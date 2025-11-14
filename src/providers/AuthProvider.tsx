'use client';

import AuthProvider from '@/context/AuthContext';

export default function AppProviders({ children }: any) {
  return <AuthProvider>{children}</AuthProvider>;
}
