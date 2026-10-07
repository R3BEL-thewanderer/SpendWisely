import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpendWise — Smart Personal Finance',
  description:
    'SpendWise mobile web application with verified domain calculations, Digital Gulak, and instant financial clarity.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full max-w-full overflow-hidden overflow-x-hidden touch-pan-y">
      <body className="h-full w-full max-w-full overflow-hidden overflow-x-hidden touch-pan-y flex flex-col antialiased selection:bg-purple-500/20">
        {children}
      </body>
    </html>
  );
}
