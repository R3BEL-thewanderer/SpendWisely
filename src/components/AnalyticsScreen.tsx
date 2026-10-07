'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { calculateAnalytics } from '../lib/analytics';
import { DatePeriod } from '../lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  'food & dining': '#a8c8e8', // Sky
  food: '#a8c8e8',
  shopping: '#e8b8c4', // Rose
  'bills & utilities': '#f4c5a8', // Peach
  bills: '#f4c5a8',
  transport: '#c8b8e0', // Lavender
  entertainment: '#a7e5d3', // Mint
  healthcare: '#d6d3d1',
  health: '#d6d3d1',
  subscriptions: '#777169',
  other: '#a8a29e',
};

const DEFAULT_COLOR_ORDER = ['#a8c8e8', '#e8b8c4', '#f4c5a8', '#c8b8e0', '#a7e5d3', '#a8a29e'];

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
    <div className="relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden touch-pan-y px-5 pt-3 pb-8 gap-4.5 no-scrollbar animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0 pt-1">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#777169] dark:text-[#a8a29e] font-sans font-semibold">
            Intelligence
          </span>
          <h1 className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff] mt-0.5">
            Analytics &amp; Trends
          </h1>
          <p className="text-[12px] text-[#777169] dark:text-[#a8a29e] font-sans">
            Quiet clarity across your spending patterns.
          </p>
        </div>

        {/* Month Selector Pill */}
        <div className="relative shrink-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as DatePeriod)}
            className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white shadow-xs focus:outline-none cursor-pointer font-sans"
          >
            <option value="CURRENT_MONTH">March 2025</option>
            <option value="PREVIOUS_MONTH">February 2025</option>
            <option value="CURRENT_WEEK">This Week</option>
            <option value="ALL_TIME">All Time</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60 text-[#0c0a09] dark:text-white" />
        </div>
      </div>

      {/* Total Spending Editorial Gradient-Orb Card ({component.gradient-orb-card}) */}
      <div className="relative overflow-hidden rounded-2xl p-5 shrink-0 min-h-[124px] bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        {/* Soft atmospheric gradient orb bloom (sky & lavender) */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full orb-sky opacity-75 dark:opacity-20 pointer-events-none" />
        <div className="absolute right-12 -bottom-10 w-40 h-40 rounded-full orb-lavender opacity-65 dark:opacity-20 pointer-events-none" />

        {/* Right side floating indicator with minimal bars */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#f0efed] dark:bg-[#24211e] flex items-center justify-center pointer-events-none border border-[#e7e5e4] dark:border-white/10 shadow-xs z-10">
          <div className="flex items-end gap-1 h-5">
            <span className="w-1 h-2.5 rounded-full bg-[#777169] dark:bg-[#a8a29e]" />
            <span className="w-1 h-5 rounded-full bg-[#0c0a09] dark:bg-white" />
            <span className="w-1 h-3.5 rounded-full bg-[#292524] dark:bg-[#d6d3d1]" />
          </div>
        </div>

        <div className="pr-16 flex flex-col relative z-10">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#777169] dark:text-[#a8a29e] font-sans">
            Total Spending
          </span>

          <div className="flex items-baseline gap-2.5 mt-1.5 flex-wrap">
            <span className="font-display text-[34px] font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff] leading-none">
              {formatCurrency(currExp)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-[#e7e5e4] dark:border-white/10 shrink-0 font-sans">
              <ArrowDown className="w-3 h-3 stroke-[2]" />
              {pctExp}%
            </span>
          </div>

          <p className="mt-1 text-[11.5px] text-[#777169] dark:text-[#a8a29e] font-sans">
            vs last month
          </p>
        </div>
      </div>

      {/* Spending Trend Spline Chart Card */}
      <div className="rounded-2xl p-5 shrink-0 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-light text-[#0c0a09] dark:text-[#ffffff]">
            Spending Trend
          </h2>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] px-2.5 py-1 rounded-full bg-[#f0efed] dark:bg-[#24211e] font-sans">
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
            <div className="relative px-2.5 py-1 rounded-full bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] text-[11px] font-medium shadow-md flex items-center justify-center font-sans">
              <span>{formatCurrency(trendPoints[activeTooltipIndex].val)}</span>
              {/* Tooltip down caret */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0c0a09] dark:bg-white rotate-45" />
            </div>
          </div>

          <svg viewBox="0 0 340 100" className="w-full h-28 overflow-visible">
            <defs>
              <linearGradient id="trendGradientEditorial" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c8b8e0" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c8b8e0" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient area underneath */}
            <path d={fillPath} fill="url(#trendGradientEditorial)" />

            {/* Curved line in warm ink */}
            <path
              d={splinePath}
              fill="none"
              stroke="currentColor"
              className="text-[#292524] dark:text-[#ffffff]"
              strokeWidth="2"
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
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? '5' : '3.5'}
                    className={isActive ? 'fill-[#0c0a09] dark:fill-white' : 'fill-[#777169] dark:fill-[#a8a29e]'}
                    stroke="#ffffff"
                    strokeWidth={isActive ? '2' : '1'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Month labels along X axis */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-normal text-[#777169] dark:text-[#a8a29e] font-sans">
            {trendPoints.map((pt, i) => (
              <span
                key={pt.month}
                onClick={() => setActiveTooltipIndex(i)}
                className={`cursor-pointer transition-colors ${
                  i === activeTooltipIndex
                    ? 'font-medium text-[#0c0a09] dark:text-white'
                    : 'hover:text-[#0c0a09]'
                }`}
              >
                {pt.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Income vs Expenses 2-Card Row */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {/* Income Card */}
        <div className="rounded-2xl p-4 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#16a34a] flex items-center justify-center">
            <ArrowUp className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="text-[11px] font-normal uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-sans mt-0.5">
            Income
          </span>
          <span className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff]">
            {formatCurrency(activeTotals.totalIncome || 45000)}
          </span>
          <div className="flex items-center gap-1 text-[10.5px] font-sans text-[#777169] dark:text-[#a8a29e]">
            <span>↑ 8% vs last month</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-2xl p-4 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white flex items-center justify-center">
            <ArrowDown className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="text-[11px] font-normal uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-sans mt-0.5">
            Expenses
          </span>
          <span className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff]">
            {formatCurrency(currExp)}
          </span>
          <div className="flex items-center gap-1 text-[10.5px] font-sans text-[#777169] dark:text-[#a8a29e]">
            <span>↓ 12% vs last month</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Donut Card */}
      <div className="rounded-2xl p-5 shrink-0 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-light text-[#0c0a09] dark:text-[#ffffff]">
            Category Allocation
          </h2>
          <button
            onClick={() => navigateTo('CATEGORIES')}
            className="text-xs font-sans text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white transition"
          >
            Manage
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Donut Chart with Center Totals in EB Garamond */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                className="text-[#f0efed] dark:text-white/10"
              />
              {donutSegments.map((seg) => (
                <circle
                  key={seg.categoryName}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="10"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              ))}
            </svg>

            {/* Center Label in Waldenburg / EB Garamond 300 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-display text-sm font-light tracking-tight text-[#0c0a09] dark:text-white leading-none">
                {formatCurrency(currExp)}
              </span>
              <span className="text-[9px] font-sans text-[#777169] dark:text-[#a8a29e] mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Right Legend List with Pastel Markers */}
          <div className="flex-1 flex flex-col gap-1.5 font-sans">
            {donutSegments.map((seg) => (
              <div key={seg.categoryName} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-normal text-[#4e4e4e] dark:text-[#d6d3d1] truncate max-w-[105px]">
                    {seg.categoryName}
                  </span>
                </div>
                <span className="font-medium text-[#0c0a09] dark:text-white">
                  {seg.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Card (Quiet editorial callout) */}
      <div
        onClick={() => navigateTo('HOME')}
        className="rounded-2xl p-4 shrink-0 bg-[#fafafa] dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center gap-3.5 cursor-pointer hover:border-[#0c0a09] dark:hover:border-white/30 transition active:scale-[0.99]"
      >
        <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 stroke-[1.8]" />
        </div>
        <div className="flex-1">
          <h4 className="font-display text-sm font-light text-[#0c0a09] dark:text-white">
            Editorial Note
          </h4>
          <p className="text-[11.5px] text-[#777169] dark:text-[#a8a29e] mt-0.5 leading-snug font-sans">
            Your Food &amp; Dining expenditures are 18% lower than last cycle. Keep this calm cadence.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#a8a29e] shrink-0" />
      </div>
    </div>
  );
}
