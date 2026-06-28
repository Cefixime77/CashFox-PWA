// ============================================
// 图表组件懒加载包装
// Recharts (~300KB) 单独拆分成独立 chunk
// 只有打开"统计"Tab 时才加载
// ============================================
import { lazy, Suspense, type ComponentProps } from 'react';
import type { PieChartView } from './PieChartView';
import type { BarChartView } from './BarChartView';
import type { HeatmapView } from './HeatmapView';

const PieChartLazy = lazy(() => import('./PieChartView'));
const BarChartLazy = lazy(() => import('./BarChartView'));
const HeatmapLazy = lazy(() => import('./HeatmapView'));

function ChartFallback() {
  return (
    <div className="bg-white rounded-card shadow-card p-4 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
      <div className="h-[200px] bg-gray-100 rounded" />
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
