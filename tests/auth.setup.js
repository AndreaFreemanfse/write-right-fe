// @ts-check
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be configured.",
    );
  }

  await page.goto("/signin");

  await page
    .getByPlaceholder("Email")
    .fill(email);

  await page
    .getByPlaceholder("Password")
    .fill(password);

  const authResponsePromise = page.waitForResponse((response) =>
  response.url().includes("/auth/v1/token"),
);

  await page
    .getByRole("button", { name: "Sign In" })
    .click();

    const authResponse = await authResponsePromise;
    const authBody = await authResponse.json();

    if (!authResponse.ok()) {
    throw new Error(
        `Supabase authentication failed (${authResponse.status()}): ${
        authBody.error_description ||
        authBody.msg ||
        authBody.message ||
        "Unknown authentication error"
        }`,
    );
    }

    // Handle onboarding redirect for new users
    if (page.url().includes("/select-presets")) {
      // Set localStorage to mark onboarding complete, then navigate
      await page.evaluate(() => {
        localStorage.setItem("onboardingComplete", "true");
      });
      await page.goto("/write");
      await page.waitForLoadState("networkidle");
    }

    await expect(page).toHaveURL(/\/write$/);

  await page.context().storageState({
    path: authFile,
  });
});