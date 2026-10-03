'use client';

import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  FileText,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gift', 'Refund', 'Other'];

export function AddIncomeModal() {
  const { activeModal, closeModal, addIncome } = useSpendWise();

  const [amountStr, setAmountStr] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState('Today');
  const [notes, setNotes] = useState('');

  if (activeModal !== 'ADD_INCOME') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    const success = addIncome({
      amount: parsedAmount,
      source: source.trim() || 'Salary Credit',
      category,
      date,
      notes,
    });

    if (success) {
      setAmountStr('');
      setSource('');
      setNotes('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[390px] max-h-[90vh] bg-[#F8F7F4] dark:bg-[#15171a] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="font-bold text-sm tracking-tight">Add Income</h2>
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
          {/* Large Amount Input */}
          <div className="flex flex-col items-center justify-center py-4 bg-white/70 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-semibold opacity-60 uppercase tracking-wider">
              Income Amount
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-3xl font-extrabold text-emerald-500">₹</span>
              <input
                type="number"
                step="any"
                autoFocus
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                className="w-48 text-center text-3xl font-extrabold bg-transparent focus:outline-none placeholder:opacity-30"
              />
            </div>
          </div>

          {/* Income Source / Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold opacity-70">Source / Title</label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="E.g. Monthly Salary, Freelance project"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition placeholder:opacity-40"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold opacity-70">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {INCOME_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Row */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold opacity-70">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today"
                className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold opacity-70">Notes (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 opacity-40" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional deposit information..."
                rows={2}
                className="w-full pl-10 pr-3.5 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition placeholder:opacity-40"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition mt-2"
          >
            Save Income
          </button>
        </form>
      </div>
    </div>
  );
}
