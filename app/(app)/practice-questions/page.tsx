"use client"; // Make this a client component

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const quizzes = [
  {
    slug: "usmle",
    title: "United States Medical Licensing Examination",
    gradientClass: "from-[#ccfbeb75] to-[#b4dafe74]",
    textColorClass: "text-[#548584]",
    iconGradient: "from-[#ccfbeb75] to-[#b4dafe74]",
  },
  {
    slug: "fcps",
    title: "Fellowship of the College of Physicians and Surgeons",
    gradientClass: "from-[#FEF4EB] to-[#FFF9F6]",
    textColorClass: "text-[#9C7241]",
    iconGradient: "from-[#FEF4EB] to-[#FFF9F6]",
  },
  {
    slug: "plab",
    title: "Professional and Linguistic Assessments Board",
    gradientClass: "from-[#F1E5FF] to-[#F7EFFF]",
    textColorClass: "text-[#711B9C]",
    iconGradient: "from-[#F1E5FF] to-[#F7EFFF]",
  },
];

export default function PracticeQuestionsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
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
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.slug}
              className="w-full md:w-[85%] lg:w-[70%] bg-white/80 rounded-xl shadow-sm overflow-hidden pt-0"
            >
              <CardHeader
                className={`pt-6 border-b border-transparent bg-gradient-to-r ${quiz.gradientClass}`}
              >
                <CardTitle
                  className={`text-lg font-semibold flex items-center justify-center gap-2 ${quiz.textColorClass}`}
                >
                  <TrendingUp
                    className="w-5 h-5 text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                  />
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`p-2 flex justify-center ${quiz.textColorClass}`}
              >
                <Link
                  href={`/practice-questions/${quiz.slug}`}
                  className="underline ml-2 inline-flex items-center gap-1"
                >
                  Start Quiz <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
