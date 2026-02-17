export interface LevelConfig {
  level: number;
  numCups: number;
  numShuffles: number;
  shuffleDuration: number;
  pauseBetween: number;
  revealTime: number;
  points: number;
}

export interface ShuffleStep {
  posA: number;
  posB: number;
}

export type GamePhase =
  | 'idle'
  | 'ballShow'       // ball visible in center
  | 'ballHide'       // ball slides under a cup
  | 'shuffling'
  | 'guessing'
  | 'reveal';        // result reveal

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
