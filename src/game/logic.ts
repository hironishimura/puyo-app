import { Board, Cell, ActivePiece, MatchGroup, Rotation, PuyoColor, Connections } from './types';
import {
  BOARD_WIDTH, BOARD_HEIGHT, MIN_MATCH_SIZE,
  CHAIN_BONUS, COLOR_BONUS, GROUP_BONUS, GROUP_BONUS_MAX,
  SCORE_BASE,
} from './constants';

export function emptyCell(): Cell {
  return { color: 'empty', isClearing: false };
}

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, emptyCell)
  );
}

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell })));
}

export function getSubPosition(piece: ActivePiece): { row: number; col: number } {
  const { row, col, rotation } = piece;
  switch (rotation) {
    case 0: return { row: row - 1, col };
    case 1: return { row, col: col + 1 };
    case 2: return { row: row + 1, col };
    case 3: return { row, col: col - 1 };
  }
}

function isCellFree(board: Board, row: number, col: number): boolean {
  if (col < 0 || col >= BOARD_WIDTH) return false;
  if (row >= BOARD_HEIGHT) return false;
  if (row < 0) return true; // 隠し行の上は空き扱い
  return board[row][col].color === 'empty';
}

export function isValidPosition(board: Board, piece: ActivePiece): boolean {
  const { row, col } = piece;
  if (col < 0 || col >= BOARD_WIDTH) return false;
  if (row >= BOARD_HEIGHT) return false;
  if (row >= 0 && board[row][col].color !== 'empty') return false;

  const sub = getSubPosition(piece);
  if (sub.col < 0 || sub.col >= BOARD_WIDTH) return false;
  if (sub.row >= BOARD_HEIGHT) return false;
  if (sub.row >= 0 && board[sub.row][sub.col].color !== 'empty') return false;

  return true;
}

export function isLanding(board: Board, piece: ActivePiece): boolean {
  return !isValidPosition(board, { ...piece, row: piece.row + 1 });
}

export function getGhostRow(board: Board, piece: ActivePiece): number {
  let current = piece;
  while (isValidPosition(board, { ...current, row: current.row + 1 })) {
    current = { ...current, row: current.row + 1 };
  }
  return current.row;
}

export function placePiece(board: Board, piece: ActivePiece): Board {
  const next = cloneBoard(board);
  const sub = getSubPosition(piece);

  if (piece.row >= 0 && piece.row < BOARD_HEIGHT) {
    next[piece.row][piece.col] = { color: piece.mainColor, isClearing: false };
  }
  if (sub.row >= 0 && sub.row < BOARD_HEIGHT) {
    next[sub.row][sub.col] = { color: piece.subColor, isClearing: false };
  }
  return next;
}

export function findMatches(board: Board): MatchGroup[] {
  const visited = Array.from({ length: BOARD_HEIGHT }, () =>
    new Array<boolean>(BOARD_WIDTH).fill(false)
  );
  const groups: MatchGroup[] = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;

  for (let r = 0; r < BOARD_HEIGHT; r++) {
    for (let c = 0; c < BOARD_WIDTH; c++) {
      const color = board[r][c].color;
      if (visited[r][c] || color === 'empty' || color === 'ojama') continue;

      const queue: Array<{ row: number; col: number }> = [{ row: r, col: c }];
      const group: Array<{ row: number; col: number }> = [];
      visited[r][c] = true;

      while (queue.length > 0) {
        const { row, col } = queue.shift()!;
        group.push({ row, col });
        for (const [dr, dc] of dirs) {
          const nr = row + dr, nc = col + dc;
          if (
            nr >= 0 && nr < BOARD_HEIGHT &&
            nc >= 0 && nc < BOARD_WIDTH &&
            !visited[nr][nc] &&
            board[nr][nc].color === color
          ) {
            visited[nr][nc] = true;
            queue.push({ row: nr, col: nc });
          }
        }
      }

      if (group.length >= MIN_MATCH_SIZE) {
        groups.push({ color, cells: group });
      }
    }
  }
  return groups;
}

export function markClearing(board: Board, matches: MatchGroup[]): Board {
  const next = cloneBoard(board);
  for (const { cells } of matches) {
    for (const { row, col } of cells) {
      next[row][col] = { ...next[row][col], isClearing: true };
    }
  }
  return next;
}

export function removeMatches(board: Board, matches: MatchGroup[]): Board {
  const next = cloneBoard(board);
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;
  const toRemove = new Set<string>();

  for (const { cells } of matches) {
    for (const { row, col } of cells) {
      toRemove.add(`${row},${col}`);
      for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (
          nr >= 0 && nr < BOARD_HEIGHT &&
          nc >= 0 && nc < BOARD_WIDTH &&
          next[nr][nc].color === 'ojama'
        ) {
          toRemove.add(`${nr},${nc}`);
        }
      }
    }
  }

  for (const key of toRemove) {
    const [r, c] = key.split(',').map(Number);
    next[r][c] = emptyCell();
  }
  return next;
}

export function applyGravity(board: Board): Board {
  const next = cloneBoard(board);
  for (let c = 0; c < BOARD_WIDTH; c++) {
    const cells: Cell[] = [];
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
      if (next[r][c].color !== 'empty') cells.push(next[r][c]);
    }
    for (let r = 0; r < BOARD_HEIGHT; r++) next[r][c] = emptyCell();
    for (let i = 0; i < cells.length; i++) {
      next[BOARD_HEIGHT - 1 - i][c] = cells[i];
    }
  }
  return next;
}

export function isGameOver(board: Board): boolean {
  return board[0][2].color !== 'empty' || board[0][3].color !== 'empty';
}

export function calculateScore(
  chainCount: number,
  puyoCount: number,
  colorCount: number,
  groupBonusTotal: number
): number {
  const chainBonus = CHAIN_BONUS[Math.min(chainCount, CHAIN_BONUS.length - 1)] ?? 0;
  const colorBonus = COLOR_BONUS[Math.min(colorCount, COLOR_BONUS.length - 1)] ?? 0;
  const bonus = Math.max(1, chainBonus + colorBonus + groupBonusTotal);
  return SCORE_BASE * puyoCount * bonus;
}

export function extractScoreParams(matches: MatchGroup[]): {
  puyoCount: number;
  colorCount: number;
  groupBonusTotal: number;
} {
  const colors = new Set<PuyoColor>();
  let puyoCount = 0;
  let groupBonusTotal = 0;

  for (const { color, cells } of matches) {
    puyoCount += cells.length;
    colors.add(color);
    groupBonusTotal += GROUP_BONUS[Math.min(cells.length, GROUP_BONUS.length - 1)] ?? GROUP_BONUS_MAX;
  }
  return { puyoCount, colorCount: colors.size, groupBonusTotal };
}

export function getConnections(board: Board, row: number, col: number, color: PuyoColor): Connections {
  if (color === 'empty' || color === 'ojama') {
    return { top: false, bottom: false, left: false, right: false };
  }
  const check = (r: number, c: number) =>
    r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH && board[r][c].color === color;
  return {
    top: check(row - 1, col),
    bottom: check(row + 1, col),
    left: check(row, col - 1),
    right: check(row, col + 1),
  };
}
