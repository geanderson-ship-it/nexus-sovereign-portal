'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/auth';
import { isAdminUser, UserLevel } from '@/lib/constants';

export function useAccessLevel() {
    const { user, isUserLoading } = useUser();
    const [isSalesAuth, setIsSalesAuth] = useState(false);
    const [isCheckingSales, setIsCheckingSales] = useState(true);

    useEffect(() => {
        try {
            const hasVendasAuth = localStorage.getItem('vendas_auth') === 'true';
            setIsSalesAuth(hasVendasAuth);
        } catch (error) {
            console.error('Failed to read vendas_auth from localStorage:', error);
        } finally {
            setIsCheckingSales(false);
        }
    }, []);

    const accessLevel: UserLevel = useMemo(() => {
        if (isAdminUser(user)) {
            return 'ADMIN';
        }
        if (isSalesAuth) {
            return 'SALES';
        }
        return 'USER';
    }, [user, isSalesAuth]);

    const isLoading = isUserLoading || isCheckingSales;

    const hasAdminAccess = accessLevel === 'ADMIN';
    const hasSalesAccess = accessLevel === 'ADMIN' || accessLevel === 'SALES';

    return {
        accessLevel,
        hasAdminAccess,
        hasSalesAccess,
        isLoading,
        isSalesAuth,
        user
    };
}
