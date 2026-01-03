import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    const post = await ctx.db.get("posts", args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (existingLike) {
      await ctx.db.delete("likes", existingLike._id);
      await ctx.db.patch("posts", args.postId, {
        likeCount: Math.max(0, (post.likeCount || 0) - 1),
      });
      return false; // Unliked
    } else {
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId: userId,
      });
      await ctx.db.patch("posts", args.postId, {
        likeCount: (post.likeCount || 0) + 1,
      });
      return true; // Liked
    }
  },
});

export const hasLiked = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const userId = identity.subject;

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    return !!existingLike;
  },
});
