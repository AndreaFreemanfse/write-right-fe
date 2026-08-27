import { supabase } from "../lib/supabase";

// Auth --------------------------------------------

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }

  return data;
}

export async function signIn(email, password) {
  const { data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("native_language")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    ...data,
    native_language: profile.native_language,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// User Profile ---------------------------------

export async function updateNativeLanguage(nativeLanguage) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      native_language: nativeLanguage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)
    .select("native_language")
    .single();

  if (error) {
    throw error;
  }

  return data.native_language;
}
