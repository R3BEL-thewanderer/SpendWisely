'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Laptop,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { DigitalGulak } from './DigitalGulak';

const PRESET_AMOUNTS = [500, 1000, 5000, 10000];

export function AddMoneyGoalModal() {
  const { activeModal, closeModal, selectedGoal, addMoneyToGoal } = useSpendWise();
  const [amountStr, setAmountStr] = useState('5000');

  if (activeModal !== 'ADD_MONEY_GOAL' || !selectedGoal) return null;

  const depositAmount = parseFloat(amountStr) || 0;
  const currentSavings = selectedGoal.currentSavings;
  const targetAmount = selectedGoal.targetAmount;

  const currentPct =
    targetAmount > 0 ? Math.min(Math.round((currentSavings / targetAmount) * 100), 100) : 0;
  const newSavings = currentSavings + depositAmount;
  const newPct =
    targetAmount > 0 ? Math.min(Math.round((newSavings / targetAmount) * 100), 100) : 0;
  const remainingAfter = Math.max(0, targetAmount - newSavings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    addMoneyToGoal(selectedGoal.id, depositAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 animate-fade-in">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-[390px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[32px] bg-[#FAF8F5] dark:bg-zinc-900 border border-white/60 dark:border-white/10 shadow-2xl p-5 flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>

          <div className="text-center">
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Add Money</h2>
            <p className="text-[10px] text-zinc-400">
              Every contribution brings you closer to your goal.
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* Goal Preview Card */}
        <div className="p-3.5 rounded-[22px] bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white">{selectedGoal.name}</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {formatCurrency(currentSavings)} / {formatCurrency(targetAmount)}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600">
            {currentPct}%
          </span>
        </div>

        {/* Diffuse Glowing Orb Backdrop & Glass Digital Gulak Piggy Bank */}
        <div className="relative flex justify-center py-1 shrink-0">
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-amber-300/35 via-purple-300/25 to-blue-300/35 blur-3xl pointer-events-none" />
          <DigitalGulak
            progress={newPct / 100}
            currentAmount={newSavings}
            targetAmount={targetAmount}
            size={180}
            showLabels={true}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Amount Display and Input */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-xs">
            <span className="text-[10px] font-bold text-zinc-400">Amount</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-2xl font-black text-zinc-900 dark:text-white">₹</span>
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="5000"
                className="w-36 text-2xl font-black text-center bg-transparent text-zinc-900 dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = amountStr === amt.toString();
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmountStr(amt.toString())}
                  className={`py-2 rounded-2xl text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  + {formatCurrency(amt)}
                </button>
              );
            })}
          </div>

          {/* 2 Bottom Stat Indicators (New Progress, Remaining Amount) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9.5px] text-zinc-400 font-semibold block">New Progress</span>
                <span className="text-xs font-bold text-emerald-600">
                  {currentPct}% → {newPct}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9.5px] text-zinc-400 font-semibold block">Remaining Amount</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {formatCurrency(remainingAfter)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <span>Add to Goal →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
