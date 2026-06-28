// ============================================
// 分类饼图 — 对应 Swift PieChartView (使用 Recharts)
// ============================================
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Category } from '../../db/models';
import { CategoryIcon } from '../Common/CategoryIcon';
import { formatCurrency, formatPercent } from '../../utils/format';

interface Props {
  breakdown: { category: Category | null; amount: number; percent: number }[];
}

export function PieChartView({ breakdown }: Props) {
  const data = breakdown.map(item => ({
    name: item.category?.name ?? '未分类',
    value: item.amount,
    color: item.category?.colorHex ?? '#BDC3C7',
    icon: item.category?.icon ?? 'HelpCircle',
    percent: item.percent,
  }));

  return (
    <div className="bg-white rounded-card shadow-card p-4">
      <h3 className="text-[20px] font-semibold text-text-primary mb-3">支出分类</h3>

      {/* 饼图 */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 图例 */}
      <div className="flex flex-col gap-2 mt-2">
        {data.slice(0, 8).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <CategoryIcon icon={item.icon} color={item.color} size={24} />
            <span className="flex-1 text-[14px] text-text-primary">{item.name}</span>
            <span className="text-[14px] text-text-primary">{formatCurrency(item.value)}</span>
            <span className="text-[13px] text-text-secondary w-10 text-right">{formatPercent(item.percent)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
