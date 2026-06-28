// ============================================
// 自定义数字键盘 — 对应 Swift NumberPadView
// ============================================
import { Delete, Check } from 'lucide-react';

interface Props {
  amountString: string;
  onAppendDigit: (d: string) => void;
  onAppendDecimal: () => void;
  onDelete: () => void;
  onConfirm?: () => void;
}

export function NumberPad({ amountString, onAppendDigit, onAppendDecimal, onDelete, onConfirm }: Props) {
  const digit = (d: string) => (
    <button
      key={d}
      onClick={() => onAppendDigit(d)}
      className="h-14 bg-white text-text-primary text-[22px] font-semibold rounded active:bg-gray-100 transition-colors"
    >
      {d}
    </button>
  );

  const actionBtn = (content: React.ReactNode, color: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`h-14 ${color} text-white rounded active:opacity-80 transition-opacity flex items-center justify-center`}
    >
      {content}
    </button>
  );

  return (
    <div className="grid grid-cols-4 gap-1 p-1 bg-text-tertiary/20 rounded-btn">
      {/* Row 1 */}
      {['1','2','3'].map(digit)}
      <button onClick={onDelete}
        className="h-14 bg-gray-100 text-text-secondary rounded active:bg-gray-200 transition-colors flex items-center justify-center"
      >
        <Delete size={22} />
      </button>

      {/* Row 2 */}
      {['4','5','6'].map(digit)}
      {actionBtn(<Check size={22} strokeWidth={3} />, 'bg-primary', () => onConfirm?.())}

      {/* Row 3 */}
      {['7','8','9'].map(digit)}
      <button onClick={onAppendDecimal}
        disabled={amountString.includes('.')}
        className="h-14 bg-white text-text-primary text-[22px] font-semibold rounded active:bg-gray-100 disabled:opacity-30 transition-colors"
      >.</button>

      {/* Row 4 */}
      {digit('0')}
      <button onClick={() => onAppendDigit('00')}
        className="h-14 bg-white text-text-primary text-[18px] font-semibold rounded active:bg-gray-100 transition-colors"
      >00</button>
      <button onClick={() => onAppendDigit('')}
        className="h-14 bg-gray-100 text-text-secondary text-[18px] font-semibold rounded active:bg-gray-200 col-span-2 transition-colors"
      >清空</button>
    </div>
  );
}
