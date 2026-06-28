# CashFox PWA — 构建日志

> 从 SwiftUI 迁移到 React PWA 的完整记录
> 开始时间: 2026-06-28 | 完成时间: 2026-06-28

## 环境信息
- Node.js: v24.16.0 | npm: 11.13.0
- 构建工具: Vite 9.1 (rolldown)
- 框架: React 19 + TypeScript 5.x
- UI: TailwindCSS v4 + Lucide React + Recharts
- 数据库: Dexie.js (IndexedDB) + dexie-react-hooks
- PWA: vite-plugin-pwa + Workbox

## 步骤记录

### Step 1: 脚手架搭建 ✅
- `npm create vite@latest CashFox-PWA -- --template react-ts`
- 依赖: dexie, dexie-react-hooks, recharts, lucide-react, react-router-dom
- 开发依赖: tailwindcss, @tailwindcss/vite, vite-plugin-pwa
- vite.config.ts: PWA + TailwindCSS 插件配置
- src/index.css: @theme 设计系统 (21色 + 阴影 + 动画)

### Step 2: 数据层 ✅
- db/models.ts: 7个实体接口 + 预设分类数据
- db/database.ts: Dexie.js 初始化 + 预设数据迁移 + 辅助查询

### Step 3: 设计系统 + 工具函数 ✅
- design/colors.ts: 11种分类色 + 明暗判断
- design/typography.ts: 字体常量
- utils/format.ts: 货币/百分比/ID 格式化
- utils/date.ts: 18个日期工具函数
- utils/export.ts: CSV 导出 + 下载

### Step 4: Context + React Hooks ✅
- contexts/AppContext.tsx: 全局应用上下文 (状态 + 数据版本 + 引导)
- hooks/useRecordViewModel.ts: 记录 CRUD + 筛选 + 分组
- hooks/useAddExpenseViewModel.ts: 表单状态 + 数字键盘逻辑 + 保存
- hooks/useStatisticsViewModel.ts: 数据聚合 + 图表数据
- hooks/useBudgetViewModel.ts: 预算/储蓄 CRUD + 进度计算
- hooks/useFoxStateMachine.ts: 9种表情 + 情绪规则引擎
- hooks/useSettingsViewModel.ts: 偏好/分类/标签/导出/重置

### Step 5: 通用组件 ✅
- Fox/FoxMascot.tsx: 狐狸看板娘 (Emoji 占位 → 可替换为设计师素材)
- Fox/FoxSpeechBubble.tsx: 对话气泡 + 三角指针
- Common/CategoryIcon.tsx: 动态 Lucide 图标 + 圆形背景
- Common/FAB.tsx: 悬浮操作按钮 (渐变色 + 安全区域)
- Common/EmptyState.tsx: 空状态 (狐狸 + 图标 + 标题 + 按钮)
- Common/ProgressRing.tsx: SVG 进度环

### Step 6: Record 模块 ✅
- Record/RecordListView.tsx: 搜索 + 分组列表 + FAB + 狐狸
- Record/RecordRow.tsx: 图标 + 金额 + 分类标签 + 备注
- Record/AddExpenseSheet.tsx: 收支切换 + 金额 + 分类网格 + 键盘 + 日期
- Record/NumberPad.tsx: 4x4 自定义数字键盘 (0-9 + 小数点 + 删除 + 确认)
- Record/CategoryGrid.tsx: 横向滚动分类选择
- Record/ExpenseDetail.tsx: 详情卡片 + 删除 + 编辑入口

### Step 7: Statistics 模块 ✅
- Statistics/StatisticsView.tsx: 日期范围 + 狐狸 + 全部图表
- Statistics/SummaryCards.tsx: 结余大卡片 + 支出/收入/笔数
- Statistics/PieChartView.tsx: Recharts 环形饼图 + 图例
- Statistics/BarChartView.tsx: Recharts 柱状图
- Statistics/HeatmapView.tsx: 20周日历热力图 + 图例

### Step 8: Budget 模块 ✅
- Budget/BudgetView.tsx: 预算/储蓄切换 + 空状态 + 表单
- Budget/BudgetCard.tsx: 进度环 + 进度条 + 金额网格 + 状态
- Budget/BudgetForm.tsx: 预算表单 + 储蓄目标表单 (内含 SavingsGoalForm)
- Budget/SavingsCard.tsx: 进度条 + 剩余天数 + 完成庆祝

### Step 9: Settings 模块 ✅
- Settings/SettingsView.tsx: 分组表单 + 导航行 + 开关行 + 编辑行
- Settings/CategoryManage.tsx: 支出/收入分类管理 + 添加表单
- Settings/TagManage.tsx: 标签管理 + 颜色选择
- Layout/AboutView.tsx: 狐狸 + 版本信息

### Step 10: App 入口 + 路由 ✅
- App.tsx: 加载页 → 引导页 / 主页
- main.tsx: React 挂载入口
- index.html: PWA meta 标签 (apple-mobile-web-app + viewport-fit)
- Layout/MainTabView.tsx: 4 Tab 导航 + 设置子页面路由
- Layout/OnboardingView.tsx: 4页引导 + 狐狸命名

## 构建结果

```
✓ TypeScript 类型检查: 0 errors
✓ Vite 生产构建: 336ms
  - dist/index.html (1.33 KB)
  - dist/assets/index.css (27.68 KB gzip: 5.79 KB)
  - dist/assets/index.js (1,353 KB gzip: 373 KB)
  - dist/sw.js (Service Worker)
  - dist/manifest.webmanifest
✓ PWA 离线缓存: 11 entries precached
```

## 文件统计

| 类型 | 数量 |
|------|------|
| TSX 组件 | 30 文件 |
| TS 模块 | 13 文件 |
| CSS | 1 文件 |
| 配置 | 5 文件 |
| **总计** | **49 源文件** |

## 与 SwiftUI 版本的对应关系

| SwiftUI 概念 | React PWA 实现 |
|-------------|---------------|
| SwiftData @Model | Dexie.js Table + TS Interface |
| @Observable ViewModel | React Custom Hooks |
| @Environment 注入 | React Context (AppContext) |
| NavigationStack | 状态驱动的页面切换 |
| .sheet() modal | 固定定位 + 动画弹窗 |
| Charts framework | Recharts (PieChart, BarChart) |
| WidgetKit | vite-plugin-pwa (manifest + SW) |
| App Intents | (PWA 限制，不支持 Siri) |
| SF Symbols | Lucide React 图标 |
| SwiftUI Views | React Function Components |

## 在 iPhone 上测试

1. 确保 iPhone 和 Windows 在同一 WiFi
2. 运行 `npx vite dev --host` 
3. iPhone Safari 打开 `http://你的IP:5173`
4. Safari → 分享按钮 → "添加到主屏幕"
5. 桌面出现 CashFox 图标，点击即全屏运行

## 已知限制 (PWA vs 原生)

- ❌ 无 Siri 快捷指令 (Web 限制)
- ❌ 无桌面小组件 (需原生 WidgetKit)
- ❌ 狐狸使用 Emoji 占位 (可换 SVG/PNG 素材)
- ⚠️ 离线数据仅存在本机 IndexedDB (无 iCloud 同步)

## 后续优化建议

1. 设计师绘制 9 种狐狸表情 SVG → 替换 Emoji 占位
2. 接入 Web Push API 实现预算提醒推送
3. 代码分割 (动态 import) 优化首屏加载
4. 添加收入/支出动画过渡
5. IndexedDB 数据导出/导入备份功能
