import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import AccuracyModal from "../../components/accuracy/AccuracyModal";
import AccuracySummary from "../../components/accuracy/AccuracySummary";

const accuracy = {
  score: 92,
  summary: "Your writing is very strong.",
  categories: {
    grammar: 90,
    vocabulary: 88,
    spelling: 100,
    sentenceStructure: 91,
  },
  improvementNote: "Keep practicing sentence structure.",
};

describe("AccuracyModal", () => {
  test("does not render when closed", () => {
    render(
      <AccuracyModal
        isOpen={false}
        onClose={vi.fn()}
        accuracy={accuracy}
      />,
    );

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
  });

  test("renders accuracy information when open", () => {
    render(
      <AccuracyModal
        isOpen={true}
        onClose={vi.fn()}
        accuracy={accuracy}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Writing Accuracy",
      }),
    ).toBeVisible();

    expect(
      screen.getByText("Your writing is very strong."),
    ).toBeVisible();

    expect(screen.getByText("Grammar")).toBeVisible();
    expect(screen.getByText("Vocabulary")).toBeVisible();
    expect(screen.getByText("Spelling")).toBeVisible();

    expect(
      screen.getByText("Sentence Structure"),
    ).toBeVisible();

    expect(
      screen.getByText(
        "Keep practicing sentence structure.",
      ),
    ).toBeVisible();
  });

  test("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccuracyModal
        isOpen={true}
        onClose={onClose}
        accuracy={accuracy}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Close accuracy details",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("closes when Escape is pressed", () => {
    const onClose = vi.fn();

    render(
      <AccuracyModal
        isOpen={true}
        onClose={onClose}
        accuracy={accuracy}
      />,
    );

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("AccuracySummary", () => {
  test("opens accuracy details when clicked", async () => {
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();

    render(
      <AccuracySummary
        score={92}
        onOpenDetails={onOpenDetails}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "View writing accuracy details",
      }),
    );

    expect(onOpenDetails).toHaveBeenCalledTimes(1);
  });

  test("uses the appropriate score class", () => {
    render(
      <AccuracySummary
        score={100}
        onOpenDetails={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "View writing accuracy details",
      }),
    ).toHaveClass("accuracy-perfect");
  });
});