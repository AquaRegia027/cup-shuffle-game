'use client';
import { Modal } from './Modal';
import { Button } from './Button';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export function InstructionsModal({ isOpen, onClose, onStartGame }: InstructionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-4 text-cream-300 text-sm">
        <div className="space-y-2">
          <h3 className="text-cream-200 font-semibold text-base">Game Rules</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>A ball is placed under one of the cups</li>
            <li>Watch carefully as the ball is revealed</li>
            <li>The cups will shuffle - follow the ball!</li>
            <li>Tap the cup you think has the ball</li>
            <li>Get it right to earn points and advance</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h3 className="text-cream-200 font-semibold text-base">Levels</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>100 levels of increasing difficulty</li>
            <li>More cups appear as you progress</li>
            <li>Shuffles get faster at higher levels</li>
            <li>Earn 50-100 points per correct guess</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-cream-200 font-semibold text-base">Daily Rewards</h3>
          <p>Spin the wheel once daily for bonus points!</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <Button
          label="Start Game"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          }
          variant="primary"
          onClick={onStartGame}
        />
        <Button
          label="Back"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 12L6 8l4-4" />
            </svg>
          }
          variant="ghost"
          onClick={onClose}
        />
      </div>
    </Modal>
  );
}
