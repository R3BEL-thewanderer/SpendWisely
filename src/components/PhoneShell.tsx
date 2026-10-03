'use client';

import React from 'react';
import { useSpendWise } from '../context/SpendWiseContext';

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
      className={`fixed inset-0 w-full h-full overflow-hidden sm:overflow-visible sm:relative sm:inset-auto sm:min-h-screen sm:flex sm:items-center sm:justify-center sm:p-4 md:p-8 transition-colors duration-300 ${
        isDark
          ? 'bg-[#111214] sm:bg-gradient-to-br sm:from-[#0a0a0c] sm:via-[#121316] sm:to-[#0c0d10]'
          : 'bg-[#F8F7F4] sm:bg-gradient-to-br sm:from-[#ede9e3] sm:via-[#f5f3ef] sm:to-[#e8e4dc]'
      }`}
    >
      {/* Desktop Background Ambient Decorative Elements */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors ${
            isDark ? 'bg-purple-900' : 'bg-purple-200'
          }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors ${
            isDark ? 'bg-blue-900' : 'bg-blue-200'
          }`}
        />
        <div
          className={`absolute top-1/2 left-12 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors ${
            isDark ? 'bg-amber-900' : 'bg-amber-100'
          }`}
        />
        {/* Subtle Brand Tag */}
        <div className="absolute top-6 left-8 flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#9CC9FF] to-[#C9B8FF] flex items-center justify-center shadow-sm">
            <span className="text-black font-bold text-xs">S</span>
          </div>
          <span
            className={`font-semibold tracking-tight text-sm ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            SpendWise Web
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
            Live Demo
          </span>
        </div>
      </div>

      {/* SMARTPHONE CONTAINER */}
      {/* On desktop: 400px x 844px centered device. On mobile: full static viewport (100vw, 100vh, zero borders, zero gaps) */}
      <div
        className={`relative w-full h-full sm:w-[400px] sm:h-[844px] sm:max-h-[92vh] sm:rounded-[48px] sm:border-[8px] transition-all duration-300 flex flex-col overflow-hidden shadow-none sm:shadow-2xl rounded-none border-0 ${
          isDark
            ? 'bg-[#111214] sm:border-[#2a2c33] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] text-[#F5F5F2]'
            : 'bg-[#F8F7F4] sm:border-[#e2ded6] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] text-[#171717]'
        }`}
      >
        {/* Phone Top Bezel / Dynamic Island / Speaker - HIDDEN on mobile devices */}
        <div className="hidden sm:flex relative w-full pt-2 pb-1 px-7 items-center justify-between z-30 select-none flex-shrink-0">
          {/* Status Time */}
          <span className="text-xs font-semibold tracking-tight w-12">{timeStr}</span>

          {/* Dynamic Island / Speaker cutout */}
          <div className="flex items-center justify-center">
            <div className="w-24 h-5 rounded-full bg-black/80 flex items-center justify-between px-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1d22]/90 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-500/80" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          {/* Status Icons: Cellular, Wifi, Battery */}
          <div className="flex items-center gap-1.5 w-12 justify-end text-xs">
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
        <div className="relative flex-1 w-full overflow-hidden flex flex-col min-h-0">
          {children}
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="absolute top-6 sm:top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-black/90 text-white text-xs font-medium shadow-xl backdrop-blur-md animate-fade-in flex items-center gap-2 max-w-[85%] text-center">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Phone Bottom Home Indicator Bar - HIDDEN on mobile devices */}
        <div className="hidden sm:flex w-full justify-center py-1.5 flex-shrink-0 z-30 select-none">
          <div
            className={`w-32 h-1 rounded-full ${
              isDark ? 'bg-zinc-600/50' : 'bg-zinc-400/50'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
