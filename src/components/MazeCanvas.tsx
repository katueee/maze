import { useRef, useEffect, useCallback } from 'react';
import type { Maze } from '../utils/mazeGenerator';
import { canMove } from '../utils/mazeGenerator';
import type { Theme } from '../utils/themes';

type Props = {
  maze: Maze;
  theme: Theme;
  playerPos: { x: number; y: number };
  onMove: (pos: { x: number; y: number }) => void;
  onBump: () => void;
};

export function MazeCanvas({ maze, theme, playerPos, onMove, onBump }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCellSize = useCallback(() => {
    const maxW = Math.min(window.innerWidth - 32, 400);
    const maxH = Math.min(window.innerHeight * 0.55, 500);
    const cellW = Math.floor(maxW / maze.width);
    const cellH = Math.floor(maxH / maze.height);
    return Math.min(cellW, cellH);
  }, [maze.width, maze.height]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = getCellSize();
    const w = cellSize * maze.width;
    const h = cellSize * maze.height;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = theme.pathColor;
    ctx.fillRect(0, 0, w, h);

    const wallWidth = Math.max(2, cellSize * 0.12);

    // Draw walls
    ctx.strokeStyle = theme.wallColor;
    ctx.lineWidth = wallWidth;
    ctx.lineCap = 'round';

    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        const cell = maze.cells[y][x];
        const cx = x * cellSize;
        const cy = y * cellSize;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellSize, cy);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(cx + cellSize, cy);
          ctx.lineTo(cx + cellSize, cy + cellSize);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(cx, cy + cellSize);
          ctx.lineTo(cx + cellSize, cy + cellSize);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + cellSize);
          ctx.stroke();
        }
      }
    }

    // Draw goal
    const goalSize = cellSize * 0.65;
    const gx = maze.end.x * cellSize + cellSize / 2;
    const gy = maze.end.y * cellSize + cellSize / 2;
    ctx.font = `${goalSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(theme.goal, gx, gy);

    // Draw player
    const playerSize = cellSize * 0.6;
    const px = playerPos.x * cellSize + cellSize / 2;
    const py = playerPos.y * cellSize + cellSize / 2;
    ctx.font = `${playerSize}px serif`;
    ctx.fillText(theme.character, px, py);
  }, [maze, theme, playerPos, getCellSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const tryMove = useCallback(
    (dx: number, dy: number) => {
      const newPos = { x: playerPos.x + dx, y: playerPos.y + dy };
      if (canMove(maze, playerPos, newPos)) {
        onMove(newPos);
      } else {
        onBump();
      }
    },
    [maze, playerPos, onMove, onBump]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const threshold = 15;

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      // Tap - move towards tap location
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const cellSize = getCellSize();
        const tapX = Math.floor((touch.clientX - rect.left) / cellSize);
        const tapY = Math.floor((touch.clientY - rect.top) / cellSize);
        const tdx = tapX - playerPos.x;
        const tdy = tapY - playerPos.y;
        if (Math.abs(tdx) >= Math.abs(tdy) && tdx !== 0) {
          tryMove(tdx > 0 ? 1 : -1, 0);
        } else if (tdy !== 0) {
          tryMove(0, tdy > 0 ? 1 : -1);
        }
      }
    } else if (Math.abs(dx) > Math.abs(dy)) {
      tryMove(dx > 0 ? 1 : -1, 0);
    } else {
      tryMove(0, dy > 0 ? 1 : -1);
    }
    touchStartRef.current = null;
  };

  // Keyboard support for testing
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': tryMove(0, -1); break;
        case 'ArrowDown': tryMove(0, 1); break;
        case 'ArrowLeft': tryMove(-1, 0); break;
        case 'ArrowRight': tryMove(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tryMove]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0',
        touchAction: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          borderRadius: '12px',
          boxShadow: `0 4px 16px ${theme.wallColor}44`,
          border: `3px solid ${theme.wallColor}`,
        }}
      />
    </div>
  );
}
