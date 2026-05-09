/// <reference types="vite/client" />

import schema from "./schema";
import { convexTest } from "convex-test";

export const modules = import.meta.glob([
  "./**/*.ts",
  "./**/*.js",
  "!./**/*.test.ts",
  "!./betterAuth/**",
]);

export const createConvexTest = () => convexTest(schema, modules);
