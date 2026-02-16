import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || '',
      payload: process.env.FARCASTER_PAYLOAD || '',
      signature: process.env.FARCASTER_SIGNATURE || '',
    },
    frame: {
      version: '1',
      name: 'Cup Shuffle',
      subtitle: 'Find the ball!',
      description:
        'A 100-level cup shuffling challenge. Track the ball, earn points, climb the leaderboard!',
      iconUrl: `${appUrl}/images/icon.png`,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: '#0A1628',
      homeUrl: appUrl,
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: 'games',
      tags: ['game', 'puzzle', 'shell-game', 'cup-shuffle'],
    },
  };

  return NextResponse.json(manifest);
}
