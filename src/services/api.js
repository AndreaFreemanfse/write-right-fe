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

export async function deleteJournalEntry(entryId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/journal/${entryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete journal entry");
  }

  return await response.json();
}

export async function updateJournalEntry(entryId, data) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/journal/${entryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Update failed:", {
      status: response.status,
      error: result,
    });

    throw new Error(JSON.stringify(result));
  }

  return result;
}
