// ============================================
// 日历热力图 — 对应 Swift HeatmapView
// ============================================
import { useMemo } from 'react';
import { toDateKey, startOfWeek, daysAgo } from '../../utils/date';
import { formatCurrency } from '../../utils/format';

interface Props {
  data: { date: Date; count: number; total: number }[];
}

export function HeatmapView({ data }: Props) {
  const weeks = 20;  // 最近20周
  const endDate = new Date();
  const startDate = daysAgo(weeks * 7 - 1, startOfWeek(endDate));

  const { cells, weekdayLabels } = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of data) {
      map.set(toDateKey(d.date), d.total);
    }

    const result: { date: Date; amount: number }[] = [];
    let d = new Date(startDate);
    while (d <= endDate) {
      result.push({ date: new Date(d), amount: map.get(toDateKey(d)) ?? 0 });
      d.setDate(d.getDate() + 1);
    }

    return {
      cells: result,
      weekdayLabels: ['一', '二', '三', '四', '五', '六', '日'],
    };
  }, [data]);

  const maxAmount = Math.max(...cells.map(c => c.amount), 1);

  function heatColor(amount: number): string {
    if (amount === 0) return '#F3F4F6';
    const p = amount / maxAmount;
    if (p < 0.2) return '#A8D8EA4D';
    if (p < 0.4) return '#A8D8EA80';
    if (p < 0.6) return '#7EC8E3B3';
    if (p < 0.8) return '#4A90B8D9';
    return '#4A90B8';
  }

  if (cells.length === 0) return null;

  return (
    <div className="bg-card-bg rounded-card shadow-card p-4">
      <h3 className="text-[20px] font-semibold text-text-primary mb-3">支出热力图</h3>

      {/* 星期标签 */}
      <div className="grid grid-cols-7 gap-[2px] mb-1">
        {weekdayLabels.map((d, i) => (
          <div key={i} className="text-[9px] text-text-tertiary text-center">{d}</div>
        ))}
      </div>

      {/* 格子 */}
      <div className="grid grid-cols-7 gap-[2px]">
        {cells.map((cell, i) => (
          <div
            key={i}
            className="aspect-square rounded-[3px]"
            style={{ backgroundColor: heatColor(cell.amount) }}
            title={`${cell.date.toLocaleDateString('zh-CN')}: ${formatCurrency(cell.amount)}`}
          />
        ))}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-[11px] text-text-tertiary">少</span>
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((p, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: heatColor(maxAmount * p) }} />
        ))}
        <span className="text-[11px] text-text-tertiary">多</span>
      </div>
    </div>
  );
}
