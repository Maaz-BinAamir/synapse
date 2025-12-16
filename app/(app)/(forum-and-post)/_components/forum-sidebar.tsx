"use client";

import { FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Clock, Search } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

function TrendingSection() {
  const trendingPosts = useQuery(api.posts.getTrending);
  return (
    <Card className="border-[#FED7AA]/30 bg-white/80 shadow-sm overflow-hidden pt-0">
      <CardHeader className="bg-[#FED7AA]/10 pt-6 border-b border-[#FED7AA]/20">
        <CardTitle className="text-lg font-semibold text-gray-800 gap-2 flex items-center">
          <>
            <TrendingUp className="w-5 h-5 text-[#FED7AA]" />
            Trending Now
          </>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {trendingPosts?.map((post, i) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className="block p-4 hover:bg-[#FED7AA]/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl font-bold text-[#FED7AA]/50 font-serif">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="font-medium text-gray-800 line-clamp-2 text-sm group-hover:text-[#9D83C4]">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {post.likeCount} likes • {post.viewCount} views
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {!trendingPosts && (
            <div className="p-4 flex justify-center">
              <Spinner className="size-5 text-[#9D83C4]" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LatestSection() {
  const latestPosts = useQuery(api.posts.getLatest);

  return (
    <Card className="border-[#76D2C0]/30 bg-white/80 shadow-sm overflow-hidden pt-0">
      <CardHeader className="bg-[#76D2C0]/10 pt-6 border-b border-[#76D2C0]/20">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#76D2C0]" />
          Latest Discussions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {latestPosts?.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className="block p-4 hover:bg-[#76D2C0]/5 transition-colors"
            >
              <h4 className="font-medium text-gray-800 line-clamp-1 text-sm">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1 py-0 h-5 border-gray-200 text-gray-500"
                >
                  {post.tags?.[0] || "General"}
                </Badge>
                <span className="text-xs text-gray-400">
                  {new Date(post._creationTime).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
          {!latestPosts && (
            <div className="p-4 flex justify-center">
              <Spinner className="size-5 text-[#9D83C4]" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ForumSidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get("search") as string;

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.push(`/forums?${params.toString()}`);
  };

  return (
    <div className="space-y-8 flex flex-col">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          name="search"
          type="text"
          placeholder="Search discussions..."
          className="pl-10 py-6 bg-white/80 border-[#9D83C4]/20 focus-visible:ring-[#9D83C4]/30 rounded-xl shadow-sm"
          defaultValue={searchParams.get("search")?.toString()}
        />
      </form>

      {/* Create Post Button */}
      <Link href="/post/create" className="block">
        <Button className="w-full bg-[#9D83C4] hover:bg-[#8a72b0] text-white py-6 text-lg shadow-lg shadow-[#9D83C4]/20 transition-all hover:-translate-y-1">
          Start a Discussion
        </Button>
      </Link>

      {/* Trending Section */}
      <TrendingSection />

      {/* Latest Posts Section */}
      <LatestSection />
    </div>
  );
}
