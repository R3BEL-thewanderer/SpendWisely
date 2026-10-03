'use client';

import React, { useState } from 'react';
import {
  PieChart,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

const DEFAULT_ALLOCATIONS = [
  { categoryName: 'Food & Drinks', percentage: 25, amount: 7500, colorHex: '#a8c8e8', iconType: 'food' },
  { categoryName: 'Shopping', percentage: 20, amount: 6000, colorHex: '#f4c5a8', iconType: 'shopping' },
  { categoryName: 'Transport', percentage: 15, amount: 4500, colorHex: '#c8b8e0', iconType: 'transport' },
  { categoryName: 'Bills & Utilities', percentage: 20, amount: 6000, colorHex: '#a7e5d3', iconType: 'bills' },
  { categoryName: 'Entertainment', percentage: 10, amount: 3000, colorHex: '#e8b8c4', iconType: 'entertainment' },
  { categoryName: 'Other', percentage: 10, amount: 3000, colorHex: '#d6d3d1', iconType: 'other' },
];

export function CreateBudgetModal() {
  const { activeModal, closeModal, createBudget } = useSpendWise();

  const [name, setName] = useState('Monthly Plan');
  const [totalLimitStr, setTotalLimitStr] = useState('30000');
  const [month, setMonth] = useState('October 2026');

  if (activeModal !== 'CREATE_BUDGET') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(totalLimitStr);
    if (!name.trim()) {
      alert('Please enter a budget plan name');
      return;
    }
    if (isNaN(limit) || limit <= 0) {
      alert('Please enter a valid budget limit');
      return;
    }

    // Scale allocations according to limit
    const allocations = DEFAULT_ALLOCATIONS.map((alloc) => ({
      ...alloc,
      amount: Math.round((limit * alloc.percentage) / 100),
    }));

    createBudget({
      name: name.trim(),
      month,
      totalLimit: limit,
      allocations,
      alertThresholdPercent: 90,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[90vh] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
              Create Budget Plan
            </h2>
            <p className="text-[10px] text-[#777169] tracking-[0.16px]">
              Set disciplined ceiling limits
            </p>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center transition active:scale-95 text-[#0c0a09] dark:text-white shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Total Limit Input with Atmospheric Bloom */}
          <div className="relative flex flex-col items-center justify-center py-4 bg-white dark:bg-[#181615] rounded-2xl border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c8b8e0]/25 blur-2xl pointer-events-none" />

            <span className="relative z-10 text-[10px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-[0.96px]">
              Monthly Planned Limit
            </span>
            <div className="relative z-10 flex items-center justify-center gap-1 mt-1">
              <span className="font-display font-light text-4xl text-[#0c0a09] dark:text-white">
                ₹
              </span>
              <input
                type="number"
                step="any"
                value={totalLimitStr}
                onChange={(e) => setTotalLimitStr(e.target.value)}
                placeholder="30000"
                className="w-44 text-center font-display font-light text-4xl bg-transparent focus:outline-none placeholder:text-[#a8a29e] text-[#0c0a09] dark:text-white tracking-tight"
              />
            </div>
          </div>

          {/* Budget Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777169] dark:text-[#a8a29e] tracking-[0.15px]">Plan Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. October Primary Plan"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none focus:border-2 focus:border-[#0c0a09] dark:focus:border-white transition"
            />
          </div>

          {/* Month */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777169] dark:text-[#a8a29e] tracking-[0.15px]">Period</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="e.g. October 2026"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none focus:border-2 focus:border-[#0c0a09] dark:focus:border-white transition"
            />
          </div>

          {/* Allocations summary preview */}
          <div className="rounded-xl p-3 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-xs text-[#777169] dark:text-[#a8a29e] flex flex-col gap-1 tracking-[0.15px]">
            <span className="font-medium text-[#0c0a09] dark:text-zinc-200">Balanced Allocation Formula:</span>
            <span>Food: 25% • Shopping: 20% • Transport: 15% • Bills: 20% • Entertainment: 10% • Misc: 10%</span>
          </div>

          {/* Submit Button - Near-Black Ink Pill */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs transition active:scale-[0.99] tracking-[0.15px] cursor-pointer mt-1"
          >
            Save Budget Plan
          </button>
        </form>
      </div>
    </div>
  );
}
