import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Heart, Eye, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Pick<T, K> & Partial<Omit<T, K>>
}[keyof T];

type GetPostsType  = RequireAtLeastOne<FunctionReturnType<typeof api.posts.get>[number] & FunctionReturnType<typeof api.posts.getCurrentUserPosts>[number]>;

export default function PostCard({ post }: { post: GetPostsType }) {
  return (
    <motion.div
      key={post._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/post/${post._id}`}>
        <Card className="group hover:shadow-md transition-all duration-300 border-[#9D83C4]/10 bg-white/80 backdrop-blur-sm hover:border-[#9D83C4]/30 cursor-pointer overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2 mb-2">
                {post.tags?.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#76D2C0]/10 text-[#76D2C0] hover:bg-[#76D2C0]/20 text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(post._creationTime!).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#9D83C4] transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 line-clamp-2 text-sm mb-4">
              {post.body}
            </p>

            <div className="flex items-center justify-between  text-gray-400 text-sm">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" /> {post.likeCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> {post.commentCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> {post.viewCount}
                </span>
              </div>
              <div>
                {post?.user && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" /> {post?.user ?? "user"}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
