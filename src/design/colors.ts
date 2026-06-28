/** 预设分类颜色（11 种柔和色） */
export const CATEGORY_COLORS = [
  '#FFB3BA', '#FFD4A3', '#FFE9A3', '#B9F5D8',
  '#D4C5F0', '#B4E7E8', '#B4D4F0', '#E8D5C4',
  '#D5D8DC', '#C4C9F0', '#F0C4D8'
] as const;

export function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

/** 判断颜色是否为深色（用于确定文字用黑还是白） */
export function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
}
