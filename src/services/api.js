import { supabase } from "../lib/supabase";

// Send the text to the backend for analysis
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

  console.log(session.access_token);
  console.log("SESSION:", session);

  const response = await fetch("http://localhost:8000/journal/analyze", {
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

  console.log(response)

  return await response.json();
}
