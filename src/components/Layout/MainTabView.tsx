// ============================================
// 主 Tab 导航 — 对应 Swift MainTabView
// ============================================
import { useState } from 'react';
import { RecordListView } from '../Record/RecordListView';
import { StatisticsView } from '../Statistics/StatisticsView';
import { BudgetView } from '../Budget/BudgetView';
import { SettingsView } from '../Settings/SettingsView';
import { CategoryManage } from '../Settings/CategoryManage';
import { TagManage } from '../Settings/TagManage';
import { AboutView } from './AboutView';
import { DollarSign, PieChart, Target, Settings } from 'lucide-react';

type Page = 'record' | 'statistics' | 'budget' | 'settings' | 'categories' | 'tags' | 'about';

const TABS: { key: Page; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { key: 'record', icon: DollarSign, label: '记录' },
  { key: 'statistics', icon: PieChart, label: '统计' },
  { key: 'budget', icon: Target, label: '预算' },
  { key: 'settings', icon: Settings, label: '设置' },
];

export function MainTabView() {
  const [activeTab, setActiveTab] = useState<Page>('record');
  const [subPage, setSubPage] = useState<Page | null>(null);

  // 分类/标签/关于等子页面
  if (subPage === 'categories') return <CategoryManage onBack={() => setSubPage(null)} />;
  if (subPage === 'tags') return <TagManage onBack={() => setSubPage(null)} />;
  if (subPage === 'about') return <AboutView onBack={() => setSubPage(null)} />;

  return (
    <div className="h-full flex flex-col">
      {/* 页面内容 */}
      <div className="flex-1 overflow-hidden" key={activeTab}>
        <div className="animate-fade-in-up h-full">
          {activeTab === 'record' && <RecordListView />}
          {activeTab === 'statistics' && <StatisticsView />}
          {activeTab === 'budget' && <BudgetView />}
          {activeTab === 'settings' && (
            <SettingsView onNavigate={(page) => setSubPage(page as Page)} />
          )}
        </div>
      </div>

      {/* TabBar */}
      <nav className="flex-shrink-0 bg-card-bg border-t pb-safe" style={{ borderColor: 'var(--cf-border)' }}>
        <div className="flex">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-tertiary'
                }`}
              >
                <Icon size={24} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
