// ============================================
// 关于页面
// ============================================
import { ArrowLeft } from 'lucide-react';
import { FoxMascot } from '../Fox/FoxMascot';

interface Props { onBack: () => void; }

export function AboutView({ onBack }: Props) {
  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-safe px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft size={24} className="text-text-primary" /></button>
        <h1 className="text-[28px] font-bold text-text-primary">关于</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 pb-24">
        <FoxMascot expression="proud" size="large" message="我是小财，你的记账管家~" />

        <div className="text-center">
          <h2 className="text-[28px] font-bold text-primary-dark">CashFox</h2>
          <p className="text-[18px] font-medium text-text-secondary mt-1">小狐狸记账</p>
          <p className="text-[13px] text-text-tertiary mt-1">版本 1.0.0 (PWA)</p>
        </div>

        <p className="text-[14px] text-text-secondary text-center leading-relaxed">
          简洁可爱的记账助手<br />
          让每一笔支出都变得轻松愉快<br />
          🦊 小财陪你一起理财
        </p>

        <div className="text-[12px] text-text-tertiary text-center mt-4">
          <p>零依赖苹果生态 · 纯 Web 技术构建</p>
          <p>React + TypeScript + Dexie.js + Recharts</p>
          <p className="mt-2">© 2026 CashFox</p>
        </div>
      </div>
    </div>
  );
}
