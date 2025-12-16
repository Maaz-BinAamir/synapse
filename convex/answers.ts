import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertAnswer = mutation({
  args: {
    userId: v.string(),
    quizSlug: v.string(),
    questionNumber: v.number(),
    isCorrect: v.boolean(),
  },
  async handler(ctx, args) {
    const existing = await ctx.db
      .query("answers")
      .withIndex("by_user_quiz_question", (q) =>
        q
          .eq("userId", args.userId)
          .eq("quizSlug", args.quizSlug)
          .eq("questionNumber", args.questionNumber)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { isCorrect: args.isCorrect });
    } else {
      await ctx.db.insert("answers", args);
    }

    return null;
  },
});

export const getQuizResults = query({
  args: {
    userId: v.string(),
    quizSlug: v.string(),
  },
  async handler(ctx, { userId, quizSlug }) {
    return await ctx.db
      .query("answers")
      .withIndex("by_user_quiz_question", (q) =>
        q.eq("userId", userId).eq("quizSlug", quizSlug)
      )
      .collect();
  },
});
