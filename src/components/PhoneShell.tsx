'use client';

import React from 'react';
import { useSpendWise } from '../context/SpendWiseContext';
import { ThemeToggle } from './ThemeToggle';

interface PhoneShellProps {
  children: React.ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  const { themeMode, toastMessage } = useSpendWise();
  const isDark = themeMode === 'DARK';

  // Real-time clock for phone status bar
  const [timeStr, setTimeStr] = React.useState('9:41');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const displayHours = hours % 12 || 12;
      const displayMins = mins < 10 ? `0${mins}` : mins;
      setTimeStr(`${displayHours}:${displayMins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 w-full h-full max-w-full overflow-hidden overflow-x-hidden touch-pan-y sm:overflow-visible sm:relative sm:inset-auto sm:min-h-screen sm:flex sm:items-center sm:justify-center sm:p-4 md:p-8 transition-colors duration-300 ${
        isDark ? 'bg-[#0c0a09] text-[#ffffff]' : 'bg-[#f5f5f5] text-[#0c0a09]'
      }`}
    >
      {/* Desktop Background Atmospheric Pastel Gradient Orbs (signature brand pattern) */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden select-none">
        {/* Mint Orb top-left */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full orb-mint opacity-60 dark:opacity-20 animate-pulse transition-opacity duration-1000" />
        {/* Peach Orb bottom-right */}
        <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full orb-peach opacity-60 dark:opacity-20 transition-opacity duration-1000" />
        {/* Lavender Orb mid-left */}
        <div className="absolute top-1/3 -left-16 w-[360px] h-[360px] rounded-full orb-lavender opacity-45 dark:opacity-15 transition-opacity duration-1000" />
        {/* Sky Orb top-right */}
        <div className="absolute top-12 right-1/4 w-[320px] h-[320px] rounded-full orb-sky opacity-40 dark:opacity-15 transition-opacity duration-1000" />

        {/* Editorial Brand Tag in Waldenburg / EB Garamond 300 */}
        <div className="absolute top-7 left-8 flex items-baseline gap-3">
          <span className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff]">
            SpendWise
          </span>
          <span className="text-[13px] font-normal text-[#777169] dark:text-[#a8a29e] tracking-wide">
            An editorial personal finance ledger
          </span>
        </div>

        {/* Desktop Quick Day/Night Toggle */}
        <div className="absolute top-7 right-8 flex items-center gap-3 bg-white/90 dark:bg-[#1c1917]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#e7e5e4] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] pointer-events-auto z-40">
          <span className="text-[12px] font-medium text-[#777169] dark:text-[#a8a29e]">Theme</span>
          <ThemeToggle fontSize="9.5px" />
        </div>
      </div>

      {/* SMARTPHONE CONTAINER */}
      {/* On desktop: 400px x 844px centered device. On mobile: full static viewport (100vw, 100vh) */}
      <div
        className={`relative w-full h-full max-w-full sm:w-[400px] sm:h-[844px] sm:max-h-[92vh] sm:rounded-[44px] sm:border transition-all duration-300 flex flex-col overflow-hidden overflow-x-hidden shadow-none sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] rounded-none border-0 ${
          isDark
            ? 'bg-[#0c0a09] sm:border-white/10 text-[#ffffff]'
            : 'bg-[#f5f5f5] sm:border-[#e7e5e4] text-[#0c0a09]'
        }`}
      >
        {/* Phone Top Bezel / Dynamic Island / Speaker - HIDDEN on mobile devices */}
        <div className="hidden sm:flex relative w-full pt-2.5 pb-1 px-7 items-center justify-between z-30 select-none flex-shrink-0">
          {/* Status Time */}
          <span className="text-xs font-medium tracking-tight w-12 text-[#0c0a09] dark:text-[#ffffff]">
            {timeStr}
          </span>

          {/* Dynamic Island / Speaker cutout */}
          <div className="flex items-center justify-center">
            <div className="w-22 h-4.5 rounded-full bg-[#0c0a09] flex items-center justify-between px-2.5">
              <div className="w-2 h-2 rounded-full bg-[#1c1917] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-indigo-400" />
              </div>
              <div className="w-1 h-1 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          {/* Status Icons: Cellular, Wifi, Battery */}
          <div className="flex items-center gap-1.5 w-12 justify-end text-xs opacity-80 text-[#0c0a09] dark:text-[#ffffff]">
            {/* Cellular signal */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M2 20h2v-4H2v4zm4 0h2v-8H6v8zm4 0h2V8h-2v12zm4 0h2V4h-2v16zm4 0h2V1h-2v19z" />
            </svg>
            {/* Wifi */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.5 0 6.67 1.34 9.07 3.53L12 19.33 2.93 11.03C5.33 8.84 8.5 7.5 12 7.5z" />
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3.5 bg-current rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Viewport */}
        <div className="relative flex-1 w-full max-w-full overflow-hidden overflow-x-hidden flex flex-col min-h-0">
          {children}
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="absolute top-6 sm:top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] text-xs font-medium shadow-xl backdrop-blur-md animate-fade-in flex items-center gap-2 max-w-[85%] text-center border border-white/10 dark:border-black/10 font-sans">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Phone Bottom Home Indicator Bar - HIDDEN on mobile devices */}
        <div className="hidden sm:flex w-full justify-center py-2 flex-shrink-0 z-30 select-none">
          <div
            className={`w-32 h-1 rounded-full ${
              isDark ? 'bg-white/20' : 'bg-black/15'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
