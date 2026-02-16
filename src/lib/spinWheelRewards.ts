import type { SpinSegment } from '@/types/game';

export const SPIN_SEGMENTS: SpinSegment[] = [
  { label: '10', points: 10, color: '#1A80FF', probability: 25 },
  { label: '25', points: 25, color: '#F0F4F8', probability: 20 },
  { label: '50', points: 50, color: '#1A80FF', probability: 18 },
  { label: '75', points: 75, color: '#F0F4F8', probability: 15 },
  { label: '100', points: 100, color: '#1A80FF', probability: 10 },
  { label: '150', points: 150, color: '#F0F4F8', probability: 7 },
  { label: '200', points: 200, color: '#1A80FF', probability: 3 },
  { label: '500', points: 500, color: '#FFD700', probability: 2 },
];

export function getSpinResult(): SpinSegment {
  const totalWeight = SPIN_SEGMENTS.reduce((sum, s) => sum + s.probability, 0);
  let rand = Math.random() * totalWeight;
  for (const segment of SPIN_SEGMENTS) {
    rand -= segment.probability;
    if (rand <= 0) return segment;
  }
  return SPIN_SEGMENTS[0];
}
