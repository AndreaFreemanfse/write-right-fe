import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import JournalEditor from "../../components/JournalEditor";

const defaultProps = {
  dictionaryOpen: false,
  text: "",
  setText: vi.fn(),
  journalTitle: "",
  setJournalTitle: vi.fn(),
  onAnalyze: vi.fn(),
  handleSaveEdit: vi.fn(),
  editingEntry: null,
  loading: false,
  loadingMessage: "Analyzing...",
  error: null,
  targetLanguage: "German",
  setTargetLanguage: vi.fn(),
  reviewDepth: null,
  setReviewDepth: vi.fn(),
};

describe("JournalEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Review Depth Selection", () => {
    test("renders both review depth options", () => {
      render(<JournalEditor {...defaultProps} />);

      expect(screen.getByRole("button", { name: /quick analysis/i })).toBeVisible();
      expect(screen.getByRole("button", { name: /in depth analysis/i })).toBeVisible();
    });

    test("renders Quick Analysis button with lightning icon", () => {
      render(<JournalEditor {...defaultProps} />);

      const quickButton = screen.getByRole("button", { name: /quick analysis/i });
      expect(quickButton).toBeVisible();
      expect(quickButton).toHaveClass("review-option");
    });

    test("renders In Depth Analysis button with magnifier icon", () => {
      render(<JournalEditor {...defaultProps} />);

      const inDepthButton = screen.getByRole("button", { name: /in depth analysis/i });
      expect(inDepthButton).toBeVisible();
      expect(inDepthButton).toHaveClass("review-option");
    });

    test("Quick Analysis button is disabled when text is empty", () => {
      render(<JournalEditor {...defaultProps} text="" />);

      const quickButton = screen.getByRole("button", { name: /quick analysis/i });
      expect(quickButton).toBeDisabled();
    });

    test("In Depth Analysis button is disabled when text is empty", () => {
      render(<JournalEditor {...defaultProps} text="" />);

      const inDepthButton = screen.getByRole("button", { name: /in depth analysis/i });
      expect(inDepthButton).toBeDisabled();
    });

    test("Quick Analysis button is enabled when text has content", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" />);

      const quickButton = screen.getByRole("button", { name: /quick analysis/i });
      expect(quickButton).not.toBeDisabled();
    });

    test("In Depth Analysis button is enabled when text has content", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" />);

      const inDepthButton = screen.getByRole("button", { name: /in depth analysis/i });
      expect(inDepthButton).not.toBeDisabled();
    });

    test("Quick Analysis button is disabled when loading", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" loading={true} />);

      const quickButton = screen.getByRole("button", { name: /quick analysis/i });
      expect(quickButton).toBeDisabled();
    });

    test("In Depth Analysis button is disabled when loading", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" loading={true} />);

      const inDepthButton = screen.getByRole("button", { name: /in depth analysis/i });
      expect(inDepthButton).toBeDisabled();
    });

    test("Quick Analysis button has active class when reviewDepth is 'quick'", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" reviewDepth="quick" />);

      const quickButton = screen.getByRole("button", { name: /quick analysis/i });
      expect(quickButton).toHaveClass("active");
    });

    test("In Depth Analysis button has active class when reviewDepth is 'in-depth'", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" reviewDepth="in-depth" />);

      const inDepthButton = screen.getByRole("button", { name: /in depth analysis/i });
      expect(inDepthButton).toHaveClass("active");
    });

    test("neither button has active class when reviewDepth is null", () => {
      render(<JournalEditor {...defaultProps} text="Hallo Welt" reviewDepth={null} />);

      const quickButton = screen.getByRole("button", { name: /quick analysis/i });
      const inDepthButton = screen.getByRole("button", { name: /in depth analysis/i });

      expect(quickButton).not.toHaveClass("active");
      expect(inDepthButton).not.toHaveClass("active");
    });

    test("clicking Quick Analysis calls setReviewDepth with 'quick' and onAnalyze", async () => {
      const user = userEvent.setup();
      render(<JournalEditor {...defaultProps} text="Hallo Welt" />);

      await user.click(screen.getByRole("button", { name: /quick analysis/i }));

      expect(defaultProps.setReviewDepth).toHaveBeenCalledWith("quick");
      expect(defaultProps.onAnalyze).toHaveBeenCalledWith("quick");
    });

    test("clicking In Depth Analysis calls setReviewDepth with 'in-depth' and onAnalyze", async () => {
      const user = userEvent.setup();
      render(<JournalEditor {...defaultProps} text="Hallo Welt" />);

      await user.click(screen.getByRole("button", { name: /in depth analysis/i }));

      expect(defaultProps.setReviewDepth).toHaveBeenCalledWith("in-depth");
      expect(defaultProps.onAnalyze).toHaveBeenCalledWith("in-depth");
    });
  });

  describe("Review Depth with Editing", () => {
    const editingProps = {
      ...defaultProps,
      text: "Ich schreibe ein Tagebuch",
      editingEntry: { id: 1, title: "My Journal" },
    };

    test("clicking Quick Analysis when editing calls setReviewDepth and handleSaveEdit with 'quick'", async () => {
      const user = userEvent.setup();
      render(<JournalEditor {...editingProps} />);

      await user.click(screen.getByRole("button", { name: /quick analysis/i }));

      expect(editingProps.setReviewDepth).toHaveBeenCalledWith("quick");
      expect(editingProps.handleSaveEdit).toHaveBeenCalledWith("quick");
    });

    test("clicking In Depth Analysis when editing calls setReviewDepth and handleSaveEdit with 'in-depth'", async () => {
      const user = userEvent.setup();
      render(<JournalEditor {...editingProps} />);

      await user.click(screen.getByRole("button", { name: /in depth analysis/i }));

      expect(editingProps.setReviewDepth).toHaveBeenCalledWith("in-depth");
      expect(editingProps.handleSaveEdit).toHaveBeenCalledWith("in-depth");
    });
  });

  describe("Tooltips", () => {
    test("renders tooltip for Quick Analysis option", () => {
      render(<JournalEditor {...defaultProps} />);

      const tooltip = document.getElementById("quick-review-tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass("review-tooltip");
    });

    test("renders tooltip for In Depth Analysis option", () => {
      render(<JournalEditor {...defaultProps} />);

      const tooltip = document.getElementById("indepth-review-tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass("review-tooltip");
    });
  });

  describe("Basic Rendering", () => {
    test("renders journal title input", () => {
      render(<JournalEditor {...defaultProps} journalTitle="My Test Journal" />);

      const titleInput = screen.getByPlaceholderText("Name your journal");
      expect(titleInput).toBeVisible();
      expect(titleInput).toHaveValue("My Test Journal");
    });

    test("renders journal text area", () => {
      render(<JournalEditor {...defaultProps} text="Hello world" />);

      const textarea = screen.getByPlaceholderText("Write about your day...");
      expect(textarea).toBeVisible();
      expect(textarea).toHaveValue("Hello world");
    });

    test("renders character count", () => {
      render(<JournalEditor {...defaultProps} text="Hello world" />);

      expect(screen.getByText("11 characters")).toBeVisible();
    });

    test("renders error message when error prop is provided", () => {
      render(<JournalEditor {...defaultProps} error="Something went wrong" />);

      expect(screen.getByText("Something went wrong")).toBeVisible();
      expect(screen.getByText("Something went wrong")).toHaveClass("error-message");
    });
  });
});
