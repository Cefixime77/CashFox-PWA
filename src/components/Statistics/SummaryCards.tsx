// ============================================
// 汇总卡片组 — 对应 Swift SummaryCardsView
// ============================================
import { formatCurrency } from '../../utils/format';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  totalExpense: number;
  totalIncome: number;
  balance: number;
  recordCount: number;
}

export function SummaryCards({ totalExpense, totalIncome, balance, recordCount }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* 结余主卡片 */}
      <div className="bg-card-bg rounded-card shadow-card p-5 text-center">
        <p className="text-[13px] text-text-secondary mb-1">结余</p>
        <p className={`text-[42px] font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* 三列小卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <MiniCard title="支出" value={formatCurrency(totalExpense)} color="text-expense" />
        <MiniCard title="收入" value={formatCurrency(totalIncome)} color="text-income" />
        <MiniCard title="笔数" value={`${recordCount}`} color="text-primary-dark" />
      </div>
    </div>
  );
}

function MiniCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-card-bg rounded-card shadow-card p-3 text-center">
      <p className="text-[13px] text-text-secondary mb-1">{title}</p>
      <p className={`text-[20px] font-semibold ${color}`}>{value}</p>
    </div>
  );
}
