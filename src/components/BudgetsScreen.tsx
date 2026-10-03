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
  food: { color: '#3B82F6', bg: 'bg-[#EFF6FF] text-[#2563EB]', icon: Coffee },
  dining: { color: '#3B82F6', bg: 'bg-[#EFF6FF] text-[#2563EB]', icon: Coffee },
  drinks: { color: '#3B82F6', bg: 'bg-[#EFF6FF] text-[#2563EB]', icon: Coffee },
  shopping: { color: '#EC4899', bg: 'bg-[#FDF2F8] text-[#DB2777]', icon: ShoppingBag },
  transport: { color: '#8B5CF6', bg: 'bg-[#F5F3FF] text-[#7C3AED]', icon: Car },
  bills: { color: '#F97316', bg: 'bg-[#FFF7ED] text-[#EA580C]', icon: Home },
  utilities: { color: '#F97316', bg: 'bg-[#FFF7ED] text-[#EA580C]', icon: Home },
  entertainment: { color: '#10B981', bg: 'bg-[#ECFDF5] text-[#059669]', icon: Tv },
  health: { color: '#EF4444', bg: 'bg-[#FEF2F2] text-[#DC2626]', icon: HeartPulse },
  education: { color: '#6366F1', bg: 'bg-[#EEF2FF] text-[#4F46E5]', icon: GraduationCap },
};

function getCategoryTheme(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return { color: '#6B7280', bg: 'bg-[#F3F4F6] text-[#4B5563]', icon: Receipt };
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

  // Colors for donut chart ring segments
  const PALETTE = ['#3B82F6', '#EC4899', '#8B5CF6', '#F97316', '#10B981', '#F59E0B'];

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
    <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-y-auto px-5 pt-3 pb-24 gap-4 no-scrollbar animate-fade-in">
      {/* Top Header Navigation matching Image 1 Screen 4 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('HOME')}
            className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Monthly Budget
            </h1>
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
              className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold shadow-xs focus:outline-none cursor-pointer text-zinc-800 dark:text-zinc-200"
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
            className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>

      {!activeBudget || !activeResult ? (
        <div className="p-10 rounded-3xl bg-white/70 dark:bg-white/5 border border-black/5 text-center flex flex-col items-center">
          <p className="text-sm font-semibold">No active budget found</p>
        </div>
      ) : (
        <>
          {/* Main Multicolor Donut & Legend Glass Card (Image 1 Screen 4 Design) */}
          <div className="rounded-[32px] p-5 bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              {/* Multicolor Donut Chart SVG */}
              <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  {/* Background Base Ring */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-zinc-100 dark:stroke-zinc-700/60"
                    strokeWidth="12"
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
                      strokeWidth="12"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 ease-out"
                    />
                  ))}
                </svg>

                {/* Center Donut Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                  <span className="text-base font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                    {formatCurrency(activeResult.totalSpent)}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    of {formatCurrency(activeResult.totalLimit)}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {Math.round(activeResult.usagePercentage)}% used
                  </span>
                </div>
              </div>

              {/* Right Side Category Legend Table (Image 1 Screen 4 Design) */}
              <div className="flex-1 flex flex-col gap-1.5 pl-2">
                {activeResult.categoryResults.slice(0, 5).map((cat, idx) => {
                  const dotColor = PALETTE[idx % PALETTE.length];
                  return (
                    <div
                      key={cat.categoryName}
                      className="flex items-center justify-between text-xs py-0.5"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 truncate">
                          {cat.categoryName}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-900 dark:text-white ml-2">
                        {formatCurrency(cat.spent)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Over Budget Notice if applicable */}
            {activeResult.status === 'OVER_BUDGET' && (
              <div className="px-3.5 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Exceeded budget by {formatCurrency(activeResult.overBudgetAmount)}</span>
              </div>
            )}
          </div>

          {/* Category Budgets List (Image 1 Screen 4 Design) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                Category Budgets
              </h2>
              <button
                onClick={() => {
                  setSelectedBudget(activeBudget);
                  openModal('CREATE_BUDGET');
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
              >
                See All
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
                    className="p-3.5 rounded-2xl bg-white/90 dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 shadow-xs flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${theme.bg}`}
                        >
                          <Icon className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">
                            {cat.categoryName}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                            {formatCurrency(cat.spent)} / {formatCurrency(cat.allocatedLimit)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {Math.round(cat.usagePercentage)}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </div>
                    </div>

                    {/* Horizontal Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            cat.status === 'OVER_BUDGET'
                              ? '#EF4444'
                              : cat.status === 'NEAR_LIMIT'
                              ? '#F59E0B'
                              : theme.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stay on Track Bottom Banner (Image 1 Screen 4 Design) */}
          <div className="rounded-[28px] p-4 bg-gradient-to-r from-[#ECFDF5] via-[#E0F2FE]/60 to-[#F0FDF4] dark:from-[#132A24] dark:to-[#172533] border border-emerald-500/20 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                <Target className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                  Stay on Track
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {activeResult.status === 'OVER_BUDGET'
                    ? 'Review shopping allocations to rebalance.'
                    : `You're ${Math.max(100 - Math.round(activeResult.usagePercentage), 0)}% under your planned spending. Great job!`}
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('AI_ASSISTANT')}
              className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-xs transition hover:scale-105 active:scale-95"
              aria-label="View Insights"
            >
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
