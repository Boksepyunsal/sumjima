'use client';

import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react'; // Import React for JSX usage, though not explicitly used in this file
import { SupabaseProvider } from '@/components/supabase-provider';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils'; // Import cn

const _geist = Geist({ subsets: ['latin'] }); // eslint-disable-line no-underscore-dangle, @typescript-eslint/naming-convention
const _geistMono = Geist_Mono({ subsets: ['latin'] }); // eslint-disable-line no-underscore-dangle, @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars

export const metadata: Metadata = {
  title: '숨지마 - 수수료 0원 직거래 플랫폼',
  description:
    '오픈소스로 만들어진 투명한 공간. 의뢰인도 고수도 비용 0원. 수수료 없는 직거래 매칭 서비스.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(_geist.className, _geistMono.className, 'antialiased')}
      >
        <SupabaseProvider>{children}</SupabaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
