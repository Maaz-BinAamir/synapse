import { query } from "./_generated/server";
import { v } from "convex/values";

export const getQuizQuestions = query({
  args: {
    quizSlug: v.string(),
  },
  async handler(ctx, { quizSlug }) {
    return await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizSlug", quizSlug))
      .collect();
  },
});
