export interface LevelConfig {
  level: number;
  numCups: number;
  numShuffles: number;
  shuffleDuration: number;
  pauseBetween: number;
  revealTime: number;
  points: number;
}

export interface CupState {
  id: number;
  position: number;  // which slot this cup is currently in (0, 1, 2, ...)
  hasBall: boolean;
}

export interface ShuffleStep {
  posA: number;  // swap cups at position A
  posB: number;  // with cup at position B
}

export type GamePhase =
  | 'idle'
  | 'reveal'
  | 'covering'
  | 'shuffling'
  | 'guessing'
  | 'result';

export interface GameEngineState {
  phase: GamePhase;
  cups: CupState[];
  ballCupId: number;
  shuffleSteps: ShuffleStep[];
  currentStep: number;
  selectedCupId: number | null;
  isCorrect: boolean | null;
  // For animation: which two positions are currently swapping
  activeSwap: { posA: number; posB: number } | null;
}

export interface LevelResult {
  level: number;
  correct: boolean;
  points: number;
  timestamp: number;
}

export interface GameState {
  currentLevel: number;
  highestLevelReached: number;
  totalPoints: number;
  levelHistory: LevelResult[];
  dailySpinUsed: boolean;
  lastSpinDate: string | null;
  hasSeenInstructions: boolean;
  spinPoints: number;
}

export interface SpinSegment {
  label: string;
  points: number;
  color: string;
  probability: number;
}
