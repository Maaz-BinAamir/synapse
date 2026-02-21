import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

export const {
  handler,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
  jwtCache: {
    enabled: true,
    expirationToleranceSeconds: 300,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isAuthError: (error: any) => {
      return error?.status !== 401;
    },
  },
});
