// ============================================
// 设置 ViewModel — 对应 Swift SettingsViewModel
// ============================================
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Category, Tag, ExpenseType } from '../db/models';
import { getCategoryColor } from '../design/colors';
import { generateId } from '../utils/format';
import { useAppContext } from '../contexts/AppContext';
import { recordsToCSV, downloadCSV } from '../utils/export';

export function useSettingsViewModel() {
  const { preference, updatePreference, refreshData } = useAppContext();

  const categories = useLiveQuery(() => db.categories.orderBy('sortOrder').toArray(), []) ?? [];
  const tags = useLiveQuery(() => db.tags.toArray(), []) ?? [];

  // 分类 CRUD
  const addCategory = async (name: string, icon: string, colorIndex: number, type: ExpenseType) => {
    const colorHex = getCategoryColor(colorIndex);
    const cat: Category = {
      id: generateId(),
      name, icon, colorHex, type,
      sortOrder: categories.length,
      isPreset: false,
      createdAt: new Date(),
    };
    await db.categories.add(cat);
    refreshData();
    console.log('[SettingsVM] Category added:', name);
  };

  const deleteCategory = async (id: string) => {
    const cat = await db.categories.get(id);
    if (!cat || cat.isPreset) return;
    await db.categories.delete(id);
    // 清除关联记录的分类
    const records = await db.expenseRecords.where('categoryId').equals(id).toArray();
    for (const r of records) {
      await db.expenseRecords.update(r.id, { categoryId: undefined });
    }
    refreshData();
  };

  const updateCategoryOrder = async (orderedCategories: Category[]) => {
    for (let i = 0; i < orderedCategories.length; i++) {
      await db.categories.update(orderedCategories[i].id, { sortOrder: i });
    }
    refreshData();
  };

  // 标签 CRUD
  const addTag = async (name: string, colorIndex: number) => {
    const colorHex = getCategoryColor(colorIndex);
    await db.tags.add({ id: generateId(), name, colorHex, createdAt: new Date() });
    refreshData();
  };

  const deleteTag = async (id: string) => {
    await db.tags.delete(id);
    refreshData();
  };

  // 导出
  const exportAllData = async () => {
    const records = await db.expenseRecords.orderBy('date').reverse().toArray();
    const cats = await db.categories.toArray();
    const csv = recordsToCSV(records, cats);
    downloadCSV(csv);
    console.log('[SettingsVM] CSV exported,', records.length, 'records');
  };

  // 重置
  const resetAllData = async () => {
    await db.expenseRecords.clear();
    await db.budgets.clear();
    await db.savingsGoals.clear();
    await db.tags.clear();
    // 清除自定义分类
    const customCats = await db.categories.filter(c => !c.isPreset).toArray();
    for (const c of customCats) await db.categories.delete(c.id);
    refreshData();
    console.log('[SettingsVM] All data reset');
  };

  return {
    preference,
    updatePreference,
    categories,
    tags,
    addCategory,
    deleteCategory,
    updateCategoryOrder,
    addTag,
    deleteTag,
    exportAllData,
    resetAllData,
  };
}
