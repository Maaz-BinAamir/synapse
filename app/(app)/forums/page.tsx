"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ForumsPage() {
  const posts = useQuery(api.posts.get);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Forums Page</h1>
      <p className="mt-4 text-gray-600">Welcome to forums.</p>
      {posts?.map((post) => (
        <div key={post._id.toString()} className="p-4 border-b">
          
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2 text-gray-700">{post.body}</p>
        </div>
      ))}
    </div>
  );
}
