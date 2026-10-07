'use client';

import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronDown,
  ChevronRight,
  Coffee,
  GraduationCap,
  HeartPulse,
  Home,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Receipt,
  ShoppingBag,
  Sparkles,
  Target,
  Tv,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';

const CATEGORY_COLORS: Record<string, { color: string; bg: string; icon: LucideIcon }> = {
  food: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Coffee },
  dining: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Coffee },
  drinks: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Coffee },
  shopping: { color: '#f4c5a8', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: ShoppingBag },
  transport: { color: '#c8b8e0', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Car },
  bills: { color: '#a7e5d3', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Home },
  utilities: { color: '#a7e5d3', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Home },
  entertainment: { color: '#e8b8c4', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Tv },
  health: { color: '#dc2626', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: HeartPulse },
  education: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: GraduationCap },
};

function getCategoryTheme(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return { color: '#777169', bg: 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]', icon: Receipt };
}

export function BudgetsScreen() {
  const {
    budgets,
    budgetResults,
    selectedBudget,
    openModal,
    setSelectedBudget,
    navigateTo,
    themeMode,
  } = useSpendWise();

  const isDark = themeMode === 'DARK';

  const activeBudget = selectedBudget || budgets[0];
  const activeResult =
    budgetResults.find((r) => r.budgetId === activeBudget?.id) || budgetResults[0];

  // Editorial pastel stops for donut chart ring segments
  const PALETTE = ['#a8c8e8', '#f4c5a8', '#c8b8e0', '#a7e5d3', '#e8b8c4', '#d6d3d1'];

  // Calculate SVG donut stroke offsets with clean 100x100 viewBox
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const totalLimit = activeResult?.totalLimit || 1;

  let cumulativeOffset = 0;
  const donutSegments = (activeResult?.categoryResults || []).map((cat, idx) => {
    const segmentRatio = Math.min(cat.spent / totalLimit, 1);
    const strokeDash = segmentRatio * circumference;
    const strokeOffset = circumference - cumulativeOffset;
    cumulativeOffset += strokeDash;

    return {
      name: cat.categoryName,
      spent: cat.spent,
      color: PALETTE[idx % PALETTE.length],
      strokeDasharray: `${strokeDash} ${circumference}`,
      strokeDashoffset: -cumulativeOffset + strokeDash,
    };
  });

  return (
    <div className="relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden px-5 pt-3 pb-32 gap-4.5 no-scrollbar animate-fade-in font-sans touch-pan-y">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('HOME')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-light text-2xl tracking-[-0.32px] text-[#0c0a09] dark:text-white leading-tight">
              Monthly Budget
            </h1>
            <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] tracking-[0.16px]">
              Disciplined capital allocation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Month Selector Pill */}
          <div className="relative">
            <select
              value={activeBudget?.id}
              onChange={(e) => {
                const found = budgets.find((b) => b.id === e.target.value);
                if (found) setSelectedBudget(found);
              }}
              className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-xs font-medium shadow-xs focus:outline-none cursor-pointer text-[#0c0a09] dark:text-zinc-200"
            >
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.month}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60 text-[#0c0a09] dark:text-white" />
          </div>

          <button
            onClick={() => openModal('CREATE_BUDGET')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>

      {!activeBudget || !activeResult ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-center flex flex-col items-center shrink-0">
          <p className="text-sm font-medium text-[#777169] dark:text-[#a8a29e]">No active budget found</p>
        </div>
      ) : (
        <>
          {/* Main Multicolor Donut & Legend Editorial Card - NEVER shrinked, strictly responsive */}
          <div className="relative shrink-0 w-full rounded-2xl p-5 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4 overflow-hidden">
            {/* Subtle atmospheric orb bloom in background */}
            <div className="absolute -top-12 right-0 w-40 h-40 rounded-full bg-[#c8b8e0]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-0 w-36 h-36 rounded-full bg-[#a7e5d3]/20 blur-3xl pointer-events-none" />

            {/* Top Budget Header Row */}
            <div className="relative z-10 flex items-center justify-between pb-1 border-b border-[#f0efed] dark:border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-sans font-medium">
                  Budget Health
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display font-light text-xl text-[#0c0a09] dark:text-white tracking-tight">
                    {formatCurrency(activeResult.totalSpent)}
                  </span>
                  <span className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
                    / {formatCurrency(activeResult.totalLimit)}
                  </span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                activeResult.status === 'OVER_BUDGET'
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                  : 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-[#e7e5e4] dark:border-white/[0.08]'
              }`}>
                {Math.round(activeResult.usagePercentage)}% used
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3.5">
              {/* Multicolor Donut Chart SVG */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Base Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-[#f0efed] dark:stroke-[#24211e]"
                    strokeWidth="9"
                    fill="none"
                  />

                  {/* Segmented Rings */}
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={seg.name + i}
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={seg.color}
                      strokeWidth="9"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 ease-out"
                    />
                  ))}
                </svg>

                {/* Center Donut Text with Waldenburg Light / EB Garamond 300 display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white leading-tight">
                    {Math.round(activeResult.usagePercentage)}%
                  </span>
                  <span className="text-[9.5px] text-[#777169] dark:text-[#a8a29e] tracking-[0.16px]">
                    spent
                  </span>
                </div>
              </div>

              {/* Right Side Category Legend Table */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                {activeResult.categoryResults.slice(0, 5).map((cat, idx) => {
                  const dotColor = PALETTE[idx % PALETTE.length];
                  return (
                    <div
                      key={cat.categoryName}
                      className="flex items-center justify-between text-xs py-0.5 min-w-0"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="text-[11px] font-medium text-[#4e4e4e] dark:text-zinc-300 truncate tracking-[0.15px]">
                          {cat.categoryName}
                        </span>
                      </div>
                      <span className="font-display font-light text-xs text-[#0c0a09] dark:text-white shrink-0 tracking-tight">
                        {formatCurrency(cat.spent)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Over Budget Notice if applicable */}
            {activeResult.status === 'OVER_BUDGET' && (
              <div className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>Exceeded budget by {formatCurrency(activeResult.overBudgetAmount)}</span>
              </div>
            )}
          </div>

          {/* Category Budgets List */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-light text-lg tracking-[-0.32px] text-[#0c0a09] dark:text-white">
                Category Allocations
              </h2>
              <button
                onClick={() => {
                  setSelectedBudget(activeBudget);
                  openModal('CREATE_BUDGET');
                }}
                className="text-xs font-medium text-[#777169] hover:text-[#0c0a09] dark:hover:text-white transition tracking-[0.15px]"
              >
                Manage
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {activeResult.categoryResults.map((cat) => {
                const theme = getCategoryTheme(cat.categoryName);
                const Icon = theme.icon;
                const pct = Math.min(cat.usagePercentage, 100);

                return (
                  <div
                    key={cat.categoryName}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${theme.bg}`}
                        >
                          <Icon className="w-3.5 h-3.5 stroke-[1.8]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                            {cat.categoryName}
                          </span>
                          <span className="text-[11px] text-[#777169] dark:text-[#a8a29e] tracking-[0.15px]">
                            {formatCurrency(cat.spent)} / {formatCurrency(cat.allocatedLimit)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-light text-sm text-[#0c0a09] dark:text-zinc-200">
                          {Math.round(cat.usagePercentage)}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
                      </div>
                    </div>

                    {/* Horizontal Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            cat.status === 'OVER_BUDGET'
                              ? '#dc2626'
                              : cat.status === 'NEAR_LIMIT'
                              ? '#f4c5a8'
                              : isDark
                              ? '#ffffff'
                              : '#292524',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stay on Track Editorial Advisory Card (Never shrinked, premium layout) */}
          <div className="relative shrink-0 w-full rounded-2xl p-4.5 sm:p-5 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-3.5 overflow-hidden">
            {/* Atmospheric soft pastel background blooms */}
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full orb-mint opacity-70 dark:opacity-20 pointer-events-none" />
            <div className="absolute -bottom-10 right-14 w-32 h-32 rounded-full orb-peach opacity-60 dark:opacity-15 pointer-events-none" />

            {/* Header row: Icon, Category Tag & Health Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] text-[#0c0a09] dark:text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#777169] dark:text-[#a8a29e] font-sans font-semibold">
                  Pacing Advisory
                </span>
              </div>

              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                  activeResult.status === 'OVER_BUDGET'
                    ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                    : 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-[#e7e5e4] dark:border-white/[0.08]'
                }`}
              >
                {activeResult.status === 'OVER_BUDGET' ? 'Over Limit' : 'Disciplined'}
              </span>
            </div>

            {/* Title & Detailed Insight */}
            <div className="relative z-10 flex flex-col gap-1">
              <h3 className="font-display font-light text-lg text-[#0c0a09] dark:text-white tracking-tight leading-snug">
                Stay on Track
              </h3>
              <p className="text-xs text-[#4e4e4e] dark:text-[#d6d3d1] leading-relaxed">
                {activeResult.status === 'OVER_BUDGET'
                  ? `You have exceeded this month's budget by ${formatCurrency(activeResult.overBudgetAmount)}. Rebalancing high-spending categories will help bring your totals back on track.`
                  : `You've spent ${formatCurrency(activeResult.totalSpent)} of your ${formatCurrency(activeResult.totalLimit)} monthly limit. You are comfortably ${Math.max(100 - Math.round(activeResult.usagePercentage), 0)}% under your planned spending ceiling.`}
              </p>
            </div>

            {/* Interactive Bottom Action Bar */}
            <div className="relative z-10 pt-3 border-t border-[#f0efed] dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
                AI-driven financial guidance
              </span>
              <button
                onClick={() => openModal('AI_ASSISTANT')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c0a09] hover:bg-[#292524] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] text-xs font-medium shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>AI Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
