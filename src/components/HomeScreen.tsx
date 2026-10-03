'use client';

import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  QrCode,
  Sparkles,
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

  const displayBalance = totals.balance || 48250;

  return (
    <div className="relative flex-1 w-full px-5 pt-3 pb-8 flex flex-col gap-5 overflow-y-auto no-scrollbar">
      {/* Atmospheric Pastel Gradient Orbs (signature brand pattern) */}
      <div className="absolute -top-16 left-1/4 w-72 h-72 rounded-full orb-peach opacity-60 dark:opacity-20 pointer-events-none" />
      <div className="absolute top-48 -right-12 w-64 h-64 rounded-full orb-mint opacity-50 dark:opacity-20 pointer-events-none" />

      {/* Header: Greeting in Waldenburg / EB Garamond 300 */}
      <div className="relative z-10 flex items-center justify-between shrink-0 pt-1">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#777169] dark:text-[#a8a29e] font-sans font-semibold">
            Overview
          </span>
          <h1 className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff] mt-0.5">
            Good morning, {firstName}
          </h1>
          <p className="text-[12px] text-[#777169] dark:text-[#a8a29e] font-sans">
            A quiet ledger for your financial wellbeing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Night Theme Switch */}
          <div className="flex items-center justify-center p-1 rounded-full bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-xs">
            <ThemeToggle fontSize="7.8px" />
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => showToast('No new notifications')}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-xs transition hover:scale-105 active:scale-95 text-[#0c0a09] dark:text-[#ffffff]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 opacity-75 stroke-[1.8]" />
          </button>

          {/* Profile Avatar with Photo/Initials */}
          <button
            onClick={() => navigateTo('PROFILE')}
            className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#292524] border border-[#e7e5e4] dark:border-white/10 p-0.5 shadow-xs transition hover:scale-105 active:scale-95"
            aria-label="Profile"
          >
            <div className="w-full h-full rounded-full bg-[#292524] text-white flex items-center justify-center font-display font-light text-xs">
              <span>{firstName.charAt(0).toUpperCase()}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Total Balance Card (ElevenLabs Editorial Print Card) */}
      <div className="relative z-10 shrink-0 rounded-2xl p-5 overflow-hidden border border-[#e7e5e4] dark:border-white/10 bg-white dark:bg-[#1c1917] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-sans">
              Total Balance
            </span>
            <button
              onClick={toggleBalanceVisibility}
              className="text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white transition"
              aria-label="Toggle Balance Visibility"
            >
              {isBalanceVisible ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <button
            onClick={() => navigateTo('ANALYTICS')}
            className="text-[12px] font-medium text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white flex items-center gap-1 transition font-sans"
          >
            <span>Analytics</span>
            <ArrowRight className="w-3 h-3 stroke-[2]" />
          </button>
        </div>

        {/* Big Balance Amount in Waldenburg / EB Garamond 300 */}
        <div className="my-2.5">
          <span className="font-display text-[38px] leading-tight font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff] block">
            {isBalanceVisible ? formatCurrency(displayBalance) : '••••••••'}
          </span>
        </div>

        {/* Status Caption & CTAs */}
        <div className="flex items-center justify-between pt-1 border-t border-[#f0efed] dark:border-white/5">
          <div className="text-[11.5px] font-sans text-[#777169] dark:text-[#a8a29e]">
            <span>Monthly spend: </span>
            <span className="font-medium text-[#0c0a09] dark:text-white">{formatCurrency(currExpenses)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('ADD_EXPENSE')}
              className="inline-flex items-center justify-center h-8 px-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#e7e5e4] text-white dark:text-[#0c0a09] text-xs font-medium font-sans transition active:scale-95"
            >
              <Plus className="w-3 h-3 mr-1 stroke-[2.5]" />
              <span>Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Plates ({colors.surface-strong}) */}
      <div className="relative z-10 shrink-0 grid grid-cols-4 gap-2.5">
        {/* Add Expense */}
        <button
          onClick={() => openModal('ADD_EXPENSE')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[66px] h-[66px] rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:border-[#0c0a09] dark:group-hover:border-white/30 active:scale-95">
            <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#292524] text-[#0c0a09] dark:text-white flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <span className="text-[11px] font-normal text-[#4e4e4e] dark:text-[#a8a29e] text-center font-sans">
            Expense
          </span>
        </button>

        {/* Add Income */}
        <button
          onClick={() => openModal('ADD_INCOME')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[66px] h-[66px] rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:border-[#0c0a09] dark:group-hover:border-white/30 active:scale-95">
            <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#292524] text-[#0c0a09] dark:text-white flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <span className="text-[11px] font-normal text-[#4e4e4e] dark:text-[#a8a29e] text-center font-sans">
            Income
          </span>
        </button>

        {/* Scan Receipt */}
        <button
          onClick={() => openModal('TRANSACTION_FILTER')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[66px] h-[66px] rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:border-[#0c0a09] dark:group-hover:border-white/30 active:scale-95">
            <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#292524] text-[#0c0a09] dark:text-white flex items-center justify-center">
              <QrCode className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
          <span className="text-[11px] font-normal text-[#4e4e4e] dark:text-[#a8a29e] text-center font-sans">
            Scan
          </span>
        </button>

        {/* More */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center gap-1.5 group w-full"
          >
            <div className="w-[66px] h-[66px] rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shadow-xs transition group-hover:border-[#0c0a09] dark:group-hover:border-white/30 active:scale-95">
              <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#292524] text-[#0c0a09] dark:text-white flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[11px] font-normal text-[#4e4e4e] dark:text-[#a8a29e] text-center font-sans">
              More
            </span>
          </button>

          {/* Popup Dropdown for More menu */}
          {showMoreMenu && (
            <div className="absolute right-0 top-20 z-40 w-48 rounded-xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-lg p-1.5 flex flex-col gap-0.5 text-xs animate-slide-up">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  navigateTo('CATEGORIES');
                }}
                className="px-3 py-2 rounded-lg text-left font-normal hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-[#0c0a09] dark:text-white"
              >
                <span>🏷️</span>
                <span>Categories</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  navigateTo('GOALS');
                }}
                className="px-3 py-2 rounded-lg text-left font-normal hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-[#0c0a09] dark:text-white"
              >
                <span>🏆</span>
                <span>Savings Goals</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  openModal('AI_ASSISTANT');
                }}
                className="px-3 py-2 rounded-lg text-left font-normal hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-[#0c0a09] dark:text-white"
              >
                <span>✨</span>
                <span>Ask SpendWise AI</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  navigateTo('LANDING');
                }}
                className="px-3 py-2 rounded-lg text-left font-normal hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-[#0c0a09] dark:text-white"
              >
                <span>📖</span>
                <span>Editorial Cover</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Ledger Entries (Editorial print list) */}
      <div className="relative z-10 shrink-0 flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-display text-lg font-light text-[#0c0a09] dark:text-[#ffffff]">
            Recent Ledger
          </h2>
          <button
            onClick={() => navigateTo('TRANSACTIONS')}
            className="text-xs font-sans text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white transition"
          >
            View all
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 text-center flex flex-col items-center">
            <p className="text-xs text-[#777169] font-sans">No entries recorded yet</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1c1917] rounded-2xl border border-[#e7e5e4] dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden">
            {recentTransactions.map((tx) => (
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
        )}
      </div>

      {/* SpendWise AI Assistant (Editorial commentary style card) */}
      <div
        onClick={() => openModal('AI_ASSISTANT')}
        className="relative z-10 shrink-0 rounded-2xl p-4.5 border border-[#e7e5e4] dark:border-white/10 bg-white dark:bg-[#1c1917] shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#0c0a09] dark:hover:border-white/30 transition group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-[#292524] flex items-center justify-center text-[#0c0a09] dark:text-white">
              <Sparkles className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-display text-base font-light text-[#0c0a09] dark:text-[#ffffff]">
                SpendWise Assistant
              </h3>
              <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] font-sans">
                Quiet verification &amp; domain analysis
              </p>
            </div>
          </div>

          <span className="btn-primary !h-7 !px-3 !text-[11px]">
            Inquire
          </span>
        </div>

        {/* Quick Inquiry Chips */}
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          {['Where did money go?', 'How much on food?', 'How is budget?'].map((q) => (
            <button
              key={q}
              onClick={(e) => {
                e.stopPropagation();
                openModal('AI_ASSISTANT');
                askAssistant(q);
              }}
              className="py-1 px-2 rounded-lg text-[10.5px] font-normal text-center truncate bg-[#f5f5f5] dark:bg-[#292524] text-[#4e4e4e] dark:text-[#d6d3d1] border border-transparent hover:border-[#d6d3d1] transition font-sans"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Insights Section */}
      {insights.length > 0 && (
        <div className="relative z-10 shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="font-display text-lg font-light text-[#0c0a09] dark:text-[#ffffff]">
              Field Notes &amp; Observations
            </h2>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
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
