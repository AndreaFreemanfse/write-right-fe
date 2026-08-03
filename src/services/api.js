import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";

export async function handleCorrectJournal(
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
      text,
      native_language: nativeLanguage,
      target_language: targetLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error("Journal analysis failed");
  }

  return await response.json();
}
