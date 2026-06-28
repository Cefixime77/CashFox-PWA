// ============================================
// 标签管理 — 对应 Swift TagManageView
// ============================================
import { useState } from 'react';
import { useSettingsViewModel } from '../../hooks/useSettingsViewModel';
import { getCategoryColor } from '../../design/colors';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface Props { onBack: () => void; }

export function TagManage({ onBack }: Props) {
  const { tags, addTag, deleteTag } = useSettingsViewModel();
  const [newName, setNewName] = useState('');
  const [colorIdx, setColorIdx] = useState(0);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTag(newName.trim(), colorIdx);
    setNewName('');
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-safe px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft size={24} className="text-text-primary" /></button>
        <h1 className="text-[28px] font-bold text-text-primary flex-1">标签管理</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24">
        {tags.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[40px] mb-3">🏷️</p>
            <p className="text-[16px] text-text-secondary">还没有标签</p>
          </div>
        ) : (
          <div className="bg-card-bg rounded-card shadow-card overflow-hidden mb-4">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--cf-border)] last:border-0">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.colorHex }} />
                <span className="flex-1 text-[16px] text-text-primary">{tag.name}</span>
                <button onClick={() => deleteTag(tag.id)}><Trash2 size={16} className="text-text-tertiary" /></button>
              </div>
            ))}
          </div>
        )}

        {/* 添加标签 */}
        <div className="bg-card-bg rounded-card shadow-card p-4">
          <div className="flex gap-2 mb-3">
            <input type="text" placeholder="新标签名称" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-3 bg-[var(--cf-border)] rounded-btn text-[16px] outline-none" />
            <button onClick={handleAdd} disabled={!newName.trim()}
              className="px-5 py-3 bg-primary text-white rounded-btn font-semibold disabled:opacity-50 active:scale-95 transition-transform">
              添加
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({length: 11}, (_, i) => (
              <button key={i} onClick={() => setColorIdx(i)}
                className="w-7 h-7 rounded-full"
                style={{ backgroundColor: getCategoryColor(i), border: colorIdx === i ? '3px solid #4A90B8' : 'none' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
