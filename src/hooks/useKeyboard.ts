'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

const KEY_ACTION: Record<string, string> = {
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  z: 'rotL', Z: 'rotL', ',': 'rotL',
  x: 'rotR', X: 'rotR', '.': 'rotR',
  ArrowDown: 'soft', s: 'soft', S: 'soft',
  ' ': 'rotR',
};

export function useKeyboard() {
  const moveLeft     = useGameStore(s => s.moveLeft);
  const moveRight    = useGameStore(s => s.moveRight);
  const rotateLeft   = useGameStore(s => s.rotateLeft);
  const rotateRight  = useGameStore(s => s.rotateRight);
  const softDropStart = useGameStore(s => s.softDropStart);
  const softDropEnd  = useGameStore(s => s.softDropEnd);
  const hardDrop     = useGameStore(s => s.hardDrop);
  const phase        = useGameStore(s => s.phase);

  const handleDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (phase === 'gameover' || phase === 'idle') return;
    const action = KEY_ACTION[e.key];
    if (!action) return;
    if (e.key === ' ') e.preventDefault();
    switch (action) {
      case 'left':  moveLeft(); break;
      case 'right': moveRight(); break;
      case 'rotL':  rotateLeft(); break;
      case 'rotR':  rotateRight(); break;
      case 'soft':  softDropStart(); break;
      case 'hard':  hardDrop(); break;
    }
  }, [phase, moveLeft, moveRight, rotateLeft, rotateRight, softDropStart, hardDrop]);

  const handleUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') softDropEnd();
  }, [softDropEnd]);

  useEffect(() => {
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [handleDown, handleUp]);
}
