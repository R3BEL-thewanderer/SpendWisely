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
  const { activeModal, closeModal, categories, showToast } = useSpendWise();

  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'month' | 'custom'>('month');
  const [selectedCats, setSelectedCats] = useState<string[]>(['Food & Dining', 'Shopping']);
  const [txType, setTxType] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [paymentMethod, setPaymentMethod] = useState<string>('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  if (activeModal !== 'TRANSACTION_FILTER') return null;

  const toggleCategory = (catName: string) => {
    if (selectedCats.includes(catName)) {
      setSelectedCats(selectedCats.filter((c) => c !== catName));
    } else {
      setSelectedCats([...selectedCats, catName]);
    }
  };

  const handleReset = () => {
    setDateRange('month');
    setSelectedCats([]);
    setTxType('ALL');
    setPaymentMethod('All');
    setMinAmount('');
    setMaxAmount('');
    showToast('Filters reset to default');
  };

  const handleApply = () => {
    showToast('Ledger filter applied');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[92vh] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
        {/* Top Handle for mobile */}
        <div className="w-full flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1 rounded-full bg-[#d6d3d1] dark:bg-white/10" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
            Filter Ledger Records
          </h2>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Filter Body Options */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* 1. Date Range Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#0c0a09] dark:text-white font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#777169] dark:text-[#a8a29e]" />
              <span>Date Range</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: '7days', label: '7 Days' },
                { id: '30days', label: '30 Days' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom' },
              ].map((pill) => {
                const isSelected = dateRange === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setDateRange(pill.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium text-center truncate transition ${
                      isSelected
                        ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] shadow-xs'
                        : 'bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e]'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Categories Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#0c0a09] dark:text-white font-medium">
              <Tag className="w-3.5 h-3.5 text-[#777169] dark:text-[#a8a29e]" />
              <span>Categories</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => {
                const isSelected = selectedCats.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleCategory(c.name)}
                    className={`py-1.5 px-2.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border transition ${
                      isSelected
                        ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#181615] border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e]'
                    }`}
                  >
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Transaction Type Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#0c0a09] dark:text-white font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#777169] dark:text-[#a8a29e]" />
              <span>Transaction Type</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'ALL', label: 'All Entries' },
                { id: 'EXPENSE', label: 'Expenses' },
                { id: 'INCOME', label: 'Income' },
              ].map((tab) => {
                const isSelected = txType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTxType(tab.id as any)}
                    className={`py-1.5 rounded-lg text-[11px] font-medium transition ${
                      isSelected
                        ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] shadow-xs'
                        : 'bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e]'
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
            <div className="flex items-center gap-2 text-[#0c0a09] dark:text-white font-medium">
              <CreditCard className="w-3.5 h-3.5 text-[#777169] dark:text-[#a8a29e]" />
              <span>Payment Method</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['All', 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'].map((pm) => {
                const isSelected = paymentMethod === pm;
                return (
                  <button
                    key={pm}
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-1.5 px-3 rounded-full text-[11px] font-medium border transition ${
                      isSelected
                        ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#181615] border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e]'
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
            <div className="flex items-center gap-2 text-[#0c0a09] dark:text-white font-medium">
              <span className="text-xs text-[#777169] dark:text-[#a8a29e]">₹</span>
              <span>Amount Range</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min (₹)"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
              <input
                type="number"
                placeholder="Max (₹)"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
            </div>
          </div>

          {/* Bottom Action Buttons: Reset & Apply Filters */}
          <div className="flex items-center justify-between gap-3 pt-2 mt-1">
            <button
              onClick={handleReset}
              className="py-3 px-5 rounded-full text-xs font-medium text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white transition"
            >
              Reset
            </button>

            <button
              onClick={handleApply}
              className="flex-1 py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs hover:opacity-95 active:scale-[0.99] transition text-center"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
