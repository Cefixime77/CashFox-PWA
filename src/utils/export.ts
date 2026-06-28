// ============================================
// CSV 导出服务 — 对应 Swift ExportService
// ============================================
import type { ExpenseRecord, Category } from '../db/models';

/** 将记录导出为 CSV 字符串 */
export function recordsToCSV(records: ExpenseRecord[], categories: Category[]): string {
  const catMap = new Map(categories.map(c => [c.id, c.name]));

  let csv = 'date,type,category,amount,title,note,tags\n';

  for (const r of records) {
    const dateStr = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}-${String(r.date.getDate()).padStart(2, '0')} ${timeStr(r.date)}`;
    const typeStr = r.type === 'expense' ? '支出' : '收入';
    const catStr = r.categoryId ? (catMap.get(r.categoryId) ?? '') : '';
    const amountStr = r.amount.toFixed(2);
    const titleStr = `"${r.title}"`;
    const noteStr = `"${r.note ?? ''}"`;
    const tagsStr = r.tagIds.join('、');  // 简化版：标签 ID 列表

    csv += `${dateStr},${typeStr},${catStr},${amountStr},${titleStr},${noteStr},${tagsStr}\n`;
  }

  return csv;
}

function timeStr(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** 触发 CSV 下载 */
export function downloadCSV(csv: string, filename?: string): void {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });  // BOM for Excel
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `CashFox_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
