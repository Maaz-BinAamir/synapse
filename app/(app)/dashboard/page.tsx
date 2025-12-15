"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function DashboardPage() {
  const user = useQuery(api.auth.getCurrentUser);

  console.log("Current user:", user);

  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Welcome, {user === undefined ? "User" : user.name}!
      </p>
      {/* Divider BELOW text */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-4xl">
          <div className="relative mt-2 w-full">
            {/* Line */}
            <div className="h-[2px] w-full bg-gray-200 rounded-full" />

            {/* Stethoscope */}
            <Image
              src="/stethoscope.png"
              alt="Stethoscope"
              width={40}
              height={40}
              className="absolute right-4 -top-4 max-w-[60px] w-full h-auto"
            />

            <div className="absolute left-0 -top-1 w-12 h-1 bg-orange-300" />
            <div className="absolute left-0 top-0 w-8 h-1 bg-blue-200" />
            <div className="absolute right-0 -top-1 w-12 h-1 bg-orange-300" />
            <div className="absolute right-0 top-0 w-8 h-1 bg-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
