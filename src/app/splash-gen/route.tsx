import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
        {/* Cup icon */}
        <svg width="200" height="240" viewBox="0 0 80 100" fill="none">
          <path
            d="M20 14 C18 14, 8 84, 5 90 L75 90 C72 84, 62 14, 60 14 Z"
            fill="#2563EB"
          />
          <ellipse cx="40" cy="14" rx="20" ry="8" fill="#1D4ED8" />
          <ellipse cx="40" cy="7" rx="6" ry="4" fill="#1E40AF" />
          <ellipse cx="40" cy="6" rx="4" ry="2.5" fill="#2563EB" />
          <ellipse cx="40" cy="90" rx="35" ry="7" fill="#1E40AF" />
          <path d="M28 20 Q26 55 24 82" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#F0F4F8',
            marginTop: 24,
          }}
        >
          Cup Shuffle
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#B3D4FF',
            marginTop: 8,
          }}
        >
          Track the ball, win points!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
