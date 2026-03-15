export type Cell = {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
};

export type Maze = {
  width: number;
  height: number;
  cells: Cell[][];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export type Difficulty = 'easy' | 'normal' | 'hard';

const DIFFICULTY_CONFIG: Record<Difficulty, { width: number; height: number }> = {
  easy: { width: 5, height: 7 },
  normal: { width: 7, height: 9 },
  hard: { width: 9, height: 12 },
};

function createGrid(width: number, height: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      });
    }
    grid.push(row);
  }
  return grid;
}

function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const { x, y } = cell;
  const neighbors: Cell[] = [];
  const height = grid.length;
  const width = grid[0].length;

  if (y > 0) neighbors.push(grid[y - 1][x]);
  if (x < width - 1) neighbors.push(grid[y][x + 1]);
  if (y < height - 1) neighbors.push(grid[y + 1][x]);
  if (x > 0) neighbors.push(grid[y][x - 1]);

  return neighbors.filter((n) => !n.visited);
}

function removeWall(current: Cell, next: Cell): void {
  const dx = next.x - current.x;
  const dy = next.y - current.y;

  if (dx === 1) {
    current.walls.right = false;
    next.walls.left = false;
  } else if (dx === -1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (dy === 1) {
    current.walls.bottom = false;
    next.walls.top = false;
  } else if (dy === -1) {
    current.walls.top = false;
    next.walls.bottom = false;
  }
}

export function generateMaze(difficulty: Difficulty): Maze {
  const { width, height } = DIFFICULTY_CONFIG[difficulty];
  const cells = createGrid(width, height);

  // Recursive backtracking
  const stack: Cell[] = [];
  const start = cells[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getNeighbors(current, cells);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, next);
      next.visited = true;
      stack.push(next);
    }
  }

  // Remove a few extra walls for easier paths (especially for kids)
  const extraRemovals = difficulty === 'easy' ? 4 : difficulty === 'normal' ? 2 : 1;
  for (let i = 0; i < extraRemovals; i++) {
    const ry = Math.floor(Math.random() * (height - 1));
    const rx = Math.floor(Math.random() * (width - 1));
    const dir = Math.random() < 0.5 ? 'right' : 'bottom';
    if (dir === 'right' && rx < width - 1) {
      removeWall(cells[ry][rx], cells[ry][rx + 1]);
    } else if (dir === 'bottom' && ry < height - 1) {
      removeWall(cells[ry][rx], cells[ry + 1][rx]);
    }
  }

  return {
    width,
    height,
    cells,
    start: { x: 0, y: 0 },
    end: { x: width - 1, y: height - 1 },
  };
}

export function canMove(
  maze: Maze,
  from: { x: number; y: number },
  to: { x: number; y: number }
): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
  if (to.x < 0 || to.x >= maze.width || to.y < 0 || to.y >= maze.height) return false;

  const cell = maze.cells[from.y][from.x];
  if (dx === 1) return !cell.walls.right;
  if (dx === -1) return !cell.walls.left;
  if (dy === 1) return !cell.walls.bottom;
  if (dy === -1) return !cell.walls.top;

  return false;
}
