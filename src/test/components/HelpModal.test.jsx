import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import HelpModal from "../../components/HelpModal";

describe("HelpModal", () => {
  test("does not render when closed", () => {
    render(
      <HelpModal
        isOpen={false}
        onClose={() => {}}
      />,
    );

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
  });

  test("renders when open", () => {
    render(
      <HelpModal
        isOpen={true}
        onClose={() => {}}
      />,
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Help",
      }),
    ).toBeVisible();
  });

  test("clicking the close button calls onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <HelpModal
        isOpen={true}
        onClose={onClose}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Close help",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking Got it calls onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <HelpModal
        isOpen={true}
        onClose={onClose}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Got it",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});