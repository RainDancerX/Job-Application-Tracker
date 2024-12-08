/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-11-12 15:29:13
 * @LastEditTime: 2024-12-08 13:21:01
 * @Description:
 */
import { getStoredUser, setStoredUser } from '@/lib/auth';
import React from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredUser());
  const isAuthenticated = !!user;

  const logout = React.useCallback(async () => {
    await signOut(auth);
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user.email;
    setStoredUser(user);
    setUser(user);
  }, []);

  // React.useEffect(() => {
  //   setUser(getStoredUser());
  // }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const email = firebaseUser?.email ?? null;
      console.log('Auth state changed:', email);
      setStoredUser(email);
      setUser(email);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
