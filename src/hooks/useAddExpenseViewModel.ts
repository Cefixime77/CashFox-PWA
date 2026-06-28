// ============================================
// 添加记录 ViewModel — 对应 Swift AddExpenseViewModel
// ============================================
import { useState, useCallback } from 'react';
import { db } from '../db/database';
import type { ExpenseRecord, ExpenseType, RecurringInterval } from '../db/models';
import { generateId } from '../utils/format';
import { useAppContext } from '../contexts/AppContext';

export function useAddExpenseViewModel() {
  const { refreshData } = useAppContext();

  const [amountString, setAmountString] = useState('');
  const [selectedType, setSelectedType] = useState<ExpenseType>('expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>('monthly');
  const [amountError, setAmountError] = useState<string | null>(null);

  // 编辑模式
  const [editingId, setEditingId] = useState<string | undefined>();

  const amount = Number(amountString) || 0;
  const isValid = amount > 0 && !!selectedCategoryId;

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  // 数字键盘操作
  const appendDigit = useCallback((digit: string) => {
    setAmountString(prev => prev === '0' && digit !== '.' ? digit : prev + digit);
    setAmountError(null);
  }, []);

  const appendDecimal = useCallback(() => {
    setAmountString(prev => prev.includes('.') ? prev : (prev || '0') + '.');
  }, []);

  const deleteLastDigit = useCallback(() => {
    setAmountString(prev => prev.slice(0, -1));
    setAmountError(null);
  }, []);

  const selectQuickAmount = useCallback((value: number) => {
    setAmountString(String(Math.floor(value)));
  }, []);

  // 切换收支类型
  const toggleType = useCallback(() => {
    setSelectedType(prev => prev === 'expense' ? 'income' : 'expense');
    setSelectedCategoryId(undefined);
  }, []);

  // 保存
  const save = useCallback(async (): Promise<ExpenseRecord | null> => {
    if (!isValid) {
      setAmountError('请输入有效金额');
      return null;
    }

    const now = new Date();

    if (editingId) {
      // 编辑
      await db.expenseRecords.update(editingId, {
        amount,
        type: selectedType,
        title,
        note: note || undefined,
        date,
        categoryId: selectedCategoryId,
        isRecurring,
        recurringInterval: isRecurring ? recurringInterval : undefined,
        updatedAt: now,
      });
      const updated = await db.expenseRecords.get(editingId);
      console.log('[AddExpenseVM] Updated:', editingId);
      refreshData();

      // 更新最后记账日期
      const pref = await db.userPreferences.get('singleton');
      if (pref) await db.userPreferences.update('singleton', { lastRecordDate: now });

      return updated ?? null;
    } else {
      // 新建
      const record: ExpenseRecord = {
        id: generateId(),
        amount,
        type: selectedType,
        title,
        note: note || undefined,
        date,
        categoryId: selectedCategoryId,
        tagIds: [],
        isRecurring,
        recurringInterval: isRecurring ? recurringInterval : undefined,
        createdAt: now,
        updatedAt: now,
      };
      await db.expenseRecords.add(record);
      console.log('[AddExpenseVM] Created:', record.id);
      refreshData();

      const pref = await db.userPreferences.get('singleton');
      if (pref) await db.userPreferences.update('singleton', { lastRecordDate: now });

      return record;
    }
  }, [amount, selectedType, title, note, date, selectedCategoryId, isRecurring, recurringInterval, editingId, isValid, refreshData]);

  // 编辑模式
  const startEditing = useCallback((record: ExpenseRecord) => {
    setEditingId(record.id);
    setAmountString(String(record.amount));
    setSelectedType(record.type);
    setSelectedCategoryId(record.categoryId);
    setTitle(record.title);
    setNote(record.note ?? '');
    setDate(new Date(record.date));
    setIsRecurring(record.isRecurring);
    if (record.recurringInterval) setRecurringInterval(record.recurringInterval);
  }, []);

  // 重置
  const reset = useCallback(() => {
    setAmountString('');
    setSelectedType('expense');
    setSelectedCategoryId(undefined);
    setTitle('');
    setNote('');
    setDate(new Date());
    setIsRecurring(false);
    setRecurringInterval('monthly');
    setAmountError(null);
    setEditingId(undefined);
  }, []);

  return {
    amountString, setAmountString,
    selectedType, setSelectedType,
    selectedCategoryId, setSelectedCategoryId,
    title, setTitle,
    note, setNote,
    date, setDate,
    isRecurring, setIsRecurring,
    recurringInterval, setRecurringInterval,
    amountError,
    amount,
    isValid,
    editingId,
    quickAmounts,
    appendDigit, appendDecimal, deleteLastDigit,
    selectQuickAmount,
    toggleType,
    save,
    startEditing,
    reset,
  };
}
