'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CreditCard,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

export function ScanReceiptModal() {
  const { activeModal, closeModal, showToast } = useSpendWise();

  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'month' | 'custom'>('7days');
  const [selectedCats, setSelectedCats] = useState<string[]>(['Food & Dining', 'Shopping']);
  const [txType, setTxType] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  if (activeModal !== 'TRANSACTION_FILTER') return null;

  const categories = [
    { name: 'Food & Dining', icon: '🍽️', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'Shopping', icon: '🛍️', color: 'bg-pink-50 text-pink-600 border-pink-200' },
    { name: 'Transport', icon: '🚗', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { name: 'Bills & Utilities', icon: '🏠', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Entertainment', icon: '🎮', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Health', icon: '❤️', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { name: 'Others', icon: '⋯', color: 'bg-zinc-50 text-zinc-600 border-zinc-200' },
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleReset = () => {
    setDateRange('7days');
    setSelectedCats([]);
    setTxType('ALL');
    setPaymentMethod('All');
    setMinAmount('');
    setMaxAmount('');
    showToast('Filters reset');
  };

  const handleApply = () => {
    showToast('Filters applied');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[390px] max-h-[92vh] bg-[#FAF8F5] dark:bg-[#121316] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Header (Image 3 Screen 2 Design) */}
        <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Filter Transactions
          </h2>

          <button
            onClick={closeModal}
            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Filter Body Options */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* 1. Date Range Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
              <Calendar className="w-3.5 h-3.5 opacity-60" />
              <span>Date Range</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: '7days', label: 'Last 7 days' },
                { id: '30days', label: 'Last 30 days' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom' },
              ].map((pill) => {
                const isSelected = dateRange === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setDateRange(pill.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold text-center truncate transition ${
                      isSelected
                        ? 'bg-[#3B82F6] text-white shadow-2xs'
                        : 'bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Date Box Display */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>12 Feb 2025</span>
              <span className="opacity-40">→</span>
              <span>18 Feb 2025</span>
            </div>
          </div>

          {/* 2. Categories Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
              <Tag className="w-3.5 h-3.5 opacity-60" />
              <span>Categories</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => {
                const isSelected = selectedCats.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleCategory(c.name)}
                    className={`py-1.5 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition ${
                      isSelected
                        ? `${c.color} shadow-2xs font-bold`
                        : 'bg-white dark:bg-zinc-800 border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Transaction Type Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 opacity-60" />
              <span>Transaction Type</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'EXPENSE', label: '↓ Expenses' },
                { id: 'INCOME', label: '↑ Income' },
              ].map((tab) => {
                const isSelected = txType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTxType(tab.id as any)}
                    className={`py-1.5 rounded-xl text-[11px] font-bold transition ${
                      isSelected
                        ? 'bg-[#8B5CF6] text-white shadow-2xs'
                        : 'bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Payment Method Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
              <CreditCard className="w-3.5 h-3.5 opacity-60" />
              <span>Payment Method</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['All', 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'].map((pm) => {
                const isSelected = paymentMethod === pm;
                return (
                  <button
                    key={pm}
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-1.5 px-3 rounded-full text-[11px] font-semibold border transition ${
                      isSelected
                        ? 'bg-[#3B82F6] text-white border-blue-500 shadow-2xs'
                        : 'bg-white dark:bg-zinc-800 border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {pm}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Amount Range Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
              <span className="text-xs">₹</span>
              <span>Amount Range</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min amount"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max amount"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Bottom Action Buttons: Reset & Apply Filters (Image 3 Screen 2) */}
          <div className="flex items-center justify-between gap-3 pt-2 mt-1">
            <button
              onClick={handleReset}
              className="py-3 px-5 rounded-full text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
            >
              Reset
            </button>

            <button
              onClick={handleApply}
              className="flex-1 py-3.5 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition text-center"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
