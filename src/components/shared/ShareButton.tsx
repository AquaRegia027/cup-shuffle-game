'use client';
import { Button } from './Button';

interface ShareButtonProps {
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  text = 'Play Cup Shuffle! Can you beat my score?',
  url,
  className,
}: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.origin : '');
    const fullText = `${text}\n${shareUrl}`;

    // Try native share first (works on mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: fullText, url: shareUrl });
        return;
      } catch {
        // User cancelled or not supported
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <Button
      label="Share"
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 8v5a1 1 0 001 1h6a1 1 0 001-1V8M10 4L8 2L6 4M8 2v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      variant="ghost"
      onClick={handleShare}
      className={className}
    />
  );
}
