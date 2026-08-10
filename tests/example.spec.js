// @ts-check
import { test, expect } from "@playwright/test";

test.describe("WriteRight landing page", () => {
  test("displays the landing page and authentication options", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "WriteRight" }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /get started/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /log in|sign in/i }),
    ).toBeVisible();
  });
});
