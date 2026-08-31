// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Authenticated WriteRight workflow", () => {
  test("authenticated user can access the journal editor", async ({
    page,
  }) => {
    await page.goto("/write");

    await expect(page).toHaveURL(/\/write$/);

    await expect(
      page.getByPlaceholder("Name your journal"),
    ).toBeVisible();

    await expect(
      page.getByPlaceholder("Write about your day..."),
    ).toBeVisible();
  });
});

test("user can submit a journal and see mocked analysis results", async ({
  page,
}) => {
  await page.route("**/journal/analyze", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "E2E Journal",
        text: "Ich fahre einen Lastwagen.",
        journal_entry_id: 999,
        mistakes: [
          {
            original: "fare",
            corrected: "fahre",
            original_full: "Ich fare einen Lastwagen.",
            corrected_full: "Ich fahre einen Lastwagen.",
            explanation: "Use the correct verb form.",
            category: "verb_conjugation",
            start: 4,
            end: 8,
            loading: false,
          },
        ],
        accuracy: {
          score: 90,
          summary: "Good work.",
          categories: {
            grammar: 90,
            vocabulary: 100,
            spelling: 90,
            sentenceStructure: 100,
          },
          improvementNote: "Review verb conjugation.",
        },
        new_badges: [],
      }),
    });
  });

  await page.goto("/write");

  await page
    .getByPlaceholder("Name your journal")
    .fill("E2E Journal");

  await page
    .getByPlaceholder("Write about your day...")
    .fill("Ich fare einen Lastwagen.");

  await page.selectOption("#language-selection", "German");

  const analyzeButton = page.getByRole("button", {
    name: /analyze|submit|check/i,
  });

  await expect(analyzeButton).toBeVisible();

  await analyzeButton.click();

  await expect(
   page.getByRole("heading", {
     name: "Your Journal Review",
   }),
  ).toBeVisible();

  await expect(
  page.getByText("fare"),
  ).toBeVisible();

  await expect(
   page.getByText("fahre"),
  ).toBeVisible();

  await expect(
   page.getByRole("button", {
     name: "View writing accuracy details",
   }),
  ).toBeVisible();
});

test("user can start and complete a Conquer Card session", async ({
  page,
}) => {
  await page.route("**/journal/analyze", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "E2E Journal",
        text: "Ich fahre einen Lastwagen.",
        journal_entry_id: 999,
        mistakes: [
          {
            original: "fare",
            corrected: "fahre",
            original_full: "Ich fare einen Lastwagen.",
            corrected_full: "Ich fahre einen Lastwagen.",
            corrected_text: "Ich fahre einen Lastwagen.",
            explanation: "Use the correct verb form.",
            category: "verb_conjugation",
            start: 4,
            end: 8,
            loading: false,
            language: "German",
          },
        ],
        accuracy: {
          score: 90,
          summary: "Good work.",
          categories: {
            grammar: 90,
            vocabulary: 100,
            spelling: 90,
            sentenceStructure: 100,
          },
          improvementNote: "Review verb conjugation.",
        },
        new_badges: [],
      }),
    });
  });

  await page.goto("/write");

  await page
    .getByPlaceholder("Name your journal")
    .fill("E2E Journal");

  await page
    .getByPlaceholder("Write about your day...")
    .fill("Ich fare einen Lastwagen.");

  await page.selectOption("#language-selection", "German");

  await page
    .getByRole("button", {
      name: /analyze|submit|check/i,
    })
    .click();

  await expect(
    page.getByText("1 card ready"),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: /conquer card/i,
    })
    .click();

  await expect(
    page.getByText("Remaining: 1"),
  ).toBeVisible();

  await page
    .getByPlaceholder("Enter Correction...")
    .fill("Ich fahre einen Lastwagen.");

  await page
    .getByRole("button", {
      name: "Check answer",
    })
    .click();

  await expect(
    page.getByText("Correct!"),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "Next card",
    })
    .click();

  await expect(
    page.getByText("Final card conquered!"),
  ).toBeVisible();

  await expect(
    page.getByText("Cards mastered: 1"),
  ).toBeVisible();
});

test("user can save a completed flashcard set to the Vault", async ({
  page,
}) => {
  await page.route("**/journal/analyze", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "E2E Journal",
        text: "Ich fahre einen Lastwagen.",
        journal_entry_id: 999,
        mistakes: [
          {
            original: "fare",
            corrected: "fahre",
            original_full: "Ich fare einen Lastwagen.",
            corrected_full: "Ich fahre einen Lastwagen.",
            corrected_text: "Ich fahre einen Lastwagen.",
            explanation: "Use the correct verb form.",
            category: "verb_conjugation",
            start: 4,
            end: 8,
            loading: false,
            language: "German",
          },
        ],
        accuracy: {
          score: 90,
          summary: "Good work.",
          categories: {
            grammar: 90,
            vocabulary: 100,
            spelling: 90,
            sentenceStructure: 100,
          },
          improvementNote: "Review verb conjugation.",
        },
        new_badges: [],
      }),
    });
  });

  await page.route("**/flashcard-sets", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    const requestBody = route.request().postDataJSON();

    expect(requestBody.name).toBe("E2E Journal");
    expect(requestBody.flashcards).toHaveLength(1);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        created: true,
        added_count: 1,
        message: "Flashcard set created with 1 new card.",
        flashcard_set: {
          id: 999,
          name: "E2E Journal",
          language: "German",
          source_type: "journal",
          journal_entry_id: 999,
          flashcards: requestBody.flashcards,
        },
      }),
    });
  });

  await page.goto("/write");

  await page
    .getByPlaceholder("Name your journal")
    .fill("E2E Journal");

  await page
    .getByPlaceholder("Write about your day...")
    .fill("Ich fare einen Lastwagen.");

  await page.selectOption("#language-selection", "German");

  await page
    .getByRole("button", {
      name: /analyze|submit|check/i,
    })
    .click();

  await page
    .getByRole("button", {
      name: /conquer card/i,
    })
    .click();

  await page
    .getByPlaceholder("Enter Correction...")
    .fill("Ich fahre einen Lastwagen.");

  await page
    .getByRole("button", {
      name: "Check answer",
    })
    .click();

  await page
    .getByRole("button", {
      name: "Next card",
    })
    .click();

  await page
    .getByRole("button", {
      name: /save set to vault/i,
    })
    .click();

  await expect(
    page.getByText("Flashcard set created with 1 new card."),
  ).toBeVisible();
});

test("user can view a journal entry from history", async ({
  page,
}) => {
  await page.route("**/journal/entries", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 101,
          title: "Berlin Trip",
          original_text: "Ich fahre morgen nach Berlin.",
          corrected_text: "Ich fahre morgen nach Berlin.",
          target_language: "German",
          mistakes: [],
          created_at: "2026-08-10T12:00:00Z",
        },
        {
          id: 102,
          title: "Paris Notes",
          original_text: "Je vais à Paris demain.",
          corrected_text: "Je vais à Paris demain.",
          target_language: "French",
          mistakes: [],
          created_at: "2026-08-11T12:00:00Z",
        },
      ]),
    });
  });

  await page.goto("/journal-entries");

  await expect(
    page.getByRole("heading", {
      name: "My Journal Entries",
    }),
  ).toBeVisible();

  await expect(
    page.getByText("Berlin Trip"),
  ).toBeVisible();

  await expect(
    page.getByText("Paris Notes"),
  ).toBeVisible();

  await page
    .getByPlaceholder("Search journal entries...")
    .fill("Berlin");

  await expect(
    page.getByText("Berlin Trip"),
  ).toBeVisible();

  await expect(
    page.getByText("Paris Notes"),
  ).not.toBeVisible();

  await page.getByText("Berlin Trip").click();

  await expect(
    page.getByRole("dialog"),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Berlin Trip",
    }),
  ).toBeVisible();

  await expect(
    page.getByText("Ich fahre morgen nach Berlin."),
  ).toBeVisible();

  const dialog = page.getByRole("dialog");

  await expect(
    dialog.getByText("German"),
  ).toBeVisible();
});