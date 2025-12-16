"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Doc } from "@/convex/_generated/dataModel";

interface CommentProps {
  comment: any; // Type this properly
  replies: any[];
  postId: Id<"posts">;
  level?: number;
}

function Comment({ comment, replies, postId, level = 0 }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const createComment = useMutation(api.comments.createComment);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await createComment({
      postId,
      content: replyContent,
      parentId: comment._id,
    });
    setIsReplying(false);
    setReplyContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  return (
    <div
      className={`mt-4 ${level > 0 ? "ml-8 border-l-2 border-[#9D83C4]/20 pl-4" : ""}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback className="bg-[#9D83C4]/10 text-[#9D83C4]">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">
              {comment.author.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment._creationTime), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-gray-700 mt-1 text-sm">{comment.content}</p>

          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-gray-500 hover:text-[#9D83C4] hover:bg-transparent"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>

          {isReplying && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a reply..."
                className="min-h-20 bg-white/50 border-[#9D83C4]/20 focus-visible:ring-[#9D83C4]/30"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="bg-[#9D83C4] hover:bg-[#8a72b0] text-white"
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {replies.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          replies={reply.replies || []}
          postId={postId}
          level={level + 1}
        />
      ))}
    </div>
  );
}

export function CommentSection({ postId }: { postId: Id<"posts"> }) {
  const comments = useQuery(api.comments.getComments, { postId });
  const [newComment, setNewComment] = useState("");
  const createComment = useMutation(api.comments.createComment);

  if (!comments)
    return (
      <div>
        {/* Comment Section Skeleton */}
        <Card className="border-none shadow-sm bg-white/80">
          <CardHeader className="border-b border-gray-100 pb-4">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <Skeleton className="h-[100px] w-full rounded-md" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );

  // Build tree
  const commentMap = new Map();
  const roots: any[] = [];

  comments.forEach((c) => {
    commentMap.set(c._id, { ...c, replies: [] });
  });

  comments.forEach((c) => {
    if (c.parentId) {
      const parent = commentMap.get(c.parentId);
      if (parent) {
        parent.replies.push(commentMap.get(c._id));
      }
    } else {
      roots.push(commentMap.get(c._id));
    }
  });

  // Sort by time
  const sortComments = (nodes: any[]) => {
    nodes.sort((a, b) => b._creationTime - a._creationTime);
    nodes.forEach((n) => sortComments(n.replies));
  };
  sortComments(roots);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await createComment({
      postId,
      content: newComment,
    });
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="border-none shadow-sm bg-white/80">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <MessageSquare className="h-5 w-5 text-[#9D83C4]" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <div className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are your thoughts?"
            className="min-h-[100px] bg-white/50 border-[#9D83C4]/20 focus-visible:ring-[#9D83C4]/30 resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="bg-[#9D83C4] hover:bg-[#8a72b0] text-white shadow-md hover:shadow-lg transition-all"
            >
              Post Comment
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {roots.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              replies={comment.replies}
              postId={postId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
