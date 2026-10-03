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

  // DETAIL VIEW (Image 2 Screen 3)
  if (currentScreen === 'GOAL_DETAIL' && selectedGoal) {
    const isCompleted = selectedGoal.currentSavings >= selectedGoal.targetAmount;
    const progress =
      selectedGoal.targetAmount > 0
        ? Math.min(selectedGoal.currentSavings / selectedGoal.targetAmount, 1)
        : 0;
    const remaining = Math.max(0, selectedGoal.targetAmount - selectedGoal.currentSavings);
    const GoalIcon = getGoalIconComponent(selectedGoal.iconType);

    return (
      <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-hidden animate-fade-in">
        {/* Scrollable Detail Body */}
        <div className="flex-1 w-full overflow-y-auto px-5 pt-3 pb-6 flex flex-col gap-4 no-scrollbar">
          {/* Top Header */}
          <div className="flex items-center justify-between shrink-0">
            <button
              onClick={() => navigateTo('GOALS')}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95 cursor-pointer"
              aria-label="Back to Goals List"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <GoalIcon className="w-4 h-4" />
              </div>
              <div className="text-center">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">
                  {selectedGoal.name}
                </h2>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {selectedGoal.description || 'For a better learning and productivity experience.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('CREATE_GOAL')}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95 cursor-pointer"
              aria-label="Options"
            >
              <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </button>
          </div>

          {/* Diffuse Glowing Orb Backdrop & Glass Digital Gulak Piggy Bank */}
          <div className="relative flex justify-center py-2 shrink-0">
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-blue-300/30 via-purple-300/25 to-pink-300/30 blur-3xl pointer-events-none" />
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
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black text-zinc-900 dark:text-white">
                {formatCurrency(selectedGoal.currentSavings)}
              </span>
              <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 font-medium">Saved</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-1">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black text-zinc-900 dark:text-white">
                {formatCurrency(remaining)}
              </span>
              <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 font-medium">Remaining</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black text-zinc-900 dark:text-white truncate max-w-full">
                {selectedGoal.targetDate || '30 Jun 2026'}
              </span>
              <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 font-medium">Target Date</span>
            </div>
          </div>

          {/* Full-width Progress Bar */}
          <div className="w-full h-2 rounded-full bg-zinc-200/80 dark:bg-zinc-700/60 overflow-hidden shrink-0">
            <div
              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-700"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          {/* Recent Contributions Section */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-zinc-900 dark:text-white">Recent Contributions</h3>
              <button
                onClick={() => openModal('ADD_MONEY_GOAL')}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Add Deposit
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {(selectedGoal.contributions || []).slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Added Money</h4>
                      <p className="text-[10px] text-zinc-400">{c.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      + {formatCurrency(c.amount)}
                    </span>
                    <button
                      onClick={() => deleteGoalContribution(selectedGoal.id, c.id)}
                      className="p-1 text-zinc-300 hover:text-rose-500 transition cursor-pointer"
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

        {/* STATIC Bottom Actions Bar (Add Money, Edit, Withdraw, Delete) */}
        <div className="shrink-0 px-5 py-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200/80 dark:border-white/10 flex items-center gap-2.5 z-20">
          <button
            onClick={() => openModal('ADD_MONEY_GOAL')}
            className="flex-1 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Money</span>
          </button>

          <button
            onClick={() => openModal('CREATE_GOAL')}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-blue-600 shadow-xs hover:bg-zinc-50 active:scale-95 transition shrink-0 cursor-pointer"
            title="Edit Goal"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => showToast('Withdrawal request simulated')}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-amber-600 shadow-xs hover:bg-zinc-50 active:scale-95 transition shrink-0 cursor-pointer"
            title="Withdraw Funds"
          >
            <MinusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete '${selectedGoal.name}' goal?`)) {
                deleteGoal(selectedGoal.id);
                navigateTo('GOALS');
              }
            }}
            className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center text-rose-500 shadow-xs hover:bg-rose-100/50 active:scale-95 transition shrink-0 cursor-pointer"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // GOALS OVERVIEW LIST VIEW (Image 2 Screen 1)
  return (
    <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-hidden animate-fade-in">
      {/* Scrollable Goals List */}
      <div className="flex-1 w-full overflow-y-auto px-5 pt-3 pb-24 flex flex-col gap-4 no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Goals</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Small steps. Big plans.</p>
          </div>

          <button
            onClick={() => openModal('CREATE_GOAL')}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95 cursor-pointer"
            aria-label="Create Goal"
          >
            <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>

        {/* Hero Glass Banner (Image 2 Screen 1) */}
        <div className="rounded-[28px] p-5 bg-gradient-to-br from-[#E2ECFE] via-[#EDE9FE] to-[#FCE7F3]/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 border border-white/80 dark:border-white/10 shadow-xs flex items-center justify-between shrink-0">
          <div className="flex flex-col pr-2">
            <span className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
              Turn your<br />dreams into reality
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              Save consistently and achieve what matters to you.
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/60 dark:border-white/10 flex items-center justify-center shadow-xs shrink-0">
            <Target className="w-7 h-7 text-indigo-600 dark:text-indigo-400 stroke-[2]" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 shrink-0">
          {(['ALL', 'IN_PROGRESS', 'COMPLETED'] as const).map((tab) => {
            const isSelected = filter === tab;
            const label =
              tab === 'ALL' ? 'All' : tab === 'IN_PROGRESS' ? 'In Progress' : 'Completed';
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
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
                className="group p-4 rounded-[26px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs cursor-pointer hover:shadow-md transition active:scale-[0.99] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: `${goal.colorHex || '#3B82F6'}18`,
                        color: goal.colorHex || '#3B82F6',
                      }}
                    >
                      <GoalIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div>
                      <h3 className="font-bold text-xs text-zinc-900 dark:text-white">
                        {goal.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {formatCurrency(goal.currentSavings)} / {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-extrabold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${goal.colorHex || '#3B82F6'}15`,
                        color: goal.colorHex || '#3B82F6',
                      }}
                    >
                      {Math.round(progress)}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGoal(goal);
                        navigateTo('GOAL_DETAIL');
                      }}
                      className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-700/50 flex items-center justify-center text-zinc-400 cursor-pointer"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Target Date */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: goal.colorHex || '#3B82F6',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    <span>Target: {goal.targetDate || '30 Jun 2026'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 100% STATIC PINNED Create Goal Gradient Pill Button */}
      <div className="absolute bottom-3 left-5 right-5 z-20 pointer-events-auto">
        <button
          onClick={() => openModal('CREATE_GOAL')}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Goal</span>
        </button>
      </div>
    </div>
  );
}
