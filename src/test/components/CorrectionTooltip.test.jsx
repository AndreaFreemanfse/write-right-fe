import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import CorrectionTooltip from "../../components/CorrectionTooltip";

const baseMistake = {
  original: "fare",
  corrected: "fahre",
  original_full: "Ich fare einen Lastwagen.",
  corrected_full: "Ich fahre einen Lastwagen.",
  explanation: "Use the correct verb form.",
  category: "verb_conjugation",
  loading: false,
};

describe("CorrectionTooltip", () => {
  test("renders the mistake, correction, and explanation", () => {
    render(
      <CorrectionTooltip
        mistake={baseMistake}
        onCreateFlashcard={vi.fn()}
        onUpdateMistake={vi.fn()}
        nativeLanguage="English"
        targetLanguage="German"
      />,
    );

    expect(screen.getByText("fare")).toBeVisible();
    expect(screen.getByText("fahre")).toBeVisible();

    expect(
      screen.getByText("Use the correct verb form."),
    ).toBeVisible();

    expect(
      screen.getByText("verb conjugation"),
    ).toBeVisible();
  });

  test("creates a flashcard from the current mistake", async () => {
    const user = userEvent.setup();
    const onCreateFlashcard = vi.fn();

    render(
      <CorrectionTooltip
        mistake={baseMistake}
        onCreateFlashcard={onCreateFlashcard}
        onUpdateMistake={vi.fn()}
        nativeLanguage="English"
        targetLanguage="German"
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /create flashcard/i,
      }),
    );

    expect(onCreateFlashcard).toHaveBeenCalledTimes(1);
    expect(onCreateFlashcard).toHaveBeenCalledWith(baseMistake);
  });

  test("does not request another explanation when one already exists", async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn();

    render(
      <CorrectionTooltip
        mistake={baseMistake}
        onCreateFlashcard={vi.fn()}
        onUpdateMistake={vi.fn()}
        nativeLanguage="English"
        targetLanguage="German"
      />,
    );

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });

    global.fetch = originalFetch;
  });

  test("generates an explanation when the mistake has none", async () => {
    const originalFetch = global.fetch;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        explanation: "Generated explanation.",
        category: "grammar",
      }),
    });

    const onUpdateMistake = vi.fn();

    const mistakeWithoutExplanation = {
      ...baseMistake,
      explanation: null,
      category: null,
    };

    render(
      <CorrectionTooltip
        mistake={mistakeWithoutExplanation}
        onCreateFlashcard={vi.fn()}
        onUpdateMistake={onUpdateMistake}
        nativeLanguage="English"
        targetLanguage="German"
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/explanation"),
      expect.objectContaining({
        method: "POST",
      }),
    );

    await waitFor(() => {
      expect(onUpdateMistake).toHaveBeenCalledWith(
        expect.objectContaining({
          explanation: "Generated explanation.",
          category: "grammar",
          loading: false,
        }),
      );
    });

    global.fetch = originalFetch;
  });
});