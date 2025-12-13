import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getAuthorPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    // Todo: improve trending algorithm
    return await ctx.db
      .query("posts")
      .withIndex("by_like_count")
      .order("desc")
      .take(5);
  },
});

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").take(5);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
      .take(20);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("posts", {
      authorId: identity.subject,
      title: args.title,
      body: args.body,
      images: args.images,
      tags: args.tags,
      commentCount: 0,
      likeCount: 0,
      viewCount: 0,
    });
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.authorId !== identity.subject) {
      throw new Error("Not authorized to delete this post");
    }
    await ctx.db.delete(args.postId);
    return true;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
