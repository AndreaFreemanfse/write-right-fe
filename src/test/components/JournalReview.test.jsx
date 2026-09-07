import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import JournalReview from "../../components/JournalReview";
import { useJournal } from "../../context/JournalContext";

vi.mock("../../context/JournalContext", () => ({
  useJournal: vi.fn(),
}));

const journalEntry = {
  title: "Truck Journal",
  created_at: "2026-08-10T12:00:00Z",
  target_language: "German",
  original_text: "Ich fahre einen Lastwagen.",
};

describe("JournalReview", () => {
  test("does not render when closed", () => {
    useJournal.mockReturnValue({
      activeModal: null,
      setActiveModal: vi.fn(),
      journalEntryData: journalEntry,
    });

    render(<JournalReview />);

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
  });

  test("renders journal entry details when open", () => {
    useJournal.mockReturnValue({
      activeModal: "journalEntries",
      setActiveModal: vi.fn(),
      journalEntryData: journalEntry,
    });

    render(<JournalReview />);

    expect(
      screen.getByRole("heading", {
        name: "Truck Journal",
      }),
    ).toBeVisible();

    expect(
      screen.getByText("German"),
    ).toBeVisible();

    expect(
      screen.getByText("Ich fahre einen Lastwagen."),
    ).toBeVisible();
  });

  test("clicking Close closes the modal", async () => {
    const user = userEvent.setup();
    const setActiveModal = vi.fn();

    useJournal.mockReturnValue({
      activeModal: "journalEntries",
      setActiveModal,
      journalEntryData: journalEntry,
    });

    render(<JournalReview />);

    await user.click(
      screen.getByRole("button", {
        name: "Close",
      }),
    );

    expect(setActiveModal).toHaveBeenCalledWith(null);
  });

  test("clicking the overlay closes the modal", async () => {
    const user = userEvent.setup();
    const setActiveModal = vi.fn();

    useJournal.mockReturnValue({
      activeModal: "journalEntries",
      setActiveModal,
      journalEntryData: journalEntry,
    });

    const { container } = render(<JournalReview />);

    const overlay = container.querySelector(
      ".journal-review-modal-overlay",
    );

    await user.click(overlay);

    expect(setActiveModal).toHaveBeenCalledWith(null);
  });

  test("clicking inside the modal does not close it", async () => {
    const user = userEvent.setup();
    const setActiveModal = vi.fn();

    useJournal.mockReturnValue({
      activeModal: "journalEntries",
      setActiveModal,
      journalEntryData: journalEntry,
    });

    render(<JournalReview />);

    await user.click(
      screen.getByRole("dialog"),
    );

    expect(setActiveModal).not.toHaveBeenCalled();
  });
});