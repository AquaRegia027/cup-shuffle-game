'use client';
import { motion } from 'motion/react';

interface CupProps {
  id: number;
  x: number;
  hasBall: boolean;
  isRevealed: boolean;
  isSelected: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
  shuffleDuration: number;
  cupSize: number;
}

export function Cup({
  id,
  x,
  hasBall,
  isRevealed,
  isSelected,
  onClick,
  disabled,
  shuffleDuration,
  cupSize,
}: CupProps) {
  const showBall = isRevealed && hasBall;
  const cupWidth = cupSize;
  const cupHeight = cupSize * 1.2;

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      animate={{ x: x * (cupWidth + 8) }}
      transition={{ duration: shuffleDuration, ease: 'easeInOut' }}
      style={{ width: cupWidth }}
    >
      {/* Cup */}
      <motion.div
        className={`relative cursor-pointer select-none ${disabled ? 'cursor-default' : ''}`}
        onClick={() => !disabled && onClick(id)}
        animate={{
          y: isRevealed ? -20 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
      >
        {/* Cup SVG */}
        <svg
          width={cupWidth}
          height={cupHeight}
          viewBox="0 0 60 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup body */}
          <path
            d="M8 8 L14 64 L46 64 L52 8 Z"
            fill={isSelected ? (hasBall ? '#22C55E' : '#EF4444') : '#1A80FF'}
            stroke="#F0F4F8"
            strokeWidth="2"
          />
          {/* Cup rim */}
          <ellipse cx="30" cy="8" rx="24" ry="6" fill={isSelected ? (hasBall ? '#16A34A' : '#DC2626') : '#0066E0'} stroke="#F0F4F8" strokeWidth="2" />
          {/* Cup bottom */}
          <ellipse cx="30" cy="64" rx="16" ry="4" fill={isSelected ? (hasBall ? '#16A34A' : '#DC2626') : '#0066E0'} stroke="#F0F4F8" strokeWidth="2" />
          {/* Shine */}
          <path d="M18 16 L20 52" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Ball (shown under cup when revealed) */}
      <motion.div
        className="absolute -bottom-2 flex items-center justify-center"
        animate={{
          opacity: showBall || (isSelected && hasBall) ? 1 : 0,
          scale: showBall || (isSelected && hasBall) ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      >
        <svg width={cupWidth * 0.4} height={cupWidth * 0.4} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="9" cy="9" r="3" fill="rgba(255,255,255,0.4)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
