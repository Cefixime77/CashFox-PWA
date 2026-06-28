// ============================================
// 记录详情 — 对应 Swift ExpenseDetailView
// ============================================
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { CategoryIcon } from '../Common/CategoryIcon';
import { smartDateDisplay, timeDisplay, weekdayDisplay } from '../../utils/date';
import { X, Pencil, Trash2, FileText, Calendar, AlignLeft, RefreshCw } from 'lucide-react';

interface Props {
  recordId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function ExpenseDetail({ recordId, onClose, onDeleted }: Props) {
  const record = useLiveQuery(() => db.expenseRecords.get(recordId), [recordId]);
  const category = useLiveQuery(
    () => record?.categoryId ? db.categories.get(record.categoryId) : null,
    [record?.categoryId]
  );

  if (!record) return null;

  const isExpense = record.type === 'expense';
  const sign = isExpense ? '-' : '+';

  const handleDelete = async () => {
    if (confirm('确定要删除这条记录吗？删除后无法恢复。')) {
      await db.expenseRecords.delete(recordId);
      onDeleted();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in-up" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-app-bg rounded-t-[24px] max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
            <X size={24} className="text-text-secondary" />
          </button>
          <h2 className="text-[20px] font-semibold">记录详情</h2>
          <div className="w-10" />
        </div>

        <div className="px-5 pb-8 flex flex-col gap-4">
          {/* 金额卡片 */}
          <div className="flex flex-col items-center py-8 bg-white rounded-card shadow-card gap-3">
            <CategoryIcon
              icon={category?.icon ?? 'HelpCircle'}
              color={category?.colorHex ?? '#A8D8EA'}
              size={64}
            />
            <span className="text-[18px] font-medium text-text-secondary">
              {category?.name ?? '未分类'}
            </span>
            <span className={`text-[42px] font-bold ${isExpense ? 'text-expense' : 'text-income'}`}>
              {sign}¥{record.amount.toFixed(2)}
            </span>
          </div>

          {/* 详情卡片 */}
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <DetailRow icon="FileText" label="标题" value={record.title || '无'} />
            <DetailRow icon="Calendar" label="日期"
              value={`${smartDateDisplay(record.date)} ${weekdayDisplay(record.date)} ${timeDisplay(record.date)}`}
            />
            {record.note && <DetailRow icon="AlignLeft" label="备注" value={record.note} />}
            {record.isRecurring && (
              <DetailRow icon="RefreshCw" label="重复"
                value={{ daily: '每天', weekly: '每周', monthly: '每月', yearly: '每年' }[record.recurringInterval ?? 'monthly'] ?? ''}
              />
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {/* TODO: 编辑模式 */}}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-btn active:scale-98 flex items-center justify-center gap-2"
            >
              <Pencil size={18} />编辑
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-3.5 bg-expense/10 text-expense font-semibold rounded-btn active:scale-98 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText size={22} className="text-text-tertiary" />,
    Calendar: <Calendar size={22} className="text-text-tertiary" />,
    AlignLeft: <AlignLeft size={22} className="text-text-tertiary" />,
    RefreshCw: <RefreshCw size={22} className="text-text-tertiary" />,
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
      {iconMap[icon] ?? <FileText size={22} className="text-text-tertiary" />}
      <div className="flex flex-col">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <span className="text-[16px] text-text-primary">{value}</span>
      </div>
    </div>
  );
}
