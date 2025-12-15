"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, Filter } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import PostCard from "../_components/post-card";

export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const recommendedPosts = useQuery(api.posts.get);
  const searchResults = useQuery(api.posts.search, { query: searchQuery });
  const trendingPosts = useQuery(api.posts.getTrending);
  const latestPosts = useQuery(api.posts.getLatest);

  const postsDisplay = searchQuery ? searchResults : recommendedPosts;
  const isSearching = searchQuery.length > 0;

  return (
    // <div className="min-h-full w-full p-6 md:p-8">
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
              Community Forums
            </h1>
            <p className="text-gray-500 mt-1">
              Discuss, share, and learn with peers
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search discussions..."
              className="pl-10 py-6 bg-white/80 border-[#9D83C4]/20 focus-visible:ring-[#9D83C4]/30 rounded-xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recommended/Search Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {isSearching ? (
                  <>
                    <Search className="w-5 h-5 text-[#9D83C4]" />
                    Search Results
                  </>
                ) : (
                  <>
                    <Filter className="w-5 h-5 text-[#9D83C4]" />
                    Recommended for you
                  </>
                )}
              </h2>
            </div>

            <div className="space-y-4">
              {postsDisplay === undefined ? (
                // Loading skeletons
                [1, 2, 3].map((i) => (
                  <Card key={i} className="border-none shadow-sm bg-white/60">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4 " />
                      <Skeleton className="h-4 w-full mb-2 " />
                      <Skeleton className="h-4 w-full mb-2 " />
                      <Skeleton className="h-4 w-1/2 " />
                    </CardContent>
                  </Card>
                ))
              ) : postsDisplay?.length === 0 ? (
                <Card className="border-dashed border-2 border-[#9D83C4]/20 bg-white/50">
                  <CardContent className="p-12 text-center text-gray-500">
                    <p>No posts found matching your criteria.</p>
                    {isSearching && (
                      <Button
                        variant="link"
                        onClick={() => setSearchQuery("")}
                        className="text-[#9D83C4] mt-2"
                      >
                        Clear search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                postsDisplay?.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Create Post Button */}
            <Link href="/posts/create" className="block">
              <Button className="w-full bg-[#9D83C4] hover:bg-[#8a72b0] text-white py-6 text-lg shadow-lg shadow-[#9D83C4]/20 transition-all hover:-translate-y-1">
                Start a Discussion
              </Button>
            </Link>

            {/* Trending Section */}
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
                      href={`/posts/${post._id}`}
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

            {/* Latest Posts Section */}
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
                      href={`/posts/${post._id}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
