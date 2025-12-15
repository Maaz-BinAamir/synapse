"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const quizzes: Record<
  string,
  { title: string; primaryColor: string; secondaryColor: string }
> = {
  usmle: {
    title: "United States Medical Licensing Examination",
    primaryColor: "ccfbf1",
    secondaryColor: "99f6e4",
  },
  fcps: {
    title: "Fellowship of the College of Physicians and Surgeons",
    primaryColor: "fed7aa",
    secondaryColor: "ffedd5",
  },
  plab: {
    title: "Professional and Linguistic Assessments Board",
    primaryColor: "dcbdfd",
    secondaryColor: "eedfff",
  },
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  if (!slug || !quizzes[slug]) notFound();

  const quizConfig = quizzes[slug];
  const user = useQuery(api.auth.getCurrentUser);

  const upsertAnswer = useMutation(api.answers.upsertAnswer);
  const quizQuestions = useQuery(api.questions.getQuizQuestions, {
    quizSlug: slug,
  });

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  // Dynamic Gradient Style Hook (Re-added)
  const backgroundStyle = useMemo(() => {
    const hexToRgb = (hex: string) => [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];

    const [r1, g1, b1] = hexToRgb(quizConfig.primaryColor);
    const [r2, g2, b2] = hexToRgb(quizConfig.secondaryColor);
    const opacity = 0.6;

    return {
      background: `linear-gradient(90deg, 
        rgba(${r1}, ${g1}, ${b1}, ${opacity}) 0%, 
        rgba(${r2}, ${g2}, ${b2}, ${opacity}) 100%)`,
    };
  }, [quizConfig.primaryColor, quizConfig.secondaryColor]);

  if (!quizQuestions) return <p>Loading...</p>;

  const question = quizQuestions[index];

  const handleNext = async () => {
    if (!selected || !question) return;

    await upsertAnswer({
      userId: user.name,
      quizSlug: slug,
      questionNumber: question.questionNumber,
      isCorrect: selected === question.correctAnswer,
    });

    setSelected(null);

    if (index + 1 < quizQuestions.length) {
      setIndex(index + 1);
    } else {
      router.push(`/practice-questions/result/${slug}`);
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    // Outer container to replicate the look of the main content area in the image
    <div className="flex-1 p-8 bg-gray-50 min-h-screen min-h-screen w-full bg-gradient-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
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
                {slug.toUpperCase()}
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
                  width: `${((index + 1) / quizQuestions.length) * 100}%`,
                  backgroundColor: `#${quizConfig.primaryColor}`,
                }}
              ></div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8 pt-0 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Question {question.questionNumber}:
            </h3>

            <p className="text-gray-700">{question.questionText}</p>

            <h4 className="text-md font-semibold text-gray-600">Options:</h4>

            <ul className="space-y-3">
              {Object.entries(question.options as Record<string, string>).map(
                ([key, value]) => {
                  const inputId = `option-${question.questionNumber}-${key}`;
                  const isSelected = selected === key;

                  return (
                    <li key={key}>
                      {/* 1. Label linked via htmlFor. The dynamic class controls the background. */}
                      <label
                        htmlFor={inputId}
                        className={`flex items-start cursor-pointer p-4 rounded-lg transition-colors duration-200 shadow-sm
    ${isSelected ? "border-2 font-semibold" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: `rgba(${parseInt(quizConfig.primaryColor.substring(0, 2), 16)}, ${parseInt(quizConfig.primaryColor.substring(2, 4), 16)}, ${parseInt(quizConfig.primaryColor.substring(4, 6), 16)}, 0.2)`,
                                borderColor: `#${quizConfig.primaryColor}`,
                              }
                            : {}
                        }
                      >
                        {/* 2. Hidden input with ID and onChange handler */}
                        <input
                          type="radio"
                          id={inputId}
                          name="quiz-option"
                          checked={isSelected}
                          onChange={() => setSelected(key)}
                          className="hidden" // Hides the input
                        />

                        {/* 3. Option Text (No radio button visual indicator needed) */}
                        <span className="flex-1">
                          {/* Display the option key (A, B, C...) next to the text */}
                          <span className="font-bold mr-2">{key}.</span> {value}
                        </span>
                      </label>
                    </li>
                  );
                }
              )}
            </ul>
            {/* Navigation Buttons (Styled with Purple Colors) */}
            <div className="flex justify-between pt-8 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={index === 0}
                className="bg-[#9D83C4] hover:bg-[#7a64a8] text-white font-semibold transition-colors disabled:opacity-50 
                          px-10 py-2 rounded-lg border border-gray-300"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selected}
                className={`text-white font-semibold transition-colors 
                  px-10 py-2 rounded-lg border border-white
                  ${
                    selected
                      ? "bg-[#9D83C4] hover:bg-[#7a64a8]"
                      : "bg-gray-400 cursor-not-allowed border-gray-400"
                  }`}
              >
                {index + 1 === quizQuestions.length ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
