// ============================================
// 预算卡片 — 对应 Swift BudgetCardView
// ============================================
import type { Budget, Category } from '../../db/models';
import { ProgressRing } from '../Common/ProgressRing';
import { CategoryIcon } from '../Common/CategoryIcon';
import { formatCurrency, formatPercent } from '../../utils/format';
import { Trash2 } from 'lucide-react';

interface Props {
  budget: Budget;
  spent: number;
  percent: number;
  category?: Category;
  onDelete: () => void;
}

export function BudgetCard({ budget, spent, percent, category, onDelete }: Props) {
  const remaining = Math.max(budget.amount - spent, 0);
  const isOver = percent >= 1;
  const isWarning = percent >= budget.alertThreshold && !isOver;

  const statusColor = isOver ? '#FF6B6B' : isWarning ? '#FFA94D' : '#51CF66';
  const statusText = isOver ? '⚠ 已超出' : isWarning ? '⚠ 即将超出' : '✓ 正常';

  return (
    <div className="bg-card-bg rounded-card shadow-card p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {category ? (
            <CategoryIcon icon={category.icon} color={category.colorHex} size={36} />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-light/30 flex items-center justify-center">
              <span className="text-primary-dark text-sm font-medium">全</span>
            </div>
          )}
          <div>
            <h4 className="text-[18px] font-medium text-text-primary">{budget.name || '月度预算'}</h4>
            <span className="text-[13px] text-text-secondary">{category?.name ?? '全部支出'}</span>
          </div>
        </div>
        <ProgressRing progress={percent} size={56} lineWidth={5}
          color={statusColor} label={formatPercent(percent)} sublabel="已用" />
      </div>

      {/* 金额信息 */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div>
          <p className="text-[10px] text-text-tertiary">预算</p>
          <p className="text-[16px] font-semibold text-text-primary">{formatCurrency(budget.amount)}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-tertiary">已用</p>
          <p className={`text-[16px] font-semibold ${isOver ? 'text-expense' : 'text-warning'}`}>
            {formatCurrency(spent)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-tertiary">剩余</p>
          <p className="text-[16px] font-semibold text-income">{formatCurrency(remaining)}</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-2 bg-[var(--cf-input)] rounded-full mb-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percent * 100, 100)}%`, backgroundColor: statusColor }} />
      </div>

      {/* 底部状态 */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium" style={{ color: statusColor }}>{statusText}</span>
        <button onClick={onDelete} className="p-1">
          <Trash2 size={16} className="text-text-tertiary hover:text-expense transition-colors" />
        </button>
      </div>
    </div>
  );
}
