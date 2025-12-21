"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageSquare,
  ThumbsUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { CommentSection } from "../../_components/comment-section";
import Image from "next/image";
import Link from "next/link";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as Id<"posts">;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const post = useQuery(api.posts.getPostById, { postId });
  const hasLiked = useQuery(api.likes.hasLiked, { postId });
  const toggleLike = useMutation(api.likes.toggleLike).withOptimisticUpdate(
    (localStore, args) => {
      const { postId } = args;
      const existingHasLiked = localStore.getQuery(api.likes.hasLiked, {
        postId,
      });

      if (existingHasLiked !== undefined) {
        localStore.setQuery(api.likes.hasLiked, { postId }, !existingHasLiked);

        const existingPost = localStore.getQuery(api.posts.getPostById, {
          postId,
        });
        if (existingPost) {
          localStore.setQuery(
            api.posts.getPostById,
            { postId },
            {
              ...existingPost,
              likeCount:
                (existingPost.likeCount || 0) + (existingHasLiked ? -1 : 1),
            }
          );
        }
      }
    }
  );

  const recordView = useMutation(api.views.recordView);

  useEffect(() => {
    if (postId) {
      recordView({ postId });
    }
  }, [postId, recordView]);

  if (post === undefined) {
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-white/80 overflow-hidden">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            <Skeleton className="w-full aspect-video rounded-xl" />

            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
        <p className="text-gray-500 mt-2">
          The post you are looking for does not exist.
        </p>
      </div>
    );
  }

  const nextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/80 overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <Link href={`/user/${post.author.username}`}>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={post.author.avatar || ""} />
                  <AvatarFallback className="bg-[#9D83C4]/10 text-[#9D83C4]">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {post.author.username}
                  </h3>
                </div>
              </div>
            </Link>
            {post.tags && (
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#E0F7FA] text-[#006064] hover:bg-[#B2EBF2]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
              {post.title}
            </h1>
            <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap">
              {post.body}
            </div>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <div className="aspect-video relative flex items-center justify-center">
                <Image
                  src={post.images[currentImageIndex]!}
                  alt={`Post attachment ${currentImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain"
                  width={800}
                  height={450}
                />
              </div>

              {post.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={nextImage}
                    disabled={currentImageIndex === post.images.length - 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {post.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 hover:bg-transparent p-0 h-auto ${
                hasLiked
                  ? "text-[#9D83C4]"
                  : "text-gray-500 hover:text-[#9D83C4]"
              }`}
              onClick={() => toggleLike({ postId })}
            >
              <ThumbsUp
                className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`}
              />
              <span className="font-medium">{post.likeCount}</span>
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">{post.commentCount}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Eye className="h-5 w-5" />
              <span className="text-sm">{post.viewCount} views</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {new Date(post._creationTime).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <CommentSection postId={postId} />
    </div>
  );
}
