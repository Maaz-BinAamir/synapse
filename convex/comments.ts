import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Enrich comments with author details
    const commentsWithAuthor = await Promise.all(
      comments.map(async (comment) => {
        const profile = await ctx.db
          .query("profile")
          .withIndex("by_user", (q) => q.eq("userId", comment.authorId))
          .first();

        const avatar = profile?.avatar
          ? await ctx.storage.getUrl(profile.avatar)
          : null;

        return {
          ...comment,
          author: {
            username: profile?.username ?? "Unknown",
            avatar,
          },
        };
      })
    );

    return commentsWithAuthor;
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    parentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      content: args.content,
      parentId: args.parentId,
      authorId: identity.subject,
    });

    // Increment comment count on post
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: (post.commentCount || 0) + 1,
      });
    }

    return commentId;
  },
});
