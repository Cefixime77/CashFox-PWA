// ============================================
// 分类图标组件 — 对应 Swift CategoryIconView
// ============================================
import { memo } from 'react';
import * as Lucide from 'lucide-react';
import { isDarkColor } from '../../design/colors';

interface Props {
  icon: string;
  color?: string;
  size?: number;
  className?: string;
}

export const CategoryIcon = memo(function CategoryIcon({
  icon, color = '#A8D8EA', size = 36, className = ''
}: Props) {
  // 动态获取 Lucide 图标组件
  const IconComponent = (Lucide as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon]
    ?? Lucide.HelpCircle;

  const bgColor = color + '33'; // 20% opacity

  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <IconComponent
        size={size * 0.5}
        style={{ color }}
      />
    </div>
  );
});
