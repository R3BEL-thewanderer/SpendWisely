'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Car,
  ChevronRight,
  Coffee,
  CreditCard,
  Edit2,
  FileText,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Receipt,
  ShoppingBag,
  Tag,
  Trash2,
  Tv,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';

export function TransactionDetailModal() {
  const {
    activeModal,
    closeModal,
    selectedTransaction,
    updateTransaction,
    deleteTransaction,
    analytics,
  } = useSpendWise();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (activeModal !== 'TRANSACTION_DETAIL' || !selectedTransaction) return null;

  const isIncome = selectedTransaction.type === 'INCOME';
  const cat = (selectedTransaction.category || '').toLowerCase();

  const startEdit = () => {
    setEditTitle(selectedTransaction.title);
    setEditAmount(selectedTransaction.amount.toString());
    setEditCategory(selectedTransaction.category);
    setEditPaymentMethod(selectedTransaction.paymentMethod || 'UPI');
    setEditNotes(selectedTransaction.notes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(editAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    updateTransaction({
      ...selectedTransaction,
      title: editTitle.trim() || selectedTransaction.title,
      amount: parsedAmount,
      category: editCategory.trim() || selectedTransaction.category,
      paymentMethod: editPaymentMethod.trim() || selectedTransaction.paymentMethod,
      notes: editNotes.trim(),
    });
    setIsEditing(false);
  };

  // Determine category icon & colors
  let IconComp = ShoppingBag;
  let orbGradient = 'from-[#FFD8CC]/70 via-[#FFE4E6]/60 to-[#E7E0FF]/70';
  let iconColor = 'text-rose-500';

  if (isIncome || cat.includes('salary') || cat.includes('income')) {
    IconComp = Receipt;
    orbGradient = 'from-[#D1FAE5]/70 via-[#E0F2FE]/60 to-[#E7E0FF]/70';
    iconColor = 'text-emerald-600';
  } else if (cat.includes('food') || cat.includes('dining')) {
    IconComp = Coffee;
    orbGradient = 'from-[#FFE4E6]/70 via-[#FED7AA]/60 to-[#FEF3C7]/70';
    iconColor = 'text-orange-500';
  } else if (cat.includes('transport')) {
    IconComp = Car;
    orbGradient = 'from-[#E0E7FF]/70 via-[#EDE9FE]/60 to-[#FCE7F3]/70';
    iconColor = 'text-indigo-600';
  } else if (cat.includes('bill') || cat.includes('util')) {
    IconComp = Receipt;
    orbGradient = 'from-[#E0F2FE]/70 via-[#BAE6FD]/60 to-[#E0E7FF]/70';
    iconColor = 'text-blue-500';
  }

  // Monthly trends for spending insights mini chart
  const trends = analytics.monthlyTrends.slice(-6);
  const maxTrendExpense = Math.max(...trends.map((t) => t.expenses), 1000);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[390px] max-h-[92vh] bg-[#FAF8F5] dark:bg-[#121316] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* Top Header Navigation */}
        <div className="px-5 py-3.5 border-b border-black/5 dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              setIsEditing(false);
              closeModal();
            }}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-zinc-900 dark:text-white">
            {isEditing ? 'Edit Expense' : 'Transaction Details'}
          </span>

          <button
            onClick={startEdit}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {isEditing ? (
          /* EDIT FORM MODE (Image 3 Screen 4) */
          <form onSubmit={handleSaveEdit} className="p-5 flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase">Description</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase">Amount (₹)</label>
              <input
                type="number"
                step="any"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase">Category</label>
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase">Payment Method</label>
              <input
                type="text"
                value={editPaymentMethod}
                onChange={(e) => setEditPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md transition active:scale-95"
              >
                Save Changes →
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    deleteTransaction(selectedTransaction.id);
                  }
                }}
                className="w-full py-3 rounded-full border border-rose-500/20 text-rose-600 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-500/5 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Transaction</span>
              </button>
            </div>
          </form>
        ) : (
          /* VIEW MODE (Image 1 Screen 3 Design) */
          <div className="p-5 flex flex-col gap-4">
            {/* Top Atmospheric Glowing Orb with Floating Icon */}
            <div className="relative w-full flex flex-col items-center justify-center py-4">
              {/* Glowing diffuse sphere behind icon */}
              <div
                className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr ${orbGradient} blur-2xl pointer-events-none`}
              />

              {/* Center Floating White Glass Circle */}
              <div className="relative z-10 w-18 h-18 rounded-full bg-white/95 dark:bg-zinc-800 shadow-md border border-white/80 dark:border-white/10 flex items-center justify-center">
                <IconComp className={`w-8 h-8 ${iconColor} stroke-[2]`} />
              </div>

              {/* Category, Amount, Merchant, Date */}
              <div className="relative z-10 mt-3 flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {selectedTransaction.category}
                </span>
                <span
                  className={`text-3xl font-black tracking-tight mt-0.5 ${
                    isIncome ? 'text-emerald-600' : 'text-zinc-900 dark:text-white'
                  }`}
                >
                  {isIncome ? '+ ' : '- '}
                  {formatCurrency(selectedTransaction.amount)}
                </span>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selectedTransaction.title}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                  {selectedTransaction.date}
                  {selectedTransaction.time ? `, ${selectedTransaction.time}` : ''}
                </span>
              </div>
            </div>

            {/* Details Form Card (Image 1 Screen 3 Design) */}
            <div className="rounded-3xl bg-white dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 p-1 divide-y divide-black/5 dark:divide-white/5 shadow-xs">
              {/* Category row */}
              <div
                onClick={startEdit}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-2.5 opacity-70">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium">Category</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-xs text-zinc-900 dark:text-white">
                  <span>{selectedTransaction.category}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </div>
              </div>

              {/* Payment Method row */}
              <div
                onClick={startEdit}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-2.5 opacity-70">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-medium">Payment Method</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-xs text-zinc-900 dark:text-white">
                  <span>{selectedTransaction.paymentMethod || 'UPI'}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </div>
              </div>

              {/* Notes row */}
              <div
                onClick={startEdit}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-2.5 opacity-70">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-medium">Notes</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-xs text-zinc-900 dark:text-white max-w-[55%] truncate text-right">
                  <span className="truncate">{selectedTransaction.notes || 'Online purchase'}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                </div>
              </div>

              {/* Tags row */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2.5 opacity-70">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium">Tags</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(selectedTransaction.tags && selectedTransaction.tags.length > 0
                    ? selectedTransaction.tags
                    : ['Essentials']
                  ).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold"
                    >
                      {t}
                    </span>
                  ))}
                  <button
                    onClick={startEdit}
                    className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs opacity-60"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Spending Insights Section Card (Image 1 Screen 3 Design) */}
            <div className="rounded-3xl bg-white dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 p-4 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                    Spending Insights
                  </h4>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Your {selectedTransaction.category} spending is pacing within verified limits this month.
              </p>

              {/* Mini 6-Month Bar Chart */}
              <div className="h-20 w-full flex items-end justify-between gap-2 pt-2 px-1">
                {trends.map((m, idx) => {
                  const isCurrent = idx === trends.length - 1;
                  const pct = (m.expenses / maxTrendExpense) * 100;

                  return (
                    <div
                      key={m.monthKey}
                      className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                    >
                      <div className="w-full flex items-end justify-center h-12">
                        <div
                          className={`w-3.5 rounded-t-md transition-all ${
                            isCurrent ? 'bg-[#FB7185]' : 'bg-[#FECDD3]/70 dark:bg-zinc-700'
                          }`}
                          style={{ height: `${Math.max(pct, 12)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-semibold opacity-50">{m.monthLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions: Edit & Delete */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={startEdit}
                className="py-3 px-3 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95 text-zinc-900 dark:text-white"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    deleteTransaction(selectedTransaction.id);
                  }
                }}
                className="py-3 px-3 rounded-full bg-rose-500/10 text-rose-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
