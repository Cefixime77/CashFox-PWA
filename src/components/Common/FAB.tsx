// ============================================
// 悬浮操作按钮 — 对应 Swift FloatingActionButton
// ============================================
import { Plus } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function FAB({ icon, onClick, className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed z-40 w-14 h-14 rounded-full
        flex items-center justify-center
        bg-gradient-to-br from-primary to-primary-dark
        text-white shadow-button
        active:scale-95 transition-transform duration-150
        ${className}
      `}
      style={{ right: 20, bottom: 'calc(24px + env(safe-area-inset-bottom))' }}
    >
      {icon ?? <Plus size={28} strokeWidth={2.5} />}
    </button>
  );
}
