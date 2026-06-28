// ============================================
// 记录列表页面 — 对应 Swift RecordListView
// ============================================
import { useState } from 'react';
import { useRecordViewModel } from '../../hooks/useRecordViewModel';
import { useFoxStateMachine } from '../../hooks/useFoxStateMachine';
import { db, getCategoriesByType } from '../../db/database';
import type { Category } from '../../db/models';
import { RecordRow } from './RecordRow';
import { FAB } from '../Common/FAB';
import { EmptyState } from '../Common/EmptyState';
import { FoxMascot } from '../Fox/FoxMascot';
import { AddExpenseSheet } from './AddExpenseSheet';
import { ExpenseDetail } from './ExpenseDetail';
import { smartDateDisplay } from '../../utils/date';
import { Search, ArrowUpDown } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

export function RecordListView() {
  const vm = useRecordViewModel();
  const fox = useFoxStateMachine();
  const [showAdd, setShowAdd] = useState(false);
  const [detailId, setDetailId] = useState<string | undefined>();
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = useLiveQuery(() => getCategoriesByType(), []) ?? [];
  const catMap = new Map(categories.map((c: Category) => [c.id, c]));

  const handleSaved = () => {
    setShowAdd(false);
    fox.evaluate({ justRecorded: true, recordAmount: 0 });
  };

  const handleDelete = async (id: string) => {
    await vm.deleteRecord(id);
    fox.evaluate({});
  };

  const dayTotal = (records: typeof vm.filteredRecords) =>
    records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* 顶部栏 */}
      <div className="pt-safe px-5 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-[34px] font-bold text-text-primary">记录</h1>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-primary-light/30"
        >
          <Search size={22} className="text-primary-dark" />
        </button>
      </div>

      {/* 搜索栏 */}
      {searchOpen && (
        <div className="px-5 pb-3 animate-fade-in-up">
          <input
            type="text"
            placeholder="搜索记录..."
            value={vm.searchText}
            onChange={e => vm.setSearchText(e.target.value)}
            autoFocus
            className="w-full px-4 py-2.5 bg-card-bg rounded-btn text-[16px] border-0 outline-none shadow-card"
          />
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {vm.groupedByDate.length === 0 ? (
          <EmptyState
            icon="FileText"
            title="还没有记录"
            foxMessage="点击下方的 + 按钮，开始记第一笔吧！"
            actionTitle="记一笔"
            onAction={() => setShowAdd(true)}
          />
        ) : (
          <>
            {/* 狐狸 */}
            <div className="flex justify-end px-5 pt-2">
              <FoxMascot expression={fox.expression} size="small" message={fox.message} />
            </div>

            {/* 分组列表 */}
            {vm.groupedByDate.map(group => (
              <div key={group.date.toISOString().slice(0, 10)} className="mb-2">
                <div className="flex items-center justify-between px-5 py-2">
                  <span className="text-[13px] font-medium text-text-secondary">
                    {smartDateDisplay(group.date)}
                  </span>
                  {dayTotal(group.records) > 0 && (
                    <span className="text-[12px] text-expense">
                      支出 ¥{dayTotal(group.records).toFixed(2)}
                    </span>
                  )}
                </div>
                {group.records.map(r => (
                  <RecordRow
                    key={r.id}
                    record={r}
                    category={r._category}
                    onClick={() => setDetailId(r.id)}
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      <FAB onClick={() => setShowAdd(true)} />

      {/* 添加 Sheet */}
      {showAdd && <AddExpenseSheet onClose={() => setShowAdd(false)} onSaved={handleSaved} />}

      {/* 详情页 */}
      {detailId && (
        <ExpenseDetail
          recordId={detailId}
          onClose={() => setDetailId(undefined)}
          onDeleted={() => { handleDelete(detailId); setDetailId(undefined); }}
        />
      )}
    </div>
  );
}
