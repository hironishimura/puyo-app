'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PuyoCell } from './PuyoCell';
import { getSubPosition, getGhostRow, getConnections } from '@/game/logic';
import { BOARD_WIDTH, VISIBLE_HEIGHT, BOARD_HEIGHT } from '@/game/constants';
import { PuyoColor } from '@/game/types';

const CELL_SIZE = 40;

export function GameBoard() {
  const board       = useGameStore(s => s.board);
  const activePiece = useGameStore(s => s.activePiece);
  const phase       = useGameStore(s => s.phase);

  // 表示用ボード (row 1〜12, 隠し行 row0 を除外)
  const visibleBoard = board.slice(1);

  // アクティブピースとゴーストのセル情報
  const { activeCells, ghostCells } = useMemo(() => {
    const active = new Map<string, PuyoColor>();
    const ghost  = new Map<string, PuyoColor>();
    if (!activePiece || phase === 'clearing' || phase === 'settling') {
      return { activeCells: active, ghostCells: ghost };
    }

    const sub = getSubPosition(activePiece);
    // visibleBoard は board[1..12] に対応: key は visibleBoard の rIdx
    const toVis = (r: number) => r - 1;

    if (activePiece.row >= 1) active.set(`${toVis(activePiece.row)},${activePiece.col}`, activePiece.mainColor);
    if (sub.row >= 1)         active.set(`${toVis(sub.row)},${sub.col}`, activePiece.subColor);

    // ゴースト
    const ghostMainRow = getGhostRow(board, activePiece);
    if (ghostMainRow >= 1) {
      const ghostSub = getSubPosition({ ...activePiece, row: ghostMainRow });
      ghost.set(`${toVis(ghostMainRow)},${activePiece.col}`, activePiece.mainColor);
      if (ghostSub.row >= 1) ghost.set(`${toVis(ghostSub.row)},${ghostSub.col}`, activePiece.subColor);
    }

    return { activeCells: active, ghostCells: ghost };
  }, [board, activePiece, phase]);

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        width: CELL_SIZE * BOARD_WIDTH,
        height: CELL_SIZE * VISIBLE_HEIGHT,
        border: '2px solid rgba(255,255,255,0.15)',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* グリッド線 */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${VISIBLE_HEIGHT}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: VISIBLE_HEIGHT * BOARD_WIDTH }).map((_, i) => (
          <div key={i} style={{ border: '1px solid rgba(255,255,255,0.04)' }} />
        ))}
      </div>

      {/* ぷよセル */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${VISIBLE_HEIGHT}, ${CELL_SIZE}px)`,
        }}
      >
        {visibleBoard.map((rowCells, rIdx) =>
          rowCells.map((cell, cIdx) => {
            const boardRow = rIdx + 1;
            const activeColor = activeCells.get(`${rIdx},${cIdx}`);
            const ghostColor  = ghostCells.get(`${rIdx},${cIdx}`);

            // 表示する色の優先順位: アクティブ > ボード固定 > ゴースト
            const displayColor: PuyoColor = activeColor ?? cell.color;
            const showGhost = !activeColor && cell.color === 'empty' && !!ghostColor;

            const conn = getConnections(board, boardRow, cIdx, displayColor);

            return (
              <div key={`${rIdx}-${cIdx}`} style={{ position: 'relative', width: CELL_SIZE, height: CELL_SIZE }}>
                {showGhost && ghostColor && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <PuyoCell color={ghostColor} isGhost size={CELL_SIZE} />
                  </div>
                )}
                {displayColor !== 'empty' && (
                  <PuyoCell
                    color={displayColor}
                    isClearing={cell.isClearing}
                    connections={conn}
                    size={CELL_SIZE}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
