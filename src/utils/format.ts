// ============================================
// 格式化工具函数
// ============================================

/** 生成唯一 ID */
export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** 金额格式化为 ¥1,234.56 */
export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/** 金额格式化为 +¥1,234.56 或 -¥1,234.56 */
export function formatSignedAmount(amount: number, type: 'expense' | 'income'): string {
  const sign = type === 'expense' ? '-' : '+';
  return `${sign}${formatCurrency(Math.abs(amount))}`;
}

/** 百分比格式化为 "65%" */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** 数值格式化为万/亿 */
export function formatLargeNumber(value: number): string {
  if (value >= 1_0000_0000) return `${(value / 1_0000_0000).toFixed(1)}亿`;
  if (value >= 1_0000) return `${(value / 1_0000).toFixed(1)}万`;
  return value.toLocaleString('zh-CN');
}
