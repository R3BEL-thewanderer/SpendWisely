'use client';

import React from 'react';
import { formatCurrency } from '../lib/currency';
import { calculateGulakFillRatio } from '../lib/goals';

interface DigitalGulakProps {
  progress?: number; // 0.0 to 1.0 (or auto-calculated from current & target)
  currentAmount: number;
  targetAmount: number;
  size?: number; // width/height in px (default 240)
  showLabels?: boolean;
}

export function DigitalGulak({
  progress,
  currentAmount,
  targetAmount,
  size = 230,
  showLabels = true,
}: DigitalGulakProps) {
  const fillRatio =
    progress !== undefined
      ? Math.min(Math.max(progress, 0), 1)
      : calculateGulakFillRatio(currentAmount, targetAmount);

  const percent = Math.round(fillRatio * 100);
  const isCompleted = fillRatio >= 0.999 || currentAmount >= targetAmount;

  // Liquid height in SVG coordinates (viewBox 0 0 300 260)
  // Base y is around 220, top y when full is around 65. Range = 155.
  const liquidHeight = 155 * fillRatio;
  const liquidTop = 220 - liquidHeight;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* 1. Ambient Glow behind the Gulak */}
      <div
        className={`absolute inset-4 rounded-full blur-2xl transition-all duration-1000 ${
          isCompleted
            ? 'bg-gradient-to-tr from-amber-300/40 via-emerald-300/40 to-purple-300/40 animate-pulse'
            : 'bg-gradient-to-tr from-[#C9B8FF]/25 via-[#9CC9FF]/25 to-[#F4C7B5]/25'
        }`}
      />

      {/* Floating Piggy Vessel SVG */}
      <div className="relative w-full h-full animate-float">
        <svg
          viewBox="0 0 300 260"
          className="w-full h-full drop-shadow-xl overflow-visible"
        >
          <defs>
            {/* Liquid Fill Gradient */}
            <linearGradient id="gulakLiquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9B8FF" stopOpacity="0.88" />
              <stop offset="35%" stopColor="#9CC9FF" stopOpacity="0.92" />
              <stop offset="70%" stopColor="#B9DEC9" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#F4C7B5" stopOpacity="0.82" />
            </linearGradient>

            {/* Glass Surface Gradient */}
            <linearGradient id="gulakGlassBase" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>

            {/* Golden Coin Gradient */}
            <radialGradient id="goldCoinGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF9D2" />
              <stop offset="60%" stopColor="#F5D98A" />
              <stop offset="100%" stopColor="#E5B842" />
            </radialGradient>

            {/* Piggy Vessel Body Clip Path */}
            <clipPath id="piggyBodyClip">
              <rect x="50" y="55" width="200" height="155" rx="72" ry="72" />
            </clipPath>
          </defs>

          {/* Feet (Glass pods) */}
          <rect
            x="85"
            y="200"
            width="36"
            height="22"
            rx="11"
            className="fill-white/40 dark:fill-white/20 stroke-white/50"
            strokeWidth="1.5"
          />
          <rect
            x="180"
            y="200"
            width="36"
            height="22"
            rx="11"
            className="fill-white/40 dark:fill-white/20 stroke-white/50"
            strokeWidth="1.5"
          />

          {/* Ears */}
          <path
            d="M 85 85 Q 92 48 120 70 Z"
            className="fill-white/35 dark:fill-white/15 stroke-white/50"
            strokeWidth="1.5"
          />
          <path
            d="M 180 70 Q 208 48 215 85 Z"
            className="fill-white/35 dark:fill-white/15 stroke-white/50"
            strokeWidth="1.5"
          />

          {/* Snout (Glass nose on front left) */}
          <rect
            x="32"
            y="112"
            width="36"
            height="42"
            rx="18"
            className="fill-white/40 dark:fill-white/20 stroke-white/50"
            strokeWidth="1.5"
          />
          <circle cx="44" cy="128" r="3" className="fill-[#EF9C8D]/70" />
          <circle cx="44" cy="138" r="3" className="fill-[#EF9C8D]/70" />

          {/* Main Piggy Vessel Body Base */}
          <rect
            x="50"
            y="55"
            width="200"
            height="155"
            rx="72"
            ry="72"
            fill="url(#gulakGlassBase)"
            className="stroke-white/60 dark:stroke-white/30 backdrop-blur-md"
            strokeWidth="2.5"
          />

          {/* Clipped Liquid Fill inside the vessel */}
          <g clipPath="url(#piggyBodyClip)">
            {fillRatio > 0.01 && (
              <g className="transition-all duration-1000 ease-out">
                {/* Waved Liquid Body */}
                <path
                  d={`
                    M 40 230
                    L 40 ${liquidTop}
                    Q 85 ${liquidTop - 6} 130 ${liquidTop}
                    T 220 ${liquidTop}
                    T 260 ${liquidTop}
                    L 260 230
                    Z
                  `}
                  fill="url(#gulakLiquidGradient)"
                />

                {/* Liquid glowing surface meniscus */}
                <path
                  d={`M 55 ${liquidTop} Q 130 ${liquidTop - 5} 245 ${liquidTop}`}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />

                {/* Sparkling bubbles in liquid */}
                {fillRatio > 0.15 && (
                  <>
                    <circle
                      cx="100"
                      cy={liquidTop + 35}
                      r="4"
                      className="fill-white/60 animate-pulse"
                    />
                    <circle
                      cx="190"
                      cy={liquidTop + 55}
                      r="6"
                      className="fill-white/50"
                    />
                    <circle
                      cx="145"
                      cy={liquidTop + 85}
                      r="3.5"
                      className="fill-white/60"
                    />
                  </>
                )}
              </g>
            )}
          </g>

          {/* 3D Crystal Curved Highlight */}
          <path
            d="M 90 75 Q 150 64 210 82"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />

          {/* Top Coin Slot */}
          <rect
            x="116"
            y="48"
            width="68"
            height="9"
            rx="4.5"
            className="fill-[#2a2c33]/40 dark:fill-black/60 stroke-white/40"
            strokeWidth="1.5"
          />

          {/* Floating Golden Coin Entering the Slot */}
          <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
            <circle
              cx="150"
              cy="34"
              r="14"
              fill="url(#goldCoinGrad)"
              className="drop-shadow-md stroke-amber-200/80"
              strokeWidth="1"
            />
            {/* Coin Rupee Icon or inner circle */}
            <circle cx="150" cy="34" r="10.5" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6" />
            <text
              x="150"
              y="38"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#7A5200"
            >
              ₹
            </text>
          </g>

          {/* Celebration Starbursts when goal reached */}
          {isCompleted && (
            <g className="animate-spin" style={{ transformOrigin: '150px 130px', animationDuration: '20s' }}>
              <polygon points="50,45 53,52 60,52 54,56 57,63 50,59 43,63 46,56 40,52 47,52" fill="#F5D98A" />
              <polygon points="250,55 253,62 260,62 254,66 257,73 250,69 243,73 246,66 240,62 247,62" fill="#F5D98A" />
              <polygon points="60,195 62,200 68,200 63,203 65,209 60,205 55,209 57,203 52,200 58,200" fill="#9CC9FF" />
              <polygon points="245,190 247,195 253,195 248,198 250,204 245,200 240,204 242,198 237,195 243,195" fill="#C9B8FF" />
            </g>
          )}
        </svg>

        {/* Overlay Text Inside the Gulak */}
        {showLabels && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
            <span className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
              {percent}%
            </span>
            <span className="text-sm font-bold tracking-tight mt-0.5">
              {formatCurrency(currentAmount)}
            </span>
            <span className="text-[11px] opacity-70">
              of {formatCurrency(targetAmount)}
            </span>
            {isCompleted && (
              <span className="mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                Goal Reached 🎉
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
