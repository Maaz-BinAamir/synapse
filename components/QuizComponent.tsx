"use client";

import { useState, useEffect } from "react";

interface Question {
  question_number: number;
  question_text: string;
  options: Record<string, string>;
  answer: string;
  test: string;
}

interface QuizComponentProps {
  slug: string;
}

export function QuizComponent({ slug }: QuizComponentProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`/data/${slug}.json`)
      .then((res) => res.json())
      .then((data: Question[]) => setQuestions(data));
  }, [slug]);

  if (!questions.length) return <p>Loading questions...</p>;

  const question = questions[currentIndex];

  const handleNext = () => {
    if (selectedOption === question.answer.toUpperCase()) {
      setScore((prev) => prev + 1);
    }
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev + 1 < questions.length ? prev + 1 : prev));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Question {question.question_number}: {question.question_text}
      </h2>

      <ul className="space-y-2">
        {Object.entries(question.options).map(([key, value]) => (
          <li key={key}>
            <button
              onClick={() => setSelectedOption(key)}
              className={`w-full text-left p-2 rounded border ${
                selectedOption === key ? "bg-blue-200" : "bg-white"
              }`}
            >
              {key}: {value}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        disabled={currentIndex + 1 > questions.length}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        Next
      </button>

      <p>
        Score: {score} / {questions.length}
      </p>
    </div>
  );
}
