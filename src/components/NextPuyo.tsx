'use client';

import { useGameStore } from '@/store/gameStore';
import { PuyoCell } from './PuyoCell';

export function NextPuyo() {
  // 次のツモリスト（最大2セット表示）
  const nextTsumos = useGameStore(s => s.nextTsumos);
  const display = nextTsumos.slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* "NEXT" ラベル: ピンクで目立つ */}
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#ec4899',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: 0,
      }}>
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
            /* 白背景に合わせた明るいカード */
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(236,72,153,0.25)',
            boxShadow: '0 2px 10px rgba(236,72,153,0.1)',
            /* 2番目のネクストは小さく薄く（視覚的な優先度を下げる） */
            transform: i === 0 ? 'scale(1)' : 'scale(0.72)',
            opacity: i === 0 ? 1 : 0.6,
            transformOrigin: 'top center',
          }}
        >
          {/* サブぷよ（上側）とメインぷよ（下側）を縦に並べる */}
          <PuyoCell color={tsumo.subColor}  size={32} />
          <PuyoCell color={tsumo.mainColor} size={32} />
        </div>
      ))}
    </div>
  );
}
