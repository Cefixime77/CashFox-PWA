// ============================================
// 分类网格选择 — 对应 Swift CategoryGridView
// ============================================
import type { Category } from '../../db/models';
import { CategoryIcon } from '../Common/CategoryIcon';

interface Props {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function CategoryGrid({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1.5 min-w-[60px] transition-all duration-200
            ${selectedId === cat.id ? 'scale-105' : 'opacity-70'}`}
        >
          <CategoryIcon
            icon={cat.icon}
            color={cat.colorHex}
            size={48}
          />
          {selectedId === cat.id && (
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: cat.colorHex }} />
          )}
          <span className={`text-[11px] ${selectedId === cat.id ? 'font-medium' : ''}`}
            style={{ color: selectedId === cat.id ? cat.colorHex : '#7F8C8D' }}>
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
