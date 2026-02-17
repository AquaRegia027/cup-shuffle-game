'use client';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { getLevelConfig } from '@/lib/levelConfig';
import { generateShuffleSequence } from '@/lib/shuffleAlgorithm';
import type { CupState, GameEngineState, GamePhase, ShuffleStep } from '@/types/game';

function createCups(numCups: number, ballIndex: number): CupState[] {
  return Array.from({ length: numCups }, (_, i) => ({
    id: i,
    position: i,
    hasBall: i === ballIndex,
  }));
}

type EngineAction =
  | { type: 'START'; payload: { numCups: number; ballIndex: number; steps: ShuffleStep[] } }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'BEGIN_SWAP'; payload: { posA: number; posB: number } }
  | { type: 'FINISH_SWAP' }
  | { type: 'SELECT_CUP'; payload: number };

function engineReducer(state: GameEngineState, action: EngineAction): GameEngineState {
  switch (action.type) {
    case 'START': {
      const cups = createCups(action.payload.numCups, action.payload.ballIndex);
      return {
        phase: 'reveal',
        cups,
        ballCupId: action.payload.ballIndex,
        shuffleSteps: action.payload.steps,
        currentStep: 0,
        selectedCupId: null,
        isCorrect: null,
        activeSwap: null,
      };
    }
    case 'SET_PHASE':
      return { ...state, phase: action.payload, activeSwap: null };

    case 'BEGIN_SWAP': {
      // Set activeSwap so the UI can animate the two cups moving
      return {
        ...state,
        activeSwap: { posA: action.payload.posA, posB: action.payload.posB },
      };
    }

    case 'FINISH_SWAP': {
      if (!state.activeSwap) return state;
      const { posA, posB } = state.activeSwap;
      // Actually swap positions of the cups at posA and posB
      const newCups = state.cups.map((c) => {
        if (c.position === posA) return { ...c, position: posB };
        if (c.position === posB) return { ...c, position: posA };
        return c;
      });
      return {
        ...state,
        cups: newCups,
        currentStep: state.currentStep + 1,
        activeSwap: null,
      };
    }

    case 'SELECT_CUP': {
      if (state.phase !== 'guessing') return state;
      const selectedCup = state.cups.find((c) => c.id === action.payload);
      const isCorrect = selectedCup?.hasBall ?? false;
      return {
        ...state,
        phase: 'result',
        selectedCupId: action.payload,
        isCorrect,
      };
    }
    default:
      return state;
  }
}

const initialState: GameEngineState = {
  phase: 'idle',
  cups: [],
  ballCupId: 0,
  shuffleSteps: [],
  currentStep: 0,
  selectedCupId: null,
  isCorrect: null,
  activeSwap: null,
};

export function useGameEngine(level: number) {
  const config = getLevelConfig(level);
  const [state, dispatch] = useReducer(engineReducer, initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const swapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (swapTimerRef.current) {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startRound = useCallback(() => {
    clearTimers();
    const ballIndex = Math.floor(Math.random() * config.numCups);
    const steps = generateShuffleSequence(config.numCups, config.numShuffles);
    dispatch({
      type: 'START',
      payload: { numCups: config.numCups, ballIndex, steps },
    });
  }, [config, clearTimers]);

  // Phase transitions: reveal -> covering -> shuffling
  useEffect(() => {
    if (state.phase === 'reveal') {
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_PHASE', payload: 'covering' });
      }, config.revealTime * 1000);
    } else if (state.phase === 'covering') {
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_PHASE', payload: 'shuffling' });
      }, 600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.phase, config.revealTime]);

  // Shuffle steps — begin a swap, wait for animation, then finish swap
  useEffect(() => {
    if (state.phase !== 'shuffling') return;
    if (state.activeSwap) return; // swap in progress

    if (state.currentStep >= state.shuffleSteps.length) {
      // All shuffles done, go to guessing
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_PHASE', payload: 'guessing' });
      }, 200);
      return;
    }

    const step = state.shuffleSteps[state.currentStep];
    const delay = state.currentStep === 0 ? 100 : config.pauseBetween * 1000;

    timerRef.current = setTimeout(() => {
      // Begin the swap animation
      dispatch({ type: 'BEGIN_SWAP', payload: { posA: step.posA, posB: step.posB } });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.phase, state.currentStep, state.activeSwap, state.shuffleSteps, config]);

  // When activeSwap is set, wait for the animation duration then finish
  useEffect(() => {
    if (!state.activeSwap) return;

    swapTimerRef.current = setTimeout(() => {
      dispatch({ type: 'FINISH_SWAP' });
    }, config.shuffleDuration * 1000);

    return () => {
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    };
  }, [state.activeSwap, config.shuffleDuration]);

  const selectCup = useCallback((cupId: number) => {
    dispatch({ type: 'SELECT_CUP', payload: cupId });
  }, []);

  return { state, config, startRound, selectCup };
}
