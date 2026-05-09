import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchQueryMock = vi.fn();
const isAuthenticatedMock = vi.fn();
const convertToModelMessagesMock = vi.fn();
const streamTextMock = vi.fn();
const groqMock = vi.fn();
const smoothStreamMock = vi.fn();

vi.mock("convex/nextjs", () => ({
  fetchQuery: fetchQueryMock,
}));

vi.mock("@/convex/_generated/api", () => ({
  api: {
    diagnosisSession: {
      get: "diagnosisSession.get",
    },
  },
}));

vi.mock("@/lib/auth-server", () => ({
  isAuthenticated: isAuthenticatedMock,
}));

vi.mock("@ai-sdk/groq", () => ({
  groq: groqMock,
}));

vi.mock("ai", () => ({
  convertToModelMessages: convertToModelMessagesMock,
  smoothStream: smoothStreamMock,
  streamText: streamTextMock,
}));

describe("chat route unit", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    groqMock.mockReturnValue("groq-model");
    smoothStreamMock.mockReturnValue("smooth-stream");
    convertToModelMessagesMock.mockReturnValue([{ role: "user", content: "hello" }]);
  });

  it("returns 401 when the user is unauthenticated", async () => {
    isAuthenticatedMock.mockResolvedValue(false);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("returns 400 when the payload is missing required fields", async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [] }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid request payload");
  });

  it("returns 404 when the diagnosis session cannot be found", async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    fetchQueryMock.mockResolvedValue(null);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "session-1",
          messages: [{ id: "1", role: "user", parts: [] }],
        }),
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Diagnosis session not found");
  });

  it("streams a response when the request is valid", async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    fetchQueryMock.mockResolvedValue({ disease: "Malaria" });
    const response = new Response("streamed", { status: 200 });
    const toUIMessageStreamResponse = vi.fn().mockReturnValue(response);
    streamTextMock.mockReturnValue({
      toUIMessageStreamResponse,
    });

    const { POST } = await import("./route");
    const result = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "session-1",
          messages: [{ id: "1", role: "user", parts: [] }],
        }),
      }),
    );

    expect(fetchQueryMock).toHaveBeenCalledOnce();
    expect(groqMock).toHaveBeenCalledWith("llama-3.1-8b-instant");
    expect(streamTextMock).toHaveBeenCalledOnce();
    expect(streamTextMock.mock.calls[0]?.[0]).toMatchObject({
      model: "groq-model",
      messages: [{ role: "user", content: "hello" }],
      experimental_transform: "smooth-stream",
    });
    expect(String(streamTextMock.mock.calls[0]?.[0]?.system)).toContain("Malaria");
    expect(result).toBe(response);
  });
});
