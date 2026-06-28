// ============================================
// 预算 ViewModel — 对应 Swift BudgetViewModel
// ============================================
import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Budget, SavingsGoal } from '../db/models';
import { generateId } from '../utils/format';
import { useAppContext } from '../contexts/AppContext';

export function useBudgetViewModel() {
  const { dataVersion, refreshData } = useAppContext();

  const budgets = useLiveQuery(() => db.budgets.toArray(), [dataVersion]) ?? [];
  const savingsGoals = useLiveQuery(() => db.savingsGoals.toArray(), [dataVersion]) ?? [];
  const allRecords = useLiveQuery(() => db.expenseRecords.toArray(), [dataVersion]) ?? [];

  // 计算预算已用金额
  const spentForBudget = (budget: Budget): number => {
    const now = new Date();
    return allRecords
      .filter(r => {
        if (r.type !== 'expense') return false;
        if (r.date < budget.startDate || r.date > now) return false;
        if (budget.categoryId && r.categoryId !== budget.categoryId) return false;
        return true;
      })
      .reduce((s, r) => s + r.amount, 0);
  };

  const spentPercent = (budget: Budget): number => {
    if (budget.amount <= 0) return 0;
    return Math.min(spentForBudget(budget) / budget.amount, 1);
  };

  const remainingForBudget = (budget: Budget): number => {
    return Math.max(budget.amount - spentForBudget(budget), 0);
  };

  // 储蓄目标剩余天数
  const daysRemaining = (goal: SavingsGoal): number | undefined => {
    if (!goal.deadline) return undefined;
    const now = new Date();
    return Math.ceil((new Date(goal.deadline).getTime() - now.getTime()) / 86400000);
  };

  // CRUD
  const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    await db.budgets.add({ ...budget, id: generateId(), createdAt: new Date() });
    refreshData();
    console.log('[BudgetVM] Budget added');
  };

  const deleteBudget = async (id: string) => {
    await db.budgets.delete(id);
    refreshData();
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    await db.savingsGoals.add({ ...goal, id: generateId(), createdAt: new Date() });
    refreshData();
    console.log('[BudgetVM] Savings goal added');
  };

  const deleteSavingsGoal = async (id: string) => {
    await db.savingsGoals.delete(id);
    refreshData();
  };

  return {
    budgets,
    savingsGoals,
    spentForBudget,
    spentPercent,
    remainingForBudget,
    daysRemaining,
    addBudget,
    deleteBudget,
    addSavingsGoal,
    deleteSavingsGoal,
  };
}
