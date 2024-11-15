"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import connectToDB from "../mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";

interface Props {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    
    //The populate function in Mongoose is used to automatically replace specified paths in a document with documents from other collections. This is particularly useful when working with references between different collections.
    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error) {
    console.log("Error fetch ", error);
  }
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Props): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true, // update and insert data into data base.
      }
    );
    if (path === "profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error("Error from user action", error);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", 
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", 
          },
        },
      ],
    });

    return threads;
  } catch (error) {
    console.log("User Action fetching user threads:", error);
  }
}
