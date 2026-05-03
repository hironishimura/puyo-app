'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// 連鎖数に応じた表示テキストのマッピング
const LABELS: Record<number, string> = {
  1: 'Chain!',
  2: 'Double!!',
  3: 'Triple!!',
  4: 'Quadruple!!',
  5: 'Quintuple!!',
  6: 'Sextuple!!',
  7: 'Septuple!!',
  8: 'Octuple!!',
};

export function ChainLabel() {
  // 連鎖数と現在フェーズを取得
  const displayChain = useGameStore(s => s.displayChain);
  const phase        = useGameStore(s => s.phase);

  // 消去中・落下中フェーズのみ連鎖ラベルを表示
  const visible = phase === 'clearing' || phase === 'settling';
  const label   = displayChain >= 1 ? (LABELS[displayChain] ?? `${displayChain} Chain!!`) : '';

  return (
    <AnimatePresence mode="wait">
      {visible && label && (
        <motion.div
          key={displayChain}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 20,
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          {/* 連鎖テキスト: 白背景でも映えるようオレンジ〜赤系のグラデーション */}
          <span style={{
            fontSize: displayChain >= 3 ? 28 : 32,
            fontWeight: 900,
            /* グラデーション文字で目立たせる */
            background: 'linear-gradient(90deg, #f97316, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            /* 白背景でも読みやすいシャドウ */
            filter: 'drop-shadow(0 2px 6px rgba(249,115,22,0.5))',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
