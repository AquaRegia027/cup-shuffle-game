import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const level = searchParams.get('level') || '1';
  const points = searchParams.get('points') || '0';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0A1628, #003380)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#F0F4F8',
            marginBottom: 16,
          }}
        >
          Cup Shuffle
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#FFD700',
            marginBottom: 8,
          }}
        >
          Level {level}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#FFD700',
            marginBottom: 32,
          }}
        >
          {points} Points
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#B3D4FF',
          }}
        >
          Can you beat this score?
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
