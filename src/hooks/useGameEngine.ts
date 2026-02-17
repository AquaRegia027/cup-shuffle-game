'use client';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { getLevelConfig } from '@/lib/levelConfig';
import { generateShuffleSequence } from '@/lib/shuffleAlgorithm';
import type { CupState, GameEngineState, GamePhase, ShuffleStep } from '@/types/game';

function createCups(numCups: number, ballIndex: number): CupState[] {
  return Array.from({ length: numCups }, (_, i) => ({
    id: i,
    x: i,
    hasBall: i === ballIndex,
  }));
}

type EngineAction =
  | { type: 'START'; payload: { numCups: number; ballIndex: number; steps: ShuffleStep[] } }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SHUFFLE_STEP' }
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
      };
    }
    case 'SET_PHASE':
      return { ...state, phase: action.payload };
    case 'SHUFFLE_STEP': {
      if (state.currentStep >= state.shuffleSteps.length) {
        return { ...state, phase: 'guessing' };
      }
      const step = state.shuffleSteps[state.currentStep];
      const newCups = state.cups.map((c) => ({ ...c }));

      // Find the two cups by their current index references
      const cupA = newCups.find((c) => c.x === step.cupIndexA);
      const cupB = newCups.find((c) => c.x === step.cupIndexB);

      if (cupA && cupB) {
        // Swap their visual x positions
        const tempX = cupA.x;
        cupA.x = cupB.x;
        cupB.x = tempX;
      }

      return {
        ...state,
        cups: newCups,
        currentStep: state.currentStep + 1,
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
};

export function useGameEngine(level: number) {
  const config = getLevelConfig(level);
  const [state, dispatch] = useReducer(engineReducer, initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  const startRound = useCallback(() => {
    clearTimer();
    const ballIndex = Math.floor(Math.random() * config.numCups);
    const steps = generateShuffleSequence(config.numCups, config.numShuffles);
    dispatch({
      type: 'START',
      payload: { numCups: config.numCups, ballIndex, steps },
    });
  }, [config, clearTimer]);

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
    return clearTimer;
  }, [state.phase, config.revealTime, clearTimer]);

  // Shuffle steps — each step fires after shuffleDuration + pauseBetween
  useEffect(() => {
    if (state.phase !== 'shuffling') return;
    if (state.currentStep >= state.shuffleSteps.length) {
      dispatch({ type: 'SET_PHASE', payload: 'guessing' });
      return;
    }
    const delay = state.currentStep === 0
      ? 150
      : (config.shuffleDuration + config.pauseBetween) * 1000;
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'SHUFFLE_STEP' });
    }, delay);
    return clearTimer;
  }, [state.phase, state.currentStep, state.shuffleSteps.length, config, clearTimer]);

  const selectCup = useCallback((cupId: number) => {
    dispatch({ type: 'SELECT_CUP', payload: cupId });
  }, []);

  return { state, config, startRound, selectCup };
}
