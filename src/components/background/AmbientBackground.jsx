import "./AmbientBackground.css";

function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-track ambient-track-one">
        écrire · schreiben · escribir · scrivere · journal · grammar · syntax ·
        vocabulary · meaning · prose · reflection ·
      </div>

      <div className="ambient-track ambient-track-two">
        字 · शब्द · كلمة · 문장 · phrase · sentence · paragraph · punctuation ·
        expression · language ·
      </div>

      <div className="ambient-track ambient-track-three">
        ✎ · “ ” · {`{ }`} · ( ) · ; · : · Σ · ∞ · conjugation · translation ·
        fluency ·
      </div>

      <div className="ambient-symbol ambient-symbol-one">文</div>
      <div className="ambient-symbol ambient-symbol-two">✎</div>
      <div className="ambient-symbol ambient-symbol-three">“ ”</div>
      <div className="ambient-symbol ambient-symbol-four">語</div>
      <div className="ambient-symbol ambient-symbol-five">🖋</div>
    </div>
  );
}

export default AmbientBackground;