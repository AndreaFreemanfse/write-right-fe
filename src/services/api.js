import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";

// Analyze a journal entry using the selected review mode.
export async function handleCorrectJournal(
  title,
  text,
  nativeLanguage,
  targetLanguage,
  reviewDepth
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
     review_depth: reviewDepth,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong while analyzing your journal.";

    try {
      const data = await response.json();
      errorMessage = data.detail || errorMessage;
    } catch {
      // Keep the default error message if the response
      // does not contain valid JSON.
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

// Fetch journal entries for the authenticated user.
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

// Delete a journal entry.
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

// Update an existing journal entry.
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

    throw new Error(result.detail || "Failed to update journal entry");
  }

  return result;
}
