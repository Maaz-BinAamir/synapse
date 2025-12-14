"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ResultsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const user = useQuery(api.auth.getCurrentUser);

  const results = useQuery(api.answers.getQuizResults, {
    userId: user.name,
    quizSlug: slug,
  });

  if (!results) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Question</th>
            <th className="border p-2">Correct</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr key={row._id}>
              <td className="border p-2">{row.userId}</td>
              <td className="border p-2">{row.questionNumber}</td>
              <td className="border p-2">{row.isCorrect ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
