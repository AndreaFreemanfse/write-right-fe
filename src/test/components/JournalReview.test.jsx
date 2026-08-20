import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import JournalReview from "../../components/JournalReview";

const journalEntry = {
  title: "Truck Journal",
  created_at: "2026-08-10T12:00:00Z",
  target_language: "German",
  original_text: "Ich fahre einen Lastwagen.",
};

describe("JournalReview", () => {
  test("does not render when closed", () => {
    render(
      <JournalReview
        isOpen={false}
        onClose={vi.fn()}
        journalEntryData={journalEntry}
      />,
    );

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
  });

  test("renders journal entry details when open", () => {
    render(
      <JournalReview
        isOpen={true}
        onClose={vi.fn()}
        journalEntryData={journalEntry}
      />,
    );

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

  test("clicking Close calls onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <JournalReview
        isOpen={true}
        onClose={onClose}
        journalEntryData={journalEntry}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Close",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking the overlay closes the modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <JournalReview
        isOpen={true}
        onClose={onClose}
        journalEntryData={journalEntry}
      />,
    );

    const overlay = container.querySelector(
      ".journal-review-modal-overlay",
    );

    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside the modal does not close it", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <JournalReview
        isOpen={true}
        onClose={onClose}
        journalEntryData={journalEntry}
      />,
    );

    await user.click(
      screen.getByRole("dialog"),
    );

    expect(onClose).not.toHaveBeenCalled();
  });
});