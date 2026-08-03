import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();

  const displayName =
    user?.email
      ?.split("@")[0]
      .replace(".", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

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
            <strong>—</strong>
            <span>Badges Earned</span>
          </article>
        </div>
      </section>

      <section className="profile-section">
        <h2>Your Badges</h2>

        <div className="profile-empty-state">
          <span className="profile-empty-icon">🏅</span>
          <p>Your earned badges will appear here.</p>
          <span>
            Keep writing and studying to unlock achievements.
          </span>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;