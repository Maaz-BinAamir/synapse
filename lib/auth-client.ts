import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  // baseURL defaults to current origin, but explicit setting ensures consistency
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  plugins: [convexClient()],
});
