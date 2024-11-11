import { fetchPosts } from "@/lib/actions/thread.action";
import React from "react";

 async function page() {
  const result = await fetchPosts()
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

export default page;
