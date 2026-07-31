import "./AccuracyModal.css";

function AccuracySummary({ score = 86, onOpenDetails }) {
  function getScoreClass() {
    if (score < 50) return "accuracy-low";
    if (score < 75) return "accuracy-medium";
    if (score < 99) return "accuracy-high";

    return "accuracy-perfect";
  }

  return (
    <button
      type="button"
      className={`accuracy-bubble ${getScoreClass()}`}
      onClick={onOpenDetails}
      aria-label="View writing accuracy details"
    >
      <svg
        className="accuracy-bubble-graphic"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <defs>
          <path
            id="accuracy-label-path"
            d="M 20 80 A 46 46 0 0 0 100 80"
          />
        </defs>

        <g className="accuracy-bullseye-icon">
          <circle
            className="bullseye-outer"
            cx="60"
            cy="44"
            r="25"
          />

          <circle
            className="bullseye-middle"
            cx="60"
            cy="44"
            r="16"
          />

          <circle
            className="bullseye-inner"
            cx="60"
            cy="44"
            r="7"
          />
        </g>

        <text className="accuracy-curved-label">
          <textPath
            href="#accuracy-label-path"
            startOffset="50%"
            textAnchor="middle"
          >
            ACCURACY
          </textPath>
        </text>
      </svg>
    </button>
  );
}

export default AccuracySummary;