import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createQuestion = mutation({
  args: {
    text: v.string(),
    options: v.array(v.string()),
    test: v.union(v.literal("PLAB"), v.literal("FCPS"), v.literal("USMLE")),
    correctOption: v.union(
      v.literal(0),
      v.literal(1),
      v.literal(2),
      v.literal(3)
    ),
  },
  handler: async (ctx, args) => {
    const questionId = await ctx.db.insert("questions", {
      text: args.text,
      options: args.options,
      test: args.test,
      correctOption: args.correctOption,
    });
    return questionId;
  },
});
