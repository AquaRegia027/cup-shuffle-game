'use client';
import { motion } from 'motion/react';
import { Button } from '@/components/shared/Button';

interface ResultOverlayProps {
  isCorrect: boolean;
  points: number;
  level: number;
  onReplay: () => void;
  onExit: () => void;
  onNext: () => void;
}

export function ResultOverlay({
  isCorrect,
  points,
  level,
  onReplay,
  onExit,
  onNext,
}: ResultOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-sea-900 border border-sea-700/50 rounded-2xl p-8 max-w-sm w-full text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        {isCorrect ? (
          <>
            <div className="text-5xl mb-4">&#127942;</div>
            <h2 className="text-2xl font-bold text-accent-correct mb-2">Correct!</h2>
            <p className="text-cream-300 mb-1">Level {level} Complete</p>
            <p className="text-accent-gold font-bold text-xl mb-6">+{points} points</p>
            <div className="flex flex-col gap-3">
              <Button
                label="Next Level"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 2l6 6-6 6" />
                  </svg>
                }
                variant="primary"
                onClick={onNext}
              />
              <Button
                label="Exit"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4L4 12M4 4l8 8" />
                  </svg>
                }
                variant="ghost"
                onClick={onExit}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">&#128532;</div>
            <h2 className="text-2xl font-bold text-accent-wrong mb-2">Wrong!</h2>
            <p className="text-cream-300 mb-6">The ball was under a different cup</p>
            <div className="flex flex-col gap-3">
              <Button
                label="Replay"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 8a6 6 0 1111.5-2.5M14 2v4h-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                variant="primary"
                onClick={onReplay}
              />
              <Button
                label="Exit"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4L4 12M4 4l8 8" />
                  </svg>
                }
                variant="ghost"
                onClick={onExit}
              />
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
