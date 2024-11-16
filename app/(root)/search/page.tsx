import UserCard from "@/components/cards/UserCard";
import { fetchAllUsers, fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    // Redirect to onboarding page
    redirect("/onboarding");
  }

  // Query based on user request
  const searchUser = await fetchAllUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });
  if (!searchUser) return null;

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {searchUser.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            (
            {searchUser.users.map((user) => (
              <UserCard
                userId={user.id}
                userName={user.username}
                name={user.name}
                imgUrl={user.image}
                type="User"
              />
            ))}
            )
          </>
        )}
      </div>
    </section>
  );
}

export default page;
