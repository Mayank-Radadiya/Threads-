"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import connectToDB from "../mongoose";
import Community from "../models/community.model";

interface Props {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({ text, author, communityId, path }: Props) {
  /**
   * Creates a new thread in the database
   *
   * This function:
   * 1. Connects to the database
   * 2. Creates a new thread document
   * 3. Updates the author's user document to include the new thread
   * 4. Revalidates the page to show the new content
   *
   */
  try {
    connectToDB();

    // Create a new thread document with the provided text, author, and communityId (if provided)
    const createNewThreads = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createNewThreads._id },
    });
    //  Trigger Next.js to revalidate the page and show new content
    revalidatePath(path);
  } catch (error: any) {
    console.error("Error creating thread from threads action", error);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  /**
   * Fetches paginated posts/threads from the database
   *
   * This function implements:
   * - Pagination
   * - Population of related data (author, community, replies)
   * - Sorting by creation date
   *
   * @param {number} pageNumber - The page number to fetch (default: 1)
   * @param {number} pageSize - Number of posts per page (default: 20)
   * @returns {Object} Object containing:
   *                   - posts: Array of thread documents
   *                   - isNext: Boolean indicating if there are more posts
   */

  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } }) // Only get top-level threads (not replies)
    .sort({ createdAt: "desc" }) // Sort by newest first
    .skip(skipAmount) // Skip documents for pagination
    .limit(pageSize) // Limit number of documents returned
    .populate({
      path: "author", // Populate author details
      model: User,
    })
    .populate({
      path: "community", // Populate community details
      model: Community,
    })
    .populate({
      path: "children", // Populate replies/children threads
      populate: {
        path: "author", // Populate author details for each reply
        model: User,
        select: "_id name parentId image", // Select specific fields only
      },
    });

  // Count total number of top-level threads for pagination
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      // .populate({
      //   path: "community",
      //   model: Community,
      //   select: "_id id name image",
      // })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    console.log("Error fetching thread in thread.action", error);
  }
}

export async function addCommentToThreads(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const OriginalThread = await Thread.findById(threadId);

    if (!OriginalThread) throw new Error("Thread not found");

    //Create a new thread with the comment text, author, and parentId (the original thread's ID)
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    OriginalThread.children.push(savedCommentThread._id);

    await OriginalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.log("Error adding comment to thread in thread.action", error);
  }
}
