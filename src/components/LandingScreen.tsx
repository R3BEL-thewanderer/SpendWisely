'use client';

import React from 'react';
import {
  ArrowRight,
  CreditCard,
  PieChart as PieIcon,
  Sparkles,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

export function LandingScreen() {
  const { navigateTo, openModal } = useSpendWise();

  return (
    <div className="relative flex-1 w-full min-h-full flex flex-col justify-between px-6 pt-8 pb-10 overflow-hidden bg-[#FAF8F5] dark:bg-[#111216]">
      {/* Ambient glowing background orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FFD8CC]/60 via-[#E7E0FF]/50 to-[#C8E2FF]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-[#C8E2FF]/50 to-[#E7E0FF]/60 blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF] p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF]" />
            </div>
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
            SpendWise
          </span>
        </div>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('spendwise_session_active', 'true');
            }
            navigateTo('HOME');
          }}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
        >
          Skip to App
        </button>
      </div>

      {/* Headline & Subtitle */}
      <div className="relative z-10 mt-6 flex flex-col gap-2.5">
        <h1 className="text-3xl sm:text-[34px] font-black tracking-tight leading-[1.15] text-zinc-900 dark:text-white">
          Understand <br />
          your money. <br />
          <span className="bg-gradient-to-r from-[#7B61FF] via-[#FF6584] to-[#FFA07A] bg-clip-text text-transparent">
            Build better habits.
          </span>
        </h1>
        <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px]">
          Track expenses, set budgets, and turn your spending into meaningful insights.
        </p>
      </div>

      {/* 3D Glass Graphic Illustration Area */}
      <div className="relative z-10 my-4 flex-1 flex items-center justify-center min-h-[220px]">
        {/* Floating Card Backdrop Glow */}
        <div className="relative w-full max-w-[310px] h-[200px] flex items-center justify-center">
          {/* Decorative Floating Pie Chart Slices */}
          <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400/80 to-purple-400/80 blur-xs p-1 shadow-md animate-float-slow">
            <div className="w-full h-full rounded-full border-2 border-white/60 flex items-center justify-center">
              <PieIcon className="w-7 h-7 text-white stroke-[2]" />
            </div>
          </div>

          {/* Decorative Floating Glass Wallet */}
          <div className="absolute -top-1 -right-2 w-14 h-14 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 shadow-lg flex items-center justify-center animate-bounce duration-1000">
            <Wallet className="w-7 h-7 text-indigo-500" />
          </div>

          {/* Floating Credit Card Representation */}
          <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-500 text-white shadow-md flex items-center justify-center">
            <CreditCard className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Main Front Glass Card (Matching Screenshot) */}
          <div className="w-[260px] p-4.5 rounded-[28px] bg-white/85 dark:bg-zinc-800/80 backdrop-blur-xl border border-white/90 dark:border-white/15 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Monthly Spending
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="w-3 h-3" />
                <span>12%</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                ₹ 24,580
              </span>
              <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </div>
            </div>

            {/* Micro Spline Chart Representation */}
            <div className="w-full h-8 pt-1 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
                <defs>
                  <linearGradient id="landingGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 16 Q20 5, 40 12 T80 4 T100 8"
                  fill="none"
                  stroke="url(#landingGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Buttons: Sign In, Sign Up & Demo */}
      <div className="relative z-10 flex flex-col gap-2.5 w-full">
        {/* Primary Dark Button: Sign In */}
        <button
          onClick={() => openModal('AUTH_SIGN_IN')}
          className="w-full py-3.5 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-sm shadow-lg hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Light Button: Sign Up */}
        <button
          onClick={() => openModal('AUTH_SIGN_UP')}
          className="w-full py-3.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-zinc-900 dark:text-white font-bold text-sm shadow-xs hover:bg-white dark:hover:bg-white/15 active:scale-[0.99] transition text-center cursor-pointer"
        >
          Create New Account
        </button>

        {/* Quick Demo Access */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('spendwise_session_active', 'true');
            }
            navigateTo('HOME');
          }}
          className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition py-1 text-center cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Explore Live Demo Dashboard</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
