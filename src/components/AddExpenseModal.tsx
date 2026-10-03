'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Plus,
  Receipt,
  Tag,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Subscriptions',
  'Other',
];

const PAYMENT_METHODS = [
  'UPI',
  'HDFC Credit Card',
  'Debit Card',
  'Cash',
  'Net Banking',
];

export function AddExpenseModal() {
  const { activeModal, closeModal, addExpense } = useSpendWise();

  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Today');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>(['Essentials']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  if (activeModal !== 'ADD_EXPENSE') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const success = addExpense({
      amount: parsedAmount,
      title: title.trim() || category,
      category,
      date,
      paymentMethod,
      notes,
      tags,
    });

    if (success) {
      setAmountStr('');
      setTitle('');
      setNotes('');
    }
  };

  const addTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[92vh] bg-[#f5f5f5] dark:bg-[#181615] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Top Header Navigation */}
        <div className="px-5 py-3.5 border-b border-[#e7e5e4] dark:border-white/[0.06] flex items-center justify-between flex-shrink-0">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
          </button>

          <span className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
            Add Expense Entry
          </span>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Top Atmospheric Pastel Bloom with Floating Icon */}
          <div className="relative w-full flex flex-col items-center justify-center py-2">
            <div className="absolute w-36 h-36 rounded-full bg-[#f4c5a8]/25 blur-2xl pointer-events-none" />
            <div className="absolute w-32 h-32 -bottom-2 rounded-full bg-[#c8b8e0]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 w-14 h-14 rounded-full bg-white dark:bg-[#24211e] shadow-2xs border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white">
              <Receipt className="w-6 h-6 stroke-[1.8]" />
            </div>

            {/* Big Amount Input Display with Waldenburg Light / EB Garamond 300 */}
            <div className="relative z-10 mt-3 flex flex-col items-center">
              <div className="flex items-center justify-center gap-1">
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
              <span className="text-[11px] text-[#777169] dark:text-[#a8a29e] tracking-[0.16px] mt-0.5">
                Enter expense amount
              </span>
            </div>
          </div>

          {/* Form Rows Group */}
          <div className="rounded-2xl bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] p-1 divide-y divide-[#e7e5e4] dark:divide-white/[0.06] shadow-2xs">
            {/* Category */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 text-[#777169] dark:text-[#a8a29e]">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Category</span>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none cursor-pointer text-right"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Title / Description */}
            <div className="flex items-center justify-between p-3.5 gap-2">
              <div className="flex items-center gap-2.5 text-[#777169] flex-shrink-0">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Title</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blue Tokai Coffee"
                className="text-xs font-medium text-[#0c0a09] dark:text-white bg-transparent focus:outline-none text-right flex-1 placeholder:text-[#a8a29e]"
              />
            </div>

            {/* Date */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 text-[#777169]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Date</span>
              </div>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs font-medium text-[#0c0a09] dark:text-white bg-transparent focus:outline-none text-right"
              />
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 text-[#777169]">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Payment Method</span>
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none cursor-pointer text-right"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 text-[#777169]">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Tags</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full bg-[#f0efed] dark:bg-white/10 border border-[#e7e5e4] dark:border-white/10 text-[#0c0a09] dark:text-zinc-200 text-[10px] font-medium"
                  >
                    {t}
                  </span>
                ))}
                {showTagInput ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Tag"
                      className="w-16 px-1.5 py-0.5 rounded-md bg-[#f0efed] dark:bg-[#181615] text-[#0c0a09] dark:text-white text-[10px]"
                    />
                    <button type="button" onClick={addTag} className="text-xs font-medium text-[#0c0a09] dark:text-white">
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="w-5 h-5 rounded-full bg-[#f0efed] dark:bg-white/10 flex items-center justify-center text-xs text-[#777169] dark:text-[#a8a29e]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-center justify-between p-3.5 gap-2">
              <div className="flex items-center gap-2.5 text-[#777169] dark:text-[#a8a29e] flex-shrink-0">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Notes</span>
              </div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add an optional memo"
                className="text-xs font-medium text-[#0c0a09] dark:text-white bg-transparent focus:outline-none text-right flex-1 placeholder:text-[#a8a29e]"
              />
            </div>
          </div>

          {/* Primary Ink Pill CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:text-[#0c0a09] dark:hover:bg-[#f0efed] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 mt-1 tracking-[0.15px] cursor-pointer"
          >
            <span>Record Expense</span>
            <span className="text-sm">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
