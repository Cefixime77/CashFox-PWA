// ============================================
// 统计主页面 — 对应 Swift StatisticsView
// ============================================
import { useStatisticsViewModel, type StatisticsRange } from '../../hooks/useStatisticsViewModel';
import { useFoxStateMachine } from '../../hooks/useFoxStateMachine';
import { SummaryCards } from './SummaryCards';
import { LazyPieChart, LazyBarChart, LazyHeatmap } from './LazyCharts';
import { FoxMascot } from '../Fox/FoxMascot';

const RANGES: { key: StatisticsRange; label: string }[] = [
  { key: 'thisWeek', label: '本周' },
  { key: 'thisMonth', label: '本月' },
  { key: 'thisYear', label: '本年' },
];

export function StatisticsView() {
  const vm = useStatisticsViewModel();
  const fox = useFoxStateMachine();

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-safe px-5 pt-4 pb-2">
        <h1 className="text-[34px] font-bold text-text-primary">统计</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24">
        {/* 日期范围选择 */}
        <div className="flex gap-2 mb-4">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => vm.setSelectedRange(r.key)}
              className={`px-4 py-1.5 rounded-pill text-[13px] font-medium transition-all ${
                vm.selectedRange === r.key
                  ? 'bg-primary text-white'
                  : 'bg-[var(--cf-input)] text-text-secondary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* 狐狸 */}
        <div className="mb-3">
          <FoxMascot expression={fox.expression} size="medium" message={fox.message} />
        </div>

        {/* 汇总卡片 */}
        <SummaryCards {...vm.summary} />

        {/* 饼图 */}
        {vm.categoryBreakdown.length > 0 && (
          <div className="mt-4">
            <LazyPieChart breakdown={vm.categoryBreakdown} />
          </div>
        )}

        {/* 柱状图 */}
        {vm.dailyBreakdown.length > 0 && (
          <div className="mt-4">
            <LazyBarChart breakdown={vm.dailyBreakdown} />
          </div>
        )}

        {/* 热力图 */}
        {vm.heatmapData.length > 0 && (
          <div className="mt-4">
            <LazyHeatmap data={vm.heatmapData} />
          </div>
        )}
      </div>
    </div>
  );
}
