import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    body: v.string(),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    commentCount: v.number(),
    likeCount: v.number(),
    viewCount: v.number(),
    createdAt: v.number(),
  }),
});
