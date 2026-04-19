'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects from the base /nexus-intelligence route to the central /gabinete hub.
 */
export default function NexusIntelligencePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/gabinete');
  }, [router]);

  // Render nothing or a loading spinner while redirecting
  return null;
}
