"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const router = useRouter();
  const createQuiz = useMutation(api.quiz.createQuiz);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Text */}
          <div>
            <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
              Learning Resources
            </h1>
            <p className="text-gray-500 mt-1">
              Find useful resources to help you learn.
            </p>
          </div>

          {/* Divider BELOW text */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <div className="relative mt-2 w-full">
                {/* Line */}
                <div className="h-0.5 w-full bg-gray-200 rounded-full" />

                {/* Stethoscope */}
                <Image
                  src="/stethoscope.png"
                  alt="Stethoscope"
                  width={40}
                  height={40}
                  className="absolute right-4 -top-4 max-w-[60px] w-full h-auto"
                />

                <div className="absolute left-0 -top-1 w-12 h-1 bg-orange-300" />
                <div className="absolute left-0 top-0 w-8 h-1 bg-blue-200" />
                <div className="absolute right-0 -top-1 w-12 h-1 bg-orange-300" />
                <div className="absolute right-0 top-0 w-8 h-1 bg-blue-200" />
              </div>
            </div>
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
                className={`pt-6 border-b border-transparent bg-linear-to-r ${quiz.gradientClass}`}
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
                <button
                  className="ml-2 inline-flex items-center gap-1 hover:underline"
                  onClick={async () => {
                    const type = quiz.slug.toUpperCase() as
                      | "PLAB"
                      | "FCPS"
                      | "USMLE";
                    const quizId = await createQuiz({ test: type });
                    router.push(`/practice-questions/${quizId}`);
                  }}
                >
                  Attempt a Quiz <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
