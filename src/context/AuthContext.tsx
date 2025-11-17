'use client';

import { createContext, useEffect, useState } from 'react';
import { refresh, logout, checkAuth } from '@/api/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (u: any) => void;
  logoutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logoutUser: async () => {},
});

export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await refresh();
        const res = await checkAuth();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return null;
  }

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
