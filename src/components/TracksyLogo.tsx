import React from 'react';
import { motion } from 'motion/react';

interface TracksyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export const TracksyLogo: React.FC<TracksyLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  animated = false,
  className = '',
}) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-lg', tagline: 'text-[8px]' },
    md: { icon: 38, text: 'text-2xl', tagline: 'text-[9px]' },
    lg: { icon: 56, text: 'text-3xl', tagline: 'text-[11px]' },
    xl: { icon: 84, text: 'text-5xl', tagline: 'text-xs' },
  }[size];

  const logoGraphic = (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="tracksyTGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e040fb" />
            <stop offset="30%" stopColor="#8b5cf6" />
            <stop offset="70%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="tracksyCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Arc on the right side of the T */}
        <path
          d="M 45 74 A 26 26 0 1 0 71 42"
          stroke="url(#tracksyCircleGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Glossy Curved Stylized 'T' shape */}
        <path
          d="M 24 24 C 20 24 20 34 26 34 H 64 C 72 34 74 24 64 24 Z"
          fill="url(#tracksyTGrad)"
        />
        <path
          d="M 52 26 C 48 26 42 32 40 44 L 33 72 C 30 84 44 90 50 82 C 54 77 56 68 54 60 C 51 46 56 32 64 26 Z"
          fill="url(#tracksyTGrad)"
        />
        <path
          d="M 30 25 C 24 25 22 34 28 35 H 64 C 72 35 74 25 64 25 H 48 C 42 34 38 52 35 72 C 32 86 46 90 50 82 C 53 76 54 66 52 58 C 48 42 54 30 64 25 Z"
          fill="url(#tracksyTGrad)"
        />

        {/* Rising Bar Chart Columns inside the circle */}
        <rect x="47" y="60" width="5.5" height="12" rx="2" fill="url(#barGrad)" />
        <rect x="55" y="52" width="5.5" height="20" rx="2" fill="url(#barGrad)" />
        <rect x="63" y="44" width="5.5" height="28" rx="2" fill="url(#barGrad)" />

        {/* White Growth Arrow with dots */}
        <path
          d="M 43 62 L 67 41"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 0"
        />
        {/* Arrow Head */}
        <path
          d="M 62 41 H 68 V 47"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="49" cy="57" r="2.2" fill="#ffffff" />
        <circle cx="57" cy="50" r="2.2" fill="#ffffff" />
      </svg>
    </div>
  );

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {animated ? (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {logoGraphic}
        </motion.div>
      ) : (
        logoGraphic
      )}

      {showText && (
        <div className="flex flex-col justify-center">
          <div className={`font-black tracking-tight ${dimensions.text} leading-none flex items-center`}>
            <span
              className="text-slate-900 dark:text-slate-100"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Track
            </span>
            <span
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent ml-0.5"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              sy
            </span>
          </div>
          {showTagline && (
            <motion.div
              initial={animated ? { opacity: 0, y: 3 } : false}
              animate={animated ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.3 }}
              className={`font-bold tracking-[0.2em] text-slate-400 uppercase ${dimensions.tagline} mt-1`}
            >
              TRACK <span className="text-emerald-500">SMART.</span> SPEND{' '}
              <span className="text-purple-600">BETTER.</span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
