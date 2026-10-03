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
  Target,
  Tv,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';

const CATEGORY_COLORS: Record<string, { color: string; bg: string; icon: LucideIcon }> = {
  food: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Coffee },
  dining: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Coffee },
  drinks: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Coffee },
  shopping: { color: '#f4c5a8', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: ShoppingBag },
  transport: { color: '#c8b8e0', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Car },
  bills: { color: '#a7e5d3', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Home },
  utilities: { color: '#a7e5d3', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Home },
  entertainment: { color: '#e8b8c4', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Tv },
  health: { color: '#dc2626', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: HeartPulse },
  education: { color: '#a8c8e8', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: GraduationCap },
};

function getCategoryTheme(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return { color: '#777169', bg: 'bg-[#f0efed] dark:bg-white/5 text-[#292524] dark:text-zinc-200 border border-[#e7e5e4] dark:border-white/10', icon: Receipt };
}

export function BudgetsScreen() {
  const {
    budgets,
    budgetResults,
    selectedBudget,
    openModal,
    setSelectedBudget,
    navigateTo,
  } = useSpendWise();

  const activeBudget = selectedBudget || budgets[0];
  const activeResult =
    budgetResults.find((r) => r.budgetId === activeBudget?.id) || budgetResults[0];

  // Editorial pastel stops for donut chart ring segments
  const PALETTE = ['#a8c8e8', '#f4c5a8', '#c8b8e0', '#a7e5d3', '#e8b8c4', '#d6d3d1'];

  // Calculate SVG donut stroke offsets
  const radius = 54;
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
    <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-y-auto px-5 pt-3 pb-24 gap-4 no-scrollbar animate-fade-in font-sans">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('HOME')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-light text-2xl tracking-[-0.32px] text-[#0c0a09] dark:text-white leading-tight">
              Monthly Budget
            </h1>
            <p className="text-[11px] text-[#777169] tracking-[0.16px]">
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
              className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 text-xs font-medium shadow-2xs focus:outline-none cursor-pointer text-[#0c0a09] dark:text-zinc-200"
            >
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.month}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60" />
          </div>

          <button
            onClick={() => openModal('CREATE_BUDGET')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>

      {!activeBudget || !activeResult ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 text-center flex flex-col items-center">
          <p className="text-sm font-medium text-[#777169]">No active budget found</p>
        </div>
      ) : (
        <>
          {/* Main Multicolor Donut & Legend Editorial Card */}
          <div className="relative rounded-2xl p-5 bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4 overflow-hidden">
            {/* Subtle atmospheric orb bloom in background */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#c8b8e0]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#a7e5d3]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              {/* Multicolor Donut Chart SVG */}
              <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  {/* Background Base Ring */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-[#f0efed] dark:stroke-zinc-800"
                    strokeWidth="11"
                    fill="none"
                  />

                  {/* Segmented Rings */}
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={seg.name + i}
                      cx="70"
                      cy="70"
                      r={radius}
                      stroke={seg.color}
                      strokeWidth="11"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 ease-out"
                    />
                  ))}
                </svg>

                {/* Center Donut Text with Waldenburg Light / EB Garamond 300 display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                  <span className="font-display font-light text-xl tracking-tight text-[#0c0a09] dark:text-white leading-tight">
                    {formatCurrency(activeResult.totalSpent)}
                  </span>
                  <span className="text-[10px] text-[#777169] tracking-[0.16px]">
                    of {formatCurrency(activeResult.totalLimit)}
                  </span>
                  <span className="text-[10px] font-medium text-[#292524] dark:text-zinc-300 mt-0.5">
                    {Math.round(activeResult.usagePercentage)}% used
                  </span>
                </div>
              </div>

              {/* Right Side Category Legend Table */}
              <div className="flex-1 flex flex-col gap-2 pl-2">
                {activeResult.categoryResults.slice(0, 5).map((cat, idx) => {
                  const dotColor = PALETTE[idx % PALETTE.length];
                  return (
                    <div
                      key={cat.categoryName}
                      className="flex items-center justify-between text-xs py-0.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="text-[11px] font-medium text-[#4e4e4e] dark:text-zinc-300 truncate tracking-[0.15px]">
                          {cat.categoryName}
                        </span>
                      </div>
                      <span className="font-display font-light text-xs text-[#0c0a09] dark:text-white ml-2 tracking-tight">
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
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
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
                    className="p-3.5 rounded-xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-2.5"
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
                          <span className="text-[11px] text-[#777169] tracking-[0.15px]">
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
                    <div className="w-full h-1 rounded-full bg-[#f0efed] dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            cat.status === 'OVER_BUDGET'
                              ? '#dc2626'
                              : cat.status === 'NEAR_LIMIT'
                              ? '#f4c5a8'
                              : '#292524',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stay on Track Bottom Editorial Card */}
          <div className="relative rounded-2xl p-4 bg-[#fafafa] dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-2xs flex items-center justify-between overflow-hidden">
            {/* Soft mint bloom */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#a7e5d3]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 text-[#0c0a09] dark:text-white flex items-center justify-center">
                <Target className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-display font-light text-sm text-[#0c0a09] dark:text-white tracking-tight">
                  Stay on Track
                </h4>
                <p className="text-[11px] text-[#777169] tracking-[0.15px]">
                  {activeResult.status === 'OVER_BUDGET'
                    ? 'Review category allocations to rebalance spending.'
                    : `You're ${Math.max(100 - Math.round(activeResult.usagePercentage), 0)}% under your planned limit.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('AI_ASSISTANT')}
              className="relative z-10 w-8 h-8 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white flex items-center justify-center shadow-xs transition active:scale-95"
              aria-label="View Insights"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
