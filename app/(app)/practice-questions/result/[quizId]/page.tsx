"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";

const testTypeConfigs: Record<
  string,
  { title: string; primaryColor: string; secondaryColor: string }
> = {
  USMLE: {
    title: "United States Medical Licensing Examination",
    primaryColor: "ccfbf1",
    secondaryColor: "99f6e4",
  },
  FCPS: {
    title: "Fellowship of the College of Physicians and Surgeons",
    primaryColor: "fed7aa",
    secondaryColor: "ffedd5",
  },
  PLAB: {
    title: "Professional and Linguistic Assessments Board",
    primaryColor: "dcbdfd",
    secondaryColor: "eedfff",
  },
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const data = useQuery(api.quiz.getQuizResults, {
    quizId: quizId as Id<"quizzes">,
  });

  const testConfig = data?.quiz.test ? testTypeConfigs[data.quiz.test] : null;

  // Dynamic Gradient Style Hook
  const backgroundStyle = useMemo(() => {
    if (!testConfig) return {};

    const hexToRgb = (hex: string) => [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];

    const [r1, g1, b1] = hexToRgb(testConfig.primaryColor);
    const [r2, g2, b2] = hexToRgb(testConfig.secondaryColor);
    const opacity = 0.6;

    return {
      background: `linear-gradient(90deg, 
        rgba(${r1}, ${g1}, ${b1}, ${opacity}) 0%, 
        rgba(${r2}, ${g2}, ${b2}, ${opacity}) 100%)`,
    };
  }, [testConfig]);

  if (!data) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 pb-4">
              <Skeleton className="h-20 w-full rounded-lg mb-4" />
              <Skeleton className="h-16 w-48 mx-auto rounded-lg" />
            </div>
            <div className="p-8 pt-0 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { quiz, results } = data;
  const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Results Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="p-8 pb-4 text-center">
            <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
              {quiz.test} Quiz Result
            </h1>
          </div>

          {/* Results Summary */}
          <div className="p-8 pt-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                className="text-center p-4 bg-green-50 rounded-lg border"
                style={backgroundStyle}
              >
                <div className="text-2xl font-bold">{quiz.score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div
                className="text-center p-4 bg-red-50 rounded-lg border"
                style={backgroundStyle}
              >
                <div className="text-2xl font-bold">
                  {quiz.totalQuestions - quiz.score}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div
                className="text-center p-4 bg-blue-50 rounded-lg border"
                style={backgroundStyle}
              >
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <button
              onClick={() => router.push("/practice-questions")}
              className="w-full bg-[#9D83C4] hover:bg-[#7a64a8] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Back to Practice Questions
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Question Review
            </h3>

            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.questionId}
                  className={`p-6 rounded-lg border-2 ${
                    result.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span>Question {index + 1}</span>
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </h4>
                  </div>

                  {/* Question Text */}
                  <p className="text-gray-700 mb-4">{result.questionText}</p>

                  {/* Options */}
                  <div className="space-y-2">
                    {result.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === result.correctOption;
                      const isSelected = optionIndex === result.selectedOption;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? "border-green-500 bg-green-100"
                              : isSelected
                                ? "border-red-500 bg-red-100"
                                : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span
                              className={
                                isCorrect || isSelected ? "font-semibold" : ""
                              }
                            >
                              {option}
                            </span>
                            {isCorrect && (
                              <span className="ml-auto text-green-600 text-sm font-semibold">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="ml-auto text-red-600 text-sm font-semibold">
                                ✗ Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
