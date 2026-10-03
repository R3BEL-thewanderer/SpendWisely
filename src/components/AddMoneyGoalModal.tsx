'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Laptop,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { DigitalGulak } from './DigitalGulak';

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000];

export function AddMoneyGoalModal() {
  const { activeModal, closeModal, selectedGoal, addMoneyToGoal } = useSpendWise();
  const [amountStr, setAmountStr] = useState('5000');

  if (activeModal !== 'ADD_MONEY_GOAL' || !selectedGoal) return null;

  const currentSavings = selectedGoal.currentSavings;
  const targetAmount = selectedGoal.targetAmount;
  const depositAmount = parseFloat(amountStr) || 0;
  const newSavings = currentSavings + depositAmount;

  const currentPct = targetAmount > 0 ? Math.min(Math.round((currentSavings / targetAmount) * 100), 100) : 0;
  const newPct = targetAmount > 0 ? Math.min(Math.round((newSavings / targetAmount) * 100), 100) : 0;
  const remainingAfter = Math.max(0, targetAmount - newSavings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    addMoneyToGoal(selectedGoal.id, depositAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-2xl sm:rounded-2xl bg-[#f5f5f5] dark:bg-[#0c0a09] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl p-5 flex flex-col gap-4 animate-slide-up">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
          </button>

          <div className="text-center">
            <h2 className="font-display font-light text-base text-[#0c0a09] dark:text-white leading-tight">
              Deposit to Savings
            </h2>
            <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] tracking-[0.15px]">
              Every contribution compounds quietly.
            </p>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Goal Preview Card */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04] text-[#0c0a09] dark:text-white flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                {selectedGoal.name}
              </h4>
              <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5">
                {formatCurrency(currentSavings)} / {formatCurrency(targetAmount)}
              </p>
            </div>
          </div>
          <span className="font-display font-light text-xs px-2.5 py-0.5 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border border-transparent dark:border-white/[0.04]">
            {currentPct}%
          </span>
        </div>

        {/* Diffuse Pastel Atmospheric Bloom & Digital Gulak */}
        <div className="relative flex justify-center py-1 shrink-0">
          <div className="absolute w-44 h-44 rounded-full bg-[#c8b8e0]/20 blur-3xl pointer-events-none" />
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
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs">
            <span className="text-[10px] uppercase font-medium tracking-wider text-[#777169] dark:text-[#a8a29e]">
              Deposit Amount
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-display font-light text-3xl text-[#0c0a09] dark:text-white">₹</span>
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="5000"
                className="w-36 font-display font-light text-3xl text-center bg-transparent text-[#0c0a09] dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = amountStr === amt.toString();
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmountStr(amt.toString())}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] shadow-xs'
                      : 'bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e]'
                  }`}
                >
                  +{formatCurrency(amt)}
                </button>
              );
            })}
          </div>

          {/* 2 Stat Indicators */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#16a34a] dark:text-[#4ade80] flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] block font-sans">Pacing</span>
                <span className="font-display font-light text-xs text-[#16a34a] dark:text-[#4ade80]">
                  {currentPct}% → {newPct}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] block font-sans">Remaining</span>
                <span className="font-display font-light text-xs text-[#0c0a09] dark:text-white">
                  {formatCurrency(remainingAfter)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs transition active:scale-[0.98] tracking-[0.15px] cursor-pointer"
            >
              <span>Add to Savings Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
