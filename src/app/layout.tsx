import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AuthProvider from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Hangout',
  description: 'Because there is so much to life...',
  authors: [{ name: 'Dhruv Chauhan' }, { name: 'Rushil Patel' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="pb-16 md:pb-0 max-w-[100vw] overflow-x-hidden">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
