import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MindCast | Exam Weather Station',
  description:
    'MindCast — Your Exam Weather Station. A smart, calm mental wellness companion for Indian exam warriors preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and Board exams. Track your mind, navigate the storm, find your calm.',
  keywords: [
    'mental wellness',
    'exam stress',
    'NEET',
    'JEE',
    'CUET',
    'CAT',
    'GATE',
    'UPSC',
    'board exams',
    'student wellness',
    'mood tracker',
  ],
  openGraph: {
    title: 'MindCast | Exam Weather Station',
    description:
      'Track your mind. Navigate the storm. Find your calm. A wellness companion for Indian exam students.',
    type: 'website',
    images: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⛅</text></svg>',
        width: 100,
        height: 100,
        alt: 'MindCast Weather Emoji',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#07070F] text-[#F1F5F9]`}
      >
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#14142A',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F1F5F9',
            },
          }}
        />
      </body>
    </html>
  );
}
