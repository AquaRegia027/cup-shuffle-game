import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1024,
          height: 1024,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A1628',
          borderRadius: 200,
        }}
      >
        {/* Cup */}
        <svg width="500" height="600" viewBox="0 0 80 100" fill="none">
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
        {/* Ball */}
        <div
          style={{
            position: 'absolute',
            bottom: 180,
            right: 260,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #FF6B6B, #E53E3E, #C53030)',
          }}
        />
      </div>
    ),
    { width: 1024, height: 1024 },
  );
}
