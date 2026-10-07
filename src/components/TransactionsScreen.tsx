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
    <div className="relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-hidden">
      {/* Scrollable transactions list */}
      <div className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden touch-pan-y px-5 pt-3 pb-24 flex flex-col gap-4 no-scrollbar">
        {/* Header: Title & Back Button */}
        <div className="flex items-center justify-between shrink-0 pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('HOME')}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#777169] dark:text-[#a8a29e] font-sans font-semibold">
                Ledger
              </span>
              <h1 className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff]">
                Transactions
              </h1>
            </div>
          </div>

          <button
            onClick={() => openModal('ADD_EXPENSE')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Search Input Bar (ElevenLabs 8px radius, hairline border, 2px ink focus) */}
        <div className="flex items-center gap-2 w-full shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777169] dark:text-[#a8a29e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger entries..."
              className="w-full pl-10 pr-8 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-normal text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0c0a09] dark:focus:border-white shadow-xs transition font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777169]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => openModal('TRANSACTION_FILTER')}
            className="w-10 h-10 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition hover:border-[#0c0a09] active:scale-95 text-[#0c0a09] dark:text-white shrink-0"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Editorial Segmented Pill Control (Ink pill primary, no saturated colors) */}
        <div className="flex items-center p-1 rounded-full bg-[#f0efed] dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shrink-0">
          {(['ALL', 'EXPENSE', 'INCOME'] as const).map((tab) => {
            const isSelected = selectedTab === tab;
            const label = tab === 'ALL' ? 'All Entries' : tab === 'EXPENSE' ? 'Expenses' : 'Income';
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all font-sans ${
                  isSelected
                    ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] shadow-xs'
                    : 'text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Transactions List Grouped by Date */}
        {filteredTransactions.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-center flex flex-col items-center justify-center my-6">
            <p className="text-xs font-normal text-[#777169] dark:text-[#a8a29e] font-sans">
              No matching records found
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTab('ALL');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white font-medium text-xs font-sans"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(groupedTransactions).map(([date, group]) => (
              <div key={date} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-[#777169] dark:text-[#a8a29e] font-sans uppercase tracking-wider">
                    {date}
                  </span>
                  <span className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] font-sans">
                    {group.netExpense >= 0
                      ? `- ${formatCurrency(group.netExpense)}`
                      : `+ ${formatCurrency(-group.netExpense)}`}
                  </span>
                </div>

                <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden">
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

      {/* Floating Action Button (Warm near-black ink pill circle) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={() => openModal('ADD_EXPENSE')}
          className="w-12 h-12 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] shadow-lg flex items-center justify-center transition active:scale-95 cursor-pointer"
          aria-label="Add Entry"
        >
          <Plus className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}
