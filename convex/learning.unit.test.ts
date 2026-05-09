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

  it("creates a quiz for an authenticated user and limits it to ten questions", async () => {
    const t = createConvexTest();
    for (let index = 0; index < 12; index += 1) {
      await createQuestion(t, `Question ${index}`);
    }

    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );
    vi.restoreAllMocks();

    const quizQuestions = await t.query(async (ctx) =>
      ctx.db.query("quizQuestions").withIndex("by_quiz", (q) => q.eq("quizId", quizId)).collect(),
    );

    expect(quizQuestions).toHaveLength(10);
  });

  it("rejects quiz creation for unauthenticated users", async () => {
    const t = createConvexTest();

    await expect(t.mutation(api.quiz.createQuiz, { test: "PLAB" })).rejects.toThrowError(
      "Not authenticated",
    );
  });

  it("returns quiz questions for a created quiz", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1");
    await createQuestion(t, "Question 2");
    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );

    const questions = await t.query(api.quiz.getQuizQuestions, { quizId });

    expect(questions).toHaveLength(2);
  });

  it("scores a finished quiz based on selected answers", async () => {
    const t = createConvexTest();
    const questionOneId = await createQuestion(t, "Question 1", 0);
    const questionTwoId = await createQuestion(t, "Question 2", 1);
    const quizId = await t.withIdentity({ subject: "learner-1" }).mutation(
      api.quiz.createQuiz,
      { test: "PLAB" },
    );

    await t.mutation(async (ctx) => {
      const answers = await ctx.db
        .query("quizQuestions")
        .withIndex("by_quiz", (q) => q.eq("quizId", quizId))
        .collect();

      for (const answer of answers) {
        if (answer.questionId === questionOneId) {
          await ctx.db.patch(answer._id, { selectedOption: 0 });
        }
        if (answer.questionId === questionTwoId) {
          await ctx.db.patch(answer._id, { selectedOption: 0 });
        }
      }
    });

    await t.mutation(api.quiz.finishQuiz, { quizId });
    const results = await t.query(api.quiz.getQuizResults, { quizId });

    expect(results.quiz.score).toBe(1);
    expect(results.results).toHaveLength(2);
  });

  it("throws for quiz results when the quiz does not exist", async () => {
    const t = createConvexTest();
    const quizId = await t.mutation(async (ctx) =>
      ctx.db.insert("quizzes", { userId: "ghost", test: "PLAB" }),
    );
    await t.mutation(async (ctx) => {
      await ctx.db.delete(quizId);
    });

    await expect(t.query(api.quiz.getQuizResults, { quizId })).rejects.toThrowError(
      "Quiz not found",
    );
  });

  it("creates a diagnosis session for an authenticated user", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);

    const sessionId = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    const session = await t.query(api.diagnosisSession.get, { sessionId });
    expect(session?.userId).toBe("doctor-1");
    expect(session?.disease).toBeTruthy();
  });

  it("rejects diagnosis session creation when unauthenticated", async () => {
    const t = createConvexTest();

    await expect(t.mutation(api.diagnosisSession.createSession, {})).rejects.toThrowError(
      "Not authenticated",
    );
  });

  it("submits an answer for the session owner and returns the correct answer", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const sessionId = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    const result = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.submitAnswer, {
        sessionId,
        answer: "Sorethroat/Respiratory tract infections",
      });

    const session = await t.query(api.diagnosisSession.get, { sessionId });
    expect(result.correctAnswer).toBe(session?.disease);
    expect(session?.userAnswer).toBe("Sorethroat/Respiratory tract infections");
  });

  it("rejects answers for sessions owned by another user", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const sessionId = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    await expect(
      t.withIdentity({ subject: "doctor-2" }).mutation(api.diagnosisSession.submitAnswer, {
        sessionId,
        answer: "Wrong user",
      }),
    ).rejects.toThrowError("Session not found or access denied");
  });

  it("returns quiz stats in chronological order and excludes incomplete scores", async () => {
    const t = createConvexTest();
    await t.mutation(async (ctx) => {
      await ctx.db.insert("quizzes", { userId: "learner-1", test: "PLAB", score: 9 });
      await ctx.db.insert("quizzes", { userId: "learner-1", test: "PLAB" });
      await ctx.db.insert("quizzes", { userId: "learner-1", test: "PLAB", score: 7 });
    });

    const stats = await t
      .withIdentity({ subject: "learner-1" })
      .query(api.dashboard.getQuizStats, {});

    expect(stats).toHaveLength(2);
    expect(stats.map((entry) => entry.score)).toEqual([9, 7]);
  });

  it("returns diagnosis stats with normalized correctness checks", async () => {
    const t = createConvexTest();
    await t.mutation(async (ctx) => {
      await ctx.db.insert("diagnosisSessions", {
        userId: "doctor-1",
        disease: "Malaria",
        userAnswer: " malaria ",
      });
      await ctx.db.insert("diagnosisSessions", {
        userId: "doctor-1",
        disease: "Dengue",
        userAnswer: "Typhoid",
      });
    });

    const stats = await t
      .withIdentity({ subject: "doctor-1" })
      .query(api.dashboard.getDiagnosisStats, {});

    expect(stats.map((entry) => entry.isCorrect)).toEqual([true, false]);
  });

  it("returns recently viewed posts with author names and filters missing posts", async () => {
    const t = createConvexTest();
    await t.mutation(async (ctx) => {
      await ctx.db.insert("profile", {
        userId: "author-1",
        username: "mentor",
        bio: "bio",
        interests: [],
      });
    });
    const postId = await t.withIdentity({ subject: "author-1" }).mutation(api.posts.create, {
      title: "Viewed post",
      body: "Body",
    });
    const deletedPostId = await t
      .withIdentity({ subject: "author-1" })
      .mutation(api.posts.create, {
        title: "Deleted post",
        body: "Body",
      });
    await t.withIdentity({ subject: "viewer-1" }).mutation(api.views.recordView, { postId });
    await t.mutation(async (ctx) => {
      await ctx.db.insert("views", { postId: deletedPostId, userId: "viewer-1" });
      await ctx.db.delete(deletedPostId);
    });

    const posts = await t
      .withIdentity({ subject: "viewer-1" })
      .query(api.dashboard.getRecentViewedPosts, {});

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      title: "Viewed post",
      authorName: "mentor",
    });
  });
});
