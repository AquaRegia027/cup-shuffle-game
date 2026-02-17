'use client';

interface CupProps {
  index: number;
  slotX: number;
  lifted: boolean;
  isSelected: boolean;
  isCorrect: boolean | null;
  onClick: () => void;
  disabled: boolean;
  cupSize: number;
  shuffleDuration: number;
}

export function Cup({
  slotX,
  lifted,
  isSelected,
  isCorrect,
  onClick,
  disabled,
  cupSize,
  shuffleDuration,
}: CupProps) {
  const cupHeight = cupSize * 1.25;
  const liftY = lifted ? -(cupHeight * 0.75) : 0;

  // Cup color
  let bodyColor = '#2563EB';
  let darkColor = '#1D4ED8';
  let rimColor = '#1E40AF';
  if (isSelected && isCorrect === true) {
    bodyColor = '#16A34A';
    darkColor = '#15803D';
    rimColor = '#166534';
  } else if (isSelected && isCorrect === false) {
    bodyColor = '#DC2626';
    darkColor = '#B91C1C';
    rimColor = '#991B1B';
  }

  return (
    <div
      className="absolute"
      style={{
        width: cupSize,
        height: cupHeight + 8,
        bottom: 0,
        left: 0,
        transform: `translateX(${slotX}px)`,
        transition: `transform ${shuffleDuration}s ease-in-out`,
        zIndex: lifted ? 10 : 1,
      }}
    >
      {/* Cup SVG — lifted/lowered */}
      <div
        onClick={disabled ? undefined : onClick}
        className={disabled ? '' : 'cursor-pointer'}
        style={{
          transform: `translateY(${liftY}px)`,
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <svg
          width={cupSize}
          height={cupHeight}
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup body — wider at bottom (inverted cup) */}
          <path
            d="M20 14 C18 14, 8 84, 5 90 L75 90 C72 84, 62 14, 60 14 Z"
            fill={bodyColor}
          />
          {/* Top of cup — closed */}
          <ellipse cx="40" cy="14" rx="20" ry="8" fill={darkColor} />
          {/* Knob */}
          <ellipse cx="40" cy="7" rx="6" ry="4" fill={rimColor} />
          <ellipse cx="40" cy="6" rx="4" ry="2.5" fill={bodyColor} />
          {/* Bottom rim */}
          <ellipse cx="40" cy="90" rx="35" ry="7" fill={rimColor} />
          {/* Opening shadow */}
          <ellipse cx="40" cy="90" rx="32" ry="5" fill="rgba(0,0,0,0.25)" />
          {/* Shine */}
          <path d="M28 20 Q26 55 24 82" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        {/* Hover effect */}
        {!disabled && (
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150"
            style={{
              background: 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
