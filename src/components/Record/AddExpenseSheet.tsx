// ============================================
// 添加记录 Sheet — 对应 Swift AddExpenseSheet
// ============================================
import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { Category, ExpenseType } from '../../db/models';
import { useAddExpenseViewModel } from '../../hooks/useAddExpenseViewModel';
import { NumberPad } from './NumberPad';
import { CategoryGrid } from './CategoryGrid';
import { X, Calendar } from 'lucide-react';

interface Props {
  recordId?: string;   // 编辑模式
  onClose: () => void;
  onSaved: () => void;
}

export function AddExpenseSheet({ recordId, onClose, onSaved }: Props) {
  const vm = useAddExpenseViewModel();
  const allCategories = useLiveQuery(() => db.categories.orderBy('sortOrder').toArray(), []) ?? [];

  const currentCategories = allCategories.filter(c => c.type === vm.selectedType);
  const selectedCat = currentCategories.find(c => c.id === vm.selectedCategoryId);

  // 编辑模式加载
  useEffect(() => {
    if (recordId) {
      db.expenseRecords.get(recordId).then(r => {
        if (r) vm.startEditing(r);
      });
    } else {
      // 默认选中第一个分类
      const cats = allCategories.filter(c => c.type === 'expense');
      if (cats.length > 0) vm.setSelectedCategoryId(cats[0].id);
    }
  }, [recordId]);

  const handleSave = async () => {
    const record = await vm.save();
    if (record) {
      vm.reset();
      onSaved();
    }
  };

  const isExpense = vm.selectedType === 'expense';
  const sign = isExpense ? '-' : '+';

  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in-up" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-app-bg rounded-t-[24px] max-h-[95vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
            <X size={24} className="text-text-secondary" />
          </button>
          <h2 className="text-[20px] font-semibold text-text-primary">
            {recordId ? '编辑记录' : '记一笔'}
          </h2>
          <div className="w-10" />
        </div>

        <div className="px-5 pb-8 flex flex-col gap-4">
          {/* 收支切换 */}
          <div className="flex rounded-btn bg-gray-100 p-0.5">
            {(['expense', 'income'] as ExpenseType[]).map(type => (
              <button
                key={type}
                onClick={() => { vm.setSelectedType(type); vm.setSelectedCategoryId(undefined); }}
                className={`flex-1 py-2.5 text-[16px] font-semibold rounded-[10px] transition-all ${
                  vm.selectedType === type
                    ? (type === 'expense' ? 'bg-expense text-white' : 'bg-income text-white')
                    : 'text-text-secondary'
                }`}
              >
                {type === 'expense' ? '支出' : '收入'}
              </button>
            ))}
          </div>

          {/* 金额显示 */}
          <div className="text-center py-2">
            {vm.amountError && (
              <p className="text-[13px] text-expense mb-1">{vm.amountError}</p>
            )}
            <div className="flex items-baseline justify-center gap-0.5">
              <span className={`text-[28px] font-bold ${isExpense ? 'text-expense' : 'text-income'}`}>
                {sign}¥
              </span>
              <span className="text-[42px] font-bold text-text-primary">
                {vm.amountString || '0'}
              </span>
            </div>
          </div>

          {/* 分类选择 */}
          <div>
            <p className="text-[16px] font-semibold text-text-primary mb-2">选择分类</p>
            <CategoryGrid
              categories={currentCategories}
              selectedId={vm.selectedCategoryId}
              onSelect={vm.setSelectedCategoryId}
            />
          </div>

          {/* 快捷金额 */}
          <div className="flex gap-2 flex-wrap">
            {vm.quickAmounts.map(a => (
              <button
                key={a}
                onClick={() => vm.selectQuickAmount(a)}
                className="px-3 py-1.5 bg-primary-light/30 text-primary-dark text-[13px] font-medium rounded-pill active:bg-primary-light/50"
              >
                ¥{a}
              </button>
            ))}
          </div>

          {/* 标题 & 备注 */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="标题（可选）"
              value={vm.title}
              onChange={e => vm.setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-btn text-[16px] border-0 outline-none shadow-card"
            />
            <input
              type="text"
              placeholder="备注（可选）"
              value={vm.note}
              onChange={e => vm.setNote(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-btn text-[16px] border-0 outline-none shadow-card"
            />

            {/* 日期 */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-btn shadow-card">
              <Calendar size={20} className="text-text-tertiary" />
              <input
                type="datetime-local"
                value={vm.date.toISOString().slice(0, 16)}
                onChange={e => vm.setDate(new Date(e.target.value))}
                className="flex-1 text-[16px] text-text-primary bg-transparent border-0 outline-none"
              />
            </div>

            {/* 周期性 */}
            <label className="flex items-center gap-3 px-4 py-3 bg-white rounded-btn shadow-card">
              <span className="flex-1 text-[16px] text-text-primary">周期性重复</span>
              <input
                type="checkbox"
                checked={vm.isRecurring}
                onChange={e => vm.setIsRecurring(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
            </label>
            {vm.isRecurring && (
              <div className="flex rounded-btn bg-gray-100 p-0.5">
                {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(interval => (
                  <button
                    key={interval}
                    onClick={() => vm.setRecurringInterval(interval)}
                    className={`flex-1 py-2 text-[14px] rounded-[10px] transition-all ${
                      vm.recurringInterval === interval ? 'bg-primary text-white font-medium' : 'text-text-secondary'
                    }`}
                  >
                    {{ daily: '每天', weekly: '每周', monthly: '每月', yearly: '每年' }[interval]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 数字键盘 */}
          <NumberPad
            amountString={vm.amountString}
            onAppendDigit={vm.appendDigit}
            onAppendDecimal={vm.appendDecimal}
            onDelete={vm.deleteLastDigit}
            onConfirm={handleSave}
          />

          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={!vm.isValid}
            className={`w-full py-3.5 text-[16px] font-semibold rounded-btn text-white transition-all
              ${vm.isValid ? (isExpense ? 'bg-expense' : 'bg-income') + ' active:scale-98' : 'bg-gray-300 cursor-not-allowed'}
            `}
          >
            记录
          </button>
        </div>
      </div>
    </div>
  );
}
