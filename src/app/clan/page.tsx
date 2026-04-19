'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects legacy /clan route to the /profile page
 * where the chat modal can be triggered.
 */
export default function ClanPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/profile');
    }, [router]);

    return null;
}
