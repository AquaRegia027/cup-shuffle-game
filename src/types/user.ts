export interface UserProfile {
  fid: number | null;
  username: string;
  avatarUrl: string | null;
  walletAddress: string | null;
}

export interface LeaderboardEntry {
  fid: number;
  username: string;
  avatarUrl: string | null;
  totalPoints: number;
  currentLevel: number;
  rank: number;
}
