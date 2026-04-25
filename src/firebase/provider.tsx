'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// Provider de autenticação — ponte para AWS Cognito via Amplify v6.
// Usa fetchAuthSession (método canônico) em vez de getCurrentUser para máxima confiabilidade.

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  user: any | null;
  isUserLoading: boolean;
  userError: Error | null;
  firebaseApp: any | null;
  firestore: any | null;
  auth: any | null;
}

export interface UserHookResult {
  user: any | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<UserHookResult>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  const checkUser = useCallback(async () => {
    try {
      // fetchAuthSession é o método mais confiável do Amplify v6 —
      // gerencia refresh de token internamente e não falha por timing pós-signIn
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
          uid: attributes.sub,
          signInDetails: { loginId: email },
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

    // Escuta signedIn e signedOut — exclui tokenRefresh para evitar re-checks que resetam o estado
    const hubListener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || payload.event === 'autoSignIn') {
        checkUser();
      } else if (payload.event === 'signedOut') {
        setAuthState({ user: null, isUserLoading: false, userError: null });
      }
    });

    return () => hubListener();
  }, [checkUser]);

  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable: true,
    firebaseApp: null,
    firestore: null,
    auth: null,
    user: authState.user,
    isUserLoading: authState.isUserLoading,
    userError: authState.userError,
  }), [authState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): any => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    return {
      user: null,
      isUserLoading: false,
      userError: null,
      firebaseApp: null,
      firestore: null,
      auth: null,
    };
  }
  return context;
};

export const useAuth = (): any => {
  return useFirebase().auth;
};

export const useFirestore = (): any => {
  return useFirebase().firestore;
};

export const useFirebaseApp = (): any => {
  return useFirebase().firebaseApp;
};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
