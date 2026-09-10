import "./QuestParticles.css";

function QuestParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    sway: -20 + Math.random() * 40,
    opacity: 0.15 + Math.random() * 0.35,
  }));

  return (
    <div className="quest-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="quest-particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--sway": `${p.sway}px`,
            "--particle-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default QuestParticles;
