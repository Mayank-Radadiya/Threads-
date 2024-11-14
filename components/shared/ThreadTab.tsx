import { fetchUserPosts } from "@/lib/actions/user.action";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

interface props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadTab({ currentUserId, accountId, accountType }: props) {

  const userThreads = await fetchUserPosts(accountId);
  if (!userThreads) return null;

  return (
    <section className="mt-9 flex flex-col gap-10">
      {userThreads.threads.map((post:any) => (
        <ThreadCard
          key={post._id}
          id={post._id}
          currentUserId={currentUserId}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
        />
      ))}
    </section>
  );
}

export default ThreadTab;
