'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface AuthUser {
  email: string;
  displayName: string;
  username: string;
  uid: string;
  photoURL?: string;
  [key: string]: any;
}

export interface AuthContextState {
  user: AuthUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  isUserLoading: true,
  userError: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  const checkUser = useCallback(async () => {
    try {
      const { userId } = await getCurrentUser();
      const session = await fetchAuthSession();

      if (!session?.tokens?.idToken) {
        setAuthState({ user: null, isUserLoading: false, userError: null });
        return;
      }

      const attributes = await fetchUserAttributes();
      const email = attributes.email || '';
      const name = attributes.name || attributes.given_name || email.split('@')[0] || 'Usuário';

      setAuthState({
        user: {
          email,
          displayName: name,
          username: email,
          uid: userId || attributes.sub || '',
          ...attributes,
        },
        isUserLoading: false,
        userError: null,
      });
    } catch {
      setAuthState({ user: null, isUserLoading: false, userError: null });
    }
  }, []);

  useEffect(() => {
    checkUser();

    const hubListener = Hub.listen('auth', ({ payload }) => {
      if (['signedIn', 'autoSignIn', 'tokenRefresh'].includes(payload.event)) {
        checkUser();
      } else if (payload.event === 'signedOut') {
        setAuthState({ user: null, isUserLoading: false, userError: null });
      }
    });

    return () => hubListener();
  }, [checkUser]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextState => useContext(AuthContext);
export const useAuth = (): AuthContextState => useContext(AuthContext);

export function useMemoAuth<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}
