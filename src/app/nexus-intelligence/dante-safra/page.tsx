'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects from the legacy /nexus-intelligence/dante-safra route 
 * to the new /intelligence/dante-safra route.
 */
export default function LegacyDanteSafraPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/intelligence/dante-safra');
    }, [router]);

    return null;
}
