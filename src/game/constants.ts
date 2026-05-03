export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 13;   // 上1行は隠し行
export const VISIBLE_HEIGHT = 12;

export const SPAWN_COL = 2;
export const SPAWN_ROW = 1;

export const MIN_MATCH_SIZE = 4;

// ms/tick — レベルごとの落下間隔
export const FALL_INTERVALS: Record<number, number> = {
  1: 800, 2: 640, 3: 528, 4: 432, 5: 352,
  6: 288, 7: 232, 8: 192, 9: 160, 10: 128,
  11: 104, 12: 80, 13: 64, 14: 48, 15: 32,
};
export const DEFAULT_FALL_INTERVAL = 800;
export const SOFT_DROP_INTERVAL = 48;

export const LOCK_DELAY = 500;
export const CLEAR_DURATION = 500;
export const SETTLE_DURATION = 250;
export const SPAWN_DELAY = 80;

export const CHAIN_BONUS = [
  0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256,
  288, 320, 352, 384, 416, 448, 480, 512,
] as const;

export const COLOR_BONUS = [0, 0, 3, 6, 12, 24] as const;

export const GROUP_BONUS = [0, 0, 0, 0, 0, 2, 3, 4, 5, 6, 8, 10, 12] as const;
export const GROUP_BONUS_MAX = 12;

export const PUYO_COLORS = ['red', 'blue', 'green', 'yellow', 'purple'] as const;
export type NormalPuyoColor = (typeof PUYO_COLORS)[number];

export const NEXT_QUEUE_SIZE = 4;
export const SCORE_BASE = 10;
