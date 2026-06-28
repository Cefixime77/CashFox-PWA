// ============================================
// 狐狸看板娘 — 整合 SVG 形象 + 气泡
// ============================================
import { useState, useEffect } from 'react';
import type { FoxExpression } from '../../db/models';
import { FoxSVG } from './FoxSVG';
import { FoxSpeechBubble } from './FoxSpeechBubble';

const FOX_SIZE = { small: 60, medium: 100, large: 150 } as const;

const EXPRESSION_GLOW: Record<FoxExpression, string> = {
  idle:      'rgba(168,216,234,0.35)',
  happy:     'rgba(185,245,216,0.40)',
  sad:       'rgba(213,216,220,0.40)',
  surprised: 'rgba(255,233,163,0.45)',
  warning:   'rgba(255,212,163,0.40)',
  proud:     'rgba(180,231,232,0.45)',
  sleeping:  'rgba(212,197,240,0.40)',
  eating:    'rgba(255,179,186,0.40)',
  celebrate: 'rgba(255,233,163,0.50)',
};

interface Props {
  expression: FoxExpression;
  size?: keyof typeof FOX_SIZE;
  message?: string;
  showBubble?: boolean;
  className?: string;
}

export function FoxMascot({
  expression, size = 'medium', message, showBubble = true, className = ''
}: Props) {
  const dim = FOX_SIZE[size];
  const glow = EXPRESSION_GLOW[expression];
  const [prevExpr, setPrevExpr] = useState(expression);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (expression !== prevExpr) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevExpr(expression);
        setIsTransitioning(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [expression, prevExpr]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* 对话气泡 */}
      {showBubble && message && (
        <div className="animate-bubble-pop" key={message}>
          <FoxSpeechBubble message={message} size={size} />
        </div>
      )}

      {/* 狐狸圆形光晕 + SVG */}
      <div
        className="rounded-full flex items-center justify-center animate-bounce-slow transition-all duration-300"
        style={{
          width: dim,
          height: dim,
          background: `radial-gradient(circle at 35% 30%, ${glow}, transparent 70%)`,
          boxShadow: `0 0 ${dim * 0.2}px ${glow}`,
        }}
      >
        <div
          className={`transition-all duration-250 ${isTransitioning ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`}
        >
          <FoxSVG expression={prevExpr} size={dim * 0.85} />
        </div>
      </div>
    </div>
  );
}
