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
  { id: 'TRANSACTIONS', label: 'Ledger', icon: Receipt },
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
    <div className="shrink-0 w-full px-3 pb-2 sm:pb-2.5 pt-0.5 z-30 pointer-events-auto">
      <div className="w-full rounded-[24px] px-1.5 py-1.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#e7e5e4] dark:border-white/[0.08] bg-white/95 dark:bg-[#181615]/95 backdrop-blur-xl transition-all">
        {NAV_ITEMS.map((item) => {
          const isSelected =
            currentScreen === item.id ||
            (item.id === 'GOALS' && currentScreen === 'GOAL_DETAIL');
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[#777169] dark:text-[#a8a29e]'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <IconComponent
                  className={`w-4 h-4 ${
                    isSelected ? 'stroke-[2] text-[#0c0a09] dark:text-white' : 'stroke-[1.6]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-wide font-normal truncate max-w-full font-sans ${
                  isSelected
                    ? 'font-medium text-[#0c0a09] dark:text-white'
                    : 'text-[#777169] dark:text-[#a8a29e]'
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
