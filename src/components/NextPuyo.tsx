'use client';

import { useGameStore } from '@/store/gameStore';
import { PuyoCell } from './PuyoCell';

export function NextPuyo() {
  const nextTsumos = useGameStore(s => s.nextTsumos);
  const display = nextTsumos.slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
        Next
      </p>
      {display.map((tsumo, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: 8,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            transform: i === 0 ? 'scale(1)' : 'scale(0.72)',
            opacity: i === 0 ? 1 : 0.55,
            transformOrigin: 'top center',
          }}
        >
          <PuyoCell color={tsumo.subColor}  size={32} />
          <PuyoCell color={tsumo.mainColor} size={32} />
        </div>
      ))}
    </div>
  );
}
