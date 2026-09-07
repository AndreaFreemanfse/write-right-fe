import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import CorrectionTooltip from "../../components/CorrectionTooltip";
import { useJournal } from "../../context/JournalContext";

vi.mock("../../context/JournalContext", () => ({
  useJournal: vi.fn(),
}));

const mistake = {
  original: "Yo soy feliz",
  original_full: "Yo soy feliz",
  corrected: "Yo estoy feliz",
  corrected_text: "Yo estoy feliz",
  corrected_full: "Yo estoy feliz",
  explanation: "Use estar for temporary states.",
  category: "grammar",
};

function renderTooltip(overrides = {}) {
  const {
    nativeLanguage = "English",
    targetLanguage = "Spanish",
    updateMistake = vi.fn(),
    ...propOverrides
  } = overrides;

  useJournal.mockReturnValue({
    nativeLanguage,
    targetLanguage,
    updateMistake,
  });

  const props = {
    mistake,
    onCreateFlashcard: vi.fn(),
    ...propOverrides,
  };

  render(<CorrectionTooltip {...props} />);

  return {
    ...props,
    updateMistake,
  };
}

describe("CorrectionTooltip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the mistake, correction, and explanation", () => {
    renderTooltip();

    expect(
      screen.getByText("Yo soy feliz"),
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

  test("creates a flashcard from the current mistake", async () => {
    const user = userEvent.setup();
    const onCreateFlashcard = vi.fn();

    renderTooltip({
      onCreateFlashcard,
    });

    const createButton = screen.getByRole("button", {
      name: /create flashcard/i,
    });

    await user.click(createButton);

    expect(onCreateFlashcard).toHaveBeenCalledTimes(1);

    expect(onCreateFlashcard).toHaveBeenCalledWith(
      mistake,
    );
  });

  test("does not request another explanation when one already exists", async () => {
    const originalFetch = global.fetch;

    global.fetch = vi.fn();

    renderTooltip();

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(global.fetch).not.toHaveBeenCalled();

    global.fetch = originalFetch;
  });

  test("generates an explanation when the mistake has none", async () => {
    const mistakeWithoutExplanation = {
      ...mistake,
      explanation: null,
      category: null,
    };

    const updateMistake = vi.fn();
    const originalFetch = global.fetch;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        explanation: "Generated explanation.",
        category: "grammar",
      }),
    });

    renderTooltip({
      mistake: mistakeWithoutExplanation,
      updateMistake,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
      }),
    );

    await waitFor(() => {
      expect(updateMistake).toHaveBeenCalledWith(
        expect.objectContaining({
          original_full:
            mistakeWithoutExplanation.original_full,
          explanation: "Generated explanation.",
          category: "grammar",
          loading: false,
        }),
      );
    });

    global.fetch = originalFetch;
  });
});