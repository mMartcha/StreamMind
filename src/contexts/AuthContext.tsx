import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from '@/src/services/api';
import {
  AuthUser,
  getMe,
  login,
  register,
} from '@/src/services/auth';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY),
      AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY),
    ]);
    setToken(null);
    setUser(null);
  }, []);

  const saveSession = useCallback(async (nextToken: string, nextUser: AuthUser) => {
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken),
      AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser)),
    ]);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const nextUser = await getMe();
    await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
          AsyncStorage.getItem(AUTH_USER_STORAGE_KEY),
        ]);

        if (!storedToken) {
          return;
        }

        if (isMounted) {
          setToken(storedToken);
          setUser(storedUser ? (JSON.parse(storedUser) as AuthUser) : null);
        }

        const nextUser = await getMe();
        await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser));

        if (isMounted) {
          setUser(nextUser);
        }
      } catch {
        await clearSession();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await login({ email, password });
      await saveSession(response.token, response.user);
    },
    [saveSession],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await register({ name, email, password });
      await saveSession(response.token, response.user);
    },
    [saveSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      signIn,
      signUp,
      signOut: clearSession,
      refreshUser,
    }),
    [clearSession, isLoading, refreshUser, signIn, signUp, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
