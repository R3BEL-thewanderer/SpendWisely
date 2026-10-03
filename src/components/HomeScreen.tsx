'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  QrCode,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { SmartInsightCard } from './SmartInsightCard';
import { TransactionRow } from './TransactionRow';
import { ThemeToggle } from './ThemeToggle';

export function HomeScreen() {
  const {
    totals,
    transactions,
    analytics,
    insights,
    userProfile,
    isBalanceVisible,
    toggleBalanceVisibility,
    navigateTo,
    openModal,
    setSelectedTransaction,
    askAssistant,
    showToast,
  } = useSpendWise();

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const firstName = userProfile.name.split(' ')[0] || 'Ashish';
  const recentTransactions = transactions.slice(0, 5);

  const prevExpenses =
    analytics.monthlyTrends.length >= 2
      ? analytics.monthlyTrends[analytics.monthlyTrends.length - 2].expenses
      : 27930;
  const currExpenses =
    analytics.monthlyTrends.length >= 1
      ? analytics.monthlyTrends[analytics.monthlyTrends.length - 1].expenses
      : 24580;
  const momDiff = currExpenses - prevExpenses;
  const momPct = prevExpenses > 0 ? Math.round((Math.abs(momDiff) / prevExpenses) * 100) : 8;

  // Total balance display amount - fall back to 48250 if not calculated yet
  const displayBalance = totals.balance || 48250;

  return (
    <div className="relative flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-5 overflow-y-auto no-scrollbar">
      {/* Top Atmospheric Ambient Glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FFD8CC]/45 via-[#E7E0FF]/40 to-[#C8E2FF]/45 blur-3xl pointer-events-none" />

      {/* Header: Greeting, Notifications, Avatar */}
      <div className="relative z-10 flex items-center justify-between shrink-0">
        <div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Good Morning,</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {firstName}
            </h1>
            <span className="text-lg">☀️</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Let&apos;s make today a smart one.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Night Theme Switch */}
          <div className="flex items-center justify-center p-1 rounded-full bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-xs">
            <ThemeToggle fontSize="7.8px" />
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => showToast('No new notifications')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-xs transition hover:scale-105 active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 opacity-75" />
          </button>

          {/* Profile Avatar with Photo/Initials */}
          <button
            onClick={() => navigateTo('PROFILE')}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFD8CC] via-[#F3EDFF] to-[#9CC9FF] p-0.5 shadow-xs transition hover:scale-105 active:scale-95"
            aria-label="Profile"
          >
            <div className="w-full h-full rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shadow-inner overflow-hidden">
              <span>{firstName.charAt(0).toUpperCase()}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Total Balance Glass Card (Image 1 Screen 2 Design - Fixed min height & shrink-0) */}
      <div className="relative z-10 shrink-0 min-h-[148px] rounded-[32px] p-5 overflow-hidden border border-white/80 dark:border-white/10 bg-gradient-to-br from-[#EAF2FF]/95 via-[#F3EDFF]/90 to-[#FFF0EC]/95 dark:from-[#1D212C] dark:via-[#22212E] dark:to-[#2B2326] shadow-sm backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Total Balance
            </span>
            <button
              onClick={toggleBalanceVisibility}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
              aria-label="Toggle Balance Visibility"
            >
              {isBalanceVisible ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Arrow to Analytics */}
          <button
            onClick={() => navigateTo('ANALYTICS')}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-white/10 border border-white/60 dark:border-white/10 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition"
            aria-label="View Analytics"
          >
            <ArrowRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Big Balance Amount */}
        <div className="my-2">
          <span className="text-3xl sm:text-[34px] font-black tracking-tight text-zinc-900 dark:text-white block">
            {isBalanceVisible ? formatCurrency(displayBalance) : '••••••••'}
          </span>
        </div>

        {/* Trend Indicator Pill */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↑ {momPct}% vs last month</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Actions (Image 1 Screen 2 Design) */}
      <div className="relative z-10 shrink-0 grid grid-cols-4 gap-2.5">
        {/* Add Expense */}
        <button
          onClick={() => openModal('ADD_EXPENSE')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[68px] h-[68px] rounded-[24px] bg-white/90 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:scale-105 active:scale-95">
            <div className="w-10 h-10 rounded-full bg-[#EBF5FF] dark:bg-blue-500/20 text-[#2563EB] dark:text-[#93C5FD] flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 text-center leading-tight">
            Add<br />Expense
          </span>
        </button>

        {/* Add Income */}
        <button
          onClick={() => openModal('ADD_INCOME')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[68px] h-[68px] rounded-[24px] bg-white/90 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:scale-105 active:scale-95">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] dark:bg-emerald-500/20 text-[#059669] dark:text-[#6EE7B7] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 text-center leading-tight">
            Add<br />Income
          </span>
        </button>

        {/* Scan Receipt */}
        <button
          onClick={() => openModal('TRANSACTION_FILTER')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[68px] h-[68px] rounded-[24px] bg-white/90 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:scale-105 active:scale-95">
            <div className="w-10 h-10 rounded-full bg-[#F5F3FF] dark:bg-purple-500/20 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center">
              <QrCode className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 text-center leading-tight">
            Scan<br />Receipt
          </span>
        </button>

        {/* More */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center gap-1.5 group w-full"
          >
            <div className="w-[68px] h-[68px] rounded-[24px] bg-white/90 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:scale-105 active:scale-95">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F4] dark:bg-zinc-700/40 text-[#57534E] dark:text-zinc-300 flex items-center justify-center">
                <MoreHorizontal className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 text-center leading-tight">
              More
            </span>
          </button>

          {/* Popup Dropdown for More menu */}
          {showMoreMenu && (
            <div className="absolute right-0 top-20 z-40 w-48 rounded-2xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 shadow-xl p-1.5 flex flex-col gap-1 text-xs animate-slide-up">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  navigateTo('CATEGORIES');
                }}
                className="px-3 py-2 rounded-xl text-left font-medium hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <span>🏷️</span>
                <span>Manage Categories</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  navigateTo('GOALS');
                }}
                className="px-3 py-2 rounded-xl text-left font-medium hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <span>🏆</span>
                <span>Savings Goals</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  openModal('AI_ASSISTANT');
                }}
                className="px-3 py-2 rounded-xl text-left font-medium hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <span>✨</span>
                <span>Ask SpendWise AI</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  navigateTo('LANDING');
                }}
                className="px-3 py-2 rounded-xl text-left font-medium hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <span>🚀</span>
                <span>Landing Preview</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Section (Directly after Quick Actions matching Image 1 Screen 2) */}
      <div className="relative z-10 shrink-0 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
            Recent Transactions
          </h2>
          <button
            onClick={() => navigateTo('TRANSACTIONS')}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
          >
            See All
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-8 rounded-[28px] bg-white/80 dark:bg-white/5 border border-black/5 text-center flex flex-col items-center">
            <p className="text-xs font-semibold">No transactions yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white/85 dark:bg-zinc-800/80 rounded-2xl border border-black/5 dark:border-white/5 shadow-xs"
              >
                <TransactionRow
                  transaction={tx}
                  onClick={() => {
                    setSelectedTransaction(tx);
                    openModal('TRANSACTION_DETAIL');
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SpendWise AI Assistant Banner Card (Cleanly placed below Recent Transactions) */}
      <div
        onClick={() => openModal('AI_ASSISTANT')}
        className="relative z-10 shrink-0 rounded-[28px] p-4 border border-purple-500/20 bg-gradient-to-br from-[#F5F3FF]/90 via-[#FAF5FF]/80 to-white/90 dark:from-[#251E33] dark:to-[#191924] shadow-xs cursor-pointer hover:border-purple-500/40 transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9B8FF] to-[#9CC9FF] flex items-center justify-center text-zinc-950 shadow-xs">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-xs tracking-tight text-zinc-900 dark:text-white">
                SpendWise AI
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Verified financial clarity
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-[10px] shadow-xs">
            Ask AI
          </span>
        </div>

        {/* Quick Question Chips */}
        <div className="grid grid-cols-3 gap-1.5 mt-2.5">
          {['Where did money go?', 'How much on food?', 'How is budget?'].map((q) => (
            <button
              key={q}
              onClick={(e) => {
                e.stopPropagation();
                openModal('AI_ASSISTANT');
                askAssistant(q);
              }}
              className="py-1 px-1.5 rounded-xl text-[10px] font-medium text-center truncate bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Insights Section */}
      {insights.length > 0 && (
        <div className="relative z-10 shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
              Smart Insights
            </h2>
            <button
              onClick={() => openModal('AI_ASSISTANT')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Deep Dive
            </button>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
            {insights.map((insight) => (
              <SmartInsightCard
                key={insight.id}
                insight={insight}
                onAction={() => {
                  if (insight.type === 'BUDGET') navigateTo('BUDGETS');
                  else if (insight.type === 'GOAL') navigateTo('GOALS');
                  else if (insight.type === 'SPENDING') navigateTo('ANALYTICS');
                  else if (insight.type === 'ANOMALY') navigateTo('TRANSACTIONS');
                  else navigateTo('ANALYTICS');
                }}
                onClick={() => openModal('AI_ASSISTANT')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
