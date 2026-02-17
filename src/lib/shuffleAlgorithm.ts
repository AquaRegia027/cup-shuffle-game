import type { ShuffleStep } from '@/types/game';

export function generateShuffleSequence(
  numCups: number,
  numShuffles: number,
): ShuffleStep[] {
  const steps: ShuffleStep[] = [];
  let lastA = -1;
  let lastB = -1;

  // Track positions to generate swaps based on current positions
  const positions = Array.from({ length: numCups }, (_, i) => i);

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

    // Record which positions to swap
    steps.push({ cupIndexA: positions[a], cupIndexB: positions[b] });

    // Update tracking
    const temp = positions[a];
    positions[a] = positions[b];
    positions[b] = temp;

    lastA = a;
    lastB = b;
  }
  return steps;
}
