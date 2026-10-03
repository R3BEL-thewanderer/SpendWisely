'use client';

import React from 'react';
import {
  BarChart2,
  Home,
  PieChart,
  Receipt,
  Trophy,
  User,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { AppScreen } from '../lib/types';

interface NavItem {
  id: AppScreen;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'HOME', label: 'Home', icon: Home },
  { id: 'TRANSACTIONS', label: 'Transactions', icon: Receipt },
  { id: 'BUDGETS', label: 'Budgets', icon: PieChart },
  { id: 'GOALS', label: 'Goals', icon: Trophy },
  { id: 'ANALYTICS', label: 'Analytics', icon: BarChart2 },
  { id: 'PROFILE', label: 'Profile', icon: User },
];

export function BottomNavigation() {
  const { currentScreen, navigateTo } = useSpendWise();

  // Hide on Landing / Onboarding screen
  if (currentScreen === 'LANDING') return null;

  return (
    <div className="shrink-0 w-full px-2.5 pb-2 sm:pb-2.5 pt-0.5 z-30 pointer-events-auto">
      <div className="w-full rounded-[28px] px-1.5 py-1.5 flex items-center justify-between shadow-lg border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[#181a1d]/90 backdrop-blur-xl transition-all">
        {NAV_ITEMS.map((item) => {
          const isSelected =
            currentScreen === item.id ||
            (item.id === 'GOALS' && currentScreen === 'GOAL_DETAIL');
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 ${
                isSelected ? 'scale-105' : 'hover:opacity-80 active:scale-95 text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'text-zinc-950 dark:text-white font-bold'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'stroke-[2.5]' : 'stroke-[1.9]'}`} />
              </div>
              <span
                className={`text-[9.5px] mt-0.5 tracking-tight font-medium truncate max-w-full px-0.5 ${
                  isSelected
                    ? 'text-zinc-950 dark:text-white font-bold'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
