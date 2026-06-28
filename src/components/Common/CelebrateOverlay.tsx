// ============================================
// 记账成功庆祝特效 — CSS confetti 粒子爆开
// ============================================
import { useEffect, useState } from 'react';

const COLORS = ['#FF6B6B','#51CF66','#FFD700','#7EC8E3','#D4C5F0','#FFA94D','#FFB3BA','#B4E7E8'];
const PARTICLE_COUNT = 18;

interface Particle {
  id: number;
  color: string;
  cx: number;  // 终点 X 偏移
  cy: number;  // 终点 Y 偏移
  delay: number;
  size: number;
  left: number; // 起始位置
}

interface Props {
  active: boolean;
}

export function CelebrateOverlay({ active }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }

    const parts: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
      const dist = 60 + Math.random() * 80;
      parts.push({
        id: i,
        color: COLORS[i % COLORS.length],
        cx: Math.cos(angle) * dist,
        cy: Math.sin(angle) * dist - 30,
        delay: Math.random() * 0.15,
        size: 6 + Math.random() * 8,
        left: 50 + (Math.random() - 0.5) * 10,
      });
    }
    setParticles(parts);

    const timer = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(timer);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            '--cx': `${p.cx}px`,
            '--cy': `${p.cy}px`,
            left: `${p.left}%`,
            top: '45%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
