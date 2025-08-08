import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthUser = {
  id: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

async function saveSecureItem(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.ALWAYS });
  } catch {
    // no-op
  }
}

async function getSecureItem(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function deleteSecureItem(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // no-op
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const storedToken = await getSecureItem(TOKEN_KEY);
      const storedUser = await getSecureItem(USER_KEY);
      if (isMounted) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        }
        setInitializing(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // TODO: Replace with real API call
    const fakeToken = 'demo-token';
    const fakeUser: AuthUser = { id: '1', email };
    setToken(fakeToken);
    setUser(fakeUser);
    await saveSecureItem(TOKEN_KEY, fakeToken);
    await saveSecureItem(USER_KEY, JSON.stringify(fakeUser));
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    // For demo purposes, sign up behaves like sign in
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    await deleteSecureItem(TOKEN_KEY);
    await deleteSecureItem(USER_KEY);
  }, []);

  const value: AuthContextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    initializing,
    signIn,
    signUp,
    signOut,
  }), [user, token, initializing, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}


