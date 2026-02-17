import type { ShuffleStep } from '@/types/game';

export function generateShuffleSequence(
  numCups: number,
  numShuffles: number,
): ShuffleStep[] {
  const steps: ShuffleStep[] = [];
  let lastA = -1;
  let lastB = -1;

  for (let i = 0; i < numShuffles; i++) {
    let a: number;
    let b: number;
    do {
      a = Math.floor(Math.random() * numCups);
      b = Math.floor(Math.random() * numCups);
    } while (
      a === b ||
      (a === lastA && b === lastB) ||
      (a === lastB && b === lastA)
    );
    // posA and posB refer to slot positions on the table
    steps.push({ posA: a, posB: b });
    lastA = a;
    lastB = b;
  }
  return steps;
}
