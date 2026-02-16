import { NextResponse } from 'next/server';

// In-memory leaderboard for development
// Replace with Vercel Postgres in production
const leaderboard: Map<
  number,
  {
    fid: number;
    username: string;
    avatarUrl: string | null;
    totalPoints: number;
    currentLevel: number;
  }
> = new Map();

export async function GET() {
  const entries = Array.from(leaderboard.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 100)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fid, username, avatarUrl, totalPoints, currentLevel } = body;

    if (!fid || typeof totalPoints !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const existing = leaderboard.get(fid);
    leaderboard.set(fid, {
      fid,
      username: username || existing?.username || 'Player',
      avatarUrl: avatarUrl || existing?.avatarUrl || null,
      totalPoints: Math.max(totalPoints, existing?.totalPoints || 0),
      currentLevel: Math.max(currentLevel, existing?.currentLevel || 1),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
