'use client';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import { Cup } from './Cup';
import { LevelIndicator } from './LevelIndicator';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useAudio } from '@/hooks/useAudio';
import type { LevelConfig } from '@/types/game';

interface GameBoardProps {
  level: number;
  onResult: (correct: boolean, points: number) => void;
  config: LevelConfig;
}

export function GameBoard({ level, onResult, config }: GameBoardProps) {
  const { state, startRound, selectCup, clearAllTimers } = useGameEngine(level);
  const audio = useAudio();
  const audioRef = useRef(audio);
  audioRef.current = audio;

  const prevPhaseRef = useRef('');
  const prevProgressRef = useRef('');

  // Start round on mount only
  useEffect(() => {
    startRound();
    return () => clearAllTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SFX on phase changes
  useEffect(() => {
    if (state.phase === prevPhaseRef.current) return;
    prevPhaseRef.current = state.phase;

    if (state.phase === 'reveal') {
      if (state.isCorrect) {
        audioRef.current.playSfx('correct');
      } else {
        audioRef.current.playSfx('wrong');
      }
    }
    if (state.phase === 'ballHide') {
      audioRef.current.playSfx('click');
    }
  }, [state.phase, state.isCorrect]);

  // Shuffle SFX — play on each progress change
  useEffect(() => {
    if (state.phase !== 'shuffling') return;
    if (state.shuffleProgress === prevProgressRef.current) return;
    if (state.shuffleProgress && state.shuffleProgress !== `0/${state.shuffleProgress.split('/')[1]}`) {
      audioRef.current.playSfx('shuffle');
    }
    prevProgressRef.current = state.shuffleProgress;
  }, [state.shuffleProgress, state.phase]);

  // Report result after reveal
  useEffect(() => {
    if (state.phase !== 'reveal' || state.isCorrect === null) return;
    const timer = setTimeout(() => {
      onResult(state.isCorrect!, state.isCorrect ? config.points : 0);
    }, 1800);
    return () => clearTimeout(timer);
  }, [state.phase, state.isCorrect, config.points, onResult]);

  // Responsive cup sizing
  const cupSize = useMemo(() => {
    if (typeof window === 'undefined') return 64;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxBoard = Math.min(vw - 32, 520, vh * 0.4);
    const size = Math.floor(maxBoard / (config.numCups * 1.2));
    return Math.max(40, Math.min(80, size));
  }, [config.numCups]);

  const slotWidth = cupSize * 1.25;
  const boardWidth = slotWidth * config.numCups;
  const cupHeight = cupSize * 1.25;
  const boardHeight = cupHeight + cupHeight * 0.75 + 20;
  const ballSize = cupSize * 0.3;

  const handleCupClick = useCallback((cupIndex: number) => {
    audioRef.current.playSfx('click');
    selectCup(cupIndex);
  }, [selectCup]);

  // Ball X position centered in its slot
  const ballX = state.ballSlot >= 0
    ? state.ballSlot * slotWidth + cupSize / 2 - ballSize / 2
    : boardWidth / 2 - ballSize / 2;

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2 sm:px-4">
      <LevelIndicator level={level} phase={state.phase} />

      {/* Phase text */}
      <div className="text-center h-7 flex items-center justify-center">
        {state.phase === 'ballShow' && (
          <p className="text-amber-400 font-semibold text-base sm:text-lg animate-pulse">
            Watch the ball!
          </p>
        )}
        {state.phase === 'ballHide' && (
          <p className="text-slate-300 text-base sm:text-lg">
            Remember this cup...
          </p>
        )}
        {state.phase === 'shuffling' && (
          <p className="text-slate-300 text-base sm:text-lg">
            Shuffling... <span className="text-blue-400">{state.shuffleProgress}</span>
          </p>
        )}
        {state.phase === 'guessing' && (
          <p className="text-blue-300 font-semibold text-base sm:text-lg animate-pulse">
            Where is the ball? Tap a cup!
          </p>
        )}
        {state.phase === 'reveal' && state.isCorrect && (
          <p className="text-green-400 font-bold text-lg sm:text-xl">
            Correct! +{config.points} pts
          </p>
        )}
        {state.phase === 'reveal' && state.isCorrect === false && (
          <p className="text-red-400 font-bold text-lg sm:text-xl">
            Wrong!
          </p>
        )}
      </div>

      {/* Game board */}
      <div className="flex justify-center w-full">
        <div className="relative" style={{ width: boardWidth, height: boardHeight }}>

          {/* Table surface */}
          <div
            className="absolute rounded-lg"
            style={{
              bottom: 0,
              left: -16,
              width: boardWidth + 32,
              height: 6,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          />

          {/* Ball */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: ballX,
              width: ballSize,
              height: ballSize,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #FF6B6B, #E53E3E, #C53030)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)',
              opacity: state.ballVisible ? 1 : 0,
              transform: `scale(${state.ballVisible ? 1 : 0.3})`,
              transition: 'left 0.4s ease-in-out, opacity 0.25s ease, transform 0.25s ease',
              zIndex: 0,
            }}
          />

          {/* Cups */}
          {state.positions.map((slot, cupIndex) => (
            <Cup
              key={cupIndex}
              index={cupIndex}
              slotX={slot * slotWidth}
              lifted={state.liftedCups.includes(cupIndex)}
              isSelected={state.selectedCup === cupIndex}
              isCorrect={state.selectedCup === cupIndex ? state.isCorrect : null}
              onClick={() => handleCupClick(cupIndex)}
              disabled={state.phase !== 'guessing'}
              cupSize={cupSize}
              shuffleDuration={config.shuffleDuration}
            />
          ))}
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-1">
        {config.numCups} cups &middot; {config.numShuffles} shuffles
      </p>
    </div>
  );
}
