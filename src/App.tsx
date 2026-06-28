// ============================================
// CashFox PWA — App 入口
// ============================================
import { useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { OnboardingView } from './components/Layout/OnboardingView';
import { MainTabView } from './components/Layout/MainTabView';

function AppContent() {
  const { ready, preference } = useAppContext();

  // ⚡ React 挂载完成后隐藏 HTML 加载屏
  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hidden');
      // 动画结束后移除 DOM
      setTimeout(() => loader.remove(), 350);
    }
  }, []);

  if (!ready) {
    return (
      <div className="h-full flex items-center justify-center bg-app-bg">
        <div className="flex flex-col items-center gap-4 animate-bounce-slow">
          <span className="text-[60px]">🦊</span>
          <p className="text-[16px] text-text-secondary">小财正在准备...</p>
        </div>
      </div>
    );
  }

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
