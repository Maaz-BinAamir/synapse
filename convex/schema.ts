import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    authorId: v.string(),
    title: v.string(),
    body: v.string(),
    images: v.optional(v.array(v.id("_storage"))),
    tags: v.optional(v.array(v.string())),
    commentCount: v.number(),
    likeCount: v.number(),
    viewCount: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_like_count", ["likeCount"])
    .searchIndex("search_title", {
      searchField: "title",
    }),

  followers: defineTable({
    followerId: v.string(),
    followingId: v.string(),
  })
    .index("by_following", ["followingId"])
    .index("by_follower", ["followerId"])
    .index("by_pair", ["followerId", "followingId"]),

  profile: defineTable({
    userId: v.string(),
    username: v.string(),
    bio: v.string(),
    interests: v.optional(v.array(v.string())),
    avatar: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]).index("by_username", ["username"]),
});
