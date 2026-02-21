"use client";

import { useMemo, useReducer } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { ChatInput } from "@/components/ai/chat-input";
import { User, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { MAX_QUESTIONS } from "@/lib/constants";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type State = {
  questionCount: number;
  input: string;
  isModalOpen: boolean;
  diagnosis: string;
  correctAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
};

type Action =
  | { type: "INCREMENT_QUESTION" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_MODAL_OPEN"; payload: boolean }
  | { type: "SET_DIAGNOSIS"; payload: string }
  | { type: "SHOW_RESULT"; payload: { correctAnswer: string; isCorrect: boolean } };

const initialState: State = {
  questionCount: 0,
  input: "",
  isModalOpen: false,
  diagnosis: "",
  correctAnswer: "",
  showResult: false,
  isCorrect: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT_QUESTION":
      return { ...state, questionCount: state.questionCount + 1, input: "" };
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "SET_MODAL_OPEN":
      return { ...state, isModalOpen: action.payload };
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload };
    case "SHOW_RESULT":
      return {
        ...state,
        correctAnswer: action.payload.correctAnswer,
        isCorrect: action.payload.isCorrect,
        showResult: true,
      };
    default:
      return state;
  }
}

export default function PracticeSession() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questionCount, input, isModalOpen, diagnosis, correctAnswer, showResult, isCorrect } = state;

  const router = useRouter();
  const { session } = useParams();

  const chatTransport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: String(session),
    transport: chatTransport,
  });

  const submitAnswer = useMutation(api.diagnosisSession.submitAnswer);

  const onSend = (value: string) => {
    if (value.trim()) {
      sendMessage(
        { text: value },
        {
          body: { sessionId: String(session) },
        },
      );
      dispatch({ type: "INCREMENT_QUESTION" });
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmitDiagnosis = async () => {
    if (!diagnosis.trim()) return;

    const { correctAnswer } = await submitAnswer({
      sessionId: session as Id<"diagnosisSessions">,
      answer: diagnosis.trim(),
    });

    const isAnswerCorrect =
      diagnosis.trim().toLowerCase() === correctAnswer.toLowerCase();

    dispatch({
      type: "SHOW_RESULT",
      payload: { correctAnswer, isCorrect: isAnswerCorrect },
    });

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push("/practice-diagnosis");
    }, 3000);
  };

  const canClose = questionCount < MAX_QUESTIONS;

  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)]">
        <Card className="h-full flex flex-col border-none shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader className="border-b border-[#9D83C4]/10 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-[#9D83C4] font-serif flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Patient Diagnosis
                </CardTitle>
                <p className="text-gray-500 text-sm mt-1">
                  {questionCount} / {MAX_QUESTIONS} questions asked
                </p>
              </div>
              <Button
                onClick={() => dispatch({ type: "SET_MODAL_OPEN", payload: true })}
                variant="outline"
                className="border-[#9D83C4] text-[#9D83C4] hover:bg-[#9D83C4] hover:text-white"
              >
                Submit Answer
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Conversation Area */}
            <Conversation className="flex-1 min-h-0">
              <ConversationContent
                className={
                  messages.length === 0
                    ? "h-full flex items-center justify-center"
                    : ""
                }
              >
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title="Start a conversation with the patient"
                    description="Ask questions to gather information for making a diagnosis."
                    icon={<User className="h-12 w-12 text-[#9D83C4]" />}
                    className="self-center"
                  />
                ) : (
                  messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <div className="flex items-start gap-3">
                        {message.role === "assistant" && (
                          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#9D83C4]/10">
                            <User className={`h-5 w-5 text-[#9D83C4]`} />
                          </div>
                        )}
                        <MessageContent>
                          {message.parts.map((part, index) => {
                            if (part.type === "text") {
                              return message.role === "assistant" ? (
                                <MessageResponse key={`${part.type}-${index}`}>
                                  {part.text}
                                </MessageResponse>
                              ) : (
                                <div
                                  key={`${part.type}-${index}`}
                                  className="whitespace-pre-wrap"
                                >
                                  {part.text}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </MessageContent>
                        {message.role === "user" && (
                          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#9D83C4]">
                            <User className={`h-5 w-5 text-white`} />
                          </div>
                        )}
                      </div>
                    </Message>
                  ))
                )}

                {/* Loading indicator */}
                {isLoading &&
                  messages[messages.length - 1]?.role === "user" && (
                    <Message from="assistant">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#9D83C4]/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-[#9D83C4]" />
                        </div>
                        <MessageContent>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </MessageContent>
                      </div>
                    </Message>
                  )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {/* Input Area */}
            <div className="border-t border-[#9D83C4]/10 p-4 bg-white/40">
              <ChatInput
                value={input}
                onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
                onSubmit={onSend}
                isDisabled={
                  status !== "ready" || questionCount >= MAX_QUESTIONS
                }
                placeholder={questionCount >= MAX_QUESTIONS ? "You've asked all questions. Submit your diagnosis." : "Ask me anything about medical practice..."}
                submitLabel="Send message"
              />
              {error ? (
                <p className="mt-2 text-sm text-red-600">{error.message}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={canClose ? (open) => dispatch({ type: "SET_MODAL_OPEN", payload: open }) : undefined}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={canClose}>
          {!showResult ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#9D83C4]">
                  {questionCount >= MAX_QUESTIONS
                    ? "Time to Diagnose"
                    : "Submit Your Diagnosis"}
                </DialogTitle>
                <DialogDescription>
                  {questionCount >= MAX_QUESTIONS
                    ? `You've asked all ${MAX_QUESTIONS} questions. What is your diagnosis?`
                    : "You can submit your diagnosis anytime, but you have questions remaining."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis-input">Your Diagnosis</Label>
                  <Input
                    id="diagnosis-input"
                    placeholder="Enter the disease/condition"
                    value={diagnosis}
                    onChange={(e) => dispatch({ type: "SET_DIAGNOSIS", payload: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmitDiagnosis();
                    }}
                    className="border-[#9D83C4]/20 focus-visible:ring-[#9D83C4]/30"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitDiagnosis}
                    disabled={!diagnosis.trim()}
                    className="flex-1 bg-[#9D83C4] hover:bg-[#8B71B2] text-white"
                  >
                    Submit Diagnosis
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">Results</DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-4 py-6">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                    <h2 className="text-3xl font-bold text-green-600">
                      Correct Diagnosis!
                    </h2>
                    <p className="text-gray-600">
                      You successfully diagnosed the patient!
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                    <h2 className="text-3xl font-bold text-red-600">
                      Incorrect Diagnosis
                    </h2>
                    <p className="text-gray-600">
                      The correct diagnosis was {correctAnswer}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-500">
                  Redirecting to the practice diagnosis page...
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
