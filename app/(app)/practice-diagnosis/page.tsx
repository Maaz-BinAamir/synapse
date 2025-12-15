import Link from "next/link";

export default function PracticeDiagnosisPage() {
  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900">Practice Diagnosis</h1>
      <p className="mt-4 text-gray-600">Welcome to practice diagnosis.</p>
      <Link
        href="/practice-diagnosis/123"
        // className="mt-6 bg-[#9D83C4] hover:bg-[#8a72b0] text-white py-6 text-lg shadow-lg shadow-[#9D83C4]/20 transition-all hover:-translate-y-1"
        className="mt-6 inline-block rounded bg-[#9D83C4] hover:bg-[#8a72b0] px-4 py-2 text-white hover:-translate-y-1"
      >
        Start Session
      </Link>
    </div>
  );
}
