// ============================================
// 进度环 — 对应 Swift ProgressRingView
// ============================================

interface Props {
  progress: number; // 0.0~1.0
  size?: number;
  lineWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  progress, size = 64, lineWidth = 6,
  color = '#7EC8E3', label, sublabel
}: Props) {
  const radius = (size - lineWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth={lineWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={lineWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }} />
      </svg>

      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && <span className="text-[14px] font-semibold text-text-primary">{label}</span>}
          {sublabel && <span className="text-[10px] text-text-secondary">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
