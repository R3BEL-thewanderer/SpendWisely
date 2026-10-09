'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import {
  loadSubscriptions,
  saveSubscriptions,
  calculateSubscriptionMetrics,
  SubscriptionMetrics,
} from '../lib/subscriptions';
import { SubscriptionItem } from '../lib/types';

export function SubscriptionsModal() {
  const { activeModal, closeModal, showToast } = useSpendWise();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ZOMBIES' | 'UPCOMING'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Subscription Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY' | 'QUARTERLY'>('MONTHLY');
  const [category, setCategory] = useState('Entertainment');
  const [nextRenewalDate, setNextRenewalDate] = useState('15 Nov 2026');
  const [daysUntilRenewal, setDaysUntilRenewal] = useState('14');
  const [cancelUrl, setCancelUrl] = useState('');
  const [serviceIcon, setServiceIcon] = useState('⚡');

  useEffect(() => {
    if (activeModal === 'SUBSCRIPTIONS') {
      const items = loadSubscriptions();
      setSubscriptions(items);
      setMetrics(calculateSubscriptionMetrics(items));
    }
  }, [activeModal]);

  const updateList = (updated: SubscriptionItem[]) => {
    setSubscriptions(updated);
    saveSubscriptions(updated);
    setMetrics(calculateSubscriptionMetrics(updated));
  };

  const handleToggleActive = (id: string) => {
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    updateList(updated);
    showToast('Subscription status updated');
  };

  const handleDelete = (id: string, subName: string) => {
    if (confirm(`Remove "${subName}" from recurring subscriptions?`)) {
      const updated = subscriptions.filter((s) => s.id !== id);
      updateList(updated);
      showToast(`Removed ${subName}`);
    }
  };

  const handleDismissZombie = (id: string) => {
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, isZombie: false } : s));
    updateList(updated);
    showToast('Zombie warning dismissed');
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid name and amount');
      return;
    }

    const newSub: SubscriptionItem = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      amount: numAmount,
      billingCycle,
      category,
      nextRenewalDate: nextRenewalDate.trim() || 'In 30 days',
      daysUntilRenewal: parseInt(daysUntilRenewal) || 30,
      serviceIcon: serviceIcon || '⚡',
      cancelUrl: cancelUrl.trim() || undefined,
      isActive: true,
      colorHex: '#3b82f6',
    };

    const updated = [newSub, ...subscriptions];
    updateList(updated);
    setName('');
    setAmount('');
    setCancelUrl('');
    setShowAddForm(false);
    showToast(`Added ${newSub.name} to subscriptions`);
  };

  if (activeModal !== 'SUBSCRIPTIONS') return null;

  const filteredSubscriptions = subscriptions.filter((s) => {
    if (activeTab === 'ZOMBIES') return s.isZombie && s.isActive;
    if (activeTab === 'UPCOMING') return s.daysUntilRenewal <= 7 && s.isActive;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl bg-[#fafafa] dark:bg-[#121110] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/[0.08] shrink-0 bg-white/70 dark:bg-[#181615]/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-light text-lg text-[#0c0a09] dark:text-white flex items-center gap-1.5">
                Subscriptions & Recurring
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Zombie Shield 🛡️
                </span>
              </h2>
              <p className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
                Recurring commitments & potential ghost spends.
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 no-scrollbar">
          {/* Top Metric Cards */}
          {metrics && (
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-medium">
                  Monthly Total
                </span>
                <span className="font-display font-light text-base text-[#0c0a09] dark:text-white mt-1">
                  {formatCurrency(metrics.totalMonthlyCommitment)}
                </span>
                <span className="text-[9.5px] text-[#777169] dark:text-[#a8a29e] mt-0.5">
                  {metrics.activeCount} active items
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] font-medium">
                  Yearly Drain
                </span>
                <span className="font-display font-light text-base text-[#0c0a09] dark:text-white mt-1">
                  {formatCurrency(metrics.totalAnnualCommitment)}
                </span>
                <span className="text-[9.5px] text-[#777169] dark:text-[#a8a29e] mt-0.5">
                  12-mo projected
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 shadow-xs flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-medium">
                  Zombie Waste
                </span>
                <span className="font-display font-light text-base text-rose-600 dark:text-rose-400 mt-1">
                  {formatCurrency(metrics.potentialZombieSavings)}
                </span>
                <span className="text-[9.5px] text-rose-500/80 dark:text-rose-400/80 mt-0.5">
                  Save {metrics.zombieCount} services
                </span>
              </div>
            </div>
          )}

          {/* Zombie Alert Highlighters */}
          {metrics && metrics.zombieCount > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Zombie Spend Alarms Detected ({metrics.zombieCount})
                </h4>
              </div>
              <ul className="text-[11px] text-amber-900/80 dark:text-amber-200/80 space-y-1 pl-5 list-disc">
                <li>
                  <strong>Price Hike:</strong> Spotify increased +₹30 (₹119 → ₹149/mo).
                </li>
                <li>
                  <strong>Duplicate Streaming:</strong> You have both Spotify & YouTube Premium active. Save ₹149/mo by keeping one.
                </li>
                <li>
                  <strong>Inactivity Warning:</strong> Cult.fit Gym (₹1,800/mo) has no logged activities in 45 days.
                </li>
              </ul>
            </div>
          )}

          {/* Tab Filter & Add Button */}
          <div className="flex items-center justify-between shrink-0 pt-1">
            <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-[#e7e5e4] dark:border-white/[0.08] text-xs">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  activeTab === 'ALL'
                    ? 'bg-white dark:bg-[#24211e] text-[#0c0a09] dark:text-white shadow-2xs'
                    : 'text-[#777169] dark:text-[#a8a29e]'
                }`}
              >
                All ({subscriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('ZOMBIES')}
                className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                  activeTab === 'ZOMBIES'
                    ? 'bg-white dark:bg-[#24211e] text-rose-600 dark:text-rose-400 shadow-2xs'
                    : 'text-[#777169] dark:text-[#a8a29e]'
                }`}
              >
                <span>🧟 Zombies</span>
                {metrics && metrics.zombieCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {metrics.zombieCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('UPCOMING')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  activeTab === 'UPCOMING'
                    ? 'bg-white dark:bg-[#24211e] text-amber-600 dark:text-amber-400 shadow-2xs'
                    : 'text-[#777169] dark:text-[#a8a29e]'
                }`}
              >
                Soon (≤7d)
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] text-xs font-medium flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{showAddForm ? 'Cancel' : 'Add New'}</span>
            </button>
          </div>

          {/* Add Subscription Form Drawer */}
          {showAddForm && (
            <form
              onSubmit={handleAddSubscription}
              className="p-4 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-md flex flex-col gap-3 animate-slide-up"
            >
              <h4 className="text-xs font-semibold text-[#0c0a09] dark:text-white uppercase tracking-wider">
                Track New Recurring Service
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Disney+ Hotstar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="299"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                    Cycle
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) =>
                      setBillingCycle(e.target.value as 'MONTHLY' | 'YEARLY' | 'QUARTERLY')
                    }
                    className="w-full px-2 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                    <option value="QUARTERLY">Quarterly</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                    Days to Renewal
                  </label>
                  <input
                    type="number"
                    value={daysUntilRenewal}
                    onChange={(e) => setDaysUntilRenewal(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] text-[#777169] dark:text-[#a8a29e] block mb-1">
                  Cancellation Page URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={cancelUrl}
                  onChange={(e) => setCancelUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#fafafa] dark:bg-[#121110] border border-[#d6d3d1] dark:border-white/10 text-xs text-[#0c0a09] dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] text-xs font-medium shadow-xs transition active:scale-95"
              >
                Save Subscription
              </button>
            </form>
          )}

          {/* Subscriptions List */}
          <div className="flex flex-col gap-2.5">
            {filteredSubscriptions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-[#777169] dark:text-[#a8a29e]">
                <Layers className="w-8 h-8 opacity-40" />
                <p className="text-xs">No subscriptions matching this filter.</p>
              </div>
            ) : (
              filteredSubscriptions.map((item) => {
                const isUrgent = item.daysUntilRenewal <= 7 && item.isActive;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl bg-white dark:bg-[#181615] border transition shadow-xs flex flex-col gap-2 ${
                      item.isZombie
                        ? 'border-rose-300 dark:border-rose-900/50'
                        : isUrgent
                        ? 'border-amber-300 dark:border-amber-900/50'
                        : 'border-[#e7e5e4] dark:border-white/[0.08]'
                    } ${!item.isActive ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg border border-black/5 dark:border-white/5"
                          style={{ backgroundColor: `${item.colorHex || '#6366f1'}15` }}
                        >
                          <span>{item.serviceIcon || '⚡'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-display font-light text-sm text-[#0c0a09] dark:text-white">
                              {item.name}
                            </h3>
                            {item.isZombie && (
                              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-semibold border border-rose-500/20">
                                🧟 Zombie Spend
                              </span>
                            )}
                            {item.priceHikeAlert && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[9px] font-semibold border border-amber-500/20">
                                +₹{item.priceHikeAlert.difference} Hike
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#777169] dark:text-[#a8a29e] block mt-0.5">
                            {item.category} • via {item.paymentMethod || 'Card'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-light text-base text-[#0c0a09] dark:text-white block">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider block">
                          /{item.billingCycle.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Renewal Countdown and Action Bar */}
                    <div className="pt-2 border-t border-[#f0efed] dark:border-white/[0.05] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3 h-3 ${isUrgent ? 'text-amber-500' : 'text-[#777169]'}`} />
                        <span
                          className={`text-[11px] font-medium ${
                            isUrgent
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-[#777169] dark:text-[#a8a29e]'
                          }`}
                        >
                          Renews in {item.daysUntilRenewal} days ({item.nextRenewalDate})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.cancelUrl && (
                          <a
                            href={item.cancelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[10.5px] font-medium text-[#0c0a09] dark:text-white flex items-center gap-1 transition"
                            title="Direct cancel page"
                          >
                            <span>Cancel</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleToggleActive(item.id)}
                          className={`px-2 py-1 rounded-lg text-[10.5px] font-medium transition ${
                            item.isActive
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {item.isActive ? 'Pause' : 'Resume'}
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1 rounded-lg text-[#a8a29e] hover:text-rose-600 dark:hover:text-rose-400 transition"
                          title="Delete subscription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e7e5e4] dark:border-white/[0.08] bg-white/70 dark:bg-[#181615]/70 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
            SpendWise monitors recurring auto-debits automatically.
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
