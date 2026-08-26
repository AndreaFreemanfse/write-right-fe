import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import ProfilePage from "../../pages/ProfilePage";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const mockUser = {
  email: "dean.grey@example.com",
  created_at: "2026-07-01T12:00:00Z",
};

const mockBadges = [
  {
    id: 1,
    earned_at: "2026-08-01T12:00:00Z",
    badge: {
      name: "First Steps",
      description: "Analyze your first journal.",
      icon: "🥉",
    },
  },
  {
    id: 2,
    earned_at: "2026-08-02T12:00:00Z",
    badge: {
      name: "High Accuracy",
      description: "Earn a journal accuracy score of 90% or higher.",
      icon: "🎯",
    },
  },
];

function mockFetchResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    json: async () => data,
  });
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      user: mockUser,
    });

    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: "test-token",
        },
      },
    });
  });

  test("renders the user profile information", async () => {
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() => mockFetchResponse([]))
      .mockImplementationOnce(() => mockFetchResponse([]))
      .mockImplementationOnce(() => mockFetchResponse([]));

    render(<ProfilePage />);

    expect(
      screen.getByRole("heading", {
        name: "Dean Grey",
      }),
    ).toBeVisible();

    expect(
      screen.getByText("dean.grey@example.com"),
    ).toBeVisible();

    await waitFor(() => {
      expect(
        screen.getByText("Your earned badges will appear here."),
      ).toBeVisible();
    });
  });

  test("renders learning activity counts", async () => {
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(mockBadges),
      )
      .mockImplementationOnce(() =>
        mockFetchResponse({ lifetime_journal_count: 3 }),
      )
      .mockImplementationOnce(() =>
        mockFetchResponse([
          { id: 1 },
          { id: 2 },
        ]),
      );

    render(<ProfilePage />);

    await waitFor(() => {
    expect(screen.getByText("3")).toBeVisible();
    expect(screen.getAllByText("2")).toHaveLength(2);
    });

    expect(
      screen.getByText("Journals Analyzed"),
    ).toBeVisible();

    expect(
      screen.getByText("Flashcard Sets"),
    ).toBeVisible();

    expect(
      screen.getByText("Badges Earned"),
    ).toBeVisible();
  });

  test("renders earned badges", async () => {
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(mockBadges),
      )
      .mockImplementationOnce(() =>
        mockFetchResponse([]),
      )
      .mockImplementationOnce(() =>
        mockFetchResponse([]),
      );

    render(<ProfilePage />);

    expect(
      await screen.findByRole("heading", {
        name: "First Steps",
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("heading", {
        name: "High Accuracy",
      }),
    ).toBeVisible();

    expect(
      screen.getByText("Analyze your first journal."),
    ).toBeVisible();
  });

  test("shows an error when profile data cannot be loaded", async () => {
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(
          {
            detail: "Unable to load badges.",
          },
          false,
        ),
      )
      .mockImplementationOnce(() =>
        mockFetchResponse([]),
      )
      .mockImplementationOnce(() =>
        mockFetchResponse([]),
      );

    render(<ProfilePage />);

    expect(
      await screen.findByText("Unable to load badges."),
    ).toBeVisible();
  });

  test("shows an authentication error when there is no session", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: null,
      },
    });

    render(<ProfilePage />);

    expect(
      await screen.findByText("User is not authenticated."),
    ).toBeVisible();
  });
});