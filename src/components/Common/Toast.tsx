// ============================================
// Toast 消息系统 — 全局轻提示
// ============================================
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  show: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastCtx>({ show: () => {} });

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2200);
  }, []);

  const dismiss = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-income" />;
      case 'error':   return <XCircle size={20} className="text-expense" />;
      case 'info':    return <Info size={20} className="text-primary" />;
    }
  };

  const bgColor = (type: ToastType) => {
    switch (type) {
      case 'success': return 'border-l-income';
      case 'error':   return 'border-l-expense';
      case 'info':    return 'border-l-primary';
    }
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Toast 容器 */}
      <div className="fixed top-0 left-0 right-0 z-[9999] pt-safe px-4 pt-5 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`animate-slide-up pointer-events-auto flex items-center gap-3 px-4 py-3 bg-card-bg rounded-btn shadow-elevated border-l-4 ${bgColor(t.type)}`}
            style={{ backgroundColor: 'var(--cf-card)', boxShadow: 'var(--cf-shadow-elevated)' }}
          >
            {icon(t.type)}
            <span className="flex-1 text-[14px] font-medium" style={{ color: 'var(--cf-text)' }}>
              {t.message}
            </span>
            <button onClick={() => dismiss(t.id)} className="opacity-50">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastCtx {
  return useContext(ToastContext);
}
