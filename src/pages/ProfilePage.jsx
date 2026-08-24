import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchBadges, fetchJournalStats, fetchFlashcardSets } from "../services/api";

import "./ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();

  const { data: badgesData, isLoading: badgesLoading, error: badgesError } = useQuery({
    queryKey: ["badges"],
    queryFn: fetchBadges,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: journalStatsData, isLoading: journalStatsLoading } = useQuery({
    queryKey: ["journal-stats"],
    queryFn: fetchJournalStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: flashcardSetsData, isLoading: flashcardSetsLoading } = useQuery({
    queryKey: ["flashcard-sets"],
    queryFn: fetchFlashcardSets,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isLoading = badgesLoading || journalStatsLoading || flashcardSetsLoading;
  const error = badgesError?.message || "";
  const badges = badgesData || [];
  const journalCount = journalStatsData?.lifetime_journal_count || 0;
  const flashcardSetCount = flashcardSetsData?.length || 0;

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
            <strong>{isLoading ? "—" : journalCount}</strong>
            <span>Journals Analyzed</span>
          </article>

          <article className="profile-stat-card">
            <strong>
              {isLoading ? "—" : flashcardSetCount}
            </strong>
            <span>Flashcard Sets</span>
          </article>

          <article className="profile-stat-card">
            <strong>{isLoading ? "—" : badges.length}</strong>
            <span>Badges Earned</span>
          </article>
        </div>
      </section>

      <section className="profile-section">
        <h2>Your Badges</h2>

        {isLoading ? (
          <div className="profile-empty-state">
            <span className="profile-empty-icon">⏳</span>
            <p>Loading your badges...</p>
          </div>
        ) : error ? (
          <div className="profile-empty-state profile-error-state">
            <span className="profile-empty-icon">⚠️</span>
            <p>{error}</p>
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