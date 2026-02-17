'use client';
import { useEffect, useRef, useState } from 'react';

interface CupProps {
  id: number;
  position: number;
  hasBall: boolean;
  lifted: boolean;
  isSelected: boolean;
  isResult: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
  cupSize: number;
  slotWidth: number;
  // Swap animation
  swapTarget: number | null; // target position to animate to
  swapDuration: number;
  swapDirection: 'over' | 'under' | null;
}

export function Cup({
  id,
  position,
  hasBall,
  lifted,
  isSelected,
  isResult,
  onClick,
  disabled,
  cupSize,
  slotWidth,
  swapTarget,
  swapDuration,
  swapDirection,
}: CupProps) {
  const cupRef = useRef<HTMLDivElement>(null);
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({});

  const cupWidth = cupSize;
  const cupHeight = cupSize * 1.2;
  const ballSize = cupSize * 0.32;
  const liftAmount = cupHeight + 10;

  // Calculate x position from slot position
  const slotX = position * slotWidth;

  // When a swap is active, animate with CSS transitions (arc path via translateY)
  useEffect(() => {
    if (swapTarget !== null && swapDirection) {
      const targetX = swapTarget * slotWidth;
      const deltaX = targetX - slotX;
      const arcHeight = swapDirection === 'over' ? -(cupHeight * 0.7) : (cupHeight * 0.4);

      // Use a keyframe animation for arcing
      const el = cupRef.current;
      if (!el) return;

      const keyframes: Keyframe[] = [
        { transform: `translate(${slotX}px, 0px)`, offset: 0 },
        { transform: `translate(${slotX + deltaX / 2}px, ${arcHeight}px)`, offset: 0.5 },
        { transform: `translate(${targetX}px, 0px)`, offset: 1 },
      ];

      const anim = el.animate(keyframes, {
        duration: swapDuration * 1000,
        easing: 'ease-in-out',
        fill: 'forwards',
      });

      return () => {
        anim.cancel();
      };
    }
    // No swap active — just set position
    setAnimStyle({
      transform: `translate(${slotX}px, 0px)`,
      transition: 'none',
    });
  }, [swapTarget, swapDirection, swapDuration, slotX, slotWidth, cupHeight]);

  // Cup color
  let cupBody = '#2563EB';
  let cupDark = '#1D4ED8';
  let cupRim = '#1E40AF';
  if (isResult && isSelected) {
    if (hasBall) {
      cupBody = '#16A34A';
      cupDark = '#15803D';
      cupRim = '#166534';
    } else {
      cupBody = '#DC2626';
      cupDark = '#B91C1C';
      cupRim = '#991B1B';
    }
  }

  const showBall = hasBall && lifted;
  const showWrongReveal = isResult && isSelected && !hasBall;
  // Also show ball under correct cup on result
  const showCorrectReveal = isResult && !isSelected && hasBall;

  return (
    <div
      ref={cupRef}
      className="absolute"
      style={{
        width: cupWidth,
        bottom: 0,
        left: 0,
        ...(!swapTarget ? { transform: `translate(${slotX}px, 0px)` } : {}),
        zIndex: swapDirection === 'over' ? 10 : 1,
        willChange: 'transform',
      }}
    >
      {/* Ball - sits on the surface */}
      <div
        className="absolute left-1/2 flex items-center justify-center"
        style={{
          bottom: 6,
          transform: 'translateX(-50%)',
          zIndex: 0,
          opacity: (showBall || showCorrectReveal) ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          style={{
            width: ballSize,
            height: ballSize,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #FF6B6B, #E53E3E, #C53030)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* Wrong X */}
      {showWrongReveal && (
        <div
          className="absolute left-1/2 flex items-center justify-center"
          style={{
            bottom: 6,
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        >
          <svg width={ballSize} height={ballSize} viewBox="0 0 30 30" fill="none">
            <line x1="6" y1="6" x2="24" y2="24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            <line x1="24" y1="6" x2="6" y2="24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* The inverted cup */}
      <div
        className={`relative ${disabled ? '' : 'cursor-pointer'}`}
        style={{
          zIndex: 1,
          transform: `translateY(${lifted ? -liftAmount : 0}px)`,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={() => !disabled && onClick(id)}
      >
        <svg
          width={cupWidth}
          height={cupHeight}
          viewBox="0 0 80 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup body - wider at bottom (inverted) */}
          <path
            d="M18 12 C16 12, 6 82, 4 86 L76 86 C74 82, 64 12, 62 12 Z"
            fill={cupBody}
          />
          {/* Top ellipse (closed top of cup) */}
          <ellipse cx="40" cy="12" rx="22" ry="8" fill={cupDark} />
          {/* Knob on top */}
          <ellipse cx="40" cy="5" rx="6" ry="4" fill={cupRim} />
          <ellipse cx="40" cy="4" rx="4" ry="2.5" fill={cupBody} />
          {/* Bottom rim */}
          <ellipse cx="40" cy="86" rx="36" ry="7" fill={cupRim} />
          {/* Bottom opening (darker) */}
          <ellipse cx="40" cy="86" rx="33" ry="5" fill="rgba(0,0,0,0.3)" />
          {/* Highlight/shine */}
          <path d="M26 18 Q24 50, 22 78" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M30 16 Q28 48, 26 76" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>

        {/* Hover glow for guessing phase */}
        {!disabled && (
          <div
            className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
