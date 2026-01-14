'use client';

import { useState, useEffect } from 'react';

export type UserProgress = {
  streak: number;
  lastLoginDate: string; // ISO string 'YYYY-MM-DD'
  xp: number;
  completedUnits: string[]; // List of completed Unit IDs (e.g., 'N5-unit-1')
};

const DEFAULT_PROGRESS: UserProgress = {
  streak: 0,
  lastLoginDate: '',
  xp: 0,
  completedUnits: [],
};

const STORAGE_KEY = 'nihongo_app_progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });

        // Check Streak Logic
        checkStreak(parsed);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    } else {
        // New user interaction
        checkStreak(DEFAULT_PROGRESS);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever progress changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const checkStreak = (currentProgress: UserProgress) => {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = currentProgress.lastLoginDate;

      if (lastLogin !== today) {
          // It's a new day!
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = currentProgress.streak;

          if (lastLogin === yesterdayStr) {
              // Continued streak
              // We don't increment here, we increment when they complete an action?
              // Or just logging in counts? Let's say logging in counts for now to keep it flashy.
              newStreak += 1;
          } else if (lastLogin && lastLogin < yesterdayStr) {
             // Streak broken :(
             newStreak = 1;
          } else if (!lastLogin) {
              // First ever login
              newStreak = 1;
          }

          setProgress(prev => ({
              ...prev,
              streak: newStreak,
              lastLoginDate: today
          }));
      }
  };

  const addXp = (amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const completeUnit = (unitId: string) => {
    setProgress((prev) => {
      if (prev.completedUnits.includes(unitId)) return prev;
      return {
        ...prev,
        completedUnits: [...prev.completedUnits, unitId],
        xp: prev.xp + 100 // Bonus XP for finishing a unit
      };
    });
  };

  return {
    progress,
    isLoaded,
    addXp,
    completeUnit
  };
}
