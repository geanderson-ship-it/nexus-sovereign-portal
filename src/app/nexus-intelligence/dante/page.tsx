'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects from /nexus-intelligence/dante to the central /gabinete hub.
 */
export default function DanteModulePage() { 
    const router = useRouter();

    useEffect(() => {
        router.replace('/gabinete');
    }, [router]);

    return null; 
}
