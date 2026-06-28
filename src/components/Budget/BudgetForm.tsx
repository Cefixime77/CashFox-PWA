// ============================================
// 预算表单 + 储蓄目标表单 — 对应 Swift BudgetFormView
// ============================================
import { useState } from 'react';
import type { Category, BudgetPeriod } from '../../db/models';
import { NumberPad } from '../Record/NumberPad';
import { X } from 'lucide-react';

interface BudgetFormProps {
  categories: Category[];
  onSave: (data: { name: string; amount: number; period: BudgetPeriod; alertThreshold: number; categoryId?: string }) => void;
  onClose: () => void;
}

export function BudgetForm({ categories, onSave, onClose }: BudgetFormProps) {
  const [name, setName] = useState('');
  const [amountString, setAmountString] = useState('');
  const [period, setPeriod] = useState<BudgetPeriod>('monthly');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [alert, setAlert] = useState(0.8);

  const expenseCats = categories.filter(c => c.type === 'expense');
  const amount = Number(amountString) || 0;
  const isValid = amount > 0 && name.length > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave({ name, amount, period, alertThreshold: alert, categoryId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in-up" onClick={onClose}>
      <div className="absolute top-[8%] left-0 right-0 bottom-0 bg-app-bg rounded-t-[24px] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2 sticky top-0 z-10 bg-app-bg">
          <button onClick={onClose}><X size={24} className="text-text-secondary" /></button>
          <h2 className="text-[20px] font-semibold">新建预算</h2>
          <button onClick={handleSave} disabled={!isValid}
            className={`text-[16px] font-semibold ${isValid ? 'text-primary' : 'text-text-tertiary'}`}>
            保存
          </button>
        </div>
        <div className="px-5 pb-8 flex flex-col gap-4">
          <input type="text" placeholder="预算名称（如：每月生活费）" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 bg-card-bg rounded-btn text-[16px] outline-none shadow-card" />

          <div className="text-center py-2">
            <span className="text-text-secondary mr-1">¥</span>
            <span className="text-[42px] font-bold text-text-primary">{amountString || '0'}</span>
          </div>

          <div className="flex rounded-btn bg-[var(--cf-input)] p-0.5">
            {(['weekly', 'monthly', 'yearly'] as BudgetPeriod[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`flex-1 py-2 text-[14px] rounded-[10px] transition-all ${
                  period === p ? 'bg-primary text-white font-medium' : 'text-text-secondary'
                }`}>
                {{ weekly: '每周', monthly: '每月', yearly: '每年' }[p]}
              </button>
            ))}
          </div>

          <select value={categoryId ?? ''} onChange={e => setCategoryId(e.target.value || undefined)}
            className="w-full px-4 py-3 bg-card-bg rounded-btn text-[16px] outline-none shadow-card">
            <option value="">全部支出</option>
            {expenseCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div>
            <div className="flex justify-between text-[13px] text-text-secondary mb-1">
              <span>提醒阈值</span><span>{Math.round(alert * 100)}%</span>
            </div>
            <input type="range" min={0.5} max={1.0} step={0.1} value={alert}
              onChange={e => setAlert(Number(e.target.value))} className="w-full accent-primary" />
          </div>

          <NumberPad amountString={amountString}
            onAppendDigit={d => setAmountString(prev => prev === '0' && d !== '.' ? d : prev + d)}
            onAppendDecimal={() => setAmountString(prev => prev.includes('.') ? prev : (prev || '0') + '.')}
            onDelete={() => setAmountString(prev => prev.slice(0, -1))}
            onConfirm={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 储蓄目标表单
// ============================================
interface SavingsGoalFormProps {
  onSave: (data: { name: string; targetAmount: number; currentAmount: number; deadline?: Date; icon: string; colorHex: string }) => void;
  onClose: () => void;
}

export function SavingsGoalForm({ onSave, onClose }: SavingsGoalFormProps) {
  const [name, setName] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [currentStr, setCurrentStr] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 90); return d; });
  const [icon, setIcon] = useState('Star');

  const targetAmount = Number(targetStr) || 0;
  const isValid = targetAmount > 0 && name.length > 0;

  const icons = ['Star', 'Heart', 'Home', 'Car', 'Plane', 'Gift', 'GraduationCap', 'Gamepad2', 'Palmtree'];

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      name, targetAmount, currentAmount: Number(currentStr) || 0,
      deadline: hasDeadline ? deadline : undefined,
      icon, colorHex: '#FFD43B'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in-up" onClick={onClose}>
      <div className="absolute top-[8%] left-0 right-0 bottom-0 bg-app-bg rounded-t-[24px] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2 sticky top-0 z-10 bg-app-bg">
          <button onClick={onClose}><X size={24} className="text-text-secondary" /></button>
          <h2 className="text-[20px] font-semibold">新建储蓄目标</h2>
          <button onClick={handleSave} disabled={!isValid}
            className={`text-[16px] font-semibold ${isValid ? 'text-primary' : 'text-text-tertiary'}`}>
            保存
          </button>
        </div>
        <div className="px-5 pb-8 flex flex-col gap-4">
          <input type="text" placeholder="目标名称（如：旅行基金）" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 bg-card-bg rounded-btn text-[16px] outline-none shadow-card" />
          <input type="number" inputMode="decimal" placeholder="目标金额" value={targetStr} onChange={e => setTargetStr(e.target.value)}
            className="w-full px-4 py-3 bg-card-bg rounded-btn text-[16px] outline-none shadow-card" />
          <input type="number" inputMode="decimal" placeholder="当前已存（可选）" value={currentStr} onChange={e => setCurrentStr(e.target.value)}
            className="w-full px-4 py-3 bg-card-bg rounded-btn text-[16px] outline-none shadow-card" />

          <label className="flex items-center gap-3 px-4 py-3 bg-card-bg rounded-btn shadow-card">
            <span className="flex-1 text-[16px]">设置截止日期</span>
            <input type="checkbox" checked={hasDeadline} onChange={e => setHasDeadline(e.target.checked)} className="w-5 h-5 accent-primary" />
          </label>
          {hasDeadline && (
            <input type="date" value={deadline.toISOString().slice(0, 10)}
              onChange={e => setDeadline(new Date(e.target.value))}
              className="w-full px-4 py-3 bg-card-bg rounded-btn text-[16px] outline-none shadow-card" />
          )}

          <div className="grid grid-cols-5 gap-3">
            {icons.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`p-3 rounded-full ${icon === ic ? 'bg-primary-light/40' : ''} active:scale-90 transition-transform`}>
                <span className="text-xl">{ic === 'Star' ? '⭐' : ic === 'Heart' ? '❤️' : ic === 'Home' ? '🏠' : ic === 'Car' ? '🚗' : ic === 'Plane' ? '✈️' : ic === 'Gift' ? '🎁' : ic === 'GraduationCap' ? '🎓' : ic === 'Gamepad2' ? '🎮' : '🌴'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
