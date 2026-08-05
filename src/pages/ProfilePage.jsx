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

  useEffect(() => {
    async function fetchBadges() {
      setBadgesLoading(true);
      setBadgesError("");

      try {
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

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.detail || "Unable to load badges.",
          );
        }

        setBadges(result);
      } catch (error) {
        console.error("Badge fetch failed:", error);

        setBadgesError(
          error.message || "Unable to load badges.",
        );
      } finally {
        setBadgesLoading(false);
      }
    }

    fetchBadges();
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
    <main className="profile-page">
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
            <strong>—</strong>
            <span>Journals Analyzed</span>
          </article>

          <article className="profile-stat-card">
            <strong>—</strong>
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