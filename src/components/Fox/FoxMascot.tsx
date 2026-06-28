// ============================================
// 狐狸看板娘组件 — 对应 Swift FoxMascotView
// ============================================
import type { FoxExpression } from '../../db/models';
import { FoxSpeechBubble } from './FoxSpeechBubble';

const FOX_SIZE = { small: 60, medium: 100, large: 150 } as const;

interface Props {
  expression: FoxExpression;
  size?: keyof typeof FOX_SIZE;
  message?: string;
  showBubble?: boolean;
  className?: string;
}

/** 表情 → SF Symbol 对应的 Emoji 占位 */
const FOX_FACES: Record<FoxExpression, string> = {
  idle: '🦊', happy: '😊', sad: '😢', surprised: '😮',
  warning: '😟', proud: '😎', sleeping: '😴', eating: '🍽️', celebrate: '🎉'
};

const FOX_BG: Record<FoxExpression, string> = {
  idle: '#A8D8EA', happy: '#B9F5D8', sad: '#D5D8DC', surprised: '#FFE9A3',
  warning: '#FFD4A3', proud: '#B4E7E8', sleeping: '#D4C5F0', eating: '#FFB3BA', celebrate: '#FFE9A3'
};

export function FoxMascot({
  expression, size = 'medium', message, showBubble = true, className = ''
}: Props) {
  const dim = FOX_SIZE[size];
  const bg = FOX_BG[expression];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {showBubble && (message || expression !== 'idle') && (
        <FoxSpeechBubble message={message ?? ''} size={size} />
      )}
      <div
        className="rounded-full flex items-center justify-center animate-bounce-slow shadow-fox"
        style={{ width: dim, height: dim, background: `radial-gradient(circle at 30% 30%, ${bg}88, ${bg}44)` }}
      >
        <span style={{ fontSize: dim * 0.5 }}>{FOX_FACES[expression]}</span>
      </div>
    </div>
  );
}
