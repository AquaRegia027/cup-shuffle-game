'use client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-sea-900/80 backdrop-blur-sm border-b border-sea-700/30">
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sea-800 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#F0F4F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <h1 className="text-lg font-bold text-cream-200">{title}</h1>
    </header>
  );
}
