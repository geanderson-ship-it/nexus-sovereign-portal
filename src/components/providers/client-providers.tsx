"use client";

import React, { useEffect } from "react";
import { LocaleProvider } from '@/components/providers/locale-provider';
import { Toaster } from '@/components/ui/toaster';
import { AmplifyProvider } from "@/components/providers/amplify-provider";
import { FirebaseProvider } from "@/firebase/provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.filename && e.filename.includes('cast_sender.js')) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return (
    <LocaleProvider>
      <AmplifyProvider>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </AmplifyProvider>
      <Toaster />
    </LocaleProvider>
  );
}
