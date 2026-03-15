import { useState, useCallback } from 'react';
import type { Difficulty } from './utils/mazeGenerator';
import { getRandomTheme } from './utils/themes';
import { TitleScreen } from './components/TitleScreen';
import { GameScreen } from './components/GameScreen';
import { playStartSound } from './utils/sound';

type Screen = 'title' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [soundOn, setSoundOn] = useState(true);
  const [theme, setTheme] = useState(() => getRandomTheme());
  const [gameKey, setGameKey] = useState(0);

  const handleStart = useCallback(() => {
    if (soundOn) playStartSound();
    setGameKey((k) => k + 1);
    setScreen('game');
  }, [soundOn]);

  const handleBack = useCallback(() => {
    setTheme(getRandomTheme());
    setScreen('title');
  }, []);

  if (screen === 'game') {
    return (
      <GameScreen
        key={gameKey}
        difficulty={difficulty}
        soundOn={soundOn}
        onBack={handleBack}
      />
    );
  }

  return (
    <TitleScreen
      theme={theme}
      difficulty={difficulty}
      soundOn={soundOn}
      onStart={handleStart}
      onDifficultyChange={setDifficulty}
      onToggleSound={() => setSoundOn((s) => !s)}
    />
  );
}

export default App;
