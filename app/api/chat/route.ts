import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  smoothStream,
} from "ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { isAuthenticated } from "@/lib/auth-server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    messages,
    sessionId,
  }: { messages?: UIMessage[]; sessionId?: string } = await req.json();

  if (!sessionId || !messages) {
    return new Response("Invalid request payload", { status: 400 });
  }

  const diagnosisSession = await fetchQuery(api.diagnosisSession.get, {
    sessionId: sessionId as Id<"diagnosisSessions">,
  });

  if (!diagnosisSession) {
    return new Response("Diagnosis session not found", { status: 404 });
  }

  const disease = diagnosisSession.disease;

  const modelMessages = [...convertToModelMessages(messages)];

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: `You are a patient visiting a doctor. You have ${disease}. 
      The doctor will ask you questions about your symptoms, medical history, and current condition. 
      Answer naturally and consistently based on the symptoms of ${disease}, remembering what you've already told the doctor. 
      Be realistic with your symptoms, timeline, and details. If you say symptoms started 3 days ago, maintain that timeline.
      Keep your answers concise but informative. DO NOT mention the disease name directly - only describe the symptoms.
      Act like a real patient who doesn't know their diagnosis yet.`,
    messages: modelMessages,
    experimental_transform: smoothStream({ chunking: "word", delayInMs: 20 }),
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occurred while streaming the diagnosis chat.";
    },
  });
}
