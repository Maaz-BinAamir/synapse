"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FeaturesSection() {
  const router = useRouter();

  return (
    <section
      id="features"
      className="w-full flex flex-col items-center mt-[160px] mb-[200px] px-4 md:px-0"
    >
      {/* Section Title */}
      <h2 className="font-inter font-semibold text-[28px] sm:text-[32px] md:text-[36px] leading-[36px] sm:leading-[40px] md:leading-[44px] text-[#711B9C] mb-12 text-center">
        Features
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Row 1: Card 1 (big) */}
        <div className="col-span-1 md:col-span-2 bg-[linear-gradient(to_right,#CCFBF1,#BBDCE9,#99F6E4)] rounded-3xl p-6 shadow-sm hover:scale-103 transition">
          <span className="inline-block bg-white/70 text-sm px-4 py-1 rounded-full">
            Academic
          </span>
          <div className="flex justify-center items-center mt-4">
            <Image
              src="/card1.png"
              alt="Card 1"
              width={360}
              height={360}
              className="object-contain w-full max-w-[360px]"
            />
          </div>
          <h3 className="text-2xl font-semibold mt-4">
            Competitive Exam Preparation
          </h3>
          <p className="text-gray-600 mt-2">
            Prepare for competitive exams like USMLE, PLAB and specialization
            exams. Access study materials, practice questions, and expert
            guidance all in one place.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] rounded-3xl p-6 shadow-sm hover:scale-103 transition">
          <span className="inline-block bg-white/70 text-sm px-4 py-1 rounded-full">
            Guidance
          </span>
          <div className="flex justify-center items-center mt-4">
            <Image
              src="/card2.png"
              alt="Card 2"
              width={200}
              height={200}
              className="object-contain w-full max-w-[200px]"
            />
          </div>
          <h3 className="text-2xl font-semibold mt-4">Talk to your seniors</h3>
          <p className="text-gray-600 mt-2">
            Use forums for guidance for all medical queries. Ask questions,
            discuss case studies, and receive mentorship from experienced
            professionals.
          </p>
        </div>

        {/* Row 2: Card 3 + middle image + Card 4 */}
        <div className="bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A] rounded-3xl p-6 shadow-sm hover:scale-103 transition">
          <span className="inline-block bg-white/70 text-sm px-4 py-1 rounded-full ">
            Diagnosis
          </span>
          <div className="flex justify-end mt-4">
            <Image
              src="/card3.png"
              alt="Card 3"
              width={260}
              height={260}
              className="object-contain w-full max-w-[260px]"
            />
          </div>
          <h3 className="text-2xl font-semibold mt-4">Practice Diagnosis</h3>
          <p className="text-gray-600 mt-2">
            Use cases & scenarios. Select cases based on body parts. Practice
            making diagnoses, improve clinical reasoning, and track your
            performance.
          </p>
        </div>

        {/* Middle Image */}
        <div className="flex justify-center items-center p-4 hover:scale-103 transition">
          <Image
            src="/feature.png"
            alt="Feature"
            width={460}
            height={460}
            className="object-contain w-full max-w-[460px]"
          />
        </div>
        {/* Card 4 spanning 2 rows */}
        <div className="bg-gradient-to-br from-[#E7D0FF] to-[#C6A4FF] rounded-3xl p-6 shadow-sm row-span-2 relative flex flex-col justify-center items-center text-center hover:scale-103 transition">
          <span className="absolute top-6 left-6 bg-white/70 text-sm px-4 py-1 rounded-full">
            Statistics
          </span>

          <div className="flex flex-col justify-center items-center">
            <h3 className="text-2xl font-semibold mt-4">Analyze Progress</h3>
            <p className="text-gray-600 mt-2 text-center">
              Track your learning journey with detailed analytics. Monitor
              strengths and weaknesses, see progress over time, and receive
              personalized recommendations for improvement.
            </p>
            <div className="flex justify-center mt-6">
              <Image
                src="/card4.png"
                alt="Card 4"
                width={260}
                height={260}
                className="object-contain w-full max-w-[260px]"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Card 5 + Card 6 */}
        <div className="bg-gradient-to-br from-[#FFE8C4] to-[#FFD7A4] rounded-3xl p-6 shadow-sm hover:scale-103 transition inline-block">
          <span className="inline-block bg-white/70 text-sm px-4 py-1 rounded-full">
            Practice
          </span>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <Image
              src="/card5.png"
              alt="Card 5"
              width={160}
              height={160}
              className="object-contain"
            />
            <div>
              <h3 className="text-2xl font-semibold">Tests</h3>
              <p className="text-gray-600 mt-2">
                Solve tests to improve your concepts. Track scores, compare with
                peers, and refine your strategy for better performance.
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Card 5 + Card 6 */}
        <div className="bg-[linear-gradient(to_right,#CCFBF1,#BBDCE9,#99F6E4)] rounded-3xl p-6 shadow-sm hover:scale-103 transition">
          <span className="inline-block bg-white/70 text-sm px-4 py-1 rounded-full">
            Knowledge
          </span>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <div>
              <h3 className="text-2xl font-semibold">Tests</h3>
              <p className="text-gray-600 mt-2">
                Share your knowledge on the forum. Contribute articles, discuss
                ideas, and help the community grow.
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: Big Bottom Banner */}
        <div className="col-span-1 md:col-span-3 bg-[linear-gradient(to_right,#FFF5FE,#DDB1E8,#FBDDF7)] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-6  hover:scale-103 transition">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">
              Follow your favorites on the Forum
            </h3>
            <p className="text-gray-700 mb-4">
              Explore posts from top contributors, stay updated with latest
              discussions, and engage with your peers in meaningful
              conversations.
            </p>
            <button
              className="px-6 py-3 bg-[#9D83C4] text-white rounded-xl hover:bg-[#7b60a4] scale-103 transition"
              onClick={() => router.push("/signup")}
            >
              Start exploring
            </button>
          </div>

          <Image
            src="/lastCard.png"
            alt="Doctors illustration"
            width={300}
            height={300}
            className="rounded-3xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
