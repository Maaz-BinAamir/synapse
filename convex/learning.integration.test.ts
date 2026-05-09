import { describe, expect, it, vi } from "vitest";

import { api } from "./_generated/api";
import { createConvexTest } from "./test.setup";

async function seedQuestion(
  t: ReturnType<typeof createConvexTest>,
  text: string,
  correctOption = 0,
) {
  return t.mutation(api.questions.createQuestion, {
    text,
    options: ["A", "B", "C", "D"],
    test: "PLAB",
    correctOption,
  });
}

describe("learning integration", () => {
  it("creates a quiz from seeded questions and returns them through the query layer", async () => {
    const t = createConvexTest();
    for (let index = 0; index < 10; index += 1) {
      await seedQuestion(t, `Question ${index}`);
    }

    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );
    const questions = await t.query(api.quiz.getQuizQuestions, { quizId });

    expect(questions).toHaveLength(10);
  });

  it("finishes a quiz and returns per-question result details", async () => {
    const t = createConvexTest();
    const firstId = await seedQuestion(t, "Question 1", 0);
    const secondId = await seedQuestion(t, "Question 2", 1);
    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );

    await t.mutation(async (ctx) => {
      const quizQuestions = await ctx.db
        .query("quizQuestions")
        .withIndex("by_quiz", (q) => q.eq("quizId", quizId))
        .collect();

      for (const item of quizQuestions) {
        await ctx.db.patch(item._id, {
          selectedOption: item.questionId === firstId ? 0 : 0,
        });
      }
    });

    await t.mutation(api.quiz.finishQuiz, { quizId });
    const results = await t.query(api.quiz.getQuizResults, { quizId });

    expect(results.quiz.totalQuestions).toBe(2);
    expect(results.quiz.score).toBe(1);
    expect(results.results.find((item) => item.questionId === firstId)?.isCorrect).toBe(
      true,
    );
    expect(
      results.results.find((item) => item.questionId === secondId)?.isCorrect,
    ).toBe(false);
  });

  it("surfaces completed quiz results through dashboard quiz stats", async () => {
    const t = createConvexTest();
    await seedQuestion(t, "Question 1", 0);
    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );
    await t.mutation(async (ctx) => {
      const quizQuestions = await ctx.db
        .query("quizQuestions")
        .withIndex("by_quiz", (q) => q.eq("quizId", quizId))
        .collect();
      await ctx.db.patch(quizQuestions[0]!._id, { selectedOption: 0 });
    });
    await t.mutation(api.quiz.finishQuiz, { quizId });

    const stats = await t
      .withIdentity({ subject: "learner-1" })
      .query(api.dashboard.getQuizStats, {});

    expect(stats).toHaveLength(1);
    expect(stats[0]?.score).toBe(1);
  });

  it("creates a diagnosis session, submits a correct answer, and reports success in dashboard stats", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const asDoctor = t.withIdentity({ subject: "doctor-1" });
    const sessionId = await asDoctor.mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    const session = await t.query(api.diagnosisSession.get, { sessionId });
    await asDoctor.mutation(api.diagnosisSession.submitAnswer, {
      sessionId,
      answer: session!.disease,
    });

    const stats = await asDoctor.query(api.dashboard.getDiagnosisStats, {});
    expect(stats).toHaveLength(1);
    expect(stats[0]?.isCorrect).toBe(true);
  });

  it("creates a diagnosis session, submits an incorrect answer, and reports failure in dashboard stats", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const asDoctor = t.withIdentity({ subject: "doctor-2" });
    const sessionId = await asDoctor.mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    await asDoctor.mutation(api.diagnosisSession.submitAnswer, {
      sessionId,
      answer: "Influenza",
    });

    const stats = await asDoctor.query(api.dashboard.getDiagnosisStats, {});
    expect(stats).toHaveLength(1);
    expect(stats[0]?.isCorrect).toBe(false);
  });

  it("keeps quiz and diagnosis dashboards isolated per user", async () => {
    const t = createConvexTest();
    await seedQuestion(t, "Question 1", 0);
    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );
    await t.mutation(async (ctx) => {
      const quizQuestions = await ctx.db
        .query("quizQuestions")
        .withIndex("by_quiz", (q) => q.eq("quizId", quizId))
        .collect();
      await ctx.db.patch(quizQuestions[0]!._id, { selectedOption: 0 });
    });
    await t.mutation(api.quiz.finishQuiz, { quizId });

    const learnerStats = await t
      .withIdentity({ subject: "learner-1" })
      .query(api.dashboard.getQuizStats, {});
    const otherStats = await t
      .withIdentity({ subject: "learner-2" })
      .query(api.dashboard.getQuizStats, {});

    expect(learnerStats).toHaveLength(1);
    expect(otherStats).toHaveLength(0);
  });

  it("mixes forum views with quiz and diagnosis activity without cross-feature regressions", async () => {
    const t = createConvexTest();
    await t.mutation(async (ctx) => {
      await ctx.db.insert("profile", {
        userId: "author-1",
        username: "alice",
        bio: "bio",
        interests: [],
      });
    });
    const postId = await t.withIdentity({ subject: "author-1" }).mutation(api.posts.create, {
      title: "Shared post",
      body: "Body",
    });
    await seedQuestion(t, "Question 1", 0);

    const asUser = t.withIdentity({ subject: "learner-1" });
    const quizId = await asUser.mutation(api.quiz.createQuiz, { test: "PLAB" });
    await t.mutation(async (ctx) => {
      const quizQuestions = await ctx.db
        .query("quizQuestions")
        .withIndex("by_quiz", (q) => q.eq("quizId", quizId))
        .collect();
      await ctx.db.patch(quizQuestions[0]!._id, { selectedOption: 0 });
    });
    await t.mutation(api.quiz.finishQuiz, { quizId });
    await asUser.mutation(api.views.recordView, { postId });
    vi.spyOn(Math, "random").mockReturnValue(0);
    const sessionId = await asUser.mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();
    const session = await t.query(api.diagnosisSession.get, { sessionId });
    await asUser.mutation(api.diagnosisSession.submitAnswer, {
      sessionId,
      answer: session!.disease,
    });

    const [quizStats, diagnosisStats, recentPosts] = await Promise.all([
      asUser.query(api.dashboard.getQuizStats, {}),
      asUser.query(api.dashboard.getDiagnosisStats, {}),
      asUser.query(api.dashboard.getRecentViewedPosts, {}),
    ]);

    expect(quizStats).toHaveLength(1);
    expect(diagnosisStats).toHaveLength(1);
    expect(recentPosts).toHaveLength(1);
  });
});
