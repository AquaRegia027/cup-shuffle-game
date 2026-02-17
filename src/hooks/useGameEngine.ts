'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getLevelConfig } from '@/lib/levelConfig';
import { generateShuffleSequence } from '@/lib/shuffleAlgorithm';
import type { GamePhase } from '@/types/game';

export interface EngineState {
  phase: GamePhase;
  positions: number[];        // positions[cupIndex] = slotIndex
  ballCupIndex: number;       // which cup has the ball
  ballSlot: number;           // which slot the ball is visually at
  ballVisible: boolean;
  liftedCups: number[];       // which cup indices are lifted
  selectedCup: number | null;
  isCorrect: boolean | null;
  shuffleProgress: string;
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
  // Memoize config so it only changes when level changes
  const config = useMemo(() => getLevelConfig(level), [level]);

  const [state, setState] = useState<EngineState>(INITIAL);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const cancelledRef = useRef(false);
  const phaseRef = useRef<GamePhase>('idle');

  // Keep phaseRef in sync
  phaseRef.current = state.phase;

  const clearAllTimers = useCallback(() => {
    cancelledRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const wait = useCallback((ms: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const t = setTimeout(() => resolve(true), ms);
      timersRef.current.push(t);
    });
  }, []);

  const startRound = useCallback(async () => {
    clearAllTimers();
    cancelledRef.current = false;

    const n = config.numCups;
    const ballCup = Math.floor(Math.random() * n);
    const initPositions = Array.from({ length: n }, (_, i) => i);
    const steps = generateShuffleSequence(n, config.numShuffles);

    // -- Phase 1: ballShow -- show ball in the center
    setState({
      phase: 'ballShow',
      positions: initPositions,
      ballCupIndex: ballCup,
      ballSlot: Math.floor(n / 2),
      ballVisible: true,
      liftedCups: [],
      selectedCup: null,
      isCorrect: null,
      shuffleProgress: '',
    });

    if (!(await wait(1000))) return;
    if (cancelledRef.current) return;

    // -- Phase 2: ballHide -- lift target cup, slide ball under it
    setState((s) => ({
      ...s,
      phase: 'ballHide',
      ballSlot: initPositions[ballCup],
      liftedCups: [ballCup],
    }));

    if (!(await wait(700))) return;
    if (cancelledRef.current) return;

    // -- Cup comes down, ball disappears
    setState((s) => ({
      ...s,
      ballVisible: false,
      liftedCups: [],
    }));

    if (!(await wait(500))) return;
    if (cancelledRef.current) return;

    // -- Phase 3: shuffling
    setState((s) => ({
      ...s,
      phase: 'shuffling',
      shuffleProgress: `0/${steps.length}`,
    }));

    if (!(await wait(400))) return;
    if (cancelledRef.current) return;

    // Execute shuffles one by one
    let pos = [...initPositions];
    for (let i = 0; i < steps.length; i++) {
      if (cancelledRef.current) return;

      const step = steps[i];
      const cupAtA = pos.indexOf(step.posA);
      const cupAtB = pos.indexOf(step.posB);
      if (cupAtA === -1 || cupAtB === -1) continue;

      const newPos = [...pos];
      newPos[cupAtA] = step.posB;
      newPos[cupAtB] = step.posA;
      pos = newPos;

      setState((s) => ({
        ...s,
        positions: newPos,
        shuffleProgress: `${i + 1}/${steps.length}`,
      }));

      // Wait for CSS transition + small pause
      const waitMs = (config.shuffleDuration + config.pauseBetween) * 1000;
      if (!(await wait(waitMs))) return;
      if (cancelledRef.current) return;
    }

    // -- Phase 4: guessing
    setState((s) => ({
      ...s,
      phase: 'guessing',
      shuffleProgress: '',
    }));
  }, [config, clearAllTimers, wait]);

  const selectCup = useCallback((cupIndex: number) => {
    if (phaseRef.current !== 'guessing') return;

    setState((prev) => {
      const isCorrect = cupIndex === prev.ballCupIndex;
      return {
        ...prev,
        phase: 'reveal',
        selectedCup: cupIndex,
        isCorrect,
        liftedCups: isCorrect ? [cupIndex] : [cupIndex, prev.ballCupIndex],
        ballVisible: true,
        ballSlot: prev.positions[prev.ballCupIndex],
      };
    });
  }, []);

  return { state, config, startRound, selectCup, clearAllTimers };
}
