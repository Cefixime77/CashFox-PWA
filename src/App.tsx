// ============================================
// CashFox PWA — App 入口
// ============================================
import { useEffect, Component, type ReactNode } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ToastProvider } from './components/Common/Toast';
import { OnboardingView } from './components/Layout/OnboardingView';
import { MainTabView } from './components/Layout/MainTabView';

class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (this.state.err) {
      return (
        <div style={{
          height: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#F5F9FC', padding: 32, fontFamily: 'system-ui'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🦊</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#2C3E50', marginBottom: 8 }}>
            出了点小问题
          </p>
          <p style={{ fontSize: 13, color: '#7F8C8D', textAlign: 'center', wordBreak: 'break-all' }}>
            {this.state.err.message}
          </p>
          <button
            onClick={() => { this.setState({ err: null }); window.location.reload(); }}
            style={{
              marginTop: 20, padding: '12px 32px', background: '#7EC8E3', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { ready, preference } = useAppContext();

  useEffect(() => {
    if (ready) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const fn = (window as any).__cashfoxReady;
            if (fn) fn();
          }, 100);
        });
      });
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <ErrorBoundary>
      {!preference?.hasCompletedOnboarding ? <OnboardingView /> : <MainTabView />}
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}
