'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

/**
 * Initializes and returns a Firebase app instance, using a singleton pattern.
 * This function is safe to call multiple times.
 */
export function initializeFirebase(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}
