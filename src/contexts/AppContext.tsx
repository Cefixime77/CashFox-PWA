// ============================================
// 全局应用上下文 — 对应 Swift 版本的环境注入
// ============================================
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { UserPreference, Category, Tag, Budget, SavingsGoal, ExpenseRecord } from '../db/models';
import { db, initDatabase, getUserPreference } from '../db/database';

interface AppState {
  // 就绪状态
  ready: boolean;
  // 用户偏好
  preference: UserPreference | null;
  // 数据变更计数器（用于触发刷新）
  dataVersion: number;
  // 动作
  refreshData: () => void;
  updatePreference: (updates: Partial<UserPreference>) => Promise<void>;
  // 引导
  completeOnboarding: (foxName: string, currency: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [preference, setPreference] = useState<UserPreference | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  // 初始化
  useEffect(() => {
    initDatabase().then(() => {
      getUserPreference().then(p => {
        setPreference(p);
        setReady(true);
        console.log('[AppContext] App ready, onboarding:', p.hasCompletedOnboarding);
      });
    });
  }, []);

  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const updatePreference = useCallback(async (updates: Partial<UserPreference>) => {
    if (!preference) return;
    const updated = { ...preference, ...updates };
    await db.userPreferences.put(updated);
    setPreference(updated);
  }, [preference]);

  const completeOnboarding = useCallback(async (foxName: string, currency: string) => {
    const pref = await getUserPreference();
    pref.foxName = foxName;
    pref.currencyCode = currency;
    pref.hasCompletedOnboarding = true;
    await db.userPreferences.put(pref);
    setPreference(pref);
    console.log('[AppContext] Onboarding completed');
  }, []);

  return (
    <AppContext.Provider value={{
      ready,
      preference,
      dataVersion,
      refreshData,
      updatePreference,
      completeOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
