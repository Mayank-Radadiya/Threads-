import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchAllUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import UserCard from "../cards/UserCard";


async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const similarMinds = await fetchAllUsers({
    userId: user.id,
    pageSize: 4,
  });
  if(!similarMinds) return null;


  const suggestedCommunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {suggestedCommunities.communities.length > 0 ? (
            <>
              {suggestedCommunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  userId={community.id}
                  name={community.name}
                  userName={community.username}
                  imgUrl={community.image}
                  type="Community"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  userId={person.id}
                  name={person.name}
                  userName={person.username}
                  imgUrl={person.image}
                  type="User"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
