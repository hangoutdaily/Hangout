import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AuthProvider from '@/context/AuthContext';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import SocketProvider from '@/providers/SocketProvider';
import GoogleAuthWrapper from '@/providers/GoogleAuthWrapper';

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
        <GoogleAuthWrapper>
          <AuthProvider>
            <SocketProvider>
              <ThemeProvider>
                <ReactQueryProvider>
                  <Header />
                  <MobileNav />
                  <main className="pb-16 md:pb-0 max-w-[100vw] overflow-x-hidden">{children}</main>
                </ReactQueryProvider>
              </ThemeProvider>
            </SocketProvider>
          </AuthProvider>
        </GoogleAuthWrapper>
      </body>
    </html>
  );
}
