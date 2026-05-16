'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nexus_user_nickname';

export function useNickname(userEmail?: string) {
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [hasAsked, setHasAsked] = useState(true);

  useEffect(() => {
    if (!userEmail) return;
    const key = `${STORAGE_KEY}_${userEmail}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setNicknameState(saved);
      setHasAsked(true);
    } else {
      setHasAsked(false);
    }
  }, [userEmail]);

  const saveNickname = (name: string) => {
    if (!userEmail) return;
    const key = `${STORAGE_KEY}_${userEmail}`;
    const value = name.trim() || null;
    if (value) {
      localStorage.setItem(key, value);
      setNicknameState(value);
    } else {
      localStorage.removeItem(key);
      setNicknameState(null);
    }
    setHasAsked(true);
  };

  const clearNickname = () => {
    if (!userEmail) return;
    localStorage.removeItem(`${STORAGE_KEY}_${userEmail}`);
    setNicknameState(null);
    setHasAsked(false);
  };

  return { nickname, hasAsked, saveNickname, clearNickname };
}
