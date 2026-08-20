import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import FlashcardStudy from "../../components/FlashcardStudy";

const sampleCards = [
  {
    original: "Yo soy feliz",
    original_full: "Yo soy feliz",
    corrected: "Yo estoy feliz",
    corrected_text: "Yo estoy feliz",
    corrected_full: "Yo estoy feliz",
    language: "Spanish",
    explanation: "Use estar for temporary states.",
  },
  {
    original: "Yo tiene hambre",
    original_full: "Yo tiene hambre",
    corrected: "Yo tengo hambre",
    corrected_text: "Yo tengo hambre",
    corrected_full: "Yo tengo hambre",
    language: "Spanish",
    explanation: "Tengo is the first-person form of tener.",
  },
];

function renderFlashcardStudy(overrides = {}) {
  const props = {
    mistakes: sampleCards,
    corrections: sampleCards,
    onCreateStudySet: vi.fn(),
    onSaveSet: vi.fn(),
    savingSet: false,
    saveMessage: "",
    targetLanguage: "Spanish",
    nativeLanguage: "English",
    ...overrides,
  };

  render(<FlashcardStudy {...props} />);

  return props;
}

describe("FlashcardStudy", () => {
  test("shows the number of available cards", () => {
    renderFlashcardStudy();

    expect(
      screen.getByText("2 cards ready"),
    ).toBeVisible();
  });

  test("starts a study session when Conquer Cards is clicked", async () => {
    const user = userEvent.setup();

    renderFlashcardStudy();

    await user.click(
      screen.getByRole("button", {
        name: /conquer cards/i,
      }),
    );

    expect(
      screen.getByText("Remaining: 2"),
    ).toBeVisible();

    expect(
      screen.getByText("Yo soy feliz"),
    ).toBeVisible();
  });

  test("deletes the temporary set from the study view", async () => {
    const user = userEvent.setup();

    renderFlashcardStudy();

    await user.click(
      screen.getByRole("button", {
        name: /delete set/i,
      }),
    );

    expect(
      screen.queryByText("2 cards ready"),
    ).not.toBeInTheDocument();
  });

  test("saves the available cards to the vault", async () => {
    const user = userEvent.setup();
    const onSaveSet = vi.fn().mockResolvedValue(true);

    renderFlashcardStudy({ onSaveSet });

    await user.click(
      screen.getByRole("button", {
        name: /save set to vault/i,
      }),
    );

    expect(onSaveSet).toHaveBeenCalledTimes(1);
    expect(onSaveSet).toHaveBeenCalledWith(sampleCards);
  });
});

test("shows correct feedback and advances to the next card", async () => {
  const user = userEvent.setup();

  renderFlashcardStudy();

  await user.click(
    screen.getByRole("button", {
      name: /conquer cards/i,
    }),
  );

  const input = screen.getByPlaceholderText(
    "Enter Correction...",
  );

  await user.type(input, "Yo estoy feliz");

  await user.click(
    screen.getByRole("button", {
      name: /check answer/i,
    }),
  );

  expect(
    screen.getByText("Correct!"),
  ).toBeVisible();

  await user.click(
    screen.getByRole("button", {
      name: /next card/i,
    }),
  );

  expect(
    screen.getByText("Remaining: 1"),
  ).toBeVisible();

  expect(
    screen.getByText("Yo tiene hambre"),
  ).toBeVisible();
});


test("shows retry feedback after an incorrect answer", async () => {
  const user = userEvent.setup();

  renderFlashcardStudy();

  await user.click(
    screen.getByRole("button", {
      name: /conquer cards/i,
    }),
  );

  const input = screen.getByPlaceholderText(
    "Enter Correction...",
  );

  await user.type(input, "Wrong answer");

  await user.click(
    screen.getByRole("button", {
      name: /check answer/i,
    }),
  );

  expect(
    screen.getByText("Not quite—try again."),
  ).toBeVisible();

  expect(
    screen.getByRole("button", {
      name: /reveal answer/i,
    }),
  ).toBeVisible();
});


test("reveals the correct answer after an incorrect attempt", async () => {
  const user = userEvent.setup();

  renderFlashcardStudy();

  await user.click(
    screen.getByRole("button", {
      name: /conquer cards/i,
    }),
  );

  await user.type(
    screen.getByPlaceholderText("Enter Correction..."),
    "Wrong answer",
  );

  await user.click(
    screen.getByRole("button", {
      name: /check answer/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /reveal answer/i,
    }),
  );

  expect(
    screen.getByText("Correct version:"),
  ).toBeVisible();

  expect(
    screen.getByText("Yo estoy feliz"),
  ).toBeVisible();

  expect(
    screen.getByText(
      "Use estar for temporary states.",
    ),
  ).toBeVisible();
});


test("practice again keeps the card in the study queue", async () => {
  const user = userEvent.setup();

  renderFlashcardStudy();

  await user.click(
    screen.getByRole("button", {
      name: /conquer cards/i,
    }),
  );

  await user.type(
    screen.getByPlaceholderText("Enter Correction..."),
    "Wrong answer",
  );

  await user.click(
    screen.getByRole("button", {
      name: /check answer/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /reveal answer/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /practice again/i,
    }),
  );

  expect(
    screen.getByText("Remaining: 2"),
  ).toBeVisible();
});

test("shows the completion state after all cards are mastered", async () => {
  const user = userEvent.setup();

  renderFlashcardStudy({
    mistakes: [sampleCards[0]],
    corrections: [sampleCards[0]],
  });

  await user.click(
    screen.getByRole("button", {
      name: /conquer card/i,
    }),
  );

  await user.type(
    screen.getByPlaceholderText("Enter Correction..."),
    "Yo estoy feliz",
  );

  await user.click(
    screen.getByRole("button", {
      name: /check answer/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /next card/i,
    }),
  );

  expect(
    screen.getByText("Final card conquered!"),
  ).toBeVisible();

  expect(
    screen.getByText("Cards mastered: 1"),
  ).toBeVisible();
});


test("generates an explanation when one is missing", async () => {
  const user = userEvent.setup();

  const cardWithoutExplanation = {
    ...sampleCards[0],
    explanation: null,
  };

  const originalFetch = global.fetch;

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      explanation: "Generated explanation.",
      category: "grammar",
    }),
  });

  renderFlashcardStudy({
    mistakes: [cardWithoutExplanation],
    corrections: [cardWithoutExplanation],
  });

  await user.click(
    screen.getByRole("button", {
      name: /conquer card/i,
    }),
  );

  await user.type(
    screen.getByPlaceholderText("Enter Correction..."),
    "Wrong answer",
  );

  await user.click(
    screen.getByRole("button", {
      name: /check answer/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /reveal answer/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /generate explanation/i,
    }),
  );

  expect(
    await screen.findByText("Generated explanation."),
  ).toBeVisible();

  expect(global.fetch).toHaveBeenCalledTimes(1);

  global.fetch = originalFetch;
});