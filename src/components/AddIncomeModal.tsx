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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[90vh] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
              Record Income
            </h2>
            <p className="text-[10px] text-[#777169] tracking-[0.16px]">
              Credit entry to your primary balance
            </p>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center transition active:scale-95 text-[#0c0a09] dark:text-white shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Large Amount Input Card with Pastel Mint Bloom */}
          <div className="relative flex flex-col items-center justify-center py-4 bg-white dark:bg-[#1c1917] rounded-2xl border border-[#e7e5e4] dark:border-white/10 shadow-2xs overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#a7e5d3]/25 blur-2xl pointer-events-none" />

            <span className="relative z-10 text-[10px] font-medium text-[#777169] uppercase tracking-[0.96px]">
              Income Credit
            </span>
            <div className="relative z-10 flex items-center justify-center gap-1 mt-1">
              <span className="font-display font-light text-4xl text-[#0c0a09] dark:text-white">₹</span>
              <input
                type="number"
                step="any"
                autoFocus
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                className="w-44 text-center font-display font-light text-4xl bg-transparent focus:outline-none placeholder:text-[#a8a29e] text-[#0c0a09] dark:text-white tracking-tight"
              />
            </div>
          </div>

          {/* Income Source / Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777169] tracking-[0.15px]">Source / Remitter</label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Monthly Salary, Consulting"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none focus:border-2 focus:border-[#0c0a09] transition placeholder:text-[#a8a29e]"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#777169] tracking-[0.15px]">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {INCOME_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer tracking-[0.15px] ${
                      isSelected
                        ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] shadow-xs'
                        : 'bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white'
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
            <label className="text-xs font-medium text-[#777169] tracking-[0.15px]">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a8a29e]" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today"
                className="w-full pl-9 pr-2.5 py-2 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none focus:border-2 focus:border-[#0c0a09] transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777169] tracking-[0.15px]">Memo (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-[#a8a29e]" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for your ledger records..."
                rows={2}
                className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none focus:border-2 focus:border-[#0c0a09] transition placeholder:text-[#a8a29e]"
              />
            </div>
          </div>

          {/* Submit Button - Near-Black Ink Pill */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs transition active:scale-[0.99] tracking-[0.15px] cursor-pointer mt-1"
          >
            Record Income Credit
          </button>
        </form>
      </div>
    </div>
  );
}
