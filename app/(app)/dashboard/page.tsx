"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const user = useQuery(api.auth.getCurrentUser);

  console.log("Current user:", user);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Welcome, {user === undefined ? "User" : user.name}!
      </p>
    </div>
  );
}
