'use client';
import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SPIN_SEGMENTS } from '@/lib/spinWheelRewards';
import { useSpinWheel } from '@/hooks/useSpinWheel';
import { useAudio } from '@/hooks/useAudio';
import type { SpinSegment } from '@/types/game';

export function SpinWheel() {
  const { canSpin, spin } = useSpinWheel();
  const audio = useAudio();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<SpinSegment | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const segmentAngle = 360 / SPIN_SEGMENTS.length;

  // Draw wheel on canvas
  const drawWheel = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < SPIN_SEGMENTS.length; i++) {
      const seg = SPIN_SEGMENTS[i];
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#0A1628';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      const textRadius = radius * 0.65;
      const textX = center + Math.cos(textAngle) * textRadius;
      const textY = center + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = seg.color === '#F0F4F8' ? '#0A1628' : '#F0F4F8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(seg.label, 0, 4);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#0A1628';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [segmentAngle]);

  // Draw wheel on mount
  const canvasCallback = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node) {
        (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node;
        drawWheel(node);
      }
    },
    [drawWheel],
  );

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;
    audio.playSfx('click');
    setIsSpinning(true);
    setResult(null);

    const reward = spin();

    // Calculate rotation to land on the winning segment
    const segIndex = SPIN_SEGMENTS.findIndex((s) => s.label === reward.label);
    const targetAngle = 360 - segIndex * segmentAngle - segmentAngle / 2;
    const totalRotation = rotation + 360 * 5 + targetAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(reward);
    }, 4000);
  };

  return (
    <div className="card flex flex-col items-center gap-4">
      <h3 className="text-cream-200 font-bold">Daily Spin</h3>

      <div className="relative">
        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="#FFD700">
            <path d="M10 24L0 8L10 0L20 8Z" />
          </svg>
        </div>

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
          <canvas
            ref={canvasCallback}
            width={200}
            height={200}
            className="rounded-full"
          />
        </motion.div>
      </div>

      {result && (
        <p className="text-accent-gold font-bold text-lg animate-bounce-in">
          +{result.points} points!
        </p>
      )}

      <button
        type="button"
        onClick={handleSpin}
        disabled={!canSpin || isSpinning}
        className={`btn-primary w-full ${!canSpin || isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSpinning ? 'Spinning...' : canSpin ? 'Spin!' : 'Come back tomorrow!'}
      </button>
    </div>
  );
}
