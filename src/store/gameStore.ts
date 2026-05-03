'use client';

import { create } from 'zustand';
import { Board, ActivePiece, Tsumo, GamePhase } from '@/game/types';
import {
  SPAWN_COL, SPAWN_ROW, NEXT_QUEUE_SIZE,
  LOCK_DELAY, CLEAR_DURATION, SETTLE_DURATION, SPAWN_DELAY,
  DEFAULT_FALL_INTERVAL, SOFT_DROP_INTERVAL, FALL_INTERVALS,
} from '@/game/constants';
import {
  createEmptyBoard,
  getSubPosition, isValidPosition, isLanding,
  placePiece, findMatches, markClearing, removeMatches,
  applyGravity, calculateScore, extractScoreParams, isGameOver,
} from '@/game/logic';
import { TsumoGenerator } from '@/game/generator';

interface GameState {
  board: Board;
  activePiece: ActivePiece | null;
  nextTsumos: Tsumo[];
  score: number;
  level: number;
  chainCount: number;
  displayChain: number;
  phase: GamePhase;
  clearedCells: Array<{ row: number; col: number }>;
  lockTimer: number;
  phaseTimer: number;
  totalPuyoCleared: number;
  isRunning: boolean;
  softDropping: boolean;
}

interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  softDropStart: () => void;
  softDropEnd: () => void;
  hardDrop: () => void;
  tick: (deltaMs: number) => void;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  board: createEmptyBoard(),
  activePiece: null,
  nextTsumos: [],
  score: 0,
  level: 1,
  chainCount: 0,
  displayChain: 0,
  phase: 'idle',
  clearedCells: [],
  lockTimer: 0,
  phaseTimer: 0,
  totalPuyoCleared: 0,
  isRunning: false,
  softDropping: false,
};

let generator: TsumoGenerator | null = null;

function calcLevel(score: number): number {
  return Math.min(15, Math.floor(score / 5000) + 1);
}

function getFallInterval(level: number, softDropping: boolean): number {
  if (softDropping) return SOFT_DROP_INTERVAL;
  return FALL_INTERVALS[Math.min(level, 15)] ?? DEFAULT_FALL_INTERVAL;
}

function spawnPiece(tsumo: Tsumo): ActivePiece {
  return {
    mainColor: tsumo.mainColor,
    subColor: tsumo.subColor,
    col: SPAWN_COL,
    row: SPAWN_ROW,
    rotation: 0,
  };
}

export const useGameStore = create<GameStore>((set, get) => {
  // クロージャ内部ヘルパー: マッチ処理 or スポーンへ遷移
  function transitionAfterSettle(board: Board, chainCount: number) {
    const matches = findMatches(board);

    if (matches.length > 0) {
      const marked = markClearing(board, matches);
      const clearedCells = matches.flatMap(m => m.cells);
      set({ board: marked, phase: 'clearing', phaseTimer: 0, chainCount, clearedCells, displayChain: chainCount });
    } else {
      // 連鎖終了
      if (isGameOver(board)) {
        set({ board, phase: 'gameover', activePiece: null, isRunning: false, displayChain: 0, chainCount: 0 });
        return;
      }
      const { nextTsumos } = get();
      const [nextTsumo, ...remaining] = nextTsumos;
      const refilled = [...remaining];
      while (refilled.length < NEXT_QUEUE_SIZE) {
        refilled.push(generator!.next());
      }
      const newPiece = spawnPiece(nextTsumo);
      set({
        board,
        activePiece: newPiece,
        nextTsumos: refilled,
        phase: 'spawning',
        phaseTimer: 0,
        chainCount: 0,
        displayChain: 0,
        clearedCells: [],
      });
    }
  }

  return {
    ...initialState,

    startGame: () => {
      generator = new TsumoGenerator();
      const nextTsumos: Tsumo[] = [];
      while (nextTsumos.length < NEXT_QUEUE_SIZE) {
        nextTsumos.push(generator.next());
      }
      const [firstTsumo, ...rest] = nextTsumos;
      set({
        ...initialState,
        isRunning: true,
        nextTsumos: rest,
        activePiece: spawnPiece(firstTsumo),
        phase: 'spawning',
        phaseTimer: 0,
      });
    },

    resetGame: () => {
      generator = null;
      set({ ...initialState });
    },

    moveLeft: () => {
      const { activePiece, board, phase } = get();
      if (!activePiece || (phase !== 'falling' && phase !== 'locking')) return;
      const next: ActivePiece = { ...activePiece, col: activePiece.col - 1 };
      if (isValidPosition(board, next)) set({ activePiece: next, lockTimer: 0 });
    },

    moveRight: () => {
      const { activePiece, board, phase } = get();
      if (!activePiece || (phase !== 'falling' && phase !== 'locking')) return;
      const next: ActivePiece = { ...activePiece, col: activePiece.col + 1 };
      if (isValidPosition(board, next)) set({ activePiece: next, lockTimer: 0 });
    },

    rotateLeft: () => {
      const { activePiece, board, phase } = get();
      if (!activePiece || (phase !== 'falling' && phase !== 'locking')) return;
      const newRot = ((activePiece.rotation - 1 + 4) % 4) as 0 | 1 | 2 | 3;
      const next: ActivePiece = { ...activePiece, rotation: newRot };
      for (const offset of [0, 1, -1]) {
        const candidate = { ...next, col: next.col + offset };
        if (isValidPosition(board, candidate)) {
          set({ activePiece: candidate, lockTimer: 0 });
          return;
        }
      }
    },

    rotateRight: () => {
      const { activePiece, board, phase } = get();
      if (!activePiece || (phase !== 'falling' && phase !== 'locking')) return;
      const newRot = ((activePiece.rotation + 1) % 4) as 0 | 1 | 2 | 3;
      const next: ActivePiece = { ...activePiece, rotation: newRot };
      for (const offset of [0, 1, -1]) {
        const candidate = { ...next, col: next.col + offset };
        if (isValidPosition(board, candidate)) {
          set({ activePiece: candidate, lockTimer: 0 });
          return;
        }
      }
    },

    softDropStart: () => set({ softDropping: true }),
    softDropEnd: () => set({ softDropping: false }),

    hardDrop: () => {
      const { activePiece, board, phase } = get();
      if (!activePiece || (phase !== 'falling' && phase !== 'locking')) return;
      let cur = { ...activePiece };
      while (isValidPosition(board, { ...cur, row: cur.row + 1 })) {
        cur = { ...cur, row: cur.row + 1 };
      }
      const newBoard = placePiece(board, cur);
      set({ activePiece: null });
      transitionAfterSettle(newBoard, 1);
    },

    tick: (deltaMs: number) => {
      const state = get();
      if (!state.isRunning) return;
      const { phase, activePiece, board, phaseTimer, lockTimer, chainCount, score, level, softDropping } = state;

      switch (phase) {
        case 'spawning': {
          const elapsed = phaseTimer + deltaMs;
          if (elapsed >= SPAWN_DELAY) {
            if (activePiece && !isValidPosition(board, activePiece)) {
              set({ phase: 'gameover', isRunning: false });
              return;
            }
            set({ phase: 'falling', phaseTimer: 0, lockTimer: 0 });
          } else {
            set({ phaseTimer: elapsed });
          }
          break;
        }

        case 'falling': {
          if (!activePiece) return;
          const interval = getFallInterval(level, softDropping);
          const elapsed = phaseTimer + deltaMs;
          if (elapsed >= interval) {
            const next: ActivePiece = { ...activePiece, row: activePiece.row + 1 };
            if (isValidPosition(board, next)) {
              set({ activePiece: next, phaseTimer: elapsed % interval });
            } else {
              set({ phase: 'locking', phaseTimer: 0, lockTimer: 0 });
            }
          } else {
            set({ phaseTimer: elapsed });
          }
          break;
        }

        case 'locking': {
          if (!activePiece) return;
          if (!isLanding(board, activePiece)) {
            set({ phase: 'falling', phaseTimer: 0, lockTimer: 0 });
            return;
          }
          const newLock = lockTimer + deltaMs;
          if (newLock >= LOCK_DELAY) {
            const newBoard = placePiece(board, activePiece);
            set({ activePiece: null, lockTimer: 0 });
            transitionAfterSettle(newBoard, 1);
          } else {
            set({ lockTimer: newLock });
          }
          break;
        }

        case 'clearing': {
          const elapsed = phaseTimer + deltaMs;
          if (elapsed >= CLEAR_DURATION) {
            const matches = findMatches(board);
            const { puyoCount, colorCount, groupBonusTotal } = extractScoreParams(matches);
            const gained = calculateScore(chainCount, puyoCount, colorCount, groupBonusTotal);
            const newScore = score + gained;
            const cleared = removeMatches(board, matches);
            const settled = applyGravity(cleared);
            set({
              score: newScore,
              level: calcLevel(newScore),
              totalPuyoCleared: state.totalPuyoCleared + puyoCount,
              board: settled,
              clearedCells: [],
              phase: 'settling',
              phaseTimer: 0,
            });
          } else {
            set({ phaseTimer: elapsed });
          }
          break;
        }

        case 'settling': {
          const elapsed = phaseTimer + deltaMs;
          if (elapsed >= SETTLE_DURATION) {
            transitionAfterSettle(board, chainCount + 1);
          } else {
            set({ phaseTimer: elapsed });
          }
          break;
        }
      }
    },
  };
});
