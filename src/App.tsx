// ============================================
// CashFox PWA — App 入口
// ============================================
import { useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { OnboardingView } from './components/Layout/OnboardingView';
import { MainTabView } from './components/Layout/MainTabView';

function AppContent() {
  const { ready, preference } = useAppContext();

  // ⚡ 应用完全就绪后关闭 HTML 加载屏
  //    关键：只在 ready=true 且内容渲染后才隐藏
  //    这样中间不存在任何空白间隙
  useEffect(() => {
    if (ready) {
      // 延迟一帧确保 DOM 已经渲染
      requestAnimationFrame(() => {
        const fn = (window as unknown as Record<string, (() => void) | undefined>).__cashfoxReady;
        if (fn) fn();
      });
    }
  }, [ready]);

  // 数据库未初始化 → React 内部加载状态（用户看不到，因为 HTML 加载屏还在）
  if (!ready) {
    return null;
  }

  // 引导页 / 主页
  if (!preference?.hasCompletedOnboarding) {
    return <OnboardingView />;
  }

  return <MainTabView />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
