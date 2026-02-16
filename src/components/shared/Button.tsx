'use client';
import type { ReactNode } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface ButtonProps {
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function Button({
  label,
  icon,
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const audio = useAudio();

  const baseClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : 'btn-ghost';

  return (
    <button
      type={type}
      className={`${baseClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={() => {
        if (disabled) return;
        audio.playSfx('click');
        onClick?.();
      }}
      disabled={disabled}
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {label}
    </button>
  );
}
