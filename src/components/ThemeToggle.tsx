'use client';

import React from 'react';
import { useSpendWise } from '../context/SpendWiseContext';

interface ThemeToggleProps {
  fontSize?: string;
  className?: string;
  showLabels?: boolean;
}

export function ThemeToggle({
  fontSize,
  className = '',
  showLabels = false,
}: ThemeToggleProps) {
  const { themeMode, toggleTheme } = useSpendWise();
  const isDark = themeMode === 'DARK';

  return (
    <div className={`theme-switch-wrapper inline-flex items-center gap-2 ${className}`}>
      {showLabels && (
        <span
          className={`text-[11px] font-bold transition select-none ${
            !isDark ? 'text-amber-500 dark:text-amber-400' : 'text-zinc-400'
          }`}
        >
          Day
        </span>
      )}
      <label
        className="theme-switch"
        aria-label="Toggle theme"
        style={fontSize ? { fontSize } : undefined}
      >
        <input
          type="checkbox"
          className="theme-switch__checkbox"
          checked={isDark}
          onChange={toggleTheme}
          aria-checked={isDark}
        />
        <div className="theme-switch__container">
          <div className="theme-switch__clouds" />
          <div className="theme-switch__stars-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 144 55"
              fill="none"
              className="theme-switch__stars"
            >
              <path
                fill="var(--stars-color)"
                d="M13.85 4.15a1 1 0 0 0-1.7 0l-.6 1.15a1 1 0 0 1-.5.5l-1.15.6a1 1 0 0 0 0 1.7l1.15.6a1 1 0 0 1 .5.5l.6 1.15a1 1 0 0 0 1.7 0l.6-1.15a1 1 0 0 1 .5-.5l1.15-.6a1 1 0 0 0 0-1.7l-1.15-.6a1 1 0 0 1-.5-.5l-.6-1.15ZM26 15.5a.75.75 0 0 0-1.3 0l-.4.8a.75.75 0 0 1-.4.4l-.8.4a.75.75 0 0 0 0 1.3l.8.4a.75.75 0 0 1 .4.4l.4.8a.75.75 0 0 0 1.3 0l.4-.8a.75.75 0 0 1 .4-.4l.8-.4a.75.75 0 0 0 0-1.3l-.8-.4a.75.75 0 0 1-.4-.4l-.4-.8ZM15 28.5a.65.65 0 0 0-1.15 0l-.35.7a.65.65 0 0 1-.35.35l-.7.35a.65.65 0 0 0 0 1.15l.7.35a.65.65 0 0 1 .35.35l.35.7a.65.65 0 0 0 1.15 0l.35-.7a.65.65 0 0 1 .35-.35l.7-.35a.65.65 0 0 0 0-1.15l-.7-.35a.65.65 0 0 1-.35-.35l-.35-.7ZM30 36.5a.65.65 0 0 0-1.15 0l-.35.7a.65.65 0 0 1-.35.35l-.7.35a.65.65 0 0 0 0 1.15l.7.35a.65.65 0 0 1 .35.35l.35.7a.65.65 0 0 0 1.15 0l.35-.7a.65.65 0 0 1 .35-.35l.7-.35a.65.65 0 0 0 0-1.15l-.7-.35a.65.65 0 0 1-.35-.35l-.35-.7ZM40 12.5a.5.5 0 0 0-.9 0l-.25.5a.5.5 0 0 1-.25.25l-.5.25a.5.5 0 0 0 0 .9l.5.25a.5.5 0 0 1 .25.25l.25.5a.5.5 0 0 0 .9 0l.25-.5a.5.5 0 0 1 .25-.25l.5-.25a.5.5 0 0 0 0-.9l-.5-.25a.5.5 0 0 1-.25-.25l-.25-.5ZM42 30.5a.5.5 0 0 0-.9 0l-.25.5a.5.5 0 0 1-.25.25l-.5.25a.5.5 0 0 0 0 .9l.5.25a.5.5 0 0 1 .25.25l.25.5a.5.5 0 0 0 .9 0l.25-.5a.5.5 0 0 1 .25-.25l.5-.25a.5.5 0 0 0 0-.9l-.5-.25a.5.5 0 0 1-.25-.25l-.25-.5Z"
              />
            </svg>
          </div>
          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
              </div>
            </div>
          </div>
        </div>
      </label>
      {showLabels && (
        <span
          className={`text-[11px] font-bold transition select-none ${
            isDark ? 'text-indigo-400' : 'text-zinc-400'
          }`}
        >
          Night
        </span>
      )}
    </div>
  );
}

export default ThemeToggle;
