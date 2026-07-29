import { supabase } from "../lib/supabase";


// Send the text to the backend for analysis
const {
  data: { session },
} = await supabase.auth.getSession();

export async function handleCorrectJournal(
  text,
  nativeLanguage,
  targetLanguage,
) {
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
