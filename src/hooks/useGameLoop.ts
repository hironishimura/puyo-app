'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function useGameLoop() {
  const tick = useGameStore(s => s.tick);
  const isRunning = useGameStore(s => s.isRunning);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const deltaMs = Math.min(timestamp - lastTimeRef.current, 100);
      lastTimeRef.current = timestamp;
      tick(deltaMs);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isRunning, tick]);
}
