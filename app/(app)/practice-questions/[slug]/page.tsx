"use client";

import { useParams, notFound } from "next/navigation";

const quizzes: Record<string, { title: string }> = {
  usmle: { title: "United States Medical Licensing Examination" },
  fcps: { title: "Fellowship of the College of Physicians and Surgeons" },
  plab: { title: "Professional and Linguistic Assessments Board" },
};

export default function QuizPage() {
  const params = useParams();

  // Ensure slug is a string
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug || !quizzes[slug]) {
    notFound();
  }

  const quiz = quizzes[slug];

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p>Render the questions for the {slug.toUpperCase()} quiz here.</p>
    </div>
  );
}
