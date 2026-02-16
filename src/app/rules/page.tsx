'use client';
import { Header } from '@/components/shared/Header';

export default function RulesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Rules & Instructions" showBack />

      <div className="flex-1 p-4 max-w-md mx-auto">
        <div className="space-y-6">
          {/* How to play */}
          <section className="card">
            <h2 className="text-lg font-bold text-cream-200 mb-3">How to Play</h2>
            <ol className="list-decimal list-inside space-y-2 text-cream-300 text-sm">
              <li>A golden ball is placed under one of the cups</li>
              <li>The ball is revealed briefly — watch carefully!</li>
              <li>The cups are covered and then shuffled</li>
              <li>After shuffling stops, tap the cup you think hides the ball</li>
              <li>If you are correct, you earn points and advance to the next level</li>
              <li>If you are wrong, you can replay the same level</li>
            </ol>
          </section>

          {/* Levels */}
          <section className="card">
            <h2 className="text-lg font-bold text-cream-200 mb-3">Levels</h2>
            <ul className="space-y-2 text-cream-300 text-sm">
              <li>There are <strong className="text-cream-100">100 levels</strong> in total</li>
              <li>Every 10 levels, an additional cup is added (3 to 12 cups)</li>
              <li>Shuffles get faster and more numerous as you progress</li>
              <li>Level 1 is easy — Level 100 is the ultimate challenge!</li>
            </ul>
          </section>

          {/* Points */}
          <section className="card">
            <h2 className="text-lg font-bold text-cream-200 mb-3">Points</h2>
            <div className="space-y-1 text-cream-300 text-sm">
              <p>Earn points for every correct guess:</p>
              <ul className="space-y-1 ml-4">
                <li>Levels 1-10: <span className="text-accent-gold font-semibold">50 pts</span></li>
                <li>Levels 11-20: <span className="text-accent-gold font-semibold">55 pts</span></li>
                <li>Levels 21-30: <span className="text-accent-gold font-semibold">60 pts</span></li>
                <li>Levels 31-40: <span className="text-accent-gold font-semibold">65 pts</span></li>
                <li>Levels 41-50: <span className="text-accent-gold font-semibold">70 pts</span></li>
                <li>Levels 51-60: <span className="text-accent-gold font-semibold">75 pts</span></li>
                <li>Levels 61-70: <span className="text-accent-gold font-semibold">80 pts</span></li>
                <li>Levels 71-80: <span className="text-accent-gold font-semibold">85 pts</span></li>
                <li>Levels 81-90: <span className="text-accent-gold font-semibold">90 pts</span></li>
                <li>Levels 91-100: <span className="text-accent-gold font-semibold">100 pts</span></li>
              </ul>
              <p className="mt-2">Wrong answers earn <strong className="text-accent-wrong">0 points</strong>.</p>
            </div>
          </section>

          {/* Daily Spin */}
          <section className="card">
            <h2 className="text-lg font-bold text-cream-200 mb-3">Daily Spin</h2>
            <p className="text-cream-300 text-sm">
              Spin the wheel once every day for bonus points! You can win 10 to 500 bonus
              points. The wheel resets at midnight UTC.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
