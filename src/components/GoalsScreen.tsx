'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Laptop,
  MinusCircle,
  MoreHorizontal,
  Palmtree,
  Pencil,
  Plus,
  Shield,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { DigitalGulak } from './DigitalGulak';

export function getGoalIconComponent(iconType?: string) {
  switch (iconType?.toLowerCase()) {
    case 'laptop':
    case 'electronics':
      return Laptop;
    case 'travel':
    case 'trip':
    case 'palm':
      return Palmtree;
    case 'shield':
    case 'emergency':
      return Shield;
    default:
      return Target;
  }
}

export function GoalsScreen() {
  const {
    goals,
    selectedGoal,
    setSelectedGoal,
    currentScreen,
    navigateTo,
    openModal,
    deleteGoalContribution,
    deleteGoal,
    showToast,
  } = useSpendWise();

  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filteredGoals = goals.filter((g) => {
    const isCompleted = g.currentSavings >= g.targetAmount;
    if (filter === 'IN_PROGRESS') return !isCompleted;
    if (filter === 'COMPLETED') return isCompleted;
    return true;
  });

  // DETAIL VIEW
  if (currentScreen === 'GOAL_DETAIL' && selectedGoal) {
    const isCompleted = selectedGoal.currentSavings >= selectedGoal.targetAmount;
    const progress =
      selectedGoal.targetAmount > 0
        ? Math.min(selectedGoal.currentSavings / selectedGoal.targetAmount, 1)
        : 0;
    const remaining = Math.max(0, selectedGoal.targetAmount - selectedGoal.currentSavings);
    const GoalIcon = getGoalIconComponent(selectedGoal.iconType);

    return (
      <div className="relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-hidden animate-fade-in font-sans">
        {/* Scrollable Detail Body */}
        <div className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden touch-pan-y px-5 pt-3 pb-6 flex flex-col gap-4 no-scrollbar">
          {/* Top Header */}
          <div className="flex items-center justify-between shrink-0">
            <button
              onClick={() => navigateTo('GOALS')}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1c1917] flex items-center justify-center border border-[#e7e5e4] dark:border-white/10 shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
              aria-label="Back to Goals List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 text-[#0c0a09] dark:text-white flex items-center justify-center">
                <GoalIcon className="w-3.5 h-3.5" />
              </div>
              <div className="text-center">
                <h2 className="font-display font-light text-base text-[#0c0a09] dark:text-white leading-tight">
                  {selectedGoal.name}
                </h2>
                <p className="text-[10px] text-[#777169] tracking-[0.15px]">
                  {selectedGoal.description || 'Target savings plan'}
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('CREATE_GOAL')}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1c1917] flex items-center justify-center border border-[#e7e5e4] dark:border-white/10 shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
              aria-label="Options"
            >
              <MoreHorizontal className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Atmospheric Pastel Blooms & Digital Gulak */}
          <div className="relative flex justify-center py-2 shrink-0">
            <div className="absolute w-52 h-52 rounded-full bg-[#c8b8e0]/20 blur-3xl pointer-events-none" />
            <div className="absolute w-44 h-44 -bottom-4 rounded-full bg-[#a7e5d3]/20 blur-3xl pointer-events-none" />
            <DigitalGulak
              progress={progress}
              currentAmount={selectedGoal.currentSavings}
              targetAmount={selectedGoal.targetAmount}
              size={220}
              showLabels={true}
            />
          </div>

          {/* 3 Metrics Cards (Saved, Remaining, Target Date) */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] font-medium tracking-[0.15px]">Saved</span>
              <span className="font-display font-light text-sm text-[#0c0a09] dark:text-white mt-0.5">
                {formatCurrency(selectedGoal.currentSavings)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] font-medium tracking-[0.15px]">Remaining</span>
              <span className="font-display font-light text-sm text-[#0c0a09] dark:text-white mt-0.5">
                {formatCurrency(remaining)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] font-medium tracking-[0.15px]">Target Date</span>
              <span className="font-display font-light text-xs text-[#0c0a09] dark:text-white mt-0.5 truncate max-w-full">
                {selectedGoal.targetDate || '30 Jun 2026'}
              </span>
            </div>
          </div>

          {/* Full-width Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] overflow-hidden shrink-0">
            <div
              className="h-full rounded-full bg-[#292524] dark:bg-white transition-all duration-700"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          {/* Recent Contributions Section */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-light text-base text-[#0c0a09] dark:text-white">
                Recent Ledger Entries
              </h3>
              <button
                onClick={() => openModal('ADD_MONEY_GOAL')}
                className="text-xs font-medium text-[#777169] hover:text-[#0c0a09] dark:hover:text-white transition tracking-[0.15px] cursor-pointer"
              >
                Add Deposit
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {(selectedGoal.contributions || []).slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04] text-[#0c0a09] dark:text-white flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                        Capital Deposit
                      </h4>
                      <p className="text-[10px] text-[#777169] dark:text-[#a8a29e]">{c.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-display font-light text-xs text-[#0c0a09] dark:text-white">
                      + {formatCurrency(c.amount)}
                    </span>
                    <button
                      onClick={() => deleteGoalContribution(selectedGoal.id, c.id)}
                      className="p-1 text-[#a8a29e] hover:text-[#dc2626] transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATIC Bottom Actions Bar with Near-Black Ink Pill */}
        <div className="shrink-0 px-5 py-3 bg-white/90 dark:bg-[#181615]/90 backdrop-blur-md border-t border-[#e7e5e4] dark:border-white/[0.08] flex items-center gap-2.5 z-20">
          <button
            onClick={() => openModal('ADD_MONEY_GOAL')}
            className="flex-1 py-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer tracking-[0.15px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>

          <button
            onClick={() => openModal('CREATE_GOAL')}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs hover:bg-[#fafafa] active:scale-95 transition shrink-0 cursor-pointer"
            title="Edit Goal"
          >
            <Pencil className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => showToast('Withdrawal request simulated')}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs hover:bg-[#fafafa] active:scale-95 transition shrink-0 cursor-pointer"
            title="Withdraw Funds"
          >
            <MinusCircle className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete '${selectedGoal.name}' goal?`)) {
                deleteGoal(selectedGoal.id);
                navigateTo('GOALS');
              }
            }}
            className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-center justify-center text-rose-600 shadow-2xs hover:bg-rose-100/50 active:scale-95 transition shrink-0 cursor-pointer"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // GOALS OVERVIEW LIST VIEW
  return (
    <div className="relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-hidden animate-fade-in font-sans">
      {/* Scrollable Goals List */}
      <div className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden touch-pan-y px-5 pt-3 pb-24 flex flex-col gap-4 no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-display font-light text-2xl tracking-[-0.32px] text-[#0c0a09] dark:text-white">
              Goals
            </h1>
            <p className="text-[11px] text-[#777169] tracking-[0.16px]">
              Small steps. Disciplined plans.
            </p>
          </div>

          <button
            onClick={() => openModal('CREATE_GOAL')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
            aria-label="Create Goal"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Hero Editorial Card with Pastel Atmospheric Bloom */}
        <div className="relative rounded-2xl p-5 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between shrink-0 overflow-hidden">
          {/* Pastel orb blooms */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#f4c5a8]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 left-10 w-36 h-36 rounded-full bg-[#c8b8e0]/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col pr-2">
            <span className="font-display font-light text-lg text-[#0c0a09] dark:text-white leading-snug">
              Turn your dreams <br />
              into reality
            </span>
            <span className="text-xs text-[#777169] dark:text-[#a8a29e] mt-1 tracking-[0.15px]">
              Save consistently and achieve what matters to you.
            </span>
          </div>

          <div className="relative z-10 w-12 h-12 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04] flex items-center justify-center shadow-xs shrink-0 text-[#0c0a09] dark:text-white">
            <Target className="w-5 h-5 stroke-[1.8]" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 rounded-full bg-[#f0efed] dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shrink-0">
          {(['ALL', 'IN_PROGRESS', 'COMPLETED'] as const).map((tab) => {
            const isSelected = filter === tab;
            const label =
              tab === 'ALL' ? 'All' : tab === 'IN_PROGRESS' ? 'In Progress' : 'Completed';
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer tracking-[0.15px] ${
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

        {/* Goals List */}
        <div className="flex flex-col gap-2.5">
          {filteredGoals.map((goal) => {
            const isCompleted = goal.currentSavings >= goal.targetAmount;
            const progress =
              goal.targetAmount > 0
                ? Math.min((goal.currentSavings / goal.targetAmount) * 100, 100)
                : 0;
            const GoalIcon = getGoalIconComponent(goal.iconType);

            return (
              <div
                key={goal.id}
                onClick={() => {
                  setSelectedGoal(goal);
                  navigateTo('GOAL_DETAIL');
                }}
                className="group p-4 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs cursor-pointer hover:shadow-md transition active:scale-[0.99] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04] text-[#0c0a09] dark:text-white flex items-center justify-center shrink-0">
                      <GoalIcon className="w-4 h-4 stroke-[1.8]" />
                    </div>

                    <div>
                      <h3 className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                        {goal.name}
                      </h3>
                      <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5 tracking-[0.15px]">
                        {formatCurrency(goal.currentSavings)} / {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-display font-light text-xs text-[#0c0a09] dark:text-zinc-200">
                      {Math.round(progress)}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGoal(goal);
                        navigateTo('GOAL_DETAIL');
                      }}
                      className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-[#24211e] flex items-center justify-center text-[#777169] dark:text-[#a8a29e] cursor-pointer"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Target Date */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-1.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#292524] dark:bg-white transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#777169] dark:text-[#a8a29e]">
                    <Calendar className="w-3 h-3" />
                    <span>Target: {goal.targetDate || '30 Jun 2026'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
