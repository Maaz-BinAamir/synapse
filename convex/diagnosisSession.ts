import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DISEASES } from "@/lib/constants";

export const createSession = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const sessionId = await ctx.db.insert("diagnosisSessions", {
      userId: identity.subject,
      disease: DISEASES[Math.floor(Math.random() * DISEASES.length)],
    });

    return sessionId;
  },
});

export const submitAnswer = mutation({
  args: { sessionId: v.id("diagnosisSessions"), answer: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.subject) {
      throw new Error("Session not found or access denied");
    }
    await ctx.db.patch(args.sessionId, { userAnswer: args.answer });

    return {
      correctAnswer: session.disease,
    };
  },
});

export const get = query({
  args: { sessionId: v.id("diagnosisSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});
