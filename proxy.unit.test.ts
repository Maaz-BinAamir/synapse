import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const isAuthenticatedMock = vi.fn();

vi.mock("@/lib/auth-server", () => ({
  isAuthenticated: isAuthenticatedMock,
}));

describe("proxy unit", () => {
  it("allows the public route for guests", async () => {
    isAuthenticatedMock.mockResolvedValue(false);
    const { default: proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("http://localhost/"));

    expect(response.status).toBe(200);
  });

  it("redirects guests away from protected routes", async () => {
    isAuthenticatedMock.mockResolvedValue(false);
    const { default: proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("http://localhost/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/signin");
  });

  it("allows authenticated users onto protected routes", async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    const { default: proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("http://localhost/dashboard"));

    expect(response.status).toBe(200);
  });

  it("redirects authenticated users away from auth routes", async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    const { default: proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("http://localhost/signin"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
  });
});
