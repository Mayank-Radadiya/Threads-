import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  
  // console.log(userInfo);
  console.log("onboarded:", userInfo?.onboarded);
  
  if(!userInfo?.onboarded) redirect("/onboarding")

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
    </>
  );
}

export default page;
