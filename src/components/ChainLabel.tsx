'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const LABELS: Record<number, string> = {
  1: 'Chain!', 2: 'Double!!', 3: 'Triple!!', 4: 'Quadruple!!',
  5: 'Quintuple!!', 6: 'Sextuple!!', 7: 'Septuple!!', 8: 'Octuple!!',
};

export function ChainLabel() {
  const displayChain = useGameStore(s => s.displayChain);
  const phase        = useGameStore(s => s.phase);

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
            pointerEvents: 'none', zIndex: 20,
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <span style={{
            fontSize: displayChain >= 3 ? 28 : 32,
            fontWeight: 900,
            color: '#fde047',
            textShadow: '0 0 24px rgba(253,224,71,0.85), 0 2px 8px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
