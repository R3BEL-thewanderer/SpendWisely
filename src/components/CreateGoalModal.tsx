'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Car,
  ChevronRight,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  PiggyBank,
  Plane,
  Tag,
  Target,
  User,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';

const GOAL_ICONS = [
  { id: 'laptop', icon: Laptop },
  { id: 'plane', icon: Plane },
  { id: 'car', icon: Car },
  { id: 'home', icon: Home },
  { id: 'education', icon: GraduationCap },
  { id: 'health', icon: Heart },
];

const GOAL_COLORS = [
  { id: 'sky', hex: '#a8c8e8' },
  { id: 'peach', hex: '#f4c5a8' },
  { id: 'lavender', hex: '#c8b8e0' },
  { id: 'mint', hex: '#a7e5d3' },
  { id: 'rose', hex: '#e8b8c4' },
  { id: 'ink', hex: '#292524' },
];

export function CreateGoalModal() {
  const { activeModal, closeModal, addGoal } = useSpendWise();

  const [name, setName] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [currentSavingsStr, setCurrentSavingsStr] = useState('');
  const [targetDate, setTargetDate] = useState('30 Jun 2026');
  const [category, setCategory] = useState('Electronics');
  const [selectedIcon, setSelectedIcon] = useState('laptop');
  const [selectedColor, setSelectedColor] = useState('#292524');
  const [description, setDescription] = useState('');

  if (activeModal !== 'CREATE_GOAL') return null;

  const targetAmount = parseFloat(targetAmountStr) || 0;
  const currentSavings = parseFloat(currentSavingsStr) || 0;
  const progressPct =
    targetAmount > 0 ? Math.min(Math.round((currentSavings / targetAmount) * 100), 100) : 0;

  const ActiveIcon = GOAL_ICONS.find((it) => it.id === selectedIcon)?.icon || Laptop;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (targetAmount <= 0) return;

    addGoal({
      name: name.trim(),
      targetAmount,
      currentSavings,
      targetDate,
      category,
      iconType: selectedIcon,
      colorHex: selectedColor,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 animate-fade-in font-sans">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-[400px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-2xl bg-[#f5f5f5] dark:bg-[#0c0a09] border border-[#e7e5e4] dark:border-white/10 shadow-2xl p-5 flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#1c1917] flex items-center justify-center border border-[#e7e5e4] dark:border-white/10 shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h2 className="font-display font-light text-base text-[#0c0a09] dark:text-white">
            Create Savings Goal
          </h2>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#1c1917] flex items-center justify-center border border-[#e7e5e4] dark:border-white/10 shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Diffuse Pastel Atmospheric Bloom */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-1 shrink-0">
          <div className="absolute w-36 h-36 rounded-full bg-[#c8b8e0]/25 blur-2xl pointer-events-none" />
          <div className="relative w-16 h-16 rounded-full bg-white dark:bg-[#1c1917] shadow-2xs border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#0c0a09] dark:text-white">
            <Target className="w-7 h-7 stroke-[1.8]" />
          </div>
          <span className="text-[11px] text-[#777169] mt-2 tracking-[0.15px]">
            Disciplined savings toward enduring goals.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Goal Name */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 shadow-2xs">
            <div className="flex items-center gap-2.5 flex-1">
              <User className="w-4 h-4 text-[#a8a29e] shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Goal Title (e.g. MacBook Pro M3)"
                className="w-full bg-transparent text-xs font-medium text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e] focus:outline-none"
                required
              />
            </div>
            {name && (
              <button
                type="button"
                onClick={() => setName('')}
                className="text-[#a8a29e] hover:text-[#0c0a09]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Target Amount */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 shadow-2xs">
            <span className="text-sm font-medium text-[#777169]">₹</span>
            <input
              type="number"
              value={targetAmountStr}
              onChange={(e) => setTargetAmountStr(e.target.value)}
              placeholder="Target Amount (e.g. 150000)"
              className="w-full bg-transparent text-xs font-medium text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e] focus:outline-none"
              required
            />
          </div>

          {/* Current Savings (Optional) */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 shadow-2xs">
            <PiggyBank className="w-4 h-4 text-[#a8a29e] shrink-0" />
            <input
              type="number"
              value={currentSavingsStr}
              onChange={(e) => setCurrentSavingsStr(e.target.value)}
              placeholder="Current Initial Capital (Optional)"
              className="w-full bg-transparent text-xs font-medium text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e] focus:outline-none"
            />
          </div>

          {/* Target Date */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 shadow-2xs cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#a8a29e]" />
              <span className="text-xs font-medium text-[#777169] tracking-[0.15px]">
                Target Date
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#0c0a09] dark:text-white">
              <span>{targetDate}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
            </div>
          </div>

          {/* Goal Category */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 shadow-2xs cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-[#a8a29e]" />
              <span className="text-xs font-medium text-[#777169] tracking-[0.15px]">
                Category
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#0c0a09] dark:text-white">
              <span>{category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
            </div>
          </div>

          {/* Choose an Icon */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-[#777169] uppercase tracking-[0.96px]">
              Icon Plate
            </span>
            <div className="grid grid-cols-6 gap-2">
              {GOAL_ICONS.map((it) => {
                const Icon = it.icon;
                const isSelected = selectedIcon === it.id;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setSelectedIcon(it.id)}
                    className={`h-10 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#292524] text-white shadow-xs'
                        : 'bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 text-[#777169] hover:text-[#0c0a09]'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose an Accent Stop */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-[#777169] uppercase tracking-[0.96px]">
              Pastel Accent
            </span>
            <div className="flex items-center justify-between px-1">
              {GOAL_COLORS.map((color) => {
                const isSelected = selectedColor === color.hex;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-8 h-8 rounded-full transition-transform cursor-pointer border border-[#e7e5e4] dark:border-white/10 ${
                      isSelected ? 'scale-115 ring-2 ring-offset-2 ring-[#0c0a09]' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-[10px] font-medium text-[#777169] uppercase tracking-[0.96px]">
              Ledger Preview
            </span>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1c1917] border border-[#e7e5e4] dark:border-white/10 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center shrink-0 text-[#0c0a09] dark:text-white">
                  <ActiveIcon className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                    {name.trim() || 'MacBook Pro'}
                  </h4>
                  <p className="text-[10px] text-[#777169]">
                    {formatCurrency(currentSavings)} / {formatCurrency(targetAmount || 150000)}
                  </p>
                </div>
              </div>
              <span className="font-display font-light text-xs text-[#0c0a09] dark:text-white">
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Submit Button - Near-Black Ink Pill */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white font-medium text-xs shadow-xs transition active:scale-[0.98] tracking-[0.15px] cursor-pointer"
            >
              <span>Save Savings Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
