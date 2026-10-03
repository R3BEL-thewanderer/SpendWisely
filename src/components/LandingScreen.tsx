'use client';

import React from 'react';
import {
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

export function LandingScreen() {
  const { navigateTo, openModal } = useSpendWise();

  return (
    <div className="relative flex-1 w-full min-h-full flex flex-col justify-between px-6 pt-8 pb-10 overflow-hidden bg-[#f5f5f5] dark:bg-[#0c0a09] font-sans">
      {/* Soft pastel atmospheric gradient orbs (mint, peach, lavender, sky) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#a7e5d3]/25 blur-3xl pointer-events-none" />
      <div className="absolute top-44 -right-16 w-72 h-72 rounded-full bg-[#f4c5a8]/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 -left-16 w-72 h-72 rounded-full bg-[#c8b8e0]/20 blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] flex items-center justify-center font-display font-light text-base shadow-xs">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white leading-tight">
              SpendWise
            </span>
            <span className="text-[9px] text-[#777169] tracking-[0.96px] uppercase font-medium">
              Personal Ledger
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('spendwise_session_active', 'true');
            }
            navigateTo('HOME');
          }}
          className="text-xs font-medium text-[#777169] hover:text-[#0c0a09] dark:hover:text-white transition tracking-[0.15px] cursor-pointer"
        >
          Skip to Ledger
        </button>
      </div>

      {/* Editorial Display Headline & Subtitle */}
      <div className="relative z-10 mt-6 flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 text-[10px] uppercase tracking-[0.96px] text-[#777169] font-medium">
          <span>Edition 2026</span>
          <span className="w-1 h-1 rounded-full bg-[#777169]" />
          <span>Vol. I</span>
        </div>

        <h1 className="font-display font-light text-4xl sm:text-[44px] tracking-[-1.2px] leading-[1.08] text-[#0c0a09] dark:text-white">
          A quietly disciplined approach to your capital.
        </h1>

        <p className="text-xs sm:text-[13px] text-[#4e4e4e] dark:text-zinc-400 leading-relaxed max-w-[300px] tracking-[0.16px]">
          Track expenses, balance category limits, and cultivate enduring financial composure through typographic clarity.
        </p>
      </div>

      {/* Editorial Floating Preview Card */}
      <div className="relative z-10 my-4 flex-1 flex items-center justify-center min-h-[200px]">
        <div className="relative w-full max-w-[310px] flex items-center justify-center">
          {/* Subtle orb background */}
          <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-[#a8c8e8]/30 blur-2xl pointer-events-none" />

          {/* Main Editorial Card */}
          <div className="w-[270px] p-5 rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#777169] tracking-[0.15px]">
                Monthly Ledger
              </span>
              <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 text-[#0c0a09] dark:text-zinc-200">
                <TrendingDown className="w-3 h-3 text-[#16a34a]" />
                <span>-12% spending</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-0.5">
              <span className="font-display font-light text-2xl tracking-tight text-[#0c0a09] dark:text-white">
                ₹ 24,580
              </span>
              <span className="text-[10px] text-[#777169] tracking-[0.16px]">
                of ₹ 30,000 limit
              </span>
            </div>

            {/* Quiet Charcoal Spline Chart */}
            <div className="w-full h-8 pt-1 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
                <defs>
                  <linearGradient id="editorialGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#292524" />
                    <stop offset="100%" stopColor="#777169" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 16 Q20 5, 40 12 T80 4 T100 8"
                  fill="none"
                  stroke="url(#editorialGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Buttons: Near-Black Ink Pill + Outline Pill */}
      <div className="relative z-10 flex flex-col gap-2.5 w-full">
        {/* Primary Ink Pill */}
        <button
          onClick={() => openModal('AUTH_SIGN_IN')}
          className="w-full h-11 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white font-medium text-[15px] shadow-xs transition flex items-center justify-center gap-2 cursor-pointer tracking-[0.15px]"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Outline Pill */}
        <button
          onClick={() => openModal('AUTH_SIGN_UP')}
          className="w-full h-11 rounded-full bg-transparent border border-[#d6d3d1] dark:border-white/20 text-[#0c0a09] dark:text-white font-medium text-[15px] shadow-2xs hover:bg-[#fafafa] dark:hover:bg-white/5 transition text-center cursor-pointer tracking-[0.15px]"
        >
          Create New Ledger
        </button>

        {/* Quick Demo Access Link */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('spendwise_session_active', 'true');
            }
            navigateTo('HOME');
          }}
          className="text-xs font-medium text-[#777169] hover:text-[#0c0a09] dark:hover:text-white transition py-1 text-center cursor-pointer flex items-center justify-center gap-1 tracking-[0.15px]"
        >
          <span>Explore Live Demo Dashboard</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
