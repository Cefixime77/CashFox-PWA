// ============================================
// 日期工具函数 — 对应 Swift Date+Extensions
// ============================================

/** 当天开始 (00:00:00) */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 当天结束 (23:59:59) */
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** 当月第一天 */
export function startOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 当月最后一天 */
export function endOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** 本周第一天（周一） */
export function startOfWeek(date: Date = new Date()): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

/** 本周最后一天（周日） */
export function endOfWeek(date: Date = new Date()): Date {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return endOfDay(d);
}

/** N天前 */
export function daysAgo(n: number, from: Date = new Date()): Date {
  const d = startOfDay(from);
  d.setDate(d.getDate() - n);
  return d;
}

/** 是否是今天 */
export function isToday(date: Date): boolean {
  return startOfDay(date).getTime() === startOfDay().getTime();
}

/** 是否是昨天 */
export function isYesterday(date: Date): boolean {
  const yesterday = daysAgo(1);
  return startOfDay(date).getTime() === yesterday.getTime();
}

/** 是否深夜 (23:00-06:00) */
export function isLateNight(date: Date = new Date()): boolean {
  const h = date.getHours();
  return h >= 23 || h < 6;
}

/** 智能日期显示：今天 / 昨天 / 6月28日 */
export function smartDateDisplay(date: Date): string {
  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}月${d}日`;
}

/** 短日期: "06/28" */
export function shortDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}/${d}`;
}

/** 时间: "14:30" */
export function timeDisplay(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** 月份: "6月" */
export function monthDisplay(date: Date): string {
  return `${date.getMonth() + 1}月`;
}

/** 星期几 */
export function weekdayDisplay(date: Date): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `周${days[date.getDay()]}`;
}

/** 日期转 YYYY-MM-DD */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 两个日期之间的天数差 */
export function daysBetween(a: Date, b: Date): number {
  return Math.floor((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}
