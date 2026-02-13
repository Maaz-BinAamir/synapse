import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitAnswer = mutation({
  args: {
    quizId: v.id("quizzes"),
    questionId: v.id("questions"),
    selectedOption: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (args.selectedOption !== undefined) {
      const isValidIndex =
        Number.isInteger(args.selectedOption) &&
        args.selectedOption >= 0 &&
        args.selectedOption < question.options.length;

      if (!isValidIndex) {
        throw new Error("Invalid option index");
      }
    }

    // Find the existing answer record for this quiz and question
    const existingAnswer = await ctx.db
      .query("quizQuestions")
      .withIndex("by_quiz_question", (q) =>
        q.eq("quizId", args.quizId).eq("questionId", args.questionId),
      )
      .unique();

    if (existingAnswer) {
      await ctx.db.patch("quizQuestions", existingAnswer._id, {
        selectedOption: args.selectedOption,
      });
      return existingAnswer._id;
    }
  },
});
