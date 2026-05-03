'use client';

import { motion } from 'framer-motion';
import { PuyoColor, Connections } from '@/game/types';

interface PuyoCellProps {
  color: PuyoColor;
  isClearing?: boolean;
  isGhost?: boolean;
  connections?: Connections;
  size?: number;
}

const COLOR_GRADIENT: Record<string, string> = {
  red:    'linear-gradient(135deg, #f87171, #dc2626)',
  blue:   'linear-gradient(135deg, #60a5fa, #2563eb)',
  green:  'linear-gradient(135deg, #4ade80, #16a34a)',
  yellow: 'linear-gradient(135deg, #fde047, #ca8a04)',
  purple: 'linear-gradient(135deg, #c084fc, #9333ea)',
  ojama:  'linear-gradient(135deg, #d1d5db, #6b7280)',
};

const BORDER_COLOR: Record<string, string> = {
  red: '#991b1b', blue: '#1d4ed8', green: '#15803d',
  yellow: '#a16207', purple: '#7e22ce', ojama: '#374151',
};

export function PuyoCell({ color, isClearing, isGhost, connections, size = 40 }: PuyoCellProps) {
  if (color === 'empty') return <div style={{ width: size, height: size }} />;

  const conn = connections ?? { top: false, bottom: false, left: false, right: false };
  const r = (tl: boolean, tr: boolean, br: boolean, bl: boolean) =>
    `${tl ? '6px' : '50%'} ${tr ? '6px' : '50%'} ${br ? '6px' : '50%'} ${bl ? '6px' : '50%'}`;

  const borderRadius = r(
    conn.top || conn.left,
    conn.top || conn.right,
    conn.bottom || conn.right,
    conn.bottom || conn.left,
  );

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        background: COLOR_GRADIENT[color] ?? COLOR_GRADIENT.ojama,
        borderRadius,
        border: `2px solid ${BORDER_COLOR[color] ?? '#374151'}`,
        opacity: isGhost ? 0.25 : 1,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
      animate={
        isClearing
          ? { scale: [1, 1.25, 0], opacity: [1, 1, 0] }
          : { scale: 1, opacity: isGhost ? 0.25 : 1 }
      }
      transition={
        isClearing
          ? { duration: 0.4, ease: 'easeInOut' }
          : { duration: 0.06 }
      }
    >
      {/* 光沢ハイライト */}
      {!isGhost && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '38%',
            height: '38%',
            background: 'rgba(255,255,255,0.45)',
            borderRadius: '50%',
            filter: 'blur(1px)',
          }}
        />
      )}
    </motion.div>
  );
}
