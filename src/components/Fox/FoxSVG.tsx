// ============================================
// 狐狸 SVG 角色 — 9 种表情的内联矢量图
// 替换原 Emoji 占位符
// ============================================
import type { FoxExpression } from '../../db/models';

interface Props {
  expression: FoxExpression;
  size?: number;
}

export function FoxSVG({ expression, size = 100 }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* ═══ 耳朵 ═══ */}
      {/* 左耳 */}
      <polygon points="22,42 10,4 48,24" fill="#E87830" />
      <polygon points="24,38 14,10 44,25" fill="#FFB6C1" />
      {/* 右耳 */}
      <polygon points="98,42 110,4 72,24" fill="#E87830" />
      <polygon points="96,38 106,10 76,25" fill="#FFB6C1" />

      {/* ═══ 脸部（主体） ═══ */}
      <ellipse cx="60" cy="62" rx="46" ry="42" fill="#F4963C" />

      {/* ═══ 白色面颊 ═══ */}
      <ellipse cx="60" cy="74" rx="32" ry="24" fill="#FFF5EE" />

      {/* ═══ 鼻子 ═══ */}
      <ellipse cx="60" cy="66" rx="4.5" ry="3.5" fill="#3D2B1F" />

      {/* ═══ 眼睛（根据表情变化） ═══ */}
      <Eyes expression={expression} />

      {/* ═══ 嘴（根据表情变化） ═══ */}
      <Mouth expression={expression} />

      {/* ═══ 配件（根据表情变化） ═══ */}
      <Accessories expression={expression} />
    </svg>
  );
}

// ═══════════════════════════════════════
// 眼睛组件
// ═══════════════════════════════════════

function Eyes({ expression }: { expression: FoxExpression }) {
  switch (expression) {
    case 'happy':
    case 'proud':
    case 'eating':
      // ^ ^ 弯月笑眼
      return (
        <>
          <path d="M40,56 Q46,48 52,56" fill="none" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
          <path d="M68,56 Q74,48 80,56" fill="none" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
        </>
      );

    case 'sad':
      // 圆眼 + 大高光（泪光）
      return (
        <>
          <ellipse cx="46" cy="56" rx="7" ry="8" fill="white" stroke="#3D2B1F" strokeWidth="2.5" />
          <ellipse cx="74" cy="56" rx="7" ry="8" fill="white" stroke="#3D2B1F" strokeWidth="2.5" />
          <circle cx="47" cy="54" r="3" fill="#3D2B1F" />
          <circle cx="75" cy="54" r="3" fill="#3D2B1F" />
          <circle cx="49" cy="52" r="1.5" fill="white" />
          <circle cx="77" cy="52" r="1.5" fill="white" />
        </>
      );

    case 'surprised':
      // 大圆眼 + 小瞳孔
      return (
        <>
          <circle cx="46" cy="56" r="10" fill="white" stroke="#3D2B1F" strokeWidth="2.5" />
          <circle cx="74" cy="56" r="10" fill="white" stroke="#3D2B1F" strokeWidth="2.5" />
          <circle cx="46" cy="56" r="4" fill="#3D2B1F" />
          <circle cx="74" cy="56" r="4" fill="#3D2B1F" />
        </>
      );

    case 'warning':
      // 半眯眼（直线）
      return (
        <>
          <line x1="38" y1="56" x2="54" y2="56" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
          <line x1="66" y1="56" x2="82" y2="56" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
        </>
      );

    case 'sleeping':
      // 闭眼（下弯弧）
      return (
        <>
          <path d="M40,56 Q46,62 52,56" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M68,56 Q74,62 80,56" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );

    case 'celebrate':
      // 星星眼 ⭐
      return (
        <>
          <g transform="translate(46, 56) scale(0.55)">
            <polygon points="0,-12 3,-4 12,-4 5,2 7,10 0,6 -7,10 -5,2 -12,-4 -3,-4"
              fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
          </g>
          <g transform="translate(74, 56) scale(0.55)">
            <polygon points="0,-12 3,-4 12,-4 5,2 7,10 0,6 -7,10 -5,2 -12,-4 -3,-4"
              fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
          </g>
        </>
      );

    default: // idle
      // 标准圆眼 + 小高光
      return (
        <>
          <ellipse cx="46" cy="56" rx="6.5" ry="7" fill="white" stroke="#3D2B1F" strokeWidth="2.5" />
          <ellipse cx="74" cy="56" rx="6.5" ry="7" fill="white" stroke="#3D2B1F" strokeWidth="2.5" />
          <circle cx="47" cy="55" r="3" fill="#3D2B1F" />
          <circle cx="75" cy="55" r="3" fill="#3D2B1F" />
          <circle cx="48.5" cy="53.5" r="1.2" fill="white" />
          <circle cx="76.5" cy="53.5" r="1.2" fill="white" />
        </>
      );
  }
}

// ═══════════════════════════════════════
// 嘴组件
// ═══════════════════════════════════════

function Mouth({ expression }: { expression: FoxExpression }) {
  switch (expression) {
    case 'happy':
    case 'proud':
      // 大微笑弧
      return (
        <path d="M50,78 Q60,90 70,78" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
      );

    case 'sad':
      // 下弯弧
      return (
        <path d="M50,82 Q60,74 70,82" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
      );

    case 'surprised':
      // 椭圆张嘴
      return <ellipse cx="60" cy="80" rx="7" ry="10" fill="#3D2B1F" />;

    case 'warning':
      // 波浪嘴
      return (
        <path d="M48,78 Q52,74 56,78 Q60,82 64,78 Q68,74 72,78"
          fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
      );

    case 'sleeping':
      // 小圆嘴
      return <circle cx="60" cy="80" r="4" fill="#3D2B1F" />;

    case 'eating':
      // 咀嚼嘴（小椭圆）
      return <ellipse cx="60" cy="80" rx="5" ry="6" fill="#3D2B1F" />;

    case 'celebrate':
      // 大笑张嘴
      return (
        <>
          <ellipse cx="60" cy="82" rx="10" ry="12" fill="#3D2B1F" />
          <ellipse cx="60" cy="79" rx="8" ry="5" fill="#FF6B6B" />
        </>
      );

    default: // idle
      // 小微笑弧
      return (
        <path d="M52,78 Q60,84 68,78" fill="none" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
      );
  }
}

// ═══════════════════════════════════════
// 配件（腮红、汗滴、星星、zZ 等）
// ═══════════════════════════════════════

function Accessories({ expression }: { expression: FoxExpression }) {
  switch (expression) {
    case 'happy':
      // 腮红
      return (
        <>
          <circle cx="35" cy="68" r="8" fill="#FFB3BA" opacity="0.5" />
          <circle cx="85" cy="68" r="8" fill="#FFB3BA" opacity="0.5" />
        </>
      );

    case 'sad':
    case 'warning':
      // 汗滴
      return (
        <g transform="translate(88, 38)">
          <path d="M0,0 Q6,10 0,16 Q-6,10 0,0Z" fill="#7EC8E3" opacity="0.8" />
        </g>
      );

    case 'proud':
      // 星星
      return (
        <g transform="translate(90, 32) scale(0.7)">
          <polygon points="0,-10 2.5,-3 10,-3 4,2 6,10 0,5 -6,10 -4,2 -10,-3 -2.5,-3"
            fill="#FFD700" />
        </g>
      );

    case 'sleeping':
      // zZ
      return (
        <g transform="translate(88, 30)" fill="none" stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <text x="0" y="8" fontSize="14" fontWeight="bold" fill="#7EC8E3" stroke="none">z</text>
          <text x="8" y="0" fontSize="18" fontWeight="bold" fill="#7EC8E3" stroke="none">Z</text>
        </g>
      );

    case 'eating':
      // 食物图标 🍙
      return (
        <g transform="translate(86, 32)">
          <ellipse cx="0" cy="4" rx="8" ry="5" fill="#FFF" stroke="#D5D8DC" strokeWidth="1" />
          <rect x="-4" y="-6" width="8" height="10" rx="2" fill="#2C3E50" opacity="0.6" />
        </g>
      );

    case 'celebrate':
      // 彩色纸屑
      return (
        <>
          <rect x="20" y="18" width="4" height="8" rx="1" fill="#FF6B6B" transform="rotate(-30 22 22)" />
          <rect x="96" y="16" width="4" height="8" rx="1" fill="#51CF66" transform="rotate(25 98 20)" />
          <rect x="88" y="52" width="4" height="6" rx="1" fill="#FFD700" transform="rotate(-20 90 55)" />
          <circle cx="24" cy="40" r="2.5" fill="#D4C5F0" />
          <circle cx="94" cy="42" r="2.5" fill="#FFA94D" />
        </>
      );

    default:
      return null;
  }
}
