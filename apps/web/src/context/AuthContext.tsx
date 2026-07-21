import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { codiux } from '../lib/codiuxClient';

type AuthUser = { id: string; email?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await codiux.auth.me();
        if (!cancelled && session?.user?.id) {
          setUser({ id: session.user.id, email: session.user.email });
        }
      } catch {
        /* not signed in */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await codiux.auth.signInWithPassword({ email, password });
    const u = session?.user;
    if (!u?.id) throw new Error('Sign in failed');
    setUser({ id: u.id, email: u.email });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await codiux.auth.signUp({ email, password });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/already registered|duplicate|23505|409/i.test(msg)) throw e;
    }
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    await codiux.auth.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
