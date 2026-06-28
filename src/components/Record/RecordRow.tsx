// ============================================
// 记录行组件 — 对应 Swift RecordRowView
// ============================================
import type { ExpenseRecord, Category } from '../../db/models';
import { CategoryIcon } from '../Common/CategoryIcon';
import { smartDateDisplay, timeDisplay } from '../../utils/date';
import { RefreshCw } from 'lucide-react';

interface Props {
  record: ExpenseRecord;
  category?: Category;
  onClick: () => void;
}

export function RecordRow({ record, category, onClick }: Props) {
  const isExpense = record.type === 'expense';
  const sign = isExpense ? '-' : '+';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 py-3 px-4 bg-white active:bg-gray-50 transition-colors cursor-pointer rounded-lg mx-2 my-0.5"
    >
      <CategoryIcon
        icon={category?.icon ?? 'HelpCircle'}
        color={category?.colorHex ?? '#A8D8EA'}
        size={40}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[16px] text-text-primary truncate">
            {record.title || category?.name || '未分类'}
          </span>
          {category && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-sm"
              style={{ backgroundColor: category.colorHex + '26', color: category.colorHex }}
            >
              {category.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {record.note && (
            <span className="text-[13px] text-text-secondary truncate max-w-[120px]">{record.note}</span>
          )}
        </div>
        <span className="text-[12px] text-text-tertiary">
          {smartDateDisplay(record.date)} {timeDisplay(record.date)}
        </span>
      </div>

      <div className="text-right flex-shrink-0">
        <span className={`text-[16px] font-semibold ${isExpense ? 'text-expense' : 'text-income'}`}>
          {sign}¥{record.amount.toFixed(2)}
        </span>
        {record.isRecurring && (
          <div className="flex justify-end mt-0.5">
            <RefreshCw size={12} className="text-text-tertiary" />
          </div>
        )}
      </div>
    </div>
  );
}
