import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("ProfilePage", () => {
  beforeEach(() => {
    // Reset all mocks completely
    vi.resetAllMocks();

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

    // Reset global fetch
    global.fetch = vi.fn();
  });

  test("renders the user profile information", async () => {
    global.fetch.mockResolvedValueOnce(mockFetchResponse([]));
    global.fetch.mockResolvedValueOnce(mockFetchResponse({ lifetime_journal_count: 0 }));
    global.fetch.mockResolvedValueOnce(mockFetchResponse([]));

    renderWithQueryClient(<ProfilePage />);

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
    global.fetch.mockResolvedValueOnce(mockFetchResponse(mockBadges));
    global.fetch.mockResolvedValueOnce(mockFetchResponse({ lifetime_journal_count: 3 }));
    global.fetch.mockResolvedValueOnce(mockFetchResponse([{ id: 1 }, { id: 2 }]));

    renderWithQueryClient(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("3")).toBeVisible();
    });
    expect(screen.getAllByText("2")).toHaveLength(2);

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
    global.fetch.mockResolvedValueOnce(mockFetchResponse(mockBadges));
    global.fetch.mockResolvedValueOnce(mockFetchResponse({ lifetime_journal_count: 0 }));
    global.fetch.mockResolvedValueOnce(mockFetchResponse([]));

    renderWithQueryClient(<ProfilePage />);

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
    global.fetch.mockResolvedValueOnce(
      mockFetchResponse({ detail: "Unable to load badges." }, false)
    );
    // Don't mock the other calls - they won't be reached if first one fails

    renderWithQueryClient(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load badges.")).toBeVisible();
    });
  });

  test("shows an authentication error when there is no session", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: null,
      },
    });

    renderWithQueryClient(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("User is not authenticated.")).toBeVisible();
    });
  });
});