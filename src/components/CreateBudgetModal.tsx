'use client';

import React, { useState } from 'react';
import {
  PieChart,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

const DEFAULT_ALLOCATIONS = [
  { categoryName: 'Food & Drinks', percentage: 25, amount: 7500, colorHex: '#9CC9FF', iconType: 'food' },
  { categoryName: 'Shopping', percentage: 20, amount: 6000, colorHex: '#EF9C8D', iconType: 'shopping' },
  { categoryName: 'Transport', percentage: 15, amount: 4500, colorHex: '#C9B8FF', iconType: 'transport' },
  { categoryName: 'Bills & Utilities', percentage: 20, amount: 6000, colorHex: '#F5D98A', iconType: 'bills' },
  { categoryName: 'Entertainment', percentage: 10, amount: 3000, colorHex: '#B9DEC9', iconType: 'entertainment' },
  { categoryName: 'Other', percentage: 10, amount: 3000, colorHex: '#F4C7B5', iconType: 'other' },
];

export function CreateBudgetModal() {
  const { activeModal, closeModal, createBudget } = useSpendWise();

  const [name, setName] = useState('Monthly Plan');
  const [totalLimitStr, setTotalLimitStr] = useState('30000');
  const [month, setMonth] = useState('March 2025');

  if (activeModal !== 'CREATE_BUDGET') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(totalLimitStr);
    if (!name.trim()) {
      alert('Please enter a budget name');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[380px] max-h-[90vh] bg-[#F8F7F4] dark:bg-[#15171a] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="font-bold text-sm tracking-tight">Create Monthly Budget</h2>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Budget Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold opacity-70">Budget Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. March Budget, Vacation Plan"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
            />
          </div>

          {/* Month */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold opacity-70">Period / Month</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="E.g. March 2025"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
            />
          </div>

          {/* Total Limit Input */}
          <div className="flex flex-col items-center justify-center py-4 bg-white/70 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-semibold opacity-60 uppercase tracking-wider">
              Total Limit
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                value={totalLimitStr}
                onChange={(e) => setTotalLimitStr(e.target.value)}
                placeholder="30000"
                className="w-44 text-center text-3xl font-extrabold bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Allocations summary preview */}
          <div className="rounded-2xl p-3 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs opacity-70 flex flex-col gap-1">
            <span className="font-semibold">Auto-distributed Category Limits:</span>
            <span>Food: 25% • Shopping: 20% • Transport: 15% • Utilities: 20% • Fun: 10% • Misc: 10%</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition mt-2"
          >
            Save Budget Plan
          </button>
        </form>
      </div>
    </div>
  );
}
