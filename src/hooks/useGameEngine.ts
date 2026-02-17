'use client';
import { useCallback, useRef, useState } from 'react';
import { getLevelConfig } from '@/lib/levelConfig';
import { generateShuffleSequence } from '@/lib/shuffleAlgorithm';
import type { GamePhase, ShuffleStep } from '@/types/game';

export interface EngineState {
  phase: GamePhase;
  // positions[i] = which slot cup #i is currently in
  positions: number[];
  ballCupIndex: number;     // which cup (index) has the ball
  ballSlot: number;         // which slot the ball is visually at (for ball animation)
  ballVisible: boolean;     // is ball visible
  liftedCups: number[];     // which cups are currently lifted
  selectedCup: number | null;
  isCorrect: boolean | null;
  shuffleProgress: string;  // "3/8" display
}

const INITIAL: EngineState = {
  phase: 'idle',
  positions: [],
  ballCupIndex: -1,
  ballSlot: -1,
  ballVisible: false,
  liftedCups: [],
  selectedCup: null,
  isCorrect: null,
  shuffleProgress: '',
};

export function useGameEngine(level: number) {
  const config = getLevelConfig(level);
  const [state, setState] = useState<EngineState>(INITIAL);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const delay = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      timersRef.current.push(t);
    });
  }, []);

  const startRound = useCallback(async () => {
    clearAllTimers();

    const n = config.numCups;
    const ballCup = Math.floor(Math.random() * n);
    const initPositions = Array.from({ length: n }, (_, i) => i);
    const steps = generateShuffleSequence(n, config.numShuffles);

    // Phase 1: Show ball in center
    setState({
      phase: 'ballShow',
      positions: initPositions,
      ballCupIndex: ballCup,
      ballSlot: Math.floor(n / 2),  // ball starts in center-ish
      ballVisible: true,
      liftedCups: [],
      selectedCup: null,
      isCorrect: null,
      shuffleProgress: '',
    });

    await delay(800);

    // Phase 2: Ball slides to the cup's position, cup lifts to receive it
    setState((s) => ({
      ...s,
      phase: 'ballHide',
      ballSlot: initPositions[ballCup],
      liftedCups: [ballCup],
    }));

    await delay(600);

    // Cup comes down to cover ball
    setState((s) => ({
      ...s,
      ballVisible: false,
      liftedCups: [],
    }));

    await delay(500);

    // Phase 3: Shuffling
    setState((s) => ({
      ...s,
      phase: 'shuffling',
      shuffleProgress: `0/${steps.length}`,
    }));

    await delay(300);

    // Execute each shuffle step
    let currentPositions = [...initPositions];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      // Find which cups are in positions posA and posB
      const cupAtA = currentPositions.indexOf(step.posA);
      const cupAtB = currentPositions.indexOf(step.posB);

      if (cupAtA === -1 || cupAtB === -1) continue;

      // Swap their positions
      const newPositions = [...currentPositions];
      newPositions[cupAtA] = step.posB;
      newPositions[cupAtB] = step.posA;
      currentPositions = newPositions;

      setState((s) => ({
        ...s,
        positions: newPositions,
        shuffleProgress: `${i + 1}/${steps.length}`,
      }));

      // Wait for animation to complete
      await delay((config.shuffleDuration + config.pauseBetween) * 1000);
    }

    // Phase 4: Guessing
    setState((s) => ({
      ...s,
      phase: 'guessing',
      shuffleProgress: '',
    }));
  }, [config, clearAllTimers, delay]);

  const selectCup = useCallback(async (cupIndex: number) => {
    if (stateRef.current.phase !== 'guessing') return;

    const s = stateRef.current;
    const isCorrect = cupIndex === s.ballCupIndex;

    // Reveal selected cup
    setState((prev) => ({
      ...prev,
      phase: 'reveal',
      selectedCup: cupIndex,
      isCorrect,
      liftedCups: [cupIndex],
      ballVisible: isCorrect,
      ballSlot: prev.positions[prev.ballCupIndex],
    }));

    await delay(600);

    // Also reveal correct cup if wrong
    if (!isCorrect) {
      setState((prev) => ({
        ...prev,
        liftedCups: [cupIndex, prev.ballCupIndex],
        ballVisible: true,
      }));
    }
  }, [delay]);

  return { state, config, startRound, selectCup, clearAllTimers };
}
