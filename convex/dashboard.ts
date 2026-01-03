import { query } from "./_generated/server";

export const getQuizStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_user_quiz", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(10);

    // Reverse to show chronological order in chart
    return quizzes
      .filter((q) => q.score !== undefined)
      .map((q) => ({
        date: q._creationTime,
        score: q.score ?? 0,
        total: 10,
      }))
      .reverse();
  },
});

export const getDiagnosisStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const sessions = await ctx.db
      .query("diagnosisSessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(10);

    return sessions
      .filter((s) => s.userAnswer)
      .map((s) => ({
        date: s._creationTime,
        isCorrect:
          s.disease.toLowerCase().trim() === s.userAnswer?.toLowerCase().trim(),
      }))
      .reverse();
  },
});

export const getRecentViewedPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const views = await ctx.db
      .query("views")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(5);

    const posts = await Promise.all(
      views.map(async (view) => {
        const post = await ctx.db.get("posts", view.postId);
        if (!post) return null;

        const author = await ctx.db
          .query("profile")
          .withIndex("by_user", (q) => q.eq("userId", post.authorId))
          .first();

        return {
          ...post,
          authorName: author?.username ?? "Unknown",
          viewedAt: view._creationTime,
        };
      })
    );

    return posts.filter((p) => p !== null);
  },
});
