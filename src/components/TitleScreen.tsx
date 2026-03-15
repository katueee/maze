import type { Difficulty } from '../utils/mazeGenerator';
import type { Theme } from '../utils/themes';
import './TitleScreen.css';

type Props = {
  theme: Theme;
  difficulty: Difficulty;
  soundOn: boolean;
  onStart: () => void;
  onDifficultyChange: (d: Difficulty) => void;
  onToggleSound: () => void;
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'かんたん 🌟',
  normal: 'ふつう 🌟🌟',
  hard: 'むずかしい 🌟🌟🌟',
};

export function TitleScreen({
  theme,
  difficulty,
  soundOn,
  onStart,
  onDifficultyChange,
  onToggleSound,
}: Props) {
  return (
    <div className="title-screen" style={{ backgroundColor: theme.bgColor }}>
      <div className="title-content">
        <div className="title-character-bounce">{theme.character}</div>
        <h1 className="title-heading">
          めいろで <span style={{ color: theme.accentColor }}>あそぼう！</span>
        </h1>
        <p className="title-theme-name">
          {theme.emoji} {theme.name} {theme.emoji}
        </p>

        <div className="title-hint">
          ☝️ ゆびでゴールまでいこう！
        </div>

        <button
          className="title-start-btn"
          style={{ backgroundColor: theme.accentColor }}
          onClick={onStart}
        >
          はじめる ▶
        </button>

        <div className="title-difficulty">
          {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              className={`title-diff-btn ${d === difficulty ? 'active' : ''}`}
              style={
                d === difficulty
                  ? { backgroundColor: theme.accentColor, color: '#fff' }
                  : { borderColor: theme.accentColor, color: theme.accentColor }
              }
              onClick={() => onDifficultyChange(d)}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>

        <button className="title-sound-btn" onClick={onToggleSound}>
          {soundOn ? '🔊 おとON' : '🔇 おとOFF'}
        </button>
      </div>
    </div>
  );
}
