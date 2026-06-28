// ============================================
// 每日柱状图 — 对应 Swift BarChartView
// ============================================
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { shortDate } from '../../utils/date';
import { formatCurrency } from '../../utils/format';

interface Props {
  breakdown: { date: Date; amount: number }[];
}

export function BarChartView({ breakdown }: Props) {
  const data = breakdown.map(item => ({
    date: shortDate(new Date(item.date)),
    amount: item.amount,
  }));

  if (data.every(d => d.amount === 0)) {
    return (
      <div className="bg-card-bg rounded-card shadow-card p-4">
        <h3 className="text-[20px] font-semibold text-text-primary mb-3">每日支出</h3>
        <p className="text-text-tertiary text-center py-10">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-card shadow-card p-4">
      <h3 className="text-[20px] font-semibold text-text-primary mb-3">每日支出</h3>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#BDC3C7' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#BDC3C7' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '支出']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 13 }}
            />
            <Bar dataKey="amount" fill="#7EC8E3" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
