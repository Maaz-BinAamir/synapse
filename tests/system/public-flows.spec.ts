import { test, expect } from "@playwright/test";

test("ST-001 home page renders the primary marketing content", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("A platform for Medical Students")).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Started" }).first()).toBeVisible();
});

test("ST-002 sign-up route is reachable for guest users", async ({ page }) => {
  await page.goto("/signup", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("ST-003 demo navigation updates the page hash", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Demo" }).click();

  await expect(page).toHaveURL(/#demo-video$/);
});

test("ST-004 features navigation updates the page hash", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Features" }).click();

  await expect(page).toHaveURL(/#features$/);
});

test("ST-005 sign-up page renders account creation controls", async ({ page }) => {
  await page.goto("/signup", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("textbox").nth(0)).toBeVisible();
  await expect(page.getByRole("textbox").nth(1)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("ST-006 sign-in page renders authentication controls", async ({ page }) => {
  await page.goto("/signin", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("textbox").nth(0)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign In with Google/i })).toBeVisible();
});

test("ST-007 guests are redirected away from the dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/signin$/);
});

test("ST-008 guests are redirected away from practice questions", async ({ page }) => {
  await page.goto("/practice-questions");

  await expect(page).toHaveURL(/\/signin$/);
});

test("ST-009 guests are redirected away from onboarding", async ({ page }) => {
  await page.goto("/onboarding");

  await expect(page).toHaveURL(/\/signin$/);
});

test("ST-010 unauthenticated chat API access is rejected", async ({ request }) => {
  const response = await request.post("/api/chat", {
    data: {
      sessionId: "fake-session",
      messages: [],
    },
  });

  expect(response.status()).toBe(401);
  await expect(response.text()).resolves.toBe("Unauthorized");
});
