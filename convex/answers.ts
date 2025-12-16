import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitAnswer = mutation({
  args: {
    quizId: v.id("quizzes"),
    questionId: v.id("questions"),
    selectedOption: v.optional(
      v.union(v.literal(0), v.literal(1), v.literal(2), v.literal(3))
    ),
  },
  handler: async (ctx, args) => {
    // Find the existing answer record for this quiz and question
    const existingAnswer = await ctx.db
      .query("quizQuestions")
      .withIndex("by_quiz_question", (q) =>
        q.eq("quizId", args.quizId).eq("questionId", args.questionId)
      )
      .unique();

    if (existingAnswer) {
      await ctx.db.patch(existingAnswer._id, {
        selectedOption: args.selectedOption,
      });
      return existingAnswer._id;
    }
  },
});
