export type PuyoColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'ojama'
  | 'empty';

export interface Cell {
  color: PuyoColor;
  isClearing: boolean;
}

// board[row][col] — row 0 が最上部（隠し行）
export type Board = Cell[][];

// 0=UP(sub上), 1=RIGHT(sub右), 2=DOWN(sub下), 3=LEFT(sub左)
export type Rotation = 0 | 1 | 2 | 3;

export interface ActivePiece {
  mainColor: PuyoColor;
  subColor: PuyoColor;
  col: number;
  row: number;
  rotation: Rotation;
}

export interface Tsumo {
  mainColor: PuyoColor;
  subColor: PuyoColor;
}

export type GamePhase =
  | 'idle'
  | 'falling'
  | 'locking'
  | 'clearing'
  | 'settling'
  | 'spawning'
  | 'gameover';

export interface MatchGroup {
  color: PuyoColor;
  cells: Array<{ row: number; col: number }>;
}

export interface Connections {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}
