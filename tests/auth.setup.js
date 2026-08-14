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

  await page
    .getByRole("button", { name: "Sign In" })
    .click();

  await page.waitForURL("**/write");

  await expect(page).toHaveURL(/\/write$/);

  await page.context().storageState({
    path: authFile,
  });
});