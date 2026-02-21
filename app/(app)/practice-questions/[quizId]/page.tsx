"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();

  const quizId = params.quizId as string;

  const submitAnswer = useMutation(api.answers.submitAnswer);
  const finishQuiz = useMutation(api.quiz.finishQuiz);
  const quizQuestions = useQuery(api.quiz.getQuizQuestions, {
    quizId: quizId as Id<"quizzes">,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  const firstQuestion = quizQuestions?.[0];
  const testType = firstQuestion
    ? (firstQuestion as Doc<"questions">).test
    : null;
  const testConfig = testType ? testTypeConfigs[testType] : null;

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

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 pb-4">
              {/* Header skeleton - matches p-6 gradient box */}
              <Skeleton className="h-20 w-full rounded-lg mb-4" />
              {/* Progress bar skeleton */}
              <Skeleton className="h-2 w-full rounded-full" />
            </div>

            <div className="p-8 pt-0 space-y-6">
              {/* Question title skeleton */}
              <Skeleton className="h-6 w-32" />

              {/* Question text skeleton - multiple lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Options label skeleton */}
              <Skeleton className="h-5 w-24" />

              {/* Options skeletons - matches p-4 padding */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>

              {/* Buttons skeleton */}
              <div className="flex justify-between pt-8 border-t border-gray-100">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testConfig) return <p>Invalid quiz type</p>;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleNext = async () => {
    if (selectedOptionIndex === null || !currentQuestion) return;

    // Submit the answer
    await submitAnswer({
      quizId: quizId as Id<"quizzes">,
      questionId: currentQuestion._id,
      selectedOption: selectedOptionIndex as 0 | 1 | 2 | 3,
    });

    setSelectedOptionIndex(null);

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finish the quiz
      await finishQuiz({ quizId: quizId as Id<"quizzes"> });
      router.push(`/practice-questions/result/${quizId}`);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex((prev) => prev - 1);
  };

  return (
    // Outer container to replicate the look of the main content area in the image
    <div className="flex-1 bg-gray-50 min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      {/* 2. Main Quiz Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header: Exam Title (Dynamically styled part) */}
          <div className="p-8 pb-4">
            {/* The gradient box: USMLE | 50 */}
            <div
              className="rounded-lg p-6 flex justify-between items-center relative"
              style={backgroundStyle} // <-- Apply gradient here
            >
              <h2 className="text-2xl font-bold text-gray-800 tracking-wider">
                {testType}
              </h2>

              {/* Stethoscope Icon Placeholder */}
              <div className="absolute top-2 right-2 -mt-4 -mr-4"></div>
            </div>

            {/* Separator Lines Placeholder */}
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 my-4 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                  backgroundColor: `#${testConfig.primaryColor}`,
                }}
              ></div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8 pt-0 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Question {currentQuestionIndex + 1}:
            </h3>

            <p className="text-gray-700">{currentQuestion.text}</p>

            <h4 className="text-md font-semibold text-gray-600">Options:</h4>

            <ul className="space-y-3">
              {currentQuestion.options.map((optionText, optionIndex) => {
                const inputId = `option-${currentQuestionIndex}-${optionIndex}`;
                const isSelected = selectedOptionIndex === optionIndex;

                return (
                  <li key={optionText}>
                    <label
                      htmlFor={inputId}
                      className={`flex items-start cursor-pointer p-4 rounded-lg transition-colors duration-200 shadow-sm
    ${isSelected ? "border-2 font-semibold" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `rgba(${parseInt(testConfig.primaryColor.substring(0, 2), 16)}, ${parseInt(testConfig.primaryColor.substring(2, 4), 16)}, ${parseInt(testConfig.primaryColor.substring(4, 6), 16)}, 0.2)`,
                              borderColor: `#${testConfig.primaryColor}`,
                            }
                          : {}
                      }
                    >
                      <input
                        type="radio"
                        id={inputId}
                        name="quiz-option"
                        checked={isSelected}
                        onChange={() => setSelectedOptionIndex(optionIndex)}
                        className="hidden" // Hides the input
                      />

                      <span className="flex-1">
                        {/* Display the option letter (A, B, C...) next to the text */}
                        <span className="font-bold mr-2">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>{" "}
                        {optionText}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="flex justify-between pt-8 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="bg-[#9D83C4] hover:bg-[#7a64a8] text-white font-semibold transition-colors disabled:opacity-50 
                          px-10 py-2 rounded-lg border border-gray-300"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOptionIndex && selectedOptionIndex !== 0}
                className={`text-white font-semibold transition-colors 
                  px-10 py-2 rounded-lg border border-white
                  ${
                    selectedOptionIndex !== null
                      ? "bg-[#9D83C4] hover:bg-[#7a64a8]"
                      : "bg-gray-400 cursor-not-allowed border-gray-400"
                  }`}
              >
                {currentQuestionIndex + 1 === quizQuestions.length
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
