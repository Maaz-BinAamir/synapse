import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createQuiz = mutation({
  args: {
    test: v.union(v.literal("PLAB"), v.literal("FCPS"), v.literal("USMLE")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const quizId = await ctx.db.insert("quizzes", {
      userId: identity.subject,
      test: args.test,
    });

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_test", (q) => q.eq("test", args.test))
      .collect();

    // const randomQuestions: Doc<"questions">[] = [];
    const quizQuestions = questions.slice(0, 10);
    // let i = 0;
    // while (i < 10) {
    //   const randomIndex = Math.floor(Math.random() * questions.length);
    //   if (!randomQuestions.includes(questions[randomIndex])) {
    //     randomQuestions.push(questions[randomIndex]);
    //     i++;
    //   }
    // }

    for (const question of quizQuestions) {
      await ctx.db.insert("quizQuestions", {
        quizId: quizId,
        questionId: question._id,
      });
    }

    return quizId;
  },
});

export const finishQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    const completedAt = Date.now();

    let score = 0;

    const answers = await ctx.db
      .query("quizQuestions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();

    for (const answer of answers) {
      const question = await ctx.db.get(answer.questionId);
      if (question && answer.selectedOption === question.correctOption) {
        score += 1;
      }
    }

    await ctx.db.patch(args.quizId, {
      completedAt,
      score,
    });
  },
});

export const getQuizQuestions = query({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("quizQuestions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();

    const questions = [];
    for (const answer of answers) {
      const question = await ctx.db.get(answer.questionId);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  },
});

export const getQuizResults = query({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    // Get the quiz details
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Get all quiz questions with answers
    const quizQuestions = await ctx.db
      .query("quizQuestions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();

    // Build detailed results
    const results = [];
    for (const quizQuestion of quizQuestions) {
      const question = await ctx.db.get(quizQuestion.questionId);
      if (question) {
        const isCorrect =
          quizQuestion.selectedOption !== undefined &&
          quizQuestion.selectedOption === question.correctOption;

        results.push({
          questionId: question._id,
          questionText: question.text,
          options: question.options,
          correctOption: question.correctOption,
          selectedOption: quizQuestion.selectedOption,
          isCorrect,
        });
      }
    }

    return {
      quiz: {
        id: quiz._id,
        test: quiz.test,
        score: quiz.score ?? 0,
        totalQuestions: quizQuestions.length,
        completedAt: quiz.completedAt,
      },
      results,
    };
  },
});
