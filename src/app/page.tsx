'use client';

import { useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { NextPuyo } from '@/components/NextPuyo';
import { ScorePanel } from '@/components/ScorePanel';
import { ChainLabel } from '@/components/ChainLabel';
import { GameOverModal } from '@/components/GameOverModal';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGameStore } from '@/store/gameStore';

export default function Page() {
  const startGame = useGameStore(s => s.startGame);
  const phase     = useGameStore(s => s.phase);

  useGameLoop();
  useKeyboard();

  useEffect(() => {
    if (phase === 'idle') startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.22) 0%, rgba(7,7,26,1) 65%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装飾 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -120, left: -120,
          width: 360, height: 360,
          background: 'rgba(139,92,246,0.12)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -120, right: -120,
          width: 360, height: 360,
          background: 'rgba(59,130,246,0.10)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* タイトル */}
      <div style={{
        position: 'absolute', top: 20, left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <h1 style={{
          margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
        }}>
          Puyo Puyo
        </h1>
      </div>

      {/* ゲームレイアウト */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, zIndex: 1 }}>
        {/* 左: スコア */}
        <div style={{ width: 120 }}>
          <ScorePanel />
        </div>

        {/* 中央: フィールド */}
        <div style={{ position: 'relative' }}>
          <GameBoard />
          <ChainLabel />
          <GameOverModal />
        </div>

        {/* 右: ネクスト */}
        <div style={{ width: 90 }}>
          <NextPuyo />
        </div>
      </div>

      {/* キー操作説明 */}
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.05em' }}>
          ←/→ Move　　Z/X/Space Rotate　　↓ Soft Drop
        </p>
      </div>
    </main>
  );
}
