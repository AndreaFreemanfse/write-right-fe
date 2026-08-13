import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import JournalEntriesTable from "../../components/JournalEntriesTable";
import {
  getJournalEntries,
  deleteJournalEntry,
} from "../../services/api.js";

vi.mock("../../services/api.js", () => ({
  getJournalEntries: vi.fn(),
  deleteJournalEntry: vi.fn(),
}));

const entries = [
  {
    id: 1,
    title: "First Journal",
    original_text: "Heute gehe ich in die Stadt.",
    target_language: "German",
    mistakes: [{ original: "test" }],
    created_at: "2026-08-01T12:00:00Z",
  },
  {
    id: 2,
    title: "Second Journal",
    original_text: "Morgen fahre ich nach Berlin.",
    target_language: "German",
    mistakes: [],
    created_at: "2026-08-02T12:00:00Z",
  },
];

function renderTable() {
  const setJournalEntryOpen = vi.fn();
  const setJournalEntryData = vi.fn();

  render(
    <JournalEntriesTable
      setJournalEntryOpen={setJournalEntryOpen}
      setJournalEntryData={setJournalEntryData}
    />,
  );

  return {
    setJournalEntryOpen,
    setJournalEntryData,
  };
}

describe("JournalEntriesTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getJournalEntries.mockResolvedValue(entries);
  });

  test("loads and renders journal entries", async () => {
    renderTable();

    expect(
      await screen.findByText("First Journal"),
    ).toBeVisible();

    expect(
      screen.getByText("Second Journal"),
    ).toBeVisible();

    expect(getJournalEntries).toHaveBeenCalledTimes(1);
  });

  test("filters journal entries using the search field", async () => {
    const user = userEvent.setup();

    renderTable();

    await screen.findByText("First Journal");

    await user.type(
      screen.getByPlaceholderText("Search journal entries..."),
      "Berlin",
    );

    expect(
      screen.getByText("Second Journal"),
    ).toBeVisible();

    expect(
      screen.queryByText("First Journal"),
    ).not.toBeInTheDocument();
  });

  test("opens the selected journal entry", async () => {
    const user = userEvent.setup();

    const {
      setJournalEntryOpen,
      setJournalEntryData,
    } = renderTable();

    await user.click(
      await screen.findByText("First Journal"),
    );

    expect(setJournalEntryOpen).toHaveBeenCalledWith(true);

    expect(setJournalEntryData).toHaveBeenCalledWith(
      entries[0],
    );
  });

  test("deletes a journal entry after confirmation", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "confirm").mockReturnValue(true);

    deleteJournalEntry.mockResolvedValue(undefined);

    renderTable();

    await screen.findByText("First Journal");

    await user.click(
      screen.getByRole("button", {
        name: "Delete First Journal",
      }),
    );

    await waitFor(() => {
      expect(deleteJournalEntry).toHaveBeenCalledWith(1);
    });

    expect(
      screen.queryByText("First Journal"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Second Journal"),
    ).toBeVisible();
  });

  test("does not delete when confirmation is cancelled", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "confirm").mockReturnValue(false);

    renderTable();

    await screen.findByText("First Journal");

    await user.click(
      screen.getByRole("button", {
        name: "Delete First Journal",
      }),
    );

    expect(deleteJournalEntry).not.toHaveBeenCalled();

    expect(
      screen.getByText("First Journal"),
    ).toBeVisible();
  });
});