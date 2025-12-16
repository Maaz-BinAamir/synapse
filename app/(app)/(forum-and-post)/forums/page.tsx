"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../../_components/post-card";

function ForumsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toString() || "";

  const recommendedPosts = useQuery(api.posts.get);
  const searchResults = useQuery(api.posts.search, { query: searchQuery });

  const postsDisplay = searchQuery ? searchResults : recommendedPosts;
  const isSearching = searchQuery.length > 0;

  const { replace } = useRouter();
  const pathname = usePathname();

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
            Community Forums
          </h1>
          <p className="text-gray-500 mt-1">
            Discuss, share, and learn with peers
          </p>
        </div>
      </div>

      {/* Main Content - Recommended/Search Results */}
      <div className="space-y-6">
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
                    onClick={handleClearSearch}
                    className="text-[#9D83C4] mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            postsDisplay?.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForumsPage() {
  return (
    <Suspense fallback={<ForumsContentSkeleton />}>
      <ForumsContent />
    </Suspense>
  );
}

function ForumsContentSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-sm bg-white/60">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
