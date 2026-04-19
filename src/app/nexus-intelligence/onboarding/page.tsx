'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects from the legacy /nexus-intelligence/onboarding route 
 * to the new /intelligence/onboarding route.
 */
export default function LegacyOnboardingPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/intelligence/onboarding');
    }, [router]);

    return null;
}
