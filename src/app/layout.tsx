import type { Metadata, Viewport } from 'next';
import './global.css';
import dynamic from 'next/dynamic';

const AppProviders = dynamic(
  () => import('@/components/providers/AppProviders').then((m) => m.AppProviders),
  { ssr: false },
);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Cup Shuffle',
  description: 'A 100-level cup shuffling challenge. Track the ball, earn points, climb the leaderboard!',
  openGraph: {
    title: 'Cup Shuffle',
    description: 'A 100-level cup shuffling challenge. Track the ball, earn points!',
  },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
       <meta name="base:app_id" content="69b195165733177ff4ffe1bf" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'base:app_id': '69b195165733177ff4ffe1bf',
  },
};

export default function Home() {
  return (<div>{/* Your page content */}</div>);
}
