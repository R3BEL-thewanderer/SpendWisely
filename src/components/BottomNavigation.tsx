'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
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

  // Smooth flowing glassmorphic pill indicator calculation with ResizeObserver
  useLayoutEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    const containerEl = navContainerRef.current;
    if (!activeEl || !containerEl) return;

    const measure = () => {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      if (activeRect.width > 0) {
        setIndicatorStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          ready: true,
        });
      }
    };

    // Immediate calculation
    measure();

    // Use ResizeObserver so that as soon as the text/label layout settles, the width is 100% accurate
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        measure();
      });
      ro.observe(activeEl);
      ro.observe(containerEl);
    }

    // Safety timers to catch frame transitions and font metrics
    const raf1 = requestAnimationFrame(measure);
    const t1 = setTimeout(measure, 40);
    const t2 = setTimeout(measure, 120);
    const t3 = setTimeout(measure, 250);

    window.addEventListener('resize', measure);

    return () => {
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', measure);
    };
  }, [currentScreen, activeIndex]);

  return (
    <div className="absolute bottom-4 sm:bottom-5 inset-x-0 z-30 pointer-events-none flex items-center justify-center px-2.5 sm:px-4">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 max-w-full">
        {/* Floating Glassmorphic Capsule Navbar */}
        <div
          ref={navContainerRef}
          className="relative flex items-center p-1.5 sm:p-1.5 rounded-full bg-white/75 dark:bg-[#181615]/80 backdrop-blur-2xl border border-white/70 dark:border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)] select-none"
        >
          {/* Smooth Flowing Indicator Pill */}
          <div
            className="nav-pill-indicator absolute top-1.5 bottom-1.5 rounded-full pointer-events-none bg-white dark:bg-[#24211e] shadow-[0_2px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-black/[0.04] dark:border-white/[0.08]"
            style={{
              left: `${indicatorStyle.left}px`,
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
                className={`relative z-10 flex items-center justify-center rounded-full select-none cursor-pointer transition-[color,transform] duration-150 ${
                  isSelected
                    ? 'px-4 sm:px-4.5 py-2 sm:py-2 gap-2 text-[#0c0a09] dark:text-white shrink-0'
                    : 'w-[38px] h-[38px] sm:w-[38px] sm:h-[38px] text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white active:scale-90 shrink-0'
                }`}
                aria-label={item.label}
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                  <IconComponent
                    className={`w-[18px] h-[18px] transition-transform duration-200 ${
                      isSelected
                        ? 'stroke-[2.2] scale-105 text-[#0c0a09] dark:text-white'
                        : 'stroke-[1.7]'
                    }`}
                  />
                </div>

                {isSelected && (
                  <span className="text-xs sm:text-[13px] font-medium tracking-tight whitespace-nowrap font-sans shrink-0 animate-fade-in">
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
            className="w-[44px] h-[44px] sm:w-[46px] sm:h-[46px] rounded-full flex items-center justify-center bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] border border-black/10 dark:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 animate-pop-in"
            aria-label="Quick Action"
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
      </div>
    </div>
  );
}

export default BottomNavigation;
