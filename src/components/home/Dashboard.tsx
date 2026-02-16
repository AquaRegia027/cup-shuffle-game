'use client';
import { useRouter } from 'next/navigation';
import { ProgressCard } from './ProgressCard';
import { RewardsCard } from './RewardsCard';
import { SpinWheel } from './SpinWheel';
import { QuickActions } from './QuickActions';

export function Dashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto pb-20">
      {/* Logo/Title */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-cream-100">Cup Shuffle</h1>
        <p className="text-cream-400 text-sm mt-1">Find the ball, earn rewards!</p>
      </div>

      <QuickActions />
      <ProgressCard />
      <RewardsCard />
      <SpinWheel />

      {/* Bottom navigation */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => router.push('/leaderboard')}
          className="card flex-1 text-center hover:bg-sea-700/60 transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0F4F8" strokeWidth="1.5" className="mx-auto mb-1">
            <path d="M12 15l-4 5H4l3-7M12 15l4 5h4l-3-7M12 15V3M8 7h8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-cream-300 text-xs">Leaderboard</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="card flex-1 text-center hover:bg-sea-700/60 transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0F4F8" strokeWidth="1.5" className="mx-auto mb-1">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
          </svg>
          <span className="text-cream-300 text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
