'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ShareButton } from '@/components/shared/ShareButton';

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <Button
        label="Start Game"
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
        }
        variant="primary"
        onClick={() => router.push('/game')}
        className="w-full"
      />
      <div className="flex gap-3">
        <Button
          label="Rules"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
              <path d="M5 6h6M5 8h6M5 10h3" />
            </svg>
          }
          variant="ghost"
          onClick={() => router.push('/rules')}
          className="flex-1"
        />
        <ShareButton className="flex-1" />
      </div>
    </div>
  );
}
