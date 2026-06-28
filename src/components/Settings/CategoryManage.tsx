// ============================================
// 分类管理 — 对应 Swift CategoryManageView
// ============================================
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { Category, ExpenseType } from '../../db/models';
import { CategoryIcon } from '../Common/CategoryIcon';
import { generateId } from '../../utils/format';
import { getCategoryColor } from '../../design/colors';
import { useAppContext } from '../../contexts/AppContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const ICONS = ['UtensilsCrossed','Car','ShoppingBag','Gamepad2','Home','Phone','Heart','BookOpen',
  'ShoppingBasket','Gift','Star','Plane','Bus','ShoppingCart','Coffee','Film','Music','Camera','PawPrint'];

interface Props { onBack: () => void; }

export function CategoryManage({ onBack }: Props) {
  const { refreshData } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<ExpenseType>('expense');

  const categories = useLiveQuery(() => db.categories.orderBy('sortOrder').toArray(), []) ?? [];
  const expenseCats = categories.filter(c => c.type === 'expense');
  const incomeCats = categories.filter(c => c.type === 'income');

  const handleDelete = async (id: string) => {
    const cat = await db.categories.get(id);
    if (!cat?.isPreset) {
      await db.categories.delete(id);
      refreshData();
    }
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-safe px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft size={24} className="text-text-primary" /></button>
        <h1 className="text-[28px] font-bold text-text-primary flex-1">分类管理</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24">
        {/* 支出分类 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-semibold text-text-primary">支出分类</h3>
            <button onClick={() => { setAddType('expense'); setShowAdd(true); }}
              className="text-primary"><Plus size={20} /></button>
          </div>
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            {expenseCats.map(cat => (
              <CatRow key={cat.id} cat={cat} onDelete={() => handleDelete(cat.id)} />
            ))}
          </div>
        </div>

        {/* 收入分类 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-semibold text-text-primary">收入分类</h3>
            <button onClick={() => { setAddType('income'); setShowAdd(true); }}
              className="text-income"><Plus size={20} /></button>
          </div>
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            {incomeCats.map(cat => (
              <CatRow key={cat.id} cat={cat} onDelete={() => handleDelete(cat.id)} />
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <AddCategorySheet type={addType} onClose={() => setShowAdd(false)} onAdded={() => { setShowAdd(false); refreshData(); }} />
      )}
    </div>
  );
}

function CatRow({ cat, onDelete }: { cat: Category; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
      <CategoryIcon icon={cat.icon} color={cat.colorHex} size={36} />
      <span className="flex-1 text-[16px] text-text-primary">{cat.name}</span>
      {cat.isPreset && <span className="text-[10px] text-text-tertiary bg-gray-100 px-1.5 py-0.5 rounded">预设</span>}
      {!cat.isPreset && (
        <button onClick={onDelete}><Trash2 size={16} className="text-text-tertiary hover:text-expense" /></button>
      )}
    </div>
  );
}

function AddCategorySheet({ type, onClose, onAdded }: { type: ExpenseType; onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [colorIdx, setColorIdx] = useState(0);

  const handleAdd = async () => {
    if (!name) return;
    await db.categories.add({
      id: generateId(), name, icon, colorHex: getCategoryColor(colorIdx),
      type, sortOrder: 99, isPreset: false, createdAt: new Date()
    });
    onAdded();
  };

  const bgColor = type === 'expense' ? 'bg-white' : 'bg-green-50';

  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in-up" onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${bgColor} rounded-t-[24px] max-h-[90vh] overflow-y-auto animate-slide-up`}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button onClick={onClose} className="text-text-secondary">取消</button>
          <h2 className="text-[20px] font-semibold">{type === 'expense' ? '添加支出分类' : '添加收入分类'}</h2>
          <button onClick={handleAdd} disabled={!name} className={`font-semibold ${name ? 'text-primary' : 'text-text-tertiary'}`}>添加</button>
        </div>
        <div className="px-5 pb-8 flex flex-col gap-4">
          <input type="text" placeholder="分类名称" value={name} onChange={e => setName(e.target.value)} autoFocus
            className="w-full px-4 py-3 bg-white rounded-btn text-[16px] outline-none shadow-card" />
          <div className="grid grid-cols-5 gap-3">
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`p-3 rounded-full ${icon === ic ? 'bg-primary-light/40' : ''} active:scale-90 transition-transform`}>
                <CategoryIcon icon={ic} color={getCategoryColor(colorIdx)} size={32} />
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-3">
            {Array.from({length: 11}, (_, i) => (
              <button key={i} onClick={() => setColorIdx(i)}
                className="w-10 h-10 rounded-full shadow-sm"
                style={{ backgroundColor: getCategoryColor(i), border: colorIdx === i ? '3px solid white' : 'none' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
