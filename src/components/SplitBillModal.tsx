'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Copy,
  Check,
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Send,
  Sliders,
  DollarSign,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import {
  loadSplitDues,
  saveSplitDues,
  calculateSplitSummary,
  buildUpiDeepLink,
  createWhatsAppShareMessage,
  SplitSummary,
} from '../lib/splitExpenses';
import { SplitDueItem } from '../lib/types';

export function SplitBillModal() {
  const {
    activeModal,
    closeModal,
    selectedTransaction,
    addIncome,
    showToast,
    userProfile,
  } = useSpendWise();

  const [dues, setDues] = useState<SplitDueItem[]>([]);
  const [summary, setSummary] = useState<SplitSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'NEW_SPLIT' | 'DUES_LEDGER'>('NEW_SPLIT');

  // Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [numPeople, setNumPeople] = useState(2);
  const [friendName, setFriendName] = useState('Rahul Sharma');
  const [friendUpiId, setFriendUpiId] = useState('');
  const [customFriendShare, setCustomFriendShare] = useState('');
  const [splitMode, setSplitMode] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [userUpiId, setUserUpiId] = useState('ashish@okhdfcbank');
  const [note, setNote] = useState('');

  // UI helpers
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (activeModal === 'SPLIT_BILL') {
      const stored = loadSplitDues();
      setDues(stored);
      setSummary(calculateSplitSummary(stored));

      // If a transaction was open, pre-fill its title & amount
      if (selectedTransaction) {
        setExpenseTitle(selectedTransaction.title);
        setTotalAmount(selectedTransaction.amount.toString());
        setNote(selectedTransaction.notes || `Split for ${selectedTransaction.title}`);
      } else {
        if (!expenseTitle) setExpenseTitle('Group Dinner Split');
        if (!totalAmount) setTotalAmount('1800');
        setNote('Shared dinner split via SpendWise');
      }
    }
  }, [activeModal, selectedTransaction]);

  const updateDuesList = (updated: SplitDueItem[]) => {
    setDues(updated);
    saveSplitDues(updated);
    setSummary(calculateSplitSummary(updated));
  };

  const parsedTotal = parseFloat(totalAmount) || 0;
  const equalFriendShare = Math.round(parsedTotal / Math.max(1, numPeople));
  const friendShare =
    splitMode === 'EQUAL'
      ? equalFriendShare
      : parseFloat(customFriendShare) || equalFriendShare;
  const yourShare = Math.max(0, parsedTotal - friendShare);

  const upiDeepLink = buildUpiDeepLink({
    upiId: userUpiId,
    payeeName: userProfile?.name || 'SpendWise User',
    amount: friendShare,
    note: `${expenseTitle} split share`,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiDeepLink);
    setCopiedLink(true);
    showToast('UPI payment link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = createWhatsAppShareMessage({
      friendName: friendName || 'Friend',
      expenseTitle: expenseTitle || 'Expense',
      totalAmount: parsedTotal,
      friendShare,
      userUpiId,
      upiLink: upiDeepLink,
    });

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    showToast('Opening WhatsApp to share split request...');
  };

  const handleSaveToLedger = () => {
    if (!friendName.trim() || parsedTotal <= 0) {
      showToast('Please specify a friend name and valid amount.');
      return;
    }

    const newDue: SplitDueItem = {
      id: `split-${Date.now()}`,
      transactionId: selectedTransaction?.id,
      expenseTitle: expenseTitle.trim() || 'Shared Expense',
      totalAmount: parsedTotal,
      friendName: friendName.trim(),
      friendUpiId: friendUpiId.trim() || undefined,
      friendShare,
      yourShare,
      status: 'PENDING',
      date: 'Today',
      note: note.trim() || undefined,
      splitType: splitMode,
    };

    const updated = [newDue, ...dues];
    updateDuesList(updated);
    showToast(`Added ₹${friendShare} due from ${newDue.friendName}`);
    setActiveTab('DUES_LEDGER');
  };

  const handleMarkSettled = (due: SplitDueItem) => {
    const updated = dues.map((d) => (d.id === due.id ? { ...d, status: 'SETTLED' as const } : d));
    updateDuesList(updated);

    // Auto-credit as income in SpendWise Ledger
    addIncome({
      amount: due.friendShare,
      source: `Split settled by ${due.friendName} (${due.expenseTitle})`,
      category: 'Others',
      notes: `Recovered share from split: ${due.expenseTitle}`,
    });

    showToast(`Settled! Added ₹${due.friendShare} received from ${due.friendName} to Income.`);
  };

  if (activeModal !== 'SPLIT_BILL') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl bg-[#fafafa] dark:bg-[#121110] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/[0.08] shrink-0 bg-white/70 dark:bg-[#181615]/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-light text-lg text-[#0c0a09] dark:text-white flex items-center gap-1.5">
                SpendWise Split & Tabs
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Instant UPI
                </span>
              </h2>
              <p className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
                Split bills with friends & generate 1-tap UPI payment links.
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[#777169] dark:text-[#a8a29e] transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 pb-1 shrink-0 flex items-center justify-between">
          <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-[#e7e5e4] dark:border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveTab('NEW_SPLIT')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeTab === 'NEW_SPLIT'
                  ? 'bg-white dark:bg-[#24211e] text-[#0c0a09] dark:text-white shadow-2xs'
                  : 'text-[#777169] dark:text-[#a8a29e]'
              }`}
            >
              Split Bill
            </button>
            <button
              onClick={() => setActiveTab('DUES_LEDGER')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'DUES_LEDGER'
                  ? 'bg-white dark:bg-[#24211e] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-[#777169] dark:text-[#a8a29e]'
              }`}
            >
              <span>Pending Dues</span>
              {summary && summary.pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                  ₹{summary.totalPendingDues.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'DUES_LEDGER' && (
            <button
              onClick={() => setActiveTab('NEW_SPLIT')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Split</span>
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4 no-scrollbar">
          {activeTab === 'NEW_SPLIT' ? (
            /* NEW SPLIT VIEW */
            <div className="flex flex-col gap-4">
              {/* Expense Details Input */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="text-[10.5px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-semibold block mb-1">
                      Expense Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Swiggy Dinner / Goa Trip"
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-semibold block mb-1">
                      Total Bill (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="1800"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Friend Selector & Quick Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10.5px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-semibold">
                      Who are you splitting with?
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Friend's Name (e.g. Rahul Sharma)"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none mb-1.5"
                  />
                  {/* Quick friend chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Sneha Rao', 'Vikram Singh'].map(
                      (nameChip) => (
                        <button
                          key={nameChip}
                          type="button"
                          onClick={() => setFriendName(nameChip)}
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-medium transition ${
                            friendName === nameChip
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-black/5 dark:bg-white/5 text-[#777169] dark:text-[#a8a29e] hover:bg-black/10'
                          }`}
                        >
                          {nameChip}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Split Configuration */}
                <div className="pt-2 border-t border-[#f0efed] dark:border-white/[0.05] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e]">
                      Split Calculation
                    </span>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSplitMode('EQUAL')}
                        className={`px-2.5 py-0.5 rounded-lg font-medium transition ${
                          splitMode === 'EQUAL'
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            : 'text-[#777169]'
                        }`}
                      >
                        Equal Split
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitMode('CUSTOM')}
                        className={`px-2.5 py-0.5 rounded-lg font-medium transition ${
                          splitMode === 'CUSTOM'
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            : 'text-[#777169]'
                        }`}
                      >
                        Custom Amount
                      </button>
                    </div>
                  </div>

                  {splitMode === 'EQUAL' ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#e7e5e4] dark:border-white/5">
                      <span className="text-xs text-[#0c0a09] dark:text-white font-medium">
                        Divide between {numPeople} people:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[2, 3, 4, 5].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setNumPeople(count)}
                            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition ${
                              numPeople === count
                                ? 'bg-indigo-600 text-white'
                                : 'bg-black/5 dark:bg-white/5 text-[#777169] dark:text-[#a8a29e]'
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                        {friendName || 'Friend'}&apos;s Exact Share (₹)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 650"
                        value={customFriendShare}
                        onChange={(e) => setCustomFriendShare(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Calculated Shares Highlight */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                      <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold uppercase tracking-wider block">
                        {friendName || 'Friend'} Owes You
                      </span>
                      <span className="font-display font-light text-xl text-indigo-700 dark:text-indigo-300 block mt-0.5">
                        {formatCurrency(friendShare)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                      <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] font-semibold uppercase tracking-wider block">
                        Your Personal Share
                      </span>
                      <span className="font-display font-light text-xl text-[#0c0a09] dark:text-white block mt-0.5">
                        {formatCurrency(yourShare)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receiving UPI ID */}
                <div className="pt-2 border-t border-[#f0efed] dark:border-white/[0.05]">
                  <label className="text-[10.5px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-semibold block mb-1">
                    Your Receiving UPI ID
                  </label>
                  <input
                    type="text"
                    value={userUpiId}
                    onChange={(e) => setUserUpiId(e.target.value)}
                    placeholder="user@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Share & Action Plate */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#0c0a09] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Instant UPI Settlement Link</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(!showQrModal)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQrModal ? 'Hide Link' : 'Show UPI URI'}</span>
                  </button>
                </div>

                {showQrModal && (
                  <div className="p-2.5 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#e7e5e4] dark:border-white/10 text-[10.5px] font-mono break-all text-[#777169] dark:text-[#a8a29e]">
                    {upiDeepLink}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-full border border-[#d6d3d1] dark:border-white/10 text-[#0c0a09] dark:text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="py-2.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveToLedger}
                  className="w-full py-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 mt-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Save to Dues Ledger (₹{friendShare} Owed)</span>
                </button>
              </div>
            </div>
          ) : (
            /* DUES LEDGER VIEW */
            <div className="flex flex-col gap-3">
              {/* Summary Stats Banner */}
              {summary && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-semibold block">
                      Total Unsettled Dues
                    </span>
                    <span className="font-display font-light text-2xl text-indigo-700 dark:text-indigo-300 block mt-0.5">
                      {formatCurrency(summary.totalPendingDues)}
                    </span>
                    <span className="text-[11px] text-indigo-600/80 dark:text-indigo-300/80 mt-0.5 block">
                      From {summary.pendingCount} pending friend tabs
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                      {summary.settledCount} Settled
                    </span>
                  </div>
                </div>
              )}

              {/* Dues List */}
              <div className="flex flex-col gap-2.5">
                {dues.length === 0 ? (
                  <div className="p-8 text-center text-[#777169] dark:text-[#a8a29e] text-xs">
                    No split dues recorded yet.
                  </div>
                ) : (
                  dues.map((due) => {
                    const isPending = due.status === 'PENDING';
                    const link = buildUpiDeepLink({
                      upiId: userUpiId,
                      payeeName: userProfile?.name || 'SpendWise User',
                      amount: due.friendShare,
                      note: `${due.expenseTitle} split share`,
                    });

                    return (
                      <div
                        key={due.id}
                        className={`p-3.5 rounded-2xl bg-white dark:bg-[#181615] border transition shadow-xs flex flex-col gap-2.5 ${
                          isPending
                            ? 'border-indigo-200 dark:border-indigo-900/40'
                            : 'border-[#e7e5e4] dark:border-white/[0.08] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center justify-center">
                              {due.friendName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-display font-light text-sm text-[#0c0a09] dark:text-white">
                                {due.friendName}
                              </h4>
                              <span className="text-[11px] text-[#777169] dark:text-[#a8a29e] block">
                                for &quot;{due.expenseTitle}&quot; • {due.date}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-display font-light text-base block ${
                                isPending
                                  ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                                  : 'text-[#777169] dark:text-[#a8a29e]'
                              }`}
                            >
                              {formatCurrency(due.friendShare)}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e]">
                              Total {formatCurrency(due.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {due.note && (
                          <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] italic bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                            &ldquo;{due.note}&rdquo;
                          </p>
                        )}

                        {/* Action Bar */}
                        <div className="pt-2 border-t border-[#f0efed] dark:border-white/[0.05] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-amber-600 dark:text-amber-400">
                                <Clock className="w-3 h-3" />
                                <span>Awaiting payment</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Settled & Added to Income</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const text = createWhatsAppShareMessage({
                                      friendName: due.friendName,
                                      expenseTitle: due.expenseTitle,
                                      totalAmount: due.totalAmount,
                                      friendShare: due.friendShare,
                                      userUpiId,
                                      upiLink: link,
                                    });
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-1 hover:bg-emerald-100 transition"
                                  title="Remind friend on WhatsApp"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Remind</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMarkSettled(due)}
                                  className="px-3 py-1 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] text-[11px] font-medium transition active:scale-95 shadow-2xs"
                                >
                                  Mark Settled ✓
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e7e5e4] dark:border-white/[0.08] bg-white/70 dark:bg-[#181615]/70 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
            {activeTab === 'NEW_SPLIT'
              ? 'UPI links work across Google Pay, PhonePe, Paytm & BHIM.'
              : 'Marking a tab settled automatically credits it to your Income.'}
          </span>
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium shadow-xs transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
