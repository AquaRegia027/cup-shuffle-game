'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const audioRef = useRef(audio);
  audioRef.current = audio;

  const [showInstructions, setShowInstructions] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const config = getLevelConfig(game.currentLevel);

  useEffect(() => {
    if (!game.hasSeenInstructions) {
      setShowInstructions(true);
    }
  }, [game.hasSeenInstructions]);

  // Background music — use ref to avoid re-running on every render
  useEffect(() => {
    audioRef.current.playBgMusic();
    return () => {
      audioRef.current.stopBgMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    audioRef.current.stopBgMusic();
    router.push('/');
  };

  const handleStartFromInstructions = () => {
    setShowInstructions(false);
    markInstructionsSeen();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col safe-bottom">
      <Header title={`Level ${game.currentLevel}`} showBack />

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
        <GameBoard
          key={gameKey}
          level={game.currentLevel}
          onResult={handleResult}
          config={config}
        />
      </div>

      {/* Audio controls */}
      <div className="fixed bottom-6 right-4 flex gap-2 z-30">
        <button
          type="button"
          onClick={() => { audio.playSfx('click'); audio.toggleMusic(); }}
          className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-sea-800/90 backdrop-blur flex items-center justify-center text-cream-300 active:bg-sea-700 touch-manipulation"
          title={audio.isMusicEnabled ? 'Mute music' : 'Enable music'}
        >
          {audio.isMusicEnabled ? (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L5 7H2v6h3l5 5V2z" />
              <path d="M14 6.5a4 4 0 010 7M16 4a7 7 0 010 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L5 7H2v6h3l5 5V2z" />
              <path d="M14 8l4 4M14 12l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => { audio.playSfx('click'); audio.toggleSfx(); }}
          className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-sea-800/90 backdrop-blur flex items-center justify-center text-cream-300 active:bg-sea-700 touch-manipulation"
          title={audio.isSfxEnabled ? 'Mute SFX' : 'Enable SFX'}
        >
          <span className="text-xs font-bold">{audio.isSfxEnabled ? 'SFX' : 'OFF'}</span>
        </button>
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => { setShowInstructions(false); markInstructionsSeen(); }}
        onStartGame={handleStartFromInstructions}
      />

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
