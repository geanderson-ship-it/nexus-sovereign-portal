'use client';

import React from 'react';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';

export function DebugAuth() {
  const { user, isUserLoading } = useUser();
  const isAdmin = isAdminUser(user);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Auth</h3>
      <div className="space-y-1">
        <p>Loading: {isUserLoading ? 'true' : 'false'}</p>
        <p>User exists: {user ? 'true' : 'false'}</p>
        {user && (
          <>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            <p>Display: {user.displayName}</p>
            <p>Is Admin: {isAdmin ? 'true' : 'false'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer">Full User Object</summary>
              <pre className="mt-1 text-[10px] overflow-auto max-h-32">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
}