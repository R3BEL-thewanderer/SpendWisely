'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { calculateAnalytics } from '../lib/analytics';
import { DatePeriod } from '../lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  'food & dining': '#3B82F6', // Blue
  food: '#3B82F6',
  shopping: '#EC4899', // Pink
  'bills & utilities': '#F97316', // Orange
  bills: '#F97316',
  transport: '#8B5CF6', // Purple
  entertainment: '#14B8A6', // Teal
  healthcare: '#EF4444',
  health: '#EF4444',
  subscriptions: '#10B981',
  other: '#6B7280',
};

const DEFAULT_COLOR_ORDER = ['#3B82F6', '#EC4899', '#F97316', '#8B5CF6', '#14B8A6', '#6B7280'];

export function AnalyticsScreen() {
  const { transactions, categories, budgets, goals, navigateTo } = useSpendWise();
  const [selectedPeriod, setSelectedPeriod] = useState<DatePeriod>('CURRENT_MONTH');
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number>(2); // March by default

  const activeAnalytics = React.useMemo(
    () => calculateAnalytics(transactions, categories, budgets, goals, selectedPeriod),
    [transactions, categories, budgets, goals, selectedPeriod]
  );

  const activeTotals = activeAnalytics.totals;

  // Trend comparisons
  const prevExp =
    activeAnalytics.monthlyTrends.length >= 2
      ? activeAnalytics.monthlyTrends[activeAnalytics.monthlyTrends.length - 2].expenses
      : 27930;
  const currExp = activeTotals.totalExpenses || 24580;
  const diffExp = currExp - prevExp;
  const pctExp = prevExp > 0 ? Math.round((Math.abs(diffExp) / prevExp) * 100) : 12;

  // Trend data points for smooth curved chart (Jan - Jun)
  const trendPoints = [
    { month: 'Jan', val: 3200, x: 25, y: 70 },
    { month: 'Feb', val: 3800, x: 80, y: 60 },
    { month: 'Mar', val: 5420, x: 140, y: 25 },
    { month: 'Apr', val: 3600, x: 200, y: 65 },
    { month: 'May', val: 4700, x: 260, y: 42 },
    { month: 'Jun', val: 4100, x: 315, y: 52 },
  ];

  // SVG smooth spline path
  const splinePath =
    'M 25 70 C 50 68, 60 60, 80 60 C 105 60, 115 25, 140 25 C 165 25, 180 65, 200 65 C 225 65, 240 42, 260 42 C 285 42, 295 52, 315 52';
  const fillPath = `${splinePath} L 315 95 L 25 95 Z`;

  // Dynamic Donut breakdown for Top Categories
  const breakdownList = activeAnalytics.categoryBreakdown.slice(0, 6);
  const totalCategorySpent = breakdownList.reduce((acc, c) => acc + c.spentAmount, 0) || 1;

  // Donut circumference for r=38 -> C ≈ 238.76
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const donutSegments = breakdownList.map((item, index) => {
    const fraction = item.spentAmount / totalCategorySpent;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle * circumference;
    cumulativeAngle += fraction;
    const color =
      CATEGORY_COLORS[item.categoryName.toLowerCase()] ||
      DEFAULT_COLOR_ORDER[index % DEFAULT_COLOR_ORDER.length];
    return {
      ...item,
      color,
      strokeDasharray,
      strokeDashoffset,
      pct: Math.round(fraction * 100),
    };
  });

  return (
    <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-y-auto px-5 pt-3 pb-28 gap-4 no-scrollbar animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Understand your spending better</p>
        </div>

        {/* Month Selector Pill */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as DatePeriod)}
            className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="CURRENT_MONTH">March 2025</option>
            <option value="PREVIOUS_MONTH">February 2025</option>
            <option value="CURRENT_WEEK">This Week</option>
            <option value="ALL_TIME">All Time</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60 text-zinc-600 dark:text-zinc-300" />
        </div>
      </div>

      {/* Total Spending Fluid Card */}
      <div className="relative overflow-hidden rounded-[28px] p-5 bg-gradient-to-br from-[#E2ECFE] via-[#EDE9FE] to-[#FCE7F3]/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 border border-white/80 dark:border-white/10 shadow-xs">
        {/* Right side floating glass icon badge */}
        <div className="absolute right-4 top-4 w-11 h-11 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/60 dark:border-white/10 shadow-xs">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.2]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Total Spending</span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            {pctExp}%
          </span>
        </div>

        <div className="mt-2">
          <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {formatCurrency(currExp)}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
          vs last month
        </p>

        {/* Decorative subtle wave glow at bottom */}
        <div className="absolute -bottom-4 left-0 right-0 h-10 bg-gradient-to-t from-white/30 dark:from-white/5 to-transparent pointer-events-none" />
      </div>

      {/* Spending Trend Spline Chart Card */}
      <div className="rounded-[28px] p-5 bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Spending Trend</h2>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700/50">
            <span>Monthly</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative w-full pt-6 pb-2">
          {/* Tooltip Badge for Active Month */}
          <div
            className="absolute transition-all duration-300 pointer-events-none -top-1"
            style={{
              left: `${(trendPoints[activeTooltipIndex].x / 340) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="relative px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[11px] font-bold shadow-md flex items-center justify-center">
              <span>{formatCurrency(trendPoints[activeTooltipIndex].val)}</span>
              {/* Tooltip down caret */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-white rotate-45" />
            </div>
          </div>

          <svg viewBox="0 0 340 100" className="w-full h-28 overflow-visible">
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#C084FC" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient area underneath */}
            <path d={fillPath} fill="url(#trendGradient)" />

            {/* Curved line */}
            <path
              d={splinePath}
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data point dots */}
            {trendPoints.map((pt, i) => {
              const isActive = i === activeTooltipIndex;
              return (
                <g
                  key={pt.month}
                  className="cursor-pointer"
                  onClick={() => setActiveTooltipIndex(i)}
                >
                  {isActive && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill="#6366F1"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? '5' : '3.5'}
                    fill={isActive ? '#4F46E5' : '#818CF8'}
                    stroke="#FFFFFF"
                    strokeWidth={isActive ? '2' : '1.5'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Month labels along X axis */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {trendPoints.map((pt, i) => (
              <span
                key={pt.month}
                onClick={() => setActiveTooltipIndex(i)}
                className={`cursor-pointer transition-colors ${
                  i === activeTooltipIndex
                    ? 'font-bold text-zinc-800 dark:text-zinc-200'
                    : 'hover:text-zinc-600'
                }`}
              >
                {pt.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Income vs Expenses 2-Card Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income Card */}
        <div className="rounded-[24px] p-4 bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Income</span>
          <span className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {formatCurrency(activeTotals.totalIncome || 45000)}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>8% vs last month</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-[24px] p-4 bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Expenses</span>
          <span className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {formatCurrency(currExp)}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowDown className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>12% vs last month</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Donut Card */}
      <div className="rounded-[28px] p-5 bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Category Breakdown</h2>
          <button
            onClick={() => navigateTo('CATEGORIES')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition"
          >
            See All
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Donut Chart with Center Totals */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="11"
                className="text-zinc-100 dark:text-zinc-700/40"
              />
              {donutSegments.map((seg) => (
                <circle
                  key={seg.categoryName}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="11"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              ))}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                {formatCurrency(currExp)}
              </span>
              <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">
                Total Spent
              </span>
            </div>
          </div>

          {/* Right Legend List */}
          <div className="flex-1 flex flex-col gap-1.5">
            {donutSegments.map((seg) => (
              <div key={seg.categoryName} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[105px]">
                    {seg.categoryName}
                  </span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {seg.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Card with Yellow Lightbulb */}
      <div
        onClick={() => navigateTo('HOME')}
        className="rounded-[24px] p-4 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 shadow-xs flex items-center gap-3.5 cursor-pointer hover:bg-amber-500/15 transition active:scale-[0.99]"
      >
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 fill-amber-500/30" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Insight</h4>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5 leading-snug">
            Your Food &amp; Drinks spending is 18% lower than last month. Great job!
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
      </div>
    </div>
  );
}
