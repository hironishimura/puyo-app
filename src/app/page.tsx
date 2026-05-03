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
  // ゲームの開始処理とフェーズ状態を取得
  const startGame = useGameStore(s => s.startGame);
  const phase     = useGameStore(s => s.phase);

  // ゲームループとキーボード入力を有効化
  useGameLoop();
  useKeyboard();

  // 初回マウント時にゲームを自動スタート
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
        /* 白ベースに淡いカラフルなグラデーション背景 */
        background: 'linear-gradient(135deg, #fdf4ff 0%, #eff6ff 50%, #f0fdf4 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ===== 背景装飾（ぼかし円） ===== */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* 左上: ピンク系の光彩 */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 360, height: 360,
          background: 'rgba(236,72,153,0.12)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
        {/* 右下: 青系の光彩 */}
        <div style={{
          position: 'absolute', bottom: -100, right: -100,
          width: 360, height: 360,
          background: 'rgba(59,130,246,0.12)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
        {/* 中央上: 緑系の光彩 */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: 280, height: 280,
          background: 'rgba(34,197,94,0.08)',
          borderRadius: '50%',
          filter: 'blur(50px)',
        }} />
      </div>

      {/* ===== タイトル表示 ===== */}
      <div style={{
        position: 'absolute', top: 20, left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          /* カラフルなグラデーション文字 */
          background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Puyo Puyo
        </h1>
      </div>

      {/* ===== ゲームレイアウト（左: スコア / 中央: フィールド / 右: ネクスト） ===== */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, zIndex: 1 }}>
        {/* 左側: スコアパネル */}
        <div style={{ width: 120 }}>
          <ScorePanel />
        </div>

        {/* 中央: ゲームボードとオーバーレイ */}
        <div style={{ position: 'relative' }}>
          <GameBoard />
          <ChainLabel />
          <GameOverModal />
        </div>

        {/* 右側: ネクストぷよ表示 */}
        <div style={{ width: 90 }}>
          <NextPuyo />
        </div>
      </div>

      {/* ===== キー操作説明（画面下部） ===== */}
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <p style={{
          margin: 0,
          fontSize: 11,
          color: 'rgba(99,102,241,0.7)',   /* インディゴで見やすく */
          letterSpacing: '0.05em',
          fontWeight: 500,
        }}>
          ←/→ Move　　Z/X/Space Rotate　　↓ Soft Drop
        </p>
      </div>
    </main>
  );
}
