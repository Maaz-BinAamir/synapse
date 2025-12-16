"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { MAX_QUESTIONS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, MessageCircleQuestion } from "lucide-react";
import Image from "next/image";

export default function PracticeDiagnosisPage() {
  const createSession = useMutation(api.diagnosisSession.createSession);

  const router = useRouter();
  async function handleCreate() {
    const sessionId = await createSession();
    router.push(`/practice-diagnosis/${sessionId}`);
  }

  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Text */}
          <div>
            <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
              Practice Diagnosis
            </h1>
            <p className="text-gray-500 mt-1">
              Sharpen your diagnostic skills by interviewing AI patients and
              identifying their conditions
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

        {/* Centered Content */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* How It Works Card */}
          <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm w-full max-w-2xl">
            <CardHeader className="border-b border-[#9D83C4]/10 pb-3">
              <CardTitle className="text-xl font-semibold text-[#9D83C4] flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid gap-3">
                <div className="flex gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#9D83C4] text-white flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Ask Questions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      You have up to {MAX_QUESTIONS} questions to gather
                      information about symptoms, medical history, and other
                      relevant details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#9D83C4] text-white flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Analyze Information
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Carefully review the patient&apos;s responses to identify
                      patterns and narrow down potential diagnoses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#9D83C4] text-white flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Submit Diagnosis
                    </h3>
                    <p className="text-gray-600 text-sm">
                      You can submit your diagnosis at any time. After all{" "}
                      {MAX_QUESTIONS} questions, you must provide an answer
                      before continuing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#9D83C4] text-white flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      View Results
                    </h3>
                    <p className="text-gray-600 text-sm">
                      See if your diagnosis was correct and learn from the
                      experience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <Button
            onClick={handleCreate}
            size="lg"
            className="bg-[#9D83C4] hover:bg-[#8B71B2] text-white px-10 py-5 text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Stethoscope className="w-5 h-5 mr-2" />
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
}
