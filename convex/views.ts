import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const recordView = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    const userId = identity.subject;

    const existingView = await ctx.db
      .query("views")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    if (!existingView) {
      await ctx.db.insert("views", {
        postId: args.postId,
        userId: userId,
      });

      const post = await ctx.db.get("posts", args.postId);
      if (post) {
        await ctx.db.patch("posts", args.postId, {
          viewCount: (post.viewCount || 0) + 1,
        });
      }
    }
  },
});
