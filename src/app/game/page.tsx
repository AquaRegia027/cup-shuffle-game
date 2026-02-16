'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameBoard } from '@/components/game/GameBoard';
import { ResultOverlay } from '@/components/game/ResultOverlay';
import { InstructionsModal } from '@/components/shared/InstructionsModal';
import { Header } from '@/components/shared/Header';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import { getLevelConfig } from '@/lib/levelConfig';

export default function GamePage() {
  const router = useRouter();
  const {
    game,
    advanceLevel,
    addPoints,
    recordResult,
    markInstructionsSeen,
  } = useGameState();
  const audio = useAudio();

  const [showInstructions, setShowInstructions] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const config = getLevelConfig(game.currentLevel);

  // Show instructions on first play
  useEffect(() => {
    if (!game.hasSeenInstructions) {
      setShowInstructions(true);
    }
  }, [game.hasSeenInstructions]);

  // Start background music
  useEffect(() => {
    audio.playBgMusic();
    return () => audio.stopBgMusic();
  }, [audio]);

  const handleResult = useCallback(
    (correct: boolean, points: number) => {
      setLastResult({ correct, points });
      setShowResult(true);

      recordResult({
        level: game.currentLevel,
        correct,
        points,
        timestamp: Date.now(),
      });

      if (correct) {
        addPoints(points);
      }
    },
    [game.currentLevel, recordResult, addPoints],
  );

  const handleNext = () => {
    advanceLevel();
    setShowResult(false);
    setLastResult(null);
    setGameKey((k) => k + 1);
  };

  const handleReplay = () => {
    setShowResult(false);
    setLastResult(null);
    setGameKey((k) => k + 1);
  };

  const handleExit = () => {
    audio.stopBgMusic();
    router.push('/');
  };

  const handleStartFromInstructions = () => {
    setShowInstructions(false);
    markInstructionsSeen();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={`Level ${game.currentLevel}`} showBack />

      <div className="flex-1 flex items-center justify-center p-4">
        <GameBoard
          key={gameKey}
          level={game.currentLevel}
          onResult={handleResult}
          config={config}
        />
      </div>

      {/* Audio controls */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={audio.toggleMusic}
          className="w-10 h-10 rounded-full bg-sea-800/80 flex items-center justify-center text-cream-300 hover:bg-sea-700"
          title={audio.isMusicEnabled ? 'Mute music' : 'Enable music'}
        >
          {audio.isMusicEnabled ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L5 7H2v6h3l5 5V2z" />
              <path d="M14 6.5a4 4 0 010 7M16 4a7 7 0 010 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L5 7H2v6h3l5 5V2z" />
              <path d="M14 8l4 4M14 12l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={audio.toggleSfx}
          className="w-10 h-10 rounded-full bg-sea-800/80 flex items-center justify-center text-cream-300 hover:bg-sea-700"
          title={audio.isSfxEnabled ? 'Mute SFX' : 'Enable SFX'}
        >
          <span className="text-xs font-bold">{audio.isSfxEnabled ? 'SFX' : 'OFF'}</span>
        </button>
      </div>

      {/* Instructions modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => {
          setShowInstructions(false);
          markInstructionsSeen();
        }}
        onStartGame={handleStartFromInstructions}
      />

      {/* Result overlay */}
      {showResult && lastResult && (
        <ResultOverlay
          isCorrect={lastResult.correct}
          points={lastResult.points}
          level={game.currentLevel}
          onReplay={handleReplay}
          onExit={handleExit}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
