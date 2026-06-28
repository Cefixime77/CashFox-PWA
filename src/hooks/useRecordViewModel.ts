// ============================================
// 记录 ViewModel — 对应 Swift RecordViewModel
// ============================================
import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { ExpenseRecord, Category, SortOption } from '../db/models';
import { useAppContext } from '../contexts/AppContext';

export function useRecordViewModel() {
  const { dataVersion } = useAppContext();
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState<SortOption>('dateDesc');

  // 使用 Dexie 的 live query 实现响应式数据
  const allRecords = useLiveQuery(
    async () => {
      const records = await db.expenseRecords.orderBy('date').reverse().toArray();
      // 关联分类
      const cats = await db.categories.toArray();
      const catMap = new Map(cats.map(c => [c.id, c]));
      return records.map(r => ({ ...r, _category: r.categoryId ? catMap.get(r.categoryId) : undefined }));
    },
    [dataVersion]
  ) as (ExpenseRecord & { _category?: Category })[] | undefined;

  // 筛选
  const filteredRecords = useCallback(() => {
    if (!allRecords) return [];
    let result = [...allRecords];

    if (searchText) {
      const q = searchText.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.note?.toLowerCase().includes(q) ?? false)
      );
    }
    if (selectedCategoryId) {
      result = result.filter(r => r.categoryId === selectedCategoryId);
    }
    // 排序
    switch (sortOption) {
      case 'dateDesc': result.sort((a, b) => b.date.getTime() - a.date.getTime()); break;
      case 'dateAsc': result.sort((a, b) => a.date.getTime() - b.date.getTime()); break;
      case 'amountDesc': result.sort((a, b) => b.amount - a.amount); break;
      case 'amountAsc': result.sort((a, b) => a.amount - b.amount); break;
    }
    return result;
  }, [allRecords, searchText, selectedCategoryId, sortOption]);

  // 按日期分组
  const groupedByDate = useCallback(() => {
    const records = filteredRecords();
    const groups = new Map<string, (ExpenseRecord & { _category?: Category })[]>();
    for (const r of records) {
      const key = r.date.toISOString().slice(0, 10);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }
    return Array.from(groups.entries()).map(([dateKey, items]) => ({
      date: new Date(dateKey),
      records: items,
    }));
  }, [filteredRecords]);

  // CRUD
  const deleteRecord = useCallback(async (id: string) => {
    await db.expenseRecords.delete(id);
    console.log('[RecordVM] Deleted:', id);
  }, []);

  return {
    allRecords,
    filteredRecords: filteredRecords(),
    groupedByDate: groupedByDate(),
    searchText, setSearchText,
    selectedCategoryId, setSelectedCategoryId,
    sortOption, setSortOption,
    deleteRecord,
  };
}
