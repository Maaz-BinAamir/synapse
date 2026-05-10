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

describe("security regression", () => {
  it("prevents guests from reading a diagnosis session", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const sessionId = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    await expect(
      t.query(api.diagnosisSession.get, { sessionId }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("prevents another user from reading someone else's diagnosis session", async () => {
    const t = createConvexTest();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const sessionId = await t
      .withIdentity({ subject: "doctor-1" })
      .mutation(api.diagnosisSession.createSession, {});
    vi.restoreAllMocks();

    await expect(
      t
        .withIdentity({ subject: "doctor-2" })
        .query(api.diagnosisSession.get, { sessionId }),
    ).rejects.toThrowError("Session not found or access denied");
  });

  it("prevents another user from finishing someone else's quiz", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t
        .withIdentity({ subject: "learner-2" })
        .mutation(api.quiz.finishQuiz, { quizId }),
    ).rejects.toThrowError("Quiz not found or access denied");
  });

  it("prevents another user from reading someone else's quiz results", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t
        .withIdentity({ subject: "learner-2" })
        .query(api.quiz.getQuizResults, { quizId }),
    ).rejects.toThrowError("Quiz not found or access denied");
  });

  it("prevents a user from spoofing another follower identity", async () => {
    const t = createConvexTest();

    await expect(
      t
        .withIdentity({ subject: "attacker" })
        .mutation(api.followers.followUsers, {
          followerId: "victim-user",
          followingId: "target-user",
        }),
    ).rejects.toThrowError(
      "Follower identity does not match authenticated user",
    );
  });

  it("prevents another user from reading someone else's quiz questions", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t
        .withIdentity({ subject: "learner-2" })
        .query(api.quiz.getQuizQuestions, { quizId }),
    ).rejects.toThrowError("Quiz not found or access denied");
  });

  it("prevents another user from submitting answers to someone else's quiz", async () => {
    const t = createConvexTest();
    const questionId = await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t
        .withIdentity({ subject: "learner-2" })
        .mutation(api.answers.submitAnswer, {
          quizId,
          questionId,
          selectedOption: 0,
        }),
    ).rejects.toThrowError("Quiz not found or access denied");
  });

  it("prevents guests from reading quiz results", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t.query(api.quiz.getQuizResults, { quizId }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("prevents guests from reading quiz questions", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t.query(api.quiz.getQuizQuestions, { quizId }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("prevents guests from finishing a quiz", async () => {
    const t = createConvexTest();
    await createQuestion(t, "Question 1", 0);
    const quizId = await t
      .withIdentity({ subject: "learner-1" })
      .mutation(api.quiz.createQuiz, {
        test: "PLAB",
      });

    await expect(
      t.mutation(api.quiz.finishQuiz, { quizId }),
    ).rejects.toThrowError("Not authenticated");
  });
});
