// ============================================
// 储蓄目标卡片 — 对应 Swift SavingsCardView
// ============================================
import type { SavingsGoal } from '../../db/models';
import { formatCurrency, formatPercent } from '../../utils/format';
import { Trash2, Calendar } from 'lucide-react';

interface Props {
  goal: SavingsGoal;
  daysRemaining?: number;
  onDelete: () => void;
}

export function SavingsCard({ goal, daysRemaining, onDelete }: Props) {
  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
  const isCompleted = progress >= 1;

  return (
    <div className="bg-white rounded-card shadow-card p-4 mb-3 relative">
      {isCompleted && <span className="absolute top-3 right-3 text-2xl">🎉</span>}

      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: goal.colorHex + '33' }}>
          <span className="text-xl">
            {goal.icon === 'Star' ? '⭐' : goal.icon === 'Heart' ? '❤️' : goal.icon === 'Home' ? '🏠' : goal.icon === 'Car' ? '🚗' : goal.icon === 'Plane' ? '✈️' : goal.icon === 'Gift' ? '🎁' : goal.icon === 'GraduationCap' ? '🎓' : '🎯'}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="text-[16px] font-semibold text-text-primary">{goal.name}</h4>
          <p className="text-[13px] text-text-secondary">
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <span className="text-[16px] font-semibold" style={{ color: goal.colorHex }}>{formatPercent(progress)}</span>
      </div>

      {/* 进度条 */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%`, backgroundColor: goal.colorHex }} />
      </div>

      {daysRemaining !== undefined && (
        <div className="flex items-center gap-1 text-[12px] text-text-tertiary mt-1">
          <Calendar size={12} />
          <span>还剩 {Math.max(daysRemaining, 0)} 天</span>
        </div>
      )}

      <div className="flex justify-end mt-2">
        <button onClick={onDelete} className="p-1">
          <Trash2 size={16} className="text-text-tertiary hover:text-expense" />
        </button>
      </div>
    </div>
  );
}
