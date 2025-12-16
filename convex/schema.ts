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

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  }).index("by_post_user", ["postId", "userId"]),

  views: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_post_user", ["postId", "userId"])
    .index("by_user", ["userId"]),

  comments: defineTable({
    postId: v.id("posts"),
    parentId: v.optional(v.id("comments")),
    authorId: v.string(),
    content: v.string(),
  }).index("by_post", ["postId"]),

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
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"]),

  questions: defineTable({
    text: v.string(),
    options: v.array(v.string()),
    test: v.union(v.literal("PLAB"), v.literal("FCPS"), v.literal("USMLE")),
    correctOption: v.union(
      v.literal(0),
      v.literal(1),
      v.literal(2),
      v.literal(3)
    ),
  }).index("by_test", ["test"]),

  quizzes: defineTable({
    userId: v.string(),
    test: v.union(v.literal("PLAB"), v.literal("FCPS"), v.literal("USMLE")),
    completedAt: v.optional(v.number()),
    score: v.optional(v.number()),
  })
    .index("by_user_quiz", ["userId", "test"])
    .index("by_test", ["test"]),

  quizQuestions: defineTable({
    quizId: v.id("quizzes"),
    questionId: v.id("questions"),
    selectedOption: v.optional(v.number()),
  })
    .index("by_quiz", ["quizId"])
    .index("by_quiz_question", ["quizId", "questionId"]),

  diagnosisSessions: defineTable({
    userId: v.string(),
    disease: v.string(),
    userAnswer: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // for now we won't store messages, since old sessions can't be viewed
  // diagnosisMessages: defineTable({
  //   sessionId: v.id("diagnosisSessions"),
  //   role: v.union(v.literal("user"), v.literal("assistant")),
  //   content: v.string(),
  // }).index("by_session", ["sessionId"]),
});
