'use client';
import { motion } from 'motion/react';

interface CupProps {
  id: number;
  x: number;
  hasBall: boolean;
  isRevealed: boolean;
  isSelected: boolean;
  isResult: boolean;
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
  isResult,
  onClick,
  disabled,
  shuffleDuration,
  cupSize,
}: CupProps) {
  const showBall = hasBall && (isRevealed || (isResult && isSelected));
  const showWrongX = isResult && isSelected && !hasBall;
  const showCorrectBall = isResult && !isSelected && hasBall;
  const cupWidth = cupSize;
  const cupHeight = cupSize * 1.3;
  const ballSize = cupSize * 0.35;
  const gap = cupSize + 12;

  // Cup color
  let cupColor = '#1E6FD9';
  let cupDark = '#1558AB';
  let cupHighlight = 'rgba(255,255,255,0.2)';
  if (isResult && isSelected) {
    cupColor = hasBall ? '#16A34A' : '#DC2626';
    cupDark = hasBall ? '#127A3A' : '#B91C1C';
  }

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ width: cupWidth, bottom: 0 }}
      animate={{ x: x * gap }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: shuffleDuration,
      }}
    >
      {/* Ball (sits on the surface, under/behind cup) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ bottom: 4, zIndex: 0 }}
      >
        <motion.div
          animate={{
            opacity: showBall || showCorrectBall ? 1 : 0,
            scale: showBall || showCorrectBall ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: isResult ? 0.2 : 0 }}
        >
          <svg width={ballSize} height={ballSize} viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" fill="#FF4444" />
            <circle cx="15" cy="15" r="13" fill="url(#ballGrad)" />
            <circle cx="11" cy="10" r="4" fill="rgba(255,255,255,0.35)" />
            <defs>
              <radialGradient id="ballGrad" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FF6666" />
                <stop offset="100%" stopColor="#CC0000" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Wrong X marker */}
      {showWrongX && (
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ bottom: 4, zIndex: 2 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <svg width={ballSize} height={ballSize} viewBox="0 0 30 30" fill="none">
            <line x1="6" y1="6" x2="24" y2="24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            <line x1="24" y1="6" x2="6" y2="24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}

      {/* The inverted cup/shell */}
      <motion.div
        className={`relative ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
        style={{ zIndex: 1 }}
        onClick={() => !disabled && onClick(id)}
        animate={{
          y: isRevealed || (isResult && isSelected) || (isResult && !isSelected && hasBall)
            ? -(cupHeight * 0.6)
            : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.4,
        }}
        whileHover={!disabled ? { y: -4 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
      >
        {/* Inverted cup SVG - dome/bell shape */}
        <svg
          width={cupWidth}
          height={cupHeight}
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup body - inverted trapezoid (wider at bottom) */}
          <path
            d="M12 10 C12 10, 8 85, 4 90 L76 90 C72 85, 68 10, 68 10"
            fill={cupColor}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          {/* Rounded top of cup */}
          <ellipse
            cx="40" cy="12" rx="28" ry="10"
            fill={cupDark}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          {/* Knob handle on top */}
          <circle cx="40" cy="6" r="5" fill={cupDark} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Bottom rim - wider */}
          <ellipse
            cx="40" cy="90" rx="36" ry="6"
            fill={cupDark}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          {/* Shine/highlight */}
          <path
            d="M24 18 C24 18, 22 70, 20 82"
            stroke={cupHighlight}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M28 16 C28 16, 26 65, 24 78"
            stroke={cupHighlight}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Surface line under each cup */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: 0,
          width: cupWidth * 1.1,
          height: 3,
          background: 'rgba(255,255,255,0.08)',
        }}
      />
    </motion.div>
  );
}
