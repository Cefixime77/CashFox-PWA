// ============================================
// 狐狸对话气泡 — 对应 Swift FoxSpeechBubble
// ============================================

interface Props {
  message: string;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = { small: 'text-[10px] px-2 py-1', medium: 'text-[13px] px-3 py-1.5', large: 'text-[14px] px-4 py-2' };

export function FoxSpeechBubble({ message, size = 'medium' }: Props) {
  return (
    <div className="relative">
      <div className={`${SIZES[size]} bg-white text-text-primary rounded-btn shadow-card max-w-[200px] text-center`}>
        {message}
      </div>
      {/* 三角指针 */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0
        border-l-[6px] border-l-transparent
        border-r-[6px] border-r-transparent
        border-t-[8px] border-t-white" />
    </div>
  );
}
