'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PuyoCell } from './PuyoCell';
import { getSubPosition, getGhostRow, getConnections } from '@/game/logic';
import { BOARD_WIDTH, VISIBLE_HEIGHT, BOARD_HEIGHT } from '@/game/constants';
import { PuyoColor } from '@/game/types';

// 各セルのピクセルサイズ
const CELL_SIZE = 40;

export function GameBoard() {
  // ゲーム状態をストアから取得
  const board       = useGameStore(s => s.board);
  const activePiece = useGameStore(s => s.activePiece);
  const phase       = useGameStore(s => s.phase);

  // 表示用ボード: row 0（隠し行）を除いた row 1〜12 を使用
  const visibleBoard = board.slice(1);

  // アクティブピースとゴースト（落下先プレビュー）のセル情報を計算
  const { activeCells, ghostCells } = useMemo(() => {
    const active = new Map<string, PuyoColor>();
    const ghost  = new Map<string, PuyoColor>();

    // 消去中・落下中フェーズはアクティブピースを表示しない
    if (!activePiece || phase === 'clearing' || phase === 'settling') {
      return { activeCells: active, ghostCells: ghost };
    }

    const sub = getSubPosition(activePiece);
    // visibleBoard は board[1..12] に対応: rIdx = board行 - 1
    const toVis = (r: number) => r - 1;

    // メインぷよとサブぷよの位置を登録（隠し行より下のみ表示）
    if (activePiece.row >= 1) active.set(`${toVis(activePiece.row)},${activePiece.col}`, activePiece.mainColor);
    if (sub.row >= 1)         active.set(`${toVis(sub.row)},${sub.col}`, activePiece.subColor);

    // ゴースト: ぷよが落下する最終行を計算して薄く表示
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
        /* 白背景に映えるカラフルな枠線 */
        border: '2px solid rgba(99,102,241,0.4)',
        /* 半透明の白で清潔感のある見た目 */
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.15)',
      }}
    >
      {/* ===== グリッド線（薄いグレーで区切り） ===== */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${VISIBLE_HEIGHT}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: VISIBLE_HEIGHT * BOARD_WIDTH }).map((_, i) => (
          <div key={i} style={{ border: '1px solid rgba(99,102,241,0.08)' }} />
        ))}
      </div>

      {/* ===== ぷよセルの描画 ===== */}
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

            // 表示色の優先順位: アクティブ操作中 > 固定済み > ゴースト
            const displayColor: PuyoColor = activeColor ?? cell.color;
            const showGhost = !activeColor && cell.color === 'empty' && !!ghostColor;

            // 隣接する同色ぷよとの接続情報（形の丸め制御に使用）
            const conn = getConnections(board, boardRow, cIdx, displayColor);

            return (
              <div key={`${rIdx}-${cIdx}`} style={{ position: 'relative', width: CELL_SIZE, height: CELL_SIZE }}>
                {/* ゴーストぷよ（落下先プレビュー、半透明） */}
                {showGhost && ghostColor && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <PuyoCell color={ghostColor} isGhost size={CELL_SIZE} />
                  </div>
                )}
                {/* 通常ぷよ（空セル以外を描画） */}
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
