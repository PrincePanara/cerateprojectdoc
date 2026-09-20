import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types/project';

interface AuthContextValue {
  user: UserProfile | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

const KEY = 'docuforge.user';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as UserProfile);
    } catch {

      /* ignore corrupt storage */}
    setReady(true);
  }, []);

  const persist = useCallback((next: UserProfile | null) => {
    setUser(next);
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next));else
    window.localStorage.removeItem(KEY);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await wait(650);
      if (!email.includes('@')) throw new Error('Enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      persist({
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        avatar: null,
        college: '',
        department: ''
      });
    },
    [persist]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      await wait(750);
      if (name.trim().length < 2) throw new Error('Enter your full name.');
      if (!email.includes('@')) throw new Error('Enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      persist({ name: name.trim(), email, avatar: null, college: '', department: '' });
    },
    [persist]
  );

  const signInWithGoogle = useCallback(async () => {
    await wait(800);
    persist({ name: 'Aarav Mehta', email: 'aarav.mehta@college.edu', avatar: null, college: '', department: '' });
  }, [persist]);

  const signOut = useCallback(() => persist(null), [persist]);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        window.localStorage.setItem(KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const value = useMemo(
    () => ({ user, ready, signIn, signUp, signInWithGoogle, signOut, updateProfile }),
    [user, ready, signIn, signUp, signInWithGoogle, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}