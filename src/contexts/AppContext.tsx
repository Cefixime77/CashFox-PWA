// ============================================
// 全局应用上下文
// ============================================
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { UserPreference, AppDarkMode } from '../db/models';
import { db, initDatabase, getUserPreference } from '../db/database';

// ═══ 暗色模式工具 ═══

function applyDarkMode(mode: AppDarkMode) {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');

  const isDark = mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  root.classList.toggle('dark', isDark);

  // 同步 PWA 状态栏颜色
  if (meta) {
    meta.setAttribute('content', isDark ? '#1a1d23' : '#A8D8EA');
  }
}

// ═══ Context ═══

interface AppState {
  ready: boolean;
  preference: UserPreference | null;
  dataVersion: number;
  refreshData: () => void;
  updatePreference: (updates: Partial<UserPreference>) => Promise<void>;
  completeOnboarding: (foxName: string, currency: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [preference, setPreference] = useState<UserPreference | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  // 初始化数据库 + 偏好 + 暗色模式
  useEffect(() => {
    initDatabase().then(() => {
      getUserPreference().then(p => {
        setPreference(p);
        applyDarkMode(p.darkMode);
        setReady(true);
        console.log('[AppContext] Ready, darkMode:', p.darkMode);
      });
    });
  }, []);

  // 监听系统暗色模式变化（当用户选择 "跟随系统" 时）
  useEffect(() => {
    if (!preference) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (preference.darkMode === 'system') applyDarkMode('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const updatePreference = useCallback(async (updates: Partial<UserPreference>) => {
    if (!preference) return;
    const updated = { ...preference, ...updates };
    await db.userPreferences.put(updated);
    setPreference(updated);

    // 暗色模式立即生效
    if ('darkMode' in updates) {
      applyDarkMode(updated.darkMode);
    }
  }, [preference]);

  const completeOnboarding = useCallback(async (foxName: string, currency: string) => {
    const pref = await getUserPreference();
    pref.foxName = foxName;
    pref.currencyCode = currency;
    pref.hasCompletedOnboarding = true;
    await db.userPreferences.put(pref);
    setPreference(pref);
  }, []);

  return (
    <AppContext.Provider value={{
      ready, preference, dataVersion, refreshData, updatePreference, completeOnboarding
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
