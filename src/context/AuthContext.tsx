'use client';

import { createContext, useEffect, useState } from 'react';
import { logout, checkAuth } from '@/api/auth';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  logoutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logoutUser: async () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        // We rely on the axios interceptor to handle token refresh if needed
        const res = await checkAuth();
        const userData = res.data.user;
        setUser(userData);

        // Onboarding enforcement
        if (userData && !userData.profileId) {
          if (window.location.pathname !== '/onboarding') {
            router.push('/onboarding');
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  if (loading) {
    return null;
  }

  const logoutUser = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
