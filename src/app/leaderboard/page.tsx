'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { useGameState } from '@/hooks/useGameState';
import type { LeaderboardEntry } from '@/types/user';

export default function LeaderboardPage() {
  const { game, profile } = useGameState();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setEntries(data.entries || []);
        }
      } catch {
        // Use local fallback
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  // If no server data, show local player as the only entry
  const displayEntries =
    entries.length > 0
      ? entries
      : [
          {
            fid: profile.fid || 0,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            totalPoints: game.totalPoints,
            currentLevel: game.currentLevel,
            rank: 1,
          },
        ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Leaderboard" showBack />

      <div className="flex-1 p-4 max-w-md mx-auto">
        {/* Your position */}
        <div className="card mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sea-700 flex items-center justify-center text-accent-gold font-bold">
              #?
            </div>
            <div className="flex-1">
              <p className="text-cream-200 font-semibold">{profile.username}</p>
              <p className="text-cream-400 text-sm">
                Level {game.currentLevel} &middot; {game.totalPoints} pts
              </p>
            </div>
          </div>
        </div>

        {/* Rankings */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-sea-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {displayEntries.map((entry, i) => (
              <div
                key={entry.fid || i}
                className={`card flex items-center gap-3 ${
                  i < 3 ? 'border-accent-gold/30' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0
                      ? 'bg-accent-gold text-sea-900'
                      : i === 1
                        ? 'bg-cream-300 text-sea-900'
                        : i === 2
                          ? 'bg-orange-400 text-sea-900'
                          : 'bg-sea-700 text-cream-300'
                  }`}
                >
                  {entry.rank || i + 1}
                </div>
                <div className="w-8 h-8 rounded-full bg-sea-700 overflow-hidden">
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream-400 text-xs">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-cream-200 font-semibold text-sm truncate">
                    {entry.username}
                  </p>
                  <p className="text-cream-400 text-xs">
                    Level {entry.currentLevel}
                  </p>
                </div>
                <span className="text-accent-gold font-bold text-sm">
                  {entry.totalPoints}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
