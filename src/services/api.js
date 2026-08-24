import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";

// Fetches journal entries for the authenticated user
export async function handleCorrectJournal(
  title,
  text,
  nativeLanguage,
  targetLanguage,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/journal/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },

    body: JSON.stringify({
      title,
      text,
      native_language: nativeLanguage,
      target_language: targetLanguage,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Something went wrong while analyzing your journal."
    );
  }

  return await response.json();
}

// Fetches journal entries for the authenticated user
export async function getJournalEntries() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/journal/entries`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch journal entries");
  }

  return await response.json();
}

// Cached queries for React Query
export async function fetchBadges() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/badges`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Unable to load badges.");
  }

  return response.json();
}

export async function fetchJournalStats() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/journal/stats`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Unable to load journal stats.");
  }

  return response.json();
}

export async function fetchFlashcardSets() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/flashcard-sets`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Unable to load flashcard sets.");
  }

  return response.json();
}

export async function saveFlashcardSet(flashcardSet) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/flashcard-sets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(flashcardSet),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Unable to save flashcard set.");
  }

  return response.json();
}

export async function deleteFlashcardSet(flashcardSetId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(
    `${API_BASE_URL}/flashcard-sets/${flashcardSetId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Unable to delete flashcard set.");
  }

  return response.json();
}

export async function updateFlashcard(flashcardId, updates) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/flashcards/${flashcardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Unable to update flashcard.");
  }

  return response.json();
}

export async function deleteJournalEntry(entryId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(
    `${API_BASE_URL}/journal/${entryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete journal entry");
  }

  return await response.json();
}
