"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const quizzes = [
  {
    slug: "usmle",
    title: "United States Medical Licensing Examination",
    gradientFrom: "#ccfbeb75",
    gradientTo: "#b4dafe74",
    textColor: "#548584",
  },
  {
    slug: "fcps",
    title: "Fellowship of the College of Physicians and Surgeons",
    gradientFrom: "#FEF4EB",
    gradientTo: "#FFF9F6",
    textColor: "#9C7241",
  },
  {
    slug: "plab",
    title: "Professional and Linguistic Assessments Board",
    gradientFrom: "#F1E5FF",
    gradientTo: "#F7EFFF",
    textColor: "#711B9C",
  },
];

export default function PracticeQuestionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
            Practice Questions
          </h1>
          <p className="text-gray-500 mt-1">
            Strengthen your concepts with exam-focused practice questions
          </p>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="flex flex-col items-center gap-6 w-full">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.slug}
            className="w-full md:w-[85%] lg:w-[70%] bg-white/80 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <CardHeader
              className="pt-6 border-b"
              style={{
                background: `linear-gradient(to right, ${quiz.gradientFrom}, ${quiz.gradientTo})`,
              }}
            >
              <CardTitle
                className="text-lg font-semibold flex items-center justify-center gap-2"
                style={{ color: quiz.textColor }}
              >
                <TrendingUp className="w-5 h-5" />
                {quiz.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="py-4 flex justify-center">
              <Link
                href={`/practice-questions/${quiz.slug}`}
                className="inline-flex items-center gap-2 font-medium hover:underline"
                style={{ color: quiz.textColor }}
              >
                Start Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
