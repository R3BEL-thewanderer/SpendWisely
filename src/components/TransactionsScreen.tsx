'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { TransactionItem } from '../lib/types';
import { TransactionRow } from './TransactionRow';

export function TransactionsScreen() {
  const {
    transactions,
    setSelectedTransaction,
    openModal,
    navigateTo,
  } = useSpendWise();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');

  // Filter list by search query and transaction type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        selectedTab === 'ALL' ||
        (selectedTab === 'EXPENSE' && tx.type === 'EXPENSE') ||
        (selectedTab === 'INCOME' && tx.type === 'INCOME');

      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, selectedTab]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, { txs: TransactionItem[]; netExpense: number }> = {};

    filteredTransactions.forEach((tx) => {
      const dateKey = tx.date || 'Earlier';
      if (!groups[dateKey]) {
        groups[dateKey] = { txs: [], netExpense: 0 };
      }
      groups[dateKey].txs.push(tx);

      if (tx.type === 'EXPENSE') {
        groups[dateKey].netExpense += tx.amount;
      } else {
        groups[dateKey].netExpense -= tx.amount;
      }
    });

    return groups;
  }, [filteredTransactions]);

  return (
    <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-hidden">
      {/* Scrollable transactions list */}
      <div className="flex-1 w-full overflow-y-auto px-5 pt-3 pb-24 flex flex-col gap-4 no-scrollbar">
        {/* Header: Title & Back Button */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('HOME')}
              className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 opacity-75" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Transactions
              </h1>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Your complete transaction history
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal('ADD_EXPENSE')}
            className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition active:scale-95"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Search Input Bar & Filter Button Row */}
        <div className="flex items-center gap-2 w-full shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 text-xs font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
              </button>
            )}
          </div>

          <button
            onClick={() => openModal('TRANSACTION_FILTER')}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-2xs transition hover:scale-105 active:scale-95 text-zinc-600 dark:text-zinc-300 shrink-0"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Control Pill: All, Expenses, Income (Image 3 Screen 1) */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-black/5 dark:border-white/5 shrink-0">
          {(['ALL', 'EXPENSE', 'INCOME'] as const).map((tab) => {
            const isSelected = selectedTab === tab;
            const label = tab === 'ALL' ? 'All' : tab === 'EXPENSE' ? 'Expenses' : 'Income';
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#9C7CF8] to-[#805AD5] text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Transactions List Grouped by Date (Image 3 Screen 1 Design) */}
        {filteredTransactions.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white/70 dark:bg-white/5 border border-black/5 text-center flex flex-col items-center justify-center my-6">
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              No matching transactions found
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTab('ALL');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-purple-600/10 text-purple-600 font-semibold text-xs"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(groupedTransactions).map(([date, group]) => (
              <div key={date} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    {date}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    {group.netExpense >= 0
                      ? `- ${formatCurrency(group.netExpense)}`
                      : `+ ${formatCurrency(-group.netExpense)}`}
                  </span>
                </div>

                <div className="rounded-2xl bg-white/90 dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5 shadow-xs">
                  {group.txs.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                      onClick={() => {
                        setSelectedTransaction(tx);
                        openModal('TRANSACTION_DETAIL');
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 100% STATIC PINNED Floating Action Button (FAB) matching Image 3 Screen 1 */}
      <div className="absolute bottom-3 right-4 z-20 pointer-events-auto">
        <button
          onClick={() => openModal('ADD_EXPENSE')}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#7B61FF] via-[#6366F1] to-[#3B82F6] text-white font-bold shadow-[0_10px_25px_-5px_rgba(99,102,241,0.6)] flex items-center justify-center transition hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Add Expense"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
