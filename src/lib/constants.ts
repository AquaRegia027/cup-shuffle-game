export const APP_NAME = 'Cup Shuffle';
export const APP_DESCRIPTION = 'A 100-level cup shuffling challenge. Track the ball, earn points, climb the leaderboard!';
export const MAX_LEVEL = 100;
export const LEVELS_PER_TIER = 10;
export const BASE_CUPS = 3;

export const STORAGE_KEYS = {
  GAME_STATE: 'cup-shuffle-state',
  PROFILE: 'cup-shuffle-profile',
  INSTRUCTIONS_SEEN: 'cup-shuffle-instructions-seen',
  AUDIO_PREFS: 'cup-shuffle-audio-prefs',
} as const;

export const COLORS = {
  seaDeep: '#0A1628',
  seaDark: '#003380',
  seaMid: '#1A80FF',
  cream: '#F0F4F8',
  creamDark: '#E2E8F0',
  gold: '#FFD700',
  correct: '#22C55E',
  wrong: '#EF4444',
} as const;
