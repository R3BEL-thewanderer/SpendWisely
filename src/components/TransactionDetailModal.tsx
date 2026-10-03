'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Car,
  ChevronRight,
  Coffee,
  CreditCard,
  Edit2,
  FileText,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Receipt,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
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

  // Form states for edit mode
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

  // Determine category icon
  let IconComp: LucideIcon = ShoppingBag;
  if (isIncome || cat.includes('salary') || cat.includes('income')) {
    IconComp = Receipt;
  } else if (cat.includes('food') || cat.includes('dining') || cat.includes('drink')) {
    IconComp = Coffee;
  } else if (cat.includes('transport') || cat.includes('cab')) {
    IconComp = Car;
  } else if (cat.includes('bill') || cat.includes('util')) {
    IconComp = Receipt;
  }

  // Monthly trends for spending insights mini chart
  const trends = analytics.monthlyTrends.slice(-6);
  const maxTrendExpense = Math.max(...trends.map((t) => t.expenses), 1000);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[92vh] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
        {/* Top Header Navigation */}
        <div className="px-5 py-3.5 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              if (isEditing) setIsEditing(false);
              else closeModal();
            }}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
          </button>

          <span className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
            {isEditing ? 'Edit Entry' : 'Ledger Record'}
          </span>

          <button
            onClick={() => (isEditing ? setIsEditing(false) : startEdit())}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {isEditing ? (
          /* EDIT FORM MODE */
          <form onSubmit={handleSaveEdit} className="p-5 flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
                Title / Merchant
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
                Amount (₹)
              </label>
              <input
                type="number"
                step="any"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
                Category
              </label>
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
                Payment Method
              </label>
              <input
                type="text"
                value={editPaymentMethod}
                onChange={(e) => setEditPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
                Memo
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white focus:outline-none focus:border-[#0c0a09] dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs transition active:scale-95"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    deleteTransaction(selectedTransaction.id);
                  }
                }}
                className="w-full py-3 rounded-full border border-rose-300 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entry</span>
              </button>
            </div>
          </form>
        ) : (
          /* VIEW MODE */
          <div className="p-5 flex flex-col gap-4">
            {/* Top Atmospheric Pastel Bloom with Floating Icon */}
            <div className="relative w-full flex flex-col items-center justify-center py-3">
              <div className="absolute w-36 h-36 rounded-full bg-[#f4c5a8]/25 blur-2xl pointer-events-none" />
              <div className="absolute w-32 h-32 -bottom-2 rounded-full bg-[#c8b8e0]/20 blur-2xl pointer-events-none" />

              {/* Center Voice-Plate Circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-[#181615] shadow-xs border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white">
                <IconComp className="w-7 h-7 stroke-[1.8]" />
              </div>

              {/* Amount in Waldenburg / EB Garamond 300 */}
              <div className="relative z-10 mt-3 flex flex-col items-center text-center">
                <span className="text-xs font-sans text-[#777169] dark:text-[#a8a29e]">
                  {selectedTransaction.category}
                </span>
                <span
                  className={`font-display font-light text-4xl tracking-tight mt-0.5 ${
                    isIncome
                      ? 'text-[#16a34a] dark:text-[#4ade80]'
                      : 'text-[#0c0a09] dark:text-white'
                  }`}
                >
                  {isIncome ? '+ ' : '- '}
                  {formatCurrency(selectedTransaction.amount)}
                </span>
                <span className="text-xs font-medium text-[#0c0a09] dark:text-white mt-1">
                  {selectedTransaction.title}
                </span>
                <span className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5 font-sans">
                  {selectedTransaction.date}
                  {selectedTransaction.time ? `, ${selectedTransaction.time}` : ''}
                </span>
              </div>
            </div>

            {/* Details Form Card */}
            <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] divide-y divide-[#f0efed] dark:divide-white/[0.05] shadow-xs overflow-hidden">
              {/* Category row */}
              <div
                onClick={startEdit}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-2.5 text-[#777169] dark:text-[#a8a29e]">
                  <Tag className="w-4 h-4 stroke-[1.8]" />
                  <span className="text-xs font-normal font-sans">Category</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-xs text-[#0c0a09] dark:text-white">
                  <span>{selectedTransaction.category}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
                </div>
              </div>

              {/* Payment Method row */}
              <div
                onClick={startEdit}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-2.5 text-[#777169] dark:text-[#a8a29e]">
                  <CreditCard className="w-4 h-4 stroke-[1.8]" />
                  <span className="text-xs font-normal font-sans">Payment Method</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-xs text-[#0c0a09] dark:text-white">
                  <span>{selectedTransaction.paymentMethod || 'UPI'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
                </div>
              </div>

              {/* Notes row */}
              <div
                onClick={startEdit}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-2.5 text-[#777169] dark:text-[#a8a29e]">
                  <FileText className="w-4 h-4 stroke-[1.8]" />
                  <span className="text-xs font-normal font-sans">Memo</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-xs text-[#0c0a09] dark:text-white max-w-[55%] truncate text-right">
                  <span className="truncate">{selectedTransaction.notes || 'No memo recorded'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e] flex-shrink-0" />
                </div>
              </div>

              {/* Tags row */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2.5 text-[#777169] dark:text-[#a8a29e]">
                  <Tag className="w-4 h-4 stroke-[1.8]" />
                  <span className="text-xs font-normal font-sans">Tags</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(selectedTransaction.tags && selectedTransaction.tags.length > 0
                    ? selectedTransaction.tags
                    : ['Essentials']
                  ).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04] text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                  <button
                    onClick={startEdit}
                    className="w-5 h-5 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white flex items-center justify-center text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Spending Insights Section Card */}
            <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] p-4 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#777169] dark:text-[#a8a29e]" />
                  <h4 className="font-display font-light text-sm text-[#0c0a09] dark:text-white">
                    Spending Insights
                  </h4>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
              </div>

              <p className="text-[11.5px] text-[#777169] dark:text-[#a8a29e] font-sans">
                Your {selectedTransaction.category} expenditures reflect a calm, verified cadence.
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
                            isCurrent
                              ? 'bg-[#292524] dark:bg-white'
                              : 'bg-[#f0efed] dark:bg-[#24211e]'
                          }`}
                          style={{ height: `${Math.max(pct, 12)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-sans text-[#777169] dark:text-[#a8a29e]">
                        {m.monthLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions: Edit & Delete */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={startEdit}
                className="py-3 px-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Entry</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    deleteTransaction(selectedTransaction.id);
                  }
                }}
                className="py-3 px-3 rounded-full border border-rose-300 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-medium text-xs flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition active:scale-95"
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
