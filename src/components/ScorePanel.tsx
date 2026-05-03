'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.10)',
      backdropFilter: 'blur(8px)',
    }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>
        {label}
      </p>
      <motion.p
        key={String(value)}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18 }}
        style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.p>
    </div>
  );
}

export function ScorePanel() {
  const score            = useGameStore(s => s.score);
  const level            = useGameStore(s => s.level);
  const totalPuyoCleared = useGameStore(s => s.totalPuyoCleared);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <StatBox label="Score"   value={score} />
      <StatBox label="Level"   value={level} />
      <StatBox label="Cleared" value={totalPuyoCleared} />
    </div>
  );
}
