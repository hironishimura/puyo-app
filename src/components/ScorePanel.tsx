'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// ===== 各スコアボックスのラベルと色テーマ =====
// label: 表示ラベル, value: 表示値, color: アクセントカラー
function StatBox({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string | number;
  accentColor: string;
}) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: 12,
      /* 白背景に合わせた明るいカード */
      background: 'rgba(255,255,255,0.9)',
      border: `1px solid ${accentColor}40`,   /* アクセントカラーで枠線 */
      boxShadow: `0 2px 12px ${accentColor}20`,
    }}>
      {/* ラベル: 小さめで色付き */}
      <p style={{
        fontSize: 10,
        fontWeight: 700,
        color: accentColor,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: '0 0 4px',
      }}>
        {label}
      </p>
      {/* 値: 更新時にアニメーションでポップイン */}
      <motion.p
        key={String(value)}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18 }}
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#111827',        /* 濃いグレーで白背景でも読みやすい */
          margin: 0,
          fontVariantNumeric: 'tabular-nums',  /* 数字の幅を固定して安定表示 */
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.p>
    </div>
  );
}

export function ScorePanel() {
  // ゲームストアからスコア・レベル・消去数を取得
  const score            = useGameStore(s => s.score);
  const level            = useGameStore(s => s.level);
  const totalPuyoCleared = useGameStore(s => s.totalPuyoCleared);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* スコア: 紫アクセント */}
      <StatBox label="Score"   value={score}            accentColor="#8b5cf6" />
      {/* レベル: 青アクセント */}
      <StatBox label="Level"   value={level}            accentColor="#3b82f6" />
      {/* 消去数: 緑アクセント */}
      <StatBox label="Cleared" value={totalPuyoCleared} accentColor="#22c55e" />
    </div>
  );
}
