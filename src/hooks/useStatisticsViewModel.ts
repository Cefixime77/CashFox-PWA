// ============================================
// 统计 ViewModel — 对应 Swift StatisticsViewModel
// ============================================
import { useState, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getRecordsInRange } from '../db/database';
import type { ExpenseRecord, Category } from '../db/models';
import { startOfDay, endOfDay, startOfWeek, startOfMonth, toDateKey } from '../utils/date';
import { useAppContext } from '../contexts/AppContext';

export type StatisticsRange = 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom';

export function useStatisticsViewModel() {
  const { dataVersion } = useAppContext();
  const [selectedRange, setSelectedRange] = useState<StatisticsRange>('thisMonth');

  const now = new Date();

  const dateRange = useMemo(() => {
    switch (selectedRange) {
      case 'thisWeek': return { start: startOfWeek(now), end: endOfDay(now) };
      case 'thisMonth': return { start: startOfMonth(now), end: endOfDay(now) };
      case 'thisYear': return { start: new Date(now.getFullYear(), 0, 1), end: endOfDay(now) };
      case 'custom': return { start: startOfMonth(now), end: endOfDay(now) };
    }
  }, [selectedRange]);

  const records = useLiveQuery(
    () => getRecordsInRange(dateRange.start, dateRange.end),
    [dataVersion, dateRange.start.getTime(), dateRange.end.getTime()]
  );

  const categories = useLiveQuery(() => db.categories.toArray(), [dataVersion]);

  const catMap = useMemo(() => {
    if (!categories) return new Map<string, Category>();
    return new Map(categories.map(c => [c.id, c]));
  }, [categories]);

  // 汇总
  const summary = useMemo(() => {
    if (!records) return { totalExpense: 0, totalIncome: 0, recordCount: 0, balance: 0 };
    const totalExpense = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    return {
      totalExpense,
      totalIncome,
      recordCount: records.length,
      balance: totalIncome - totalExpense,
    };
  }, [records]);

  // 分类明细
  const categoryBreakdown = useMemo(() => {
    if (!records) return [];
    const expenseRecords = records.filter(r => r.type === 'expense');
    const totalExpense = expenseRecords.reduce((s, r) => s + r.amount, 0);
    const grouped = new Map<string, number>();
    for (const r of expenseRecords) {
      if (!r.categoryId) continue;
      grouped.set(r.categoryId, (grouped.get(r.categoryId) ?? 0) + r.amount);
    }
    return Array.from(grouped.entries())
      .map(([catId, amount]) => ({
        category: catMap.get(catId) ?? null,
        amount,
        percent: totalExpense > 0 ? amount / totalExpense : 0,
      }))
      .filter(item => item.category)
      .sort((a, b) => b.amount - a.amount);
  }, [records, catMap]);

  // 每日明细
  const dailyBreakdown = useMemo(() => {
    if (!records) return [];
    const grouped = new Map<string, number>();
    for (const r of records) {
      if (r.type !== 'expense') continue;
      const key = toDateKey(r.date);
      grouped.set(key, (grouped.get(key) ?? 0) + r.amount);
    }
    // 补全范围内的所有日期
    const result: { date: Date; amount: number }[] = [];
    let d = new Date(dateRange.start);
    while (d <= dateRange.end) {
      const key = toDateKey(d);
      result.push({ date: new Date(d), amount: grouped.get(key) ?? 0 });
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [records, dateRange]);

  // 热力图数据
  const heatmapData = useMemo(() => {
    if (!records) return [];
    const grouped = new Map<string, { count: number; total: number }>();
    for (const r of records) {
      if (r.type !== 'expense') continue;
      const key = toDateKey(r.date);
      const prev = grouped.get(key) ?? { count: 0, total: 0 };
      grouped.set(key, { count: prev.count + 1, total: prev.total + r.amount });
    }
    return Array.from(grouped.entries())
      .map(([dateKey, data]) => ({ date: new Date(dateKey), ...data }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [records]);

  return {
    selectedRange, setSelectedRange,
    summary,
    categoryBreakdown,
    dailyBreakdown,
    heatmapData,
    records,
  };
}
