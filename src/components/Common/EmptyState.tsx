// ============================================
// 空状态视图 — 对应 Swift EmptyStateView
// ============================================
import type { FoxExpression } from '../../db/models';
import { FoxMascot } from '../Fox/FoxMascot';
import * as Lucide from 'lucide-react';

interface Props {
  icon: string;
  title: string;
  foxMessage: string;
  foxExpression?: FoxExpression;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon, title, foxMessage, foxExpression = 'idle', actionTitle, onAction
}: Props) {
  const IconComp = (Lucide as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon]
    ?? Lucide.HelpCircle;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in-up">
      <FoxMascot expression={foxExpression} size="large" message={foxMessage} />

      <div className="flex flex-col items-center mt-6 gap-3">
        <IconComp size={40} className="text-text-tertiary" />
        <p className="text-[20px] font-semibold text-text-primary text-center">{title}</p>
      </div>

      {actionTitle && onAction && (
        <button
          onClick={onAction}
          className="mt-6 w-full max-w-xs py-3.5 bg-primary text-white font-semibold rounded-btn shadow-button active:scale-98 transition-transform"
        >
          {actionTitle}
        </button>
      )}
    </div>
  );
}
