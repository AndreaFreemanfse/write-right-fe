import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";

import "./ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();

  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [badgesError, setBadgesError] = useState("");
  const [journalCount, setJournalCount] = useState(0);
  const [flashcardSetCount, setFlashcardSetCount] = useState(0);

useEffect(() => {
  async function fetchProfileData() {
    setBadgesLoading(true);
    setBadgesError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User is not authenticated.");
      }

      const requestOptions = {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      };

      const [
        badgesResponse,
        journalsResponse,
        flashcardSetsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/badges`, requestOptions),
        fetch(`${API_BASE_URL}/journal/entries`, requestOptions),
        fetch(`${API_BASE_URL}/flashcard-sets`, requestOptions),
      ]);

      const [
        badgesResult,
        journalsResult,
        flashcardSetsResult,
      ] = await Promise.all([
        badgesResponse.json(),
        journalsResponse.json(),
        flashcardSetsResponse.json(),
      ]);

      if (!badgesResponse.ok) {
        throw new Error(
          badgesResult.detail || "Unable to load badges.",
        );
      }

      if (!journalsResponse.ok) {
        throw new Error(
          journalsResult.detail || "Unable to load journals.",
        );
      }

      if (!flashcardSetsResponse.ok) {
        throw new Error(
          flashcardSetsResult.detail ||
            "Unable to load flashcard sets.",
        );
      }

      setBadges(badgesResult);
      setJournalCount(journalsResult.length);
      setFlashcardSetCount(flashcardSetsResult.length);
    } catch (error) {
      console.error("Profile data fetch failed:", error);

      setBadgesError(
        error.message || "Unable to load profile activity.",
      );
    } finally {
      setBadgesLoading(false);
    }
  }

  fetchProfileData();
}, []);

  const displayName =
    user?.email
      ?.split("@")[0]
      .replace(".", " ")
      .replace(/\b\w/g, (character) =>
        character.toUpperCase(),
      );

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unavailable";

  return (
    <main className="profile-page app-page">
      <section className="profile-header-card">
        <div className="profile-avatar" aria-hidden="true">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h1>{displayName}</h1>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-member-since">
            Member since {memberSince}
          </p>
        </div>
      </section>

      <section className="profile-section">
        <h2>Learning Activity</h2>

        <div className="profile-stat-grid">
          <article className="profile-stat-card">
            <strong>{badgesLoading ? "—" : journalCount}</strong>
            <span>Journals Analyzed</span>
          </article>

          <article className="profile-stat-card">
            <strong>
              {badgesLoading ? "—" : flashcardSetCount}
            </strong>
            <span>Flashcard Sets</span>
          </article>

          <article className="profile-stat-card">
            <strong>{badgesLoading ? "—" : badges.length}</strong>
            <span>Badges Earned</span>
          </article>
        </div>
      </section>

      <section className="profile-section">
        <h2>Your Badges</h2>

        {badgesLoading ? (
          <div className="profile-empty-state">
            <span className="profile-empty-icon">⏳</span>
            <p>Loading your badges...</p>
          </div>
        ) : badgesError ? (
          <div className="profile-empty-state profile-error-state">
            <span className="profile-empty-icon">⚠️</span>
            <p>{badgesError}</p>
          </div>
        ) : badges.length === 0 ? (
          <div className="profile-empty-state">
            <span className="profile-empty-icon">🏅</span>
            <p>Your earned badges will appear here.</p>
            <span>
              Keep writing and studying to unlock achievements.
            </span>
          </div>
        ) : (
          <div className="profile-badge-grid">
            {badges.map((userBadge) => (
              <article
                className="profile-badge-card"
                key={userBadge.id}
              >
                <div
                  className="profile-badge-icon"
                  aria-hidden="true"
                >
                  {userBadge.badge.icon}
                </div>

                <div className="profile-badge-content">
                  <h3>{userBadge.badge.name}</h3>

                  <p>{userBadge.badge.description}</p>

                  <span>
                    Earned{" "}
                    {new Date(
                      userBadge.earned_at,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;