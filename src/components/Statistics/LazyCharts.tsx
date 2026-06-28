// ============================================
// 图表组件懒加载包装
// Recharts (~300KB) 单独拆分成独立 chunk
// 只有打开"统计"Tab 时才加载
// ============================================
import { lazy, Suspense, type ComponentProps } from 'react';
import type { PieChartView } from './PieChartView';
import type { BarChartView } from './BarChartView';
import type { HeatmapView } from './HeatmapView';

const PieChartLazy = lazy(() => import('./PieChartView').then(m => ({ default: m.PieChartView })));
const BarChartLazy = lazy(() => import('./BarChartView').then(m => ({ default: m.BarChartView })));
const HeatmapLazy = lazy(() => import('./HeatmapView').then(m => ({ default: m.HeatmapView })));

function ChartFallback() {
  return (
    <div className="bg-card-bg rounded-card shadow-card p-4 animate-pulse">
      <div className="h-4 w-24 bg-[var(--cf-border)] rounded mb-3" />
      <div className="h-[200px] bg-[var(--cf-input)] rounded" />
    </div>
  );
}

export function LazyPieChart(props: ComponentProps<typeof PieChartView>) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <PieChartLazy {...props} />
    </Suspense>
  );
}

export function LazyBarChart(props: ComponentProps<typeof BarChartView>) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <BarChartLazy {...props} />
    </Suspense>
  );
}

export function LazyHeatmap(props: ComponentProps<typeof HeatmapView>) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <HeatmapLazy {...props} />
    </Suspense>
  );
}
