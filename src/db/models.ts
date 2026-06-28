// ============================================
// CashFox PWA — 数据模型 (TypeScript 接口)
// 对应 Swift 版本的 SwiftData @Model 类
// ============================================

/** 收支类型 */
export type ExpenseType = 'expense' | 'income';

/** 预算周期 */
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

/** 重复周期 */
export type RecurringInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';

/** 暗色模式 */
export type AppDarkMode = 'system' | 'light' | 'dark';

/** 狐狸表情 */
export type FoxExpression = 'idle' | 'happy' | 'sad' | 'surprised' | 'warning'
  | 'proud' | 'sleeping' | 'eating' | 'celebrate';

/** 排序方式 */
export type SortOption = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc';

// ============================================
// 数据库实体接口
// ============================================

export interface Category {
  id: string;            // UUID
  name: string;
  icon: string;          // Lucide 图标名
  colorHex: string;
  type: ExpenseType;
  sortOrder: number;
  isPreset: boolean;
  parentId?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  colorHex: string;
  createdAt: Date;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  type: ExpenseType;
  title: string;
  note?: string;
  date: Date;
  categoryId?: string;
  tagIds: string[];
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  alertThreshold: number;  // 0.0~1.0
  categoryId?: string;     // undefined = 全部支出
  createdAt: Date;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  icon: string;
  colorHex: string;
  createdAt: Date;
}

export interface UserPreference {
  id: string;             // 固定为 'singleton'
  currencyCode: string;
  foxName: string;
  colorTheme: string;
  biometricLock: boolean;
  firstDayOfMonth: number;
  darkMode: AppDarkMode;
  hasCompletedOnboarding: boolean;
  lastRecordDate?: Date;
}

// ============================================
// 预设数据
// ============================================

export const PRESET_EXPENSE_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: '餐饮', icon: 'UtensilsCrossed', colorHex: '#FFB3BA', type: 'expense', sortOrder: 0, isPreset: true },
  { name: '交通', icon: 'Car', colorHex: '#FFD4A3', type: 'expense', sortOrder: 1, isPreset: true },
  { name: '购物', icon: 'ShoppingBag', colorHex: '#FFE9A3', type: 'expense', sortOrder: 2, isPreset: true },
  { name: '娱乐', icon: 'Gamepad2', colorHex: '#B9F5D8', type: 'expense', sortOrder: 3, isPreset: true },
  { name: '住房', icon: 'Home', colorHex: '#D4C5F0', type: 'expense', sortOrder: 4, isPreset: true },
  { name: '通讯', icon: 'Phone', colorHex: '#B4E7E8', type: 'expense', sortOrder: 5, isPreset: true },
  { name: '医疗', icon: 'Heart', colorHex: '#B4D4F0', type: 'expense', sortOrder: 6, isPreset: true },
  { name: '教育', icon: 'BookOpen', colorHex: '#E8D5C4', type: 'expense', sortOrder: 7, isPreset: true },
  { name: '日用', icon: 'ShoppingBasket', colorHex: '#D5D8DC', type: 'expense', sortOrder: 8, isPreset: true },
  { name: '人情', icon: 'Gift', colorHex: '#F0C4D8', type: 'expense', sortOrder: 9, isPreset: true },
  { name: '其他', icon: 'MoreHorizontal', colorHex: '#C4C9F0', type: 'expense', sortOrder: 10, isPreset: true },
];

export const PRESET_INCOME_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: '工资', icon: 'Banknote', colorHex: '#B9F5D8', type: 'income', sortOrder: 0, isPreset: true },
  { name: '奖金', icon: 'Star', colorHex: '#FFE9A3', type: 'income', sortOrder: 1, isPreset: true },
  { name: '投资', icon: 'TrendingUp', colorHex: '#B4E7E8', type: 'income', sortOrder: 2, isPreset: true },
  { name: '兼职', icon: 'Hammer', colorHex: '#FFD4A3', type: 'income', sortOrder: 3, isPreset: true },
  { name: '退款', icon: 'Undo2', colorHex: '#D4C5F0', type: 'income', sortOrder: 4, isPreset: true },
  { name: '其他', icon: 'MoreHorizontal', colorHex: '#C4C9F0', type: 'income', sortOrder: 5, isPreset: true },
];
