import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: [
            "*.unit.test.ts",
            "convex/**/*.unit.test.ts",
            "lib/**/*.unit.test.ts",
            "app/**/*.unit.test.ts",
          ],
          environment: "edge-runtime",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "integration",
          include: ["convex/**/*.integration.test.ts"],
          environment: "edge-runtime",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "./coverage",
      include: [
        "convex/posts.ts",
        "convex/comments.ts",
        "convex/likes.ts",
        "convex/followers.ts",
        "convex/views.ts",
        "convex/questions.ts",
        "convex/quiz.ts",
        "convex/dashboard.ts",
        "convex/diagnosisSession.ts",
        "app/api/chat/route.ts",
        "proxy.ts",
        "lib/utils.ts",
      ],
      exclude: [
        "convex/_generated/**",
        "convex/betterAuth/**",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
