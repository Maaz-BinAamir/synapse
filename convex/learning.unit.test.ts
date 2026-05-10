import { describe, expect, it, vi } from "vitest";

import { api } from "./_generated/api";
import { createConvexTest } from "./test.setup";

async function createQuestion(
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

describe("learning unit", () => {
  it("creates a question with a valid correct option", async () => {
    const t = createConvexTest();

    const questionId = await createQuestion(t, "What is the diagnosis?");
    const question = await t.query(async (ctx) => ctx.db.get(questionId));

    expect(question?.correctOption).toBe(0);
  });

  it("rejects an out-of-range correct option", async () => {
    const t = createConvexTest();

    await expect(
      t.mutation(api.questions.createQuestion, {
        text: "Broken question",
        options: ["A", "B"],
        test: "PLAB",
        correctOption: 2,
      }),
    ).rejects.toThrowError("Invalid correct option index");
  });

  it("rejects quiz creation for unauthenticated users", async () => {
    const t = createConvexTest();

    await expect(
      t.mutation(api.quiz.createQuiz, { test: "PLAB" }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("throws for quiz results when the quiz does not exist", async () => {
    const t = createConvexTest();
    const quizId = await t.mutation(async (ctx) =>
      ctx.db.insert("quizzes", { userId: "ghost", test: "PLAB" }),
    );
    await t.mutation(async (ctx) => {
      await ctx.db.delete(quizId);
    });

    await expect(
      t.query(api.quiz.getQuizResults, { quizId }),
    ).rejects.toThrowError("Quiz not found");
  });

  it("rejects diagnosis session creation when unauthenticated", async () => {
    const t = createConvexTest();

    await expect(
      t.mutation(api.diagnosisSession.createSession, {}),
    ).rejects.toThrowError("Not authenticated");
  });

  it("returns quiz stats in chronological order and excludes incomplete scores", async () => {
    const t = createConvexTest();
    await t.mutation(async (ctx) => {
      await ctx.db.insert("quizzes", {
        userId: "learner-1",
        test: "PLAB",
        score: 9,
      });
      await ctx.db.insert("quizzes", { userId: "learner-1", test: "PLAB" });
      await ctx.db.insert("quizzes", {
        userId: "learner-1",
        test: "PLAB",
        score: 7,
      });
    });

    const stats = await t
      .withIdentity({ subject: "learner-1" })
      .query(api.dashboard.getQuizStats, {});

    expect(stats).toHaveLength(2);
    expect(stats.map((entry) => entry.score)).toEqual([9, 7]);
  });

  it("rejects answers for sessions owned by another user", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const sessionId = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    await expect(
      t
        .withIdentity({ subject: "doctor-2" })
        .mutation(api.diagnosisSession.submitAnswer, {
          sessionId,
          answer: "Wrong user",
        }),
    ).rejects.toThrowError("Session not found or access denied");
  });
});
