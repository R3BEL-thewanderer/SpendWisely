'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  BarChart2,
  Home,
  PieChart,
  Plus,
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
  const { currentScreen, navigateTo, openModal } = useSpendWise();
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Hide on Landing or Goal Detail sub-view
  if (currentScreen === 'LANDING' || currentScreen === 'GOAL_DETAIL') return null;

  // Pages where the plus (+) action button is required
  const requiresPlusButton =
    currentScreen === 'HOME' ||
    currentScreen === 'TRANSACTIONS' ||
    currentScreen === 'BUDGETS' ||
    currentScreen === 'GOALS' ||
    currentScreen === 'CATEGORIES';

  const handlePlusAction = () => {
    switch (currentScreen) {
      case 'HOME':
      case 'TRANSACTIONS':
        openModal('ADD_EXPENSE');
        break;
      case 'BUDGETS':
        openModal('CREATE_BUDGET');
        break;
      case 'GOALS':
        openModal('CREATE_GOAL');
        break;
      case 'CATEGORIES':
        openModal('ADD_CATEGORY');
        break;
      default:
        openModal('ADD_EXPENSE');
        break;
    }
  };

  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === currentScreen);

  // Smooth flowing glassmorphic pill indicator calculation
  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeEl = itemRefs.current[activeIndex];
      const containerEl = navContainerRef.current;
      if (activeEl && containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        setIndicatorStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          ready: true,
        });
      }
    };

    updateIndicator();
    const rafId = requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [currentScreen, activeIndex]);

  return (
    <div className="absolute bottom-4 sm:bottom-5 inset-x-0 z-30 pointer-events-none flex items-center justify-center px-3 sm:px-4">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 max-w-full">
        {/* Floating Glassmorphic Capsule Navbar */}
        <div
          ref={navContainerRef}
          className="relative flex items-center p-1 sm:p-1.5 rounded-full bg-white/75 dark:bg-[#181615]/80 backdrop-blur-2xl border border-white/70 dark:border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 select-none"
        >
          {/* Smooth Flowing Indicator Pill */}
          <div
            className="absolute top-1 bottom-1 sm:top-1.5 sm:bottom-1.5 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] bg-white dark:bg-[#24211e] shadow-[0_2px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-black/[0.04] dark:border-white/[0.08]"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.ready ? 1 : 0,
            }}
          />

          {/* Navigation Items */}
          {NAV_ITEMS.map((item, index) => {
            const isSelected = currentScreen === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => navigateTo(item.id)}
                className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-200 select-none cursor-pointer ${
                  isSelected
                    ? 'px-3 sm:px-3.5 py-1.5 gap-1.5 text-[#0c0a09] dark:text-white'
                    : 'w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white active:scale-90'
                }`}
                aria-label={item.label}
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <IconComponent
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected
                        ? 'stroke-[2.2] scale-105 text-[#0c0a09] dark:text-white'
                        : 'stroke-[1.7]'
                    }`}
                  />
                </div>

                {isSelected && (
                  <span className="text-[11px] sm:text-xs font-medium tracking-tight whitespace-nowrap font-sans animate-fade-in">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Quick Action Plus (+) Button (Shown only on required pages) */}
        {requiresPlusButton && (
          <button
            onClick={handlePlusAction}
            className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-full flex items-center justify-center bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] border border-black/10 dark:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 animate-fade-in"
            aria-label="Quick Action"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        )}
      </div>
    </div>
  );
}

export default BottomNavigation;
