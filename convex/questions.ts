import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createQuestion = mutation({
  args: {
    text: v.string(),
    options: v.array(v.string()),
    test: v.union(v.literal("PLAB"), v.literal("FCPS"), v.literal("USMLE")),
    correctOption: v.number(),
  },
  handler: async (ctx, args) => {
    const isValidCorrectOption =
      Number.isInteger(args.correctOption) &&
      args.correctOption >= 0 &&
      args.correctOption < args.options.length;

    if (!isValidCorrectOption) {
      throw new Error("Invalid correct option index");
    }

    const questionId = await ctx.db.insert("questions", {
      text: args.text,
      options: args.options,
      test: args.test,
      correctOption: args.correctOption,
    });
    return questionId;
  },
});
