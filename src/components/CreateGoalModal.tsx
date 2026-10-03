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
  MoreHorizontal,
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
  { id: 'blue', hex: '#3B82F6' },
  { id: 'pink', hex: '#FB7185' },
  { id: 'violet', hex: '#A855F7' },
  { id: 'peach', hex: '#F97316' },
  { id: 'yellow', hex: '#FACC15' },
  { id: 'mint', hex: '#34D399' },
];

export function CreateGoalModal() {
  const { activeModal, closeModal, addGoal } = useSpendWise();

  const [name, setName] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [currentSavingsStr, setCurrentSavingsStr] = useState('');
  const [targetDate, setTargetDate] = useState('30 Jun 2026');
  const [category, setCategory] = useState('Electronics');
  const [selectedIcon, setSelectedIcon] = useState('laptop');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
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

          <h2 className="font-bold text-base text-zinc-900 dark:text-white">Create a Goal</h2>

          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>

        {/* Diffuse Glowing Orb with 3D Target Graphic (Image 2 Screen 2) */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-1 shrink-0">
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300/40 via-purple-300/30 to-blue-300/40 blur-2xl pointer-events-none" />
          <div className="relative w-20 h-20 rounded-full bg-white dark:bg-zinc-800 shadow-md border-2 border-purple-200/60 dark:border-white/10 flex items-center justify-center text-purple-600">
            <Target className="w-9 h-9 stroke-[2]" />
          </div>
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
            Set a goal, stay consistent, make it happen.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Goal Name */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2.5 flex-1">
              <User className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Goal Name"
                className="w-full bg-transparent text-xs font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                required
              />
            </div>
            {name && (
              <button
                type="button"
                onClick={() => setName('')}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Target Amount */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-xs">
            <span className="text-sm font-bold text-zinc-400">₹</span>
            <input
              type="number"
              value={targetAmountStr}
              onChange={(e) => setTargetAmountStr(e.target.value)}
              placeholder="Target Amount (e.g. 80000)"
              className="w-full bg-transparent text-xs font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              required
            />
          </div>

          {/* Current Savings (Optional) */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-xs">
            <PiggyBank className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="number"
              value={currentSavingsStr}
              onChange={(e) => setCurrentSavingsStr(e.target.value)}
              placeholder="Current Savings (Optional)"
              className="w-full bg-transparent text-xs font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />
          </div>

          {/* Target Date */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-xs cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Target Date
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
              <span>{targetDate}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Goal Category */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-xs cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Goal Category
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
              <span>{category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Choose an Icon */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Choose an Icon
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
                    className={`h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-2 shadow-xs scale-105'
                        : 'bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-white/5 text-zinc-500 hover:text-zinc-800'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: selectedColor,
                            backgroundColor: `${selectedColor}15`,
                            color: selectedColor,
                          }
                        : {}
                    }
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose a Color */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Choose a Color
            </span>
            <div className="flex items-center justify-between px-1">
              {GOAL_COLORS.map((color) => {
                const isSelected = selectedColor === color.hex;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-9 h-9 rounded-full transition-transform ${
                      isSelected ? 'scale-110 ring-2 ring-offset-2 ring-zinc-400' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. High performance laptop for college"
              className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none shadow-xs"
            />
          </div>

          {/* Live Preview Card */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Preview
            </span>
            <div className="p-3.5 rounded-[22px] bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${selectedColor}18`,
                    color: selectedColor,
                  }}
                >
                  <ActiveIcon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                    {name.trim() || 'New Laptop'}
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    {formatCurrency(currentSavings)} / {formatCurrency(targetAmount || 80000)}
                  </p>
                </div>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${selectedColor}15`,
                  color: selectedColor,
                }}
              >
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <span>Create Goal →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
