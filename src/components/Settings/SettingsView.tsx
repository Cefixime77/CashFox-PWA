// ============================================
// 设置主页面 — 对应 Swift SettingsView
// ============================================
import { useState } from 'react';
import { useSettingsViewModel } from '../../hooks/useSettingsViewModel';
import { FoxMascot } from '../Fox/FoxMascot';
import { ChevronRight, Download, Trash2, Moon, Shield, Bell, Tag, Grid3X3 } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export function SettingsView({ onNavigate }: Props) {
  const vm = useSettingsViewModel();
  const [showResetAlert, setShowResetAlert] = useState(false);
  const pref = vm.preference;

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-safe px-5 pt-4 pb-2">
        <h1 className="text-[34px] font-bold text-text-primary">设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* 外观 */}
        <Section title="外观">
          <SelectRow icon={Moon} label="主题模式"
            value={pref?.darkMode === 'dark' ? '深色' : pref?.darkMode === 'light' ? '浅色' : '跟随系统'}
            onClick={() => {
              const modes = ['system', 'light', 'dark'] as const;
              const idx = modes.indexOf(pref?.darkMode ?? 'system');
              vm.updatePreference?.({ darkMode: modes[(idx + 1) % 3] });
            }} />
          <EditRow icon={Tag} label="狐狸名字" value={pref?.foxName ?? '小财'}
            onSave={name => vm.updatePreference?.({ foxName: name })} />
        </Section>

        {/* 数据管理 */}
        <Section title="数据管理">
          <NavRow icon={Grid3X3} label="分类管理" onClick={() => onNavigate('categories')} />
          <NavRow icon={Tag} label="标签管理" onClick={() => onNavigate('tags')} />
          <ActionRow icon={Download} label="导出数据 (CSV)" onClick={vm.exportAllData} />
        </Section>

        {/* 提醒 */}
        <Section title="提醒">
          <ToggleRow icon={Bell} label="每日记账提醒" checked={false} onChange={() => {}} />
          <ToggleRow icon={Bell} label="预算超支提醒" checked={true} onChange={() => {}} />
        </Section>

        {/* 安全 */}
        <Section title="安全">
          <ToggleRow icon={Shield} label="面容/指纹解锁" checked={pref?.biometricLock ?? false}
            onChange={() => vm.updatePreference?.({ biometricLock: !pref?.biometricLock })} />
        </Section>

        {/* 关于 */}
        <Section title="其他">
          <ActionRow icon={FoxMascotMin} label="关于小狐狸记账" onClick={() => onNavigate('about')} />
          <ActionRow icon={Trash2} label="重置所有数据" onClick={() => setShowResetAlert(true)} danger />
        </Section>
      </div>

      {showResetAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-fade-in-up">
          <div className="bg-white rounded-card p-6 mx-8 max-w-sm shadow-elevated">
            <h3 className="text-[18px] font-semibold mb-2">重置所有数据</h3>
            <p className="text-[14px] text-text-secondary mb-4">这将删除所有记录、预算和自定义分类。此操作不可恢复。</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetAlert(false)}
                className="flex-1 py-3 rounded-btn bg-gray-100 font-semibold">取消</button>
              <button onClick={() => { vm.resetAllData(); setShowResetAlert(false); }}
                className="flex-1 py-3 rounded-btn bg-expense text-white font-semibold">确认重置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// 子组件
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 px-5">
      <p className="text-[13px] font-medium text-text-secondary mb-2 ml-1">{title}</p>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function NavRow({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50">
      <Icon size={20} className="text-text-secondary" />
      <span className="flex-1 text-left text-[16px] text-text-primary">{label}</span>
      <ChevronRight size={18} className="text-text-tertiary" />
    </button>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50">
      <Icon size={20} className={danger ? 'text-expense' : 'text-text-secondary'} />
      <span className={`flex-1 text-left text-[16px] ${danger ? 'text-expense' : 'text-text-primary'}`}>{label}</span>
    </button>
  );
}

function SelectRow({ icon: Icon, label, value, onClick }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50">
      <Icon size={20} className="text-text-secondary" />
      <span className="flex-1 text-left text-[16px] text-text-primary">{label}</span>
      <span className="text-[14px] text-text-secondary">{value}</span>
      <ChevronRight size={18} className="text-text-tertiary" />
    </button>
  );
}

function EditRow({ icon: Icon, label, value, onSave }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; onSave: (val: string) => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
      <Icon size={20} className="text-text-secondary" />
      <span className="text-[16px] text-text-primary">{label}</span>
      <input type="text" defaultValue={value}
        onBlur={e => onSave(e.target.value)}
        className="flex-1 text-right text-[16px] text-text-secondary bg-transparent outline-none" />
    </div>
  );
}

function ToggleRow({ icon: Icon, label, checked, onChange }: { icon: React.ComponentType<{ size?: number }>; label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
      <Icon size={20} className="text-text-secondary" />
      <span className="flex-1 text-[16px] text-text-primary">{label}</span>
      <button onClick={onChange}
        className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function FoxMascotMin() { return <span className="text-lg">🦊</span>; }
