'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  MoreHorizontal,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[390px] max-h-[92vh] bg-[#FAF8F5] dark:bg-[#121316] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Top Header Navigation matching Image 3 Screen 3 */}
        <div className="px-5 py-3.5 border-b border-black/5 dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-zinc-900 dark:text-white">
            Add Expense
          </span>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Top Glowing Orb with Floating Center Icon (Image 3 Screen 3) */}
          <div className="relative w-full flex flex-col items-center justify-center py-2">
            <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#FFE4E6]/80 via-[#FED7AA]/70 to-[#E0E7FF]/60 blur-2xl pointer-events-none" />

            <div className="relative z-10 w-16 h-16 rounded-full bg-white/95 dark:bg-zinc-800 shadow-md border border-white/80 dark:border-white/10 flex items-center justify-center">
              <Receipt className="w-7 h-7 text-rose-500 stroke-[2]" />
            </div>

            {/* Big Amount Input Display */}
            <div className="relative z-10 mt-3 flex flex-col items-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">₹</span>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0"
                  className="w-40 text-center text-3xl font-black bg-transparent focus:outline-none placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                />
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                Enter amount
              </span>
            </div>
          </div>

          {/* Form Rows Group (Image 3 Screen 3 Design) */}
          <div className="rounded-3xl bg-white dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 p-1 divide-y divide-black/5 dark:divide-white/5 shadow-xs">
            {/* Category */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 opacity-70">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-medium">Category</span>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none cursor-pointer text-right"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="flex items-center justify-between p-3.5 gap-2">
              <div className="flex items-center gap-2.5 opacity-70 flex-shrink-0">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Description</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a description"
                className="text-xs font-semibold text-zinc-900 dark:text-white bg-transparent focus:outline-none text-right flex-1 placeholder:text-zinc-400"
              />
            </div>

            {/* Date */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 opacity-70">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Date</span>
              </div>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today"
                className="text-xs font-semibold text-zinc-900 dark:text-white bg-transparent focus:outline-none text-right w-28"
              />
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5 opacity-70">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-medium">Payment Method</span>
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none cursor-pointer text-right"
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
              <div className="flex items-center gap-2.5 opacity-70">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-medium">Tags</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold"
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
                      className="w-16 px-1.5 py-0.5 rounded bg-zinc-100 text-[10px]"
                    />
                    <button type="button" onClick={addTag} className="text-xs font-bold text-blue-600">
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs opacity-60"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-center justify-between p-3.5 gap-2">
              <div className="flex items-center gap-2.5 opacity-70 flex-shrink-0">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Notes</span>
              </div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note (optional)"
                className="text-xs font-semibold text-zinc-900 dark:text-white bg-transparent focus:outline-none text-right flex-1 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Primary Save Expense Button (Image 3 Screen 3) */}
          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-1.5 mt-1"
          >
            <span>Save Expense</span>
            <span className="text-sm">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
