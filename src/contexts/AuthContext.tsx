import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types/project';
import { auth, database } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

interface AuthContextValue {
  user: UserProfile | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUid(firebaseUser.uid);
        const userRef = ref(database, 'users/' + firebaseUser.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          const defaultProfile: UserProfile = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL,
            college: '',
            department: ''
          };
          setUser(defaultProfile);
          set(userRef, defaultProfile);
        }
      } else {
        setFirebaseUid(null);
        setUser(null);
      }
      setReady(true);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    []
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      if (name.trim().length < 2) throw new Error('Enter your full name.');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newProfile: UserProfile = { 
        name: name.trim(), 
        email, 
        avatar: null, 
        college: '', 
        department: '' 
      };
      await set(ref(database, 'users/' + userCredential.user.uid), newProfile);
      setUser(newProfile);
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!firebaseUid || !user) return;
      const next = { ...user, ...patch };
      setUser(next);
      await set(ref(database, 'users/' + firebaseUid), next);
    },
    [firebaseUid, user]
  );

  const value = useMemo(
    () => ({ user, ready, signIn, signUp, signInWithGoogle, signOut, updateProfile }),
    [user, ready, signIn, signUp, signInWithGoogle, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}