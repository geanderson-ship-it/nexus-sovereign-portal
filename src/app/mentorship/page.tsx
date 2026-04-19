'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects the legacy /mentorship route to the /profile page.
 * The profile page is now the central hub for accessing AI mentors.
 */
export default function MentorshipRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/profile');
    }, [router]);

    return null;
}
