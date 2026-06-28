// ============================================
// 狐狸情绪状态机 — 对应 Swift FoxStateMachine
// ============================================
import { useState, useCallback, useMemo } from 'react';
import type { FoxExpression, ExpenseRecord, Budget } from '../db/models';
import { isLateNight, startOfDay, toDateKey } from '../utils/date';

interface FoxContext {
  justRecorded: boolean;
  recordAmount: number;
  isLateNight: boolean;
  todayExpense: number;
  todayRecordCount: number;
  consecutiveDays: number;
  monthlyBudgetPercent: number;
  monthlyBudgetRemaining: number;
  savingsGoalCompleted: boolean;
  daysSinceLastRecord: number;
  recordIsLarge: boolean;
}

const FOX_MESSAGES: Record<FoxExpression, string[]> = {
  idle: ['今天也要好好记账哦~', '小财在这里等你哦~', '记得要收支平衡呀！', '每日一记，财富自由！'],
  happy: ['记录成功！继续保持！', '又记一笔，你真棒！', '记账小能手！', '今天的你也好认真~'],
  sad: ['这个月预算紧张了...', '好久不见，快来记一笔吧~'],
  surprised: [],
  warning: ['今天花得有点多呢...', '这个月预算超标了哦！要注意啦'],
  proud: [],
  sleeping: ['这么晚了还记账，辛苦啦~'],
  eating: ['吃好喝好，也要记好账哦！'],
  celebrate: ['太棒了！目标达成！🎉'],
};

/** 根据上下文确定狐狸表情 */
function determineExpression(ctx: FoxContext): FoxExpression {
  if (ctx.savingsGoalCompleted) return 'celebrate';
  if (ctx.justRecorded && ctx.recordIsLarge) return 'surprised';
  if (ctx.justRecorded) return 'happy';
  if (ctx.isLateNight) return 'sleeping';
  if (ctx.monthlyBudgetPercent >= 1.0) return 'warning';
  if (ctx.monthlyBudgetPercent >= 0.8) return 'sad';
  if (ctx.consecutiveDays >= 7) return 'proud';
  if (ctx.daysSinceLastRecord > 3) return 'sad';
  return 'idle';
}

function randomMessage(expr: FoxExpression, ctx: FoxContext): string {
  switch (expr) {
    case 'surprised': return `哇，${Math.floor(ctx.recordAmount)}元！这笔可不小！`;
    case 'proud': return `你已经连续记账${ctx.consecutiveDays}天啦！`;
    case 'sad':
      if (ctx.monthlyBudgetPercent >= 0.8) return `只剩${Math.floor(ctx.monthlyBudgetRemaining)}元预算了...`;
      return '好久不见，快来记一笔吧~';
    default:
      const msgs = FOX_MESSAGES[expr];
      return msgs[Math.floor(Math.random() * msgs.length)] ?? msgs[0];
  }
}

export function useFoxStateMachine() {
  const [expression, setExpression] = useState<FoxExpression>('idle');
  const [message, setMessage] = useState(FOX_MESSAGES.idle[0]);

  const evaluate = useCallback((ctx: Partial<FoxContext>) => {
    const fullCtx: FoxContext = {
      justRecorded: false, recordAmount: 0, isLateNight: isLateNight(),
      todayExpense: 0, todayRecordCount: 0, consecutiveDays: 0,
      monthlyBudgetPercent: 0, monthlyBudgetRemaining: 0,
      savingsGoalCompleted: false, daysSinceLastRecord: 0, recordIsLarge: false,
      ...ctx,
    };
    const expr = determineExpression(fullCtx);
    const msg = randomMessage(expr, fullCtx);
    setExpression(expr);
    setMessage(msg);
    console.log('[FoxState]', expr, msg);
  }, []);

  const resetToIdle = useCallback(() => {
    setExpression('idle');
    setMessage(FOX_MESSAGES.idle[0]);
  }, []);

  return { expression, message, evaluate, resetToIdle };
}
