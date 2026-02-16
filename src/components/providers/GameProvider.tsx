'use client';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { GameState, LevelResult } from '@/types/game';
import type { UserProfile } from '@/types/user';
import { STORAGE_KEYS } from '@/lib/constants';
import { getFromStorage, setToStorage } from '@/lib/storage';

const DEFAULT_GAME_STATE: GameState = {
  currentLevel: 1,
  highestLevelReached: 1,
  totalPoints: 0,
  levelHistory: [],
  dailySpinUsed: false,
  lastSpinDate: null,
  hasSeenInstructions: false,
  spinPoints: 0,
};

const DEFAULT_PROFILE: UserProfile = {
  fid: null,
  username: 'Player',
  avatarUrl: null,
  walletAddress: null,
};

type GameAction =
  | { type: 'LOAD_STATE'; payload: { game: GameState; profile: UserProfile } }
  | { type: 'ADVANCE_LEVEL' }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'RECORD_RESULT'; payload: LevelResult }
  | { type: 'MARK_INSTRUCTIONS_SEEN' }
  | { type: 'CLAIM_SPIN'; payload: { points: number; date: string } }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'RESET_TO_LEVEL'; payload: number };

interface FullState {
  game: GameState;
  profile: UserProfile;
}

function reducer(state: FullState, action: GameAction): FullState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { game: action.payload.game, profile: action.payload.profile };
    case 'ADVANCE_LEVEL': {
      const nextLevel = Math.min(state.game.currentLevel + 1, 100);
      return {
        ...state,
        game: {
          ...state.game,
          currentLevel: nextLevel,
          highestLevelReached: Math.max(state.game.highestLevelReached, nextLevel),
        },
      };
    }
    case 'ADD_POINTS':
      return {
        ...state,
        game: {
          ...state.game,
          totalPoints: state.game.totalPoints + action.payload,
        },
      };
    case 'RECORD_RESULT':
      return {
        ...state,
        game: {
          ...state.game,
          levelHistory: [...state.game.levelHistory.slice(-49), action.payload],
        },
      };
    case 'MARK_INSTRUCTIONS_SEEN':
      return {
        ...state,
        game: { ...state.game, hasSeenInstructions: true },
      };
    case 'CLAIM_SPIN':
      return {
        ...state,
        game: {
          ...state.game,
          dailySpinUsed: true,
          lastSpinDate: action.payload.date,
          totalPoints: state.game.totalPoints + action.payload.points,
          spinPoints: state.game.spinPoints + action.payload.points,
        },
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    case 'RESET_TO_LEVEL':
      return {
        ...state,
        game: { ...state.game, currentLevel: action.payload },
      };
    default:
      return state;
  }
}

export interface GameContextValue {
  game: GameState;
  profile: UserProfile;
  advanceLevel: () => void;
  addPoints: (pts: number) => void;
  recordResult: (result: LevelResult) => void;
  markInstructionsSeen: () => void;
  claimSpin: (points: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetToLevel: (level: number) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    game: DEFAULT_GAME_STATE,
    profile: DEFAULT_PROFILE,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedGame = getFromStorage<GameState>(STORAGE_KEYS.GAME_STATE, DEFAULT_GAME_STATE);
    const savedProfile = getFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);

    // Check if spin should reset (new day)
    const today = new Date().toISOString().split('T')[0];
    if (savedGame.lastSpinDate !== today) {
      savedGame.dailySpinUsed = false;
    }

    dispatch({ type: 'LOAD_STATE', payload: { game: savedGame, profile: savedProfile } });
  }, []);

  // Persist game state
  useEffect(() => {
    setToStorage(STORAGE_KEYS.GAME_STATE, state.game);
  }, [state.game]);

  // Persist profile
  useEffect(() => {
    setToStorage(STORAGE_KEYS.PROFILE, state.profile);
  }, [state.profile]);

  const advanceLevel = useCallback(() => dispatch({ type: 'ADVANCE_LEVEL' }), []);
  const addPoints = useCallback((pts: number) => dispatch({ type: 'ADD_POINTS', payload: pts }), []);
  const recordResult = useCallback((result: LevelResult) => dispatch({ type: 'RECORD_RESULT', payload: result }), []);
  const markInstructionsSeen = useCallback(() => dispatch({ type: 'MARK_INSTRUCTIONS_SEEN' }), []);
  const claimSpin = useCallback((points: number) => {
    const date = new Date().toISOString().split('T')[0];
    dispatch({ type: 'CLAIM_SPIN', payload: { points, date } });
  }, []);
  const updateProfile = useCallback((updates: Partial<UserProfile>) => dispatch({ type: 'UPDATE_PROFILE', payload: updates }), []);
  const resetToLevel = useCallback((level: number) => dispatch({ type: 'RESET_TO_LEVEL', payload: level }), []);

  const value = useMemo(
    () => ({
      game: state.game,
      profile: state.profile,
      advanceLevel,
      addPoints,
      recordResult,
      markInstructionsSeen,
      claimSpin,
      updateProfile,
      resetToLevel,
    }),
    [state, advanceLevel, addPoints, recordResult, markInstructionsSeen, claimSpin, updateProfile, resetToLevel],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
