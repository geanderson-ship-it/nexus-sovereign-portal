'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { AwsRumConfig } from 'aws-rum-web';

function AwsRumTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rumRef = useRef<any>(null);

  // Initialize AWS RUM once
  useEffect(() => {
    const initRum = async () => {
      if (rumRef.current) return;
      try {
        const { AwsRum } = await import('aws-rum-web');
        const config: AwsRumConfig = {
          sessionSampleRate: 1,
          endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
          telemetries: ["performance", "errors", "http"],
          allowCookies: true,
          enableXRay: false,
          signing: false
        };

        const APPLICATION_ID = "021991d4-ea3c-42a0-8ede-74ae723397d2";
        const APPLICATION_VERSION = "1.0.0";
        const APPLICATION_REGION = "us-east-1";

        rumRef.current = new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
      } catch (error) {
        // Ignore errors thrown during CloudWatch RUM web client initialization
      }
    };
    initRum();
  }, []);

  // Track page views on client-side route changes (SPA support)
  useEffect(() => {
    if (rumRef.current && pathname) {
      try {
        const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        rumRef.current.recordPageView(fullPath);
      } catch (e) {
        // Ignore errors recording page views
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AwsRumAnalytics() {
  return (
    <Suspense fallback={null}>
      <AwsRumTracker />
    </Suspense>
  );
}
