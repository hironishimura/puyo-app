'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function GameOverModal() {
  const phase     = useGameStore(s => s.phase);
  const score     = useGameStore(s => s.score);
  const startGame = useGameStore(s => s.startGame);

  return (
    <AnimatePresence>
      {phase === 'gameover' && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
              padding: '36px 40px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}
            initial={{ y: 32, scale: 0.85 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '0.04em' }}>
              GAME OVER
            </h2>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Final Score
              </p>
              <p style={{ fontSize: 44, fontWeight: 700, color: '#fde047', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {score.toLocaleString()}
              </p>
            </div>

            <motion.button
              onClick={startGame}
              style={{
                padding: '12px 36px',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                border: 'none',
                borderRadius: 999,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
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
