'use client';
import { useRef } from 'react';
import { Header } from '@/components/shared/Header';
import { useGameState } from '@/hooks/useGameState';

export default function ProfilePage() {
  const { game, profile, updateProfile } = useGameState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateProfile({ avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const winRate =
    game.levelHistory.length > 0
      ? Math.round(
          (game.levelHistory.filter((r) => r.correct).length /
            game.levelHistory.length) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Profile" showBack />

      <div className="flex-1 p-4 max-w-md mx-auto space-y-4">
        {/* Avatar section */}
        <div className="card flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-sea-700 border-2 border-sea-500 overflow-hidden flex items-center justify-center hover:border-accent-gold transition-colors"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F0F4F8" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-cream-400 text-xs">Tap to change avatar</p>

          {/* Username */}
          <input
            type="text"
            value={profile.username}
            onChange={(e) => updateProfile({ username: e.target.value })}
            className="bg-sea-800 text-cream-200 text-center font-bold text-lg rounded-lg px-4 py-2 border border-sea-700/50 focus:border-sea-500 outline-none w-full max-w-xs"
            maxLength={20}
          />
        </div>

        {/* Stats */}
        <div className="card">
          <h3 className="text-cream-200 font-bold mb-3">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cream-100">{game.currentLevel}</p>
              <p className="text-cream-400 text-xs">Current Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-gold">{game.totalPoints}</p>
              <p className="text-cream-400 text-xs">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cream-100">{game.levelHistory.length}</p>
              <p className="text-cream-400 text-xs">Games Played</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-correct">{winRate}%</p>
              <p className="text-cream-400 text-xs">Win Rate</p>
            </div>
          </div>
        </div>

        {/* Wallet info */}
        {profile.walletAddress && (
          <div className="card">
            <h3 className="text-cream-200 font-bold mb-2">Wallet</h3>
            <p className="text-cream-400 text-sm font-mono break-all">
              {profile.walletAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
