"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowRight, Activity, Brain } from "lucide-react";

const QuizPerformanceChart = dynamic(
  () => import("./charts").then((m) => m.QuizPerformanceChart),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> }
);

const DiagnosisAccuracyChart = dynamic(
  () => import("./charts").then((m) => m.DiagnosisAccuracyChart),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> }
);

export default function DashboardPage() {
  const { isAuthenticated } = useConvexAuth();
  const quizStats = useQuery(
    api.dashboard.getQuizStats,
    isAuthenticated ? {} : "skip"
  );
  const diagnosisStats = useQuery(
    api.dashboard.getDiagnosisStats,
    isAuthenticated ? {} : "skip"
  );
  const recentPosts = useQuery(
    api.dashboard.getRecentViewedPosts,
    isAuthenticated ? {} : "skip"
  );

  const quizData = quizStats?.map((q) => ({
    date: format(new Date(q.date), "MMM dd"),
    score: q.score,
  }));

  const diagnosisData = diagnosisStats
    ? [
        {
          name: "Correct",
          value: diagnosisStats.filter((s) => s.isCorrect).length,
        },
        {
          name: "Incorrect",
          value: diagnosisStats.filter((s) => !s.isCorrect).length,
        },
      ]
    : [];

  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Text */}
          <div>
            <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
              Dashboard
            </h1>
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

        {/* Section 1: Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Stats */}
          <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Brain className="h-5 w-5 text-[#9D83C4]" />
                Quiz Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {quizStats === undefined ? (
                  <Skeleton className="h-full w-full" />
                ) : quizStats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No quiz data available
                  </div>
                ) : (
                  <QuizPerformanceChart data={quizData ?? []} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis Stats */}
          <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Activity className="h-5 w-5 text-[#9D83C4]" />
                Diagnosis Accuracy (Last 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {diagnosisStats === undefined ? (
                  <Skeleton className="h-full w-full" />
                ) : diagnosisStats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No diagnosis data available
                  </div>
                ) : (
                  <DiagnosisAccuracyChart data={diagnosisData} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Recent Posts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 font-serif">
            Recently Viewed Posts
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {recentPosts === undefined ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
            ) : recentPosts.length === 0 ? (
              <div className="text-gray-500 italic">
                You haven&apos;t viewed any posts yet.
              </div>
            ) : (
              recentPosts.map((post) => (
                <Link key={post._id} href={`/post/${post._id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white/60 hover:bg-white/80 group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-[#9D83C4]/10 text-[#9D83C4] group-hover:bg-[#9D83C4] group-hover:text-white transition-colors">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-[#9D83C4] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            by {post.authorName} • Viewed{" "}
                            {format(new Date(post.viewedAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-[#9D83C4] transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
