'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function GameOverModal() {
  // ゲームフェーズ、最終スコア、リスタート関数を取得
  const phase     = useGameStore(s => s.phase);
  const score     = useGameStore(s => s.score);
  const startGame = useGameStore(s => s.startGame);

  return (
    <AnimatePresence>
      {phase === 'gameover' && (
        /* ===== 背景オーバーレイ（フィールド全体を覆う） ===== */
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            /* 白に近い半透明オーバーレイ */
            background: 'rgba(255,255,255,0.80)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* ===== モーダル本体 ===== */}
          <motion.div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
              padding: '36px 40px',
              /* 白カードにカラフルな枠線 */
              background: '#ffffff',
              border: '2px solid rgba(139,92,246,0.3)',
              borderRadius: 20,
              boxShadow: '0 16px 48px rgba(139,92,246,0.2)',
            }}
            initial={{ y: 32, scale: 0.85 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
          >
            {/* GAME OVER タイトル: グラデーション文字 */}
            <h2 style={{
              fontSize: 36,
              fontWeight: 900,
              margin: 0,
              letterSpacing: '0.04em',
              background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              GAME OVER
            </h2>

            {/* 最終スコア表示 */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',        /* グレーで控えめに */
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: '0 0 6px',
              }}>
                Final Score
              </p>
              {/* スコア数値: オレンジで大きく目立つ */}
              <p style={{
                fontSize: 44,
                fontWeight: 700,
                color: '#f97316',
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {score.toLocaleString()}
              </p>
            </div>

            {/* リスタートボタン */}
            <motion.button
              onClick={startGame}
              style={{
                padding: '12px 36px',
                /* カラフルなグラデーションボタン */
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                border: 'none',
                borderRadius: 999,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              PLAY AGAIN
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
