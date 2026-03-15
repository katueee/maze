import { useState, useCallback } from 'react';
import type { Maze, Difficulty } from '../utils/mazeGenerator';
import { generateMaze } from '../utils/mazeGenerator';
import type { Theme } from '../utils/themes';
import { getRandomTheme } from '../utils/themes';
import { MazeCanvas } from './MazeCanvas';
import { ClearModal } from './ClearModal';
import { playMoveSound, playClearSound, playStartSound, playBumpSound } from '../utils/sound';
import './GameScreen.css';

type Props = {
  difficulty: Difficulty;
  soundOn: boolean;
  onBack: () => void;
};

export function GameScreen({ difficulty, soundOn, onBack }: Props) {
  const [maze, setMaze] = useState<Maze>(() => generateMaze(difficulty));
  const [theme, setTheme] = useState<Theme>(() => getRandomTheme());
  const [playerPos, setPlayerPos] = useState(maze.start);
  const [cleared, setCleared] = useState(false);

  const handleMove = useCallback(
    (pos: { x: number; y: number }) => {
      if (cleared) return;
      setPlayerPos(pos);
      if (soundOn) playMoveSound();
      if (pos.x === maze.end.x && pos.y === maze.end.y) {
        setCleared(true);
        if (soundOn) playClearSound();
      }
    },
    [cleared, maze, soundOn]
  );

  const handleBump = useCallback(() => {
    if (soundOn) playBumpSound();
  }, [soundOn]);

  const resetMaze = useCallback(() => {
    setPlayerPos(maze.start);
    setCleared(false);
    if (soundOn) playStartSound();
  }, [maze, soundOn]);

  const newMaze = useCallback(() => {
    const m = generateMaze(difficulty);
    const t = getRandomTheme();
    setMaze(m);
    setTheme(t);
    setPlayerPos(m.start);
    setCleared(false);
    if (soundOn) playStartSound();
  }, [difficulty, soundOn]);

  return (
    <div className="game-screen" style={{ backgroundColor: theme.bgColor }}>
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          ← もどる
        </button>
        <span className="game-theme-label">
          {theme.emoji} {theme.name}
        </span>
      </div>

      <MazeCanvas
        maze={maze}
        theme={theme}
        playerPos={playerPos}
        onMove={handleMove}
        onBump={handleBump}
      />

      <div className="game-controls">
        <button
          className="game-ctrl-btn"
          style={{ borderColor: theme.accentColor, color: theme.accentColor }}
          onClick={resetMaze}
        >
          🔄 やりなおし
        </button>
        <button
          className="game-ctrl-btn"
          style={{ borderColor: theme.accentColor, color: theme.accentColor }}
          onClick={newMaze}
        >
          🆕 あたらしいめいろ
        </button>
      </div>

      {cleared && (
        <ClearModal
          theme={theme}
          onRetry={resetMaze}
          onNext={newMaze}
        />
      )}
    </div>
  );
}
