import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://cup-shuffle-game.vercel.app';

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || '',
      payload: process.env.FARCASTER_PAYLOAD || '',
      signature: process.env.FARCASTER_SIGNATURE || '',
    },
    frame: {
      version: '1',
      name: 'Cup Shuffle',
      subtitle: 'Track the ball, win points!',
      description:
        'A 100-level cup shuffling challenge. Watch the ball hide under a cup, follow the shuffle, and guess right to earn points!',
      iconUrl: `${appUrl}/images/icon.png`,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: '#0A1628',
      homeUrl: appUrl,
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: 'games',
      tags: ['game', 'puzzle', 'shell-game', 'cups'],
    },
  };

  return NextResponse.json(manifest);
}
