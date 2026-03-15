import { useEffect, useState } from 'react';
import type { Theme } from '../utils/themes';
import './ClearModal.css';

type Props = {
  theme: Theme;
  onRetry: () => void;
  onNext: () => void;
};

const SPARKLES = ['✨', '🌟', '⭐', '💫', '🎉', '🎊'];

export function ClearModal({ theme, onRetry, onNext }: Props) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; left: number; delay: number }[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: SPARKLES[Math.floor(Math.random() * SPARKLES.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="clear-overlay">
      <div className="clear-particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="clear-particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>
      <div className="clear-card" style={{ borderColor: theme.accentColor }}>
        <div className="clear-character">{theme.character}</div>
        <h2 className="clear-title" style={{ color: theme.accentColor }}>
          できた！🎉
        </h2>
        <p className="clear-sub">すごい！よくがんばったね！</p>
        <div className="clear-goal">{theme.goal}</div>
        <div className="clear-buttons">
          <button
            className="clear-btn"
            style={{ backgroundColor: theme.accentColor }}
            onClick={onRetry}
          >
            🔄 もういっかい
          </button>
          <button
            className="clear-btn"
            style={{ backgroundColor: theme.accentColor }}
            onClick={onNext}
          >
            ➡️ つぎのめいろ
          </button>
        </div>
      </div>
    </div>
  );
}
