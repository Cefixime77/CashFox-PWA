// ============================================
// CashFox PWA — App 入口
// 对应 Swift ContentView + CashFoxApp
// ============================================
import { useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { OnboardingView } from './components/Layout/OnboardingView';
import { MainTabView } from './components/Layout/MainTabView';

function AppContent() {
  const { ready, preference } = useAppContext();

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
