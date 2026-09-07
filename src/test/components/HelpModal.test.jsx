import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import HelpModal from "../../components/HelpModal";
import { useJournal } from "../../context/JournalContext";

vi.mock("../../context/JournalContext", () => ({
  useJournal: vi.fn(),
}));

describe("HelpModal", () => {
  test("does not render when closed", () => {
    useJournal.mockReturnValue({
      activeModal: null,
      setActiveModal: vi.fn(),
    });

    render(<HelpModal />);

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
  });

  test("renders when open", () => {
    useJournal.mockReturnValue({
      activeModal: "help",
      setActiveModal: vi.fn(),
    });

    render(<HelpModal />);

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Help",
      }),
    ).toBeVisible();
  });

  test("clicking the close button closes the modal", async () => {
    const user = userEvent.setup();
    const setActiveModal = vi.fn();

    useJournal.mockReturnValue({
      activeModal: "help",
      setActiveModal,
    });

    render(<HelpModal />);

    await user.click(
      screen.getByRole("button", {
        name: "Close help",
      }),
    );

    expect(setActiveModal).toHaveBeenCalledWith(null);
  });

  test("clicking Got it closes the modal", async () => {
    const user = userEvent.setup();
    const setActiveModal = vi.fn();

    useJournal.mockReturnValue({
      activeModal: "help",
      setActiveModal,
    });

    render(<HelpModal />);

    await user.click(
      screen.getByRole("button", {
        name: "Got it",
      }),
    );

    expect(setActiveModal).toHaveBeenCalledWith(null);
  });
});