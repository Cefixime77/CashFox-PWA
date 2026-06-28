// ============================================
// CashFox PWA — Dexie.js 数据库
// 对应 Swift 版本的 DataService
// ============================================
import Dexie, { type Table } from 'dexie';
import type { ExpenseRecord, Category, Tag, Budget, SavingsGoal, UserPreference } from './models';
import { PRESET_EXPENSE_CATEGORIES, PRESET_INCOME_CATEGORIES } from './models';
import { generateId } from '../utils/format';

export class CashFoxDatabase extends Dexie {
  expenseRecords!: Table<ExpenseRecord, string>;
  categories!: Table<Category, string>;
  tags!: Table<Tag, string>;
  budgets!: Table<Budget, string>;
  savingsGoals!: Table<SavingsGoal, string>;
  userPreferences!: Table<UserPreference, string>;

  constructor() {
    super('CashFoxDB');
    this.version(1).stores({
      expenseRecords: 'id, type, date, categoryId, amount, createdAt',
      categories: 'id, type, sortOrder',
      tags: 'id',
      budgets: 'id, period, startDate',
      savingsGoals: 'id, createdAt',
      userPreferences: 'id'
    });
  }
}

// 单例
export const db = new CashFoxDatabase();

// ============================================
// 初始化数据库 & 预设数据
// ============================================

let initialized = false;

export async function initDatabase(): Promise<void> {
  if (initialized) return;

  // 初始化用户偏好
  const pref = await db.userPreferences.get('singleton');
  if (!pref) {
    await db.userPreferences.put({
      id: 'singleton',
      currencyCode: 'CNY',
      foxName: '小财',
      colorTheme: 'default',
      biometricLock: false,
      firstDayOfMonth: 1,
      darkMode: 'system',
      hasCompletedOnboarding: false,
    });
  }

  // 初始化预设分类（仅首次）
  const catCount = await db.categories.count();
  if (catCount === 0) {
    const now = new Date();
    const expenseCats: Category[] = PRESET_EXPENSE_CATEGORIES.map((c, i) => ({
      ...c,
      id: `preset-exp-${i}`,
      createdAt: now,
    }));
    const incomeCats: Category[] = PRESET_INCOME_CATEGORIES.map((c, i) => ({
      ...c,
      id: `preset-inc-${i}`,
      createdAt: now,
    }));
    await db.categories.bulkAdd([...expenseCats, ...incomeCats]);
  }

  initialized = true;
  console.log('[CashFox DB] Database initialized successfully');
}

// ============================================
// 辅助查询函数
// ============================================

/** 获取用户偏好（确保存在） */
export async function getUserPreference(): Promise<UserPreference> {
  const pref = await db.userPreferences.get('singleton');
  if (pref) return pref;
  const newPref: UserPreference = {
    id: 'singleton',
    currencyCode: 'CNY',
    foxName: '小财',
    colorTheme: 'default',
    biometricLock: false,
    firstDayOfMonth: 1,
    darkMode: 'system',
    hasCompletedOnboarding: false,
  };
  await db.userPreferences.put(newPref);
  return newPref;
}

/** 按类型获取分类 */
export async function getCategoriesByType(type?: 'expense' | 'income'): Promise<Category[]> {
  const all = await db.categories.orderBy('sortOrder').toArray();
  return type ? all.filter(c => c.type === type) : all;
}

/** 按日期范围获取记录 */
export async function getRecordsInRange(startDate: Date, endDate: Date): Promise<ExpenseRecord[]> {
  return db.expenseRecords
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('date');
}
