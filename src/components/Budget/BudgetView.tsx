// ============================================
// 预算主页面 — 对应 Swift BudgetView
// ============================================
import { useState } from 'react';
import { useBudgetViewModel } from '../../hooks/useBudgetViewModel';
import { useFoxStateMachine } from '../../hooks/useFoxStateMachine';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { Category } from '../../db/models';
import { BudgetCard } from './BudgetCard';
import { SavingsCard } from './SavingsCard';
import { BudgetForm } from './BudgetForm';
import { SavingsGoalForm } from './BudgetForm';
import { EmptyState } from '../Common/EmptyState';
import { FoxMascot } from '../Fox/FoxMascot';
import { Plus } from 'lucide-react';

export function BudgetView() {
  const [tab, setTab] = useState<'budgets' | 'goals'>('budgets');
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const vm = useBudgetViewModel();
  const fox = useFoxStateMachine();
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-safe px-5 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-[34px] font-bold text-text-primary">预算</h1>
        <button
          onClick={() => tab === 'budgets' ? setShowAddBudget(true) : setShowAddGoal(true)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <Plus size={24} className="text-primary" />
        </button>
      </div>

      {/* 分段控制器 */}
      <div className="px-5 pb-3">
        <div className="flex rounded-btn bg-[var(--cf-input)] p-0.5">
          {(['budgets', 'goals'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-[16px] font-semibold rounded-[10px] transition-all ${
                tab === t ? 'bg-card-bg text-text-primary shadow-sm' : 'text-text-secondary'
              }`}
            >
              {{ budgets: '预算', goals: '储蓄目标' }[t]}
            </button>
          ))}
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24">
        <div className="mb-3">
          <FoxMascot expression={fox.expression} size="medium" message={fox.message} />
        </div>

        {tab === 'budgets' && vm.budgets.length === 0 && (
          <EmptyState icon="Target" title="还没有预算" foxMessage="设置月度预算，帮你控制支出！"
            actionTitle="添加预算" onAction={() => setShowAddBudget(true)} />
        )}
        {tab === 'budgets' && vm.budgets.map(b => (
          <BudgetCard key={b.id} budget={b}
            spent={vm.spentForBudget(b)} percent={vm.spentPercent(b)}
            onDelete={() => vm.deleteBudget(b.id)} category={
              b.categoryId ? categories.find(c => c.id === b.categoryId) : undefined
            }
          />
        ))}

        {tab === 'goals' && vm.savingsGoals.length === 0 && (
          <EmptyState icon="Goal" title="还没有储蓄目标" foxMessage="设定一个储蓄目标，小狐狸陪你一起实现！"
            actionTitle="添加目标" onAction={() => setShowAddGoal(true)} />
        )}
        {tab === 'goals' && vm.savingsGoals.map(g => (
          <SavingsCard key={g.id} goal={g} daysRemaining={vm.daysRemaining(g)}
            onDelete={() => vm.deleteSavingsGoal(g.id)} />
        ))}
      </div>

      {showAddBudget && (
        <BudgetForm categories={categories} onSave={vm.addBudget} onClose={() => setShowAddBudget(false)} />
      )}
      {showAddGoal && (
        <SavingsGoalForm onSave={vm.addSavingsGoal} onClose={() => setShowAddGoal(false)} />
      )}
    </div>
  );
}
