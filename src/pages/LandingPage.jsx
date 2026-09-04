import { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const [pointerPosition, setPointerPosition] = useState({
    x: 50,
    y: 42,
  });

  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();

    setPointerPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  }
  function handlePointerLeave() {
    setPointerPosition({
      x: 50,
      y: 42,
    });
  }
  return (
    <main className="landing-page"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      >
      <section className="landing-content">
        <div
          className="landing-ink"
          aria-hidden="true"
          style={{
            "--pointer-x": `${pointerPosition.x}%`,
            "--pointer-y": `${pointerPosition.y}%`,
          }}
        />

        <div className="landing-logo">
          <img
            src="/WriteRightLogo.png"
            alt="WriteRight logo"
            className="landing-logo-image"
          />
        </div>

        <div className="landing-title-wrap">
          <h1 className="landing-title">WriteRight</h1>

          <svg
            className="landing-pen-stroke"
            viewBox="0 0 320 40"
            aria-hidden="true"
          >
            <path
              d="M12 24 C85 6, 220 8, 308 22"
              pathLength="1"
            />
          </svg>
        </div>

        <div
          className="landing-tagline"
          aria-label="Write. Learn. Remember."
        >
          <span>Write.</span>
          <span>Learn.</span>
          <span>Remember.</span>
        </div>

        <p className="landing-description">
          Turn every journal entry into personalized language practice,
          corrections, and flashcards.
        </p>

        <div className="landing-actions">
          <Link
            className="landing-button landing-button-primary"
            to="/signup"
          >
            Get Started
          </Link>

          <Link
            className="landing-button landing-button-secondary"
            to="/signin"
          >
            Log In
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;