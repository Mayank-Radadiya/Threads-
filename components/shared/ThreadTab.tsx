import { fetchUserPosts } from "@/lib/actions/user.action";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadTab({ currentUserId, accountId, accountType }: props) {
  let userThreads: any;
  if (accountType === "User") {
    userThreads = await fetchUserPosts(accountId);
  } else {
    // Fetch community threads here
    userThreads = await fetchCommunityPosts(accountId);
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      <section className="mt-9 flex flex-col gap-10">
        {userThreads.threads.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? {
                    name: userThreads.name,
                    image: userThreads.image,
                    id: userThreads.id,
                  }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={
              accountType === "Community"
                ? {
                    name: userThreads.name,
                    id: userThreads.id,
                    image: userThreads.image,
                  }
                : thread.community
            }
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))}
      </section>
    </section>
  );
}

export default ThreadTab;
