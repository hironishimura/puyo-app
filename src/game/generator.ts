import { Tsumo } from './types';
import { PUYO_COLORS, NormalPuyoColor, NEXT_QUEUE_SIZE } from './constants';

function mulberry32(seed: number) {
  return function (): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class TsumoGenerator {
  private rng: () => number;
  private queue: Tsumo[] = [];

  constructor(seed?: number) {
    this.rng = mulberry32(seed ?? Math.floor(Math.random() * 0xffffffff));
    this.refill();
  }

  private randomColor(): NormalPuyoColor {
    return PUYO_COLORS[Math.floor(this.rng() * PUYO_COLORS.length)];
  }

  private refill(): void {
    while (this.queue.length < NEXT_QUEUE_SIZE * 2) {
      this.queue.push({
        mainColor: this.randomColor(),
        subColor: this.randomColor(),
      });
    }
  }

  next(): Tsumo {
    this.refill();
    return this.queue.shift()!;
  }

  peek(n: number): Tsumo[] {
    this.refill();
    return this.queue.slice(0, n);
  }
}
