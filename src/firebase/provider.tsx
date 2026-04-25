'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// Otimização Platinum: Este provider agora serve como uma ponte para a AWS.
// Mantemos os nomes dos hooks para não quebrar os componentes existentes durante a unificação.

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  user: any | null; // Mapeado para o usuário da AWS
  isUserLoading: boolean;
  userError: Error | null;
  // Membros legados do Firebase como null para compatibilidade de tipo
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
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setAuthState({
        user: { ...user, ...attributes, displayName: attributes.name || user.username },
        isUserLoading: false,
        userError: null
      });
    } catch (e) {
      setAuthState({ user: null, isUserLoading: false, userError: null });
    }
  }, []);

  useEffect(() => {
    // Verificação inicial do estado de autenticação
    checkUser();

    // Escuta eventos de autenticação do Amplify em tempo real
    // Isso garante que o estado seja atualizado imediatamente após signIn/signOut
    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'autoSignIn':
        case 'tokenRefresh':
          checkUser();
          break;
        case 'signedOut':
          setAuthState({ user: null, isUserLoading: false, userError: null });
          break;
        default:
          break;
      }
    });

    // Limpa o listener quando o componente é desmontado
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
    // Retornamos um estado padrão seguro em vez de lançar erro para não quebrar o build do Next.js 
    // durante a pré-renderização de páginas estáticas.
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
