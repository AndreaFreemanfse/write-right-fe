// context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Check if user has completed onboarding
      if (currentUser) {
        setProfileLoading(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("native_language")
          .eq("id", currentUser.id)
          .single();

        // Prefer profile data; fall back to localStorage flag
        const profileComplete = !!profile?.native_language;
        const localComplete = localStorage.getItem("onboardingComplete") === "true";
        setOnboardingComplete(profileComplete || localComplete);
        setProfileLoading(false);
      } else {
        setOnboardingComplete(false);
        setProfileLoading(false);
      }

      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        setProfileLoading(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("native_language")
          .eq("id", currentUser.id)
          .single();

        const profileComplete = !!profile?.native_language;
        const localComplete = localStorage.getItem("onboardingComplete") === "true";
        setOnboardingComplete(profileComplete || localComplete);
        setProfileLoading(false);
      } else {
        setOnboardingComplete(false);
        setProfileLoading(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize synchronously from localStorage to avoid brief false state
  const [onboardingComplete, setOnboardingComplete] = useState(
    () => localStorage.getItem("onboardingComplete") === "true",
  );

  return (
    <AuthContext.Provider value={{ user, loading, onboardingComplete, setOnboardingComplete, profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
