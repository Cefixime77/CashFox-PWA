// ============================================
// 引导页 — 对应 Swift OnboardingView
// ============================================
import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { FoxMascot } from '../Fox/FoxMascot';
import { ChevronRight } from 'lucide-react';

const PAGES = [
  {
    title: '欢迎来到小狐狸记账',
    desc: '我是你的记账管家小财~\n和你一起轻松管理每一笔支出',
    expression: 'idle' as const,
  },
  {
    title: '快速记录',
    desc: '轻点一下，几秒完成记账\n自定义键盘让输入快如闪电',
    expression: 'happy' as const,
  },
  {
    title: '聪明分析',
    desc: '图表清晰展示你的消费习惯\n预算提醒让你不再超支',
    expression: 'proud' as const,
  },
  {
    title: '准备好了吗？',
    desc: '给我取个名字，我们开始吧！',
    expression: 'celebrate' as const,
  },
];

export function OnboardingView() {
  const { completeOnboarding } = useAppContext();
  const [page, setPage] = useState(0);
  const [foxName, setFoxName] = useState('小财');

  const isLast = page === PAGES.length - 1;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-app-bg to-primary-light/20">
      {/* 页面指示器 */}
      <div className="flex justify-center gap-2 pt-safe pt-6 pb-2">
        {PAGES.map((_, i) => (
          <div key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'w-5 bg-primary' : 'w-2 bg-text-tertiary/30'}`} />
        ))}
      </div>

      {/* 页面内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <FoxMascot expression={PAGES[page].expression} size="large" showBubble={false} />

        <div className="text-center">
          <h2 className="text-[34px] font-bold text-text-primary mb-3">{PAGES[page].title}</h2>
          <p className="text-[16px] text-text-secondary leading-relaxed whitespace-pre-line">{PAGES[page].desc}</p>
        </div>

        {isLast && (
          <div className="w-full animate-scale-in">
            <p className="text-[14px] text-text-secondary text-center mb-2">给你的小狐狸取个名字吧</p>
            <input
              type="text"
              value={foxName}
              onChange={e => setFoxName(e.target.value)}
              className="w-full px-5 py-3 bg-white rounded-btn text-[20px] font-semibold text-center outline-none shadow-card"
              placeholder="小财"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="px-8 pb-safe pb-8 flex gap-3">
        {!isLast && (
          <>
            <button
              onClick={() => completeOnboarding(foxName, 'CNY')}
              className="flex-1 py-3 text-[16px] text-text-secondary active:text-text-primary transition-colors"
            >
              跳过
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              className="flex-1 py-3.5 bg-primary text-white text-[16px] font-semibold rounded-btn shadow-button active:scale-98 transition-transform flex items-center justify-center gap-1"
            >
              下一步 <ChevronRight size={18} />
            </button>
          </>
        )}
        {isLast && (
          <button
            onClick={() => completeOnboarding(foxName, 'CNY')}
            className="w-full py-3.5 bg-primary text-white text-[16px] font-semibold rounded-btn shadow-button active:scale-98 transition-transform"
          >
            开始记账 🦊
          </button>
        )}
      </div>
    </div>
  );
}
