'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  Camera,
  Check,
  ChevronRight,
  Crown,
  Download,
  Eye,
  Lock,
  LogOut,
  Mail,
  Moon,
  MoreHorizontal,
  Palette,
  Pencil,
  PieChart,
  RotateCcw,
  Shield,
  Sliders,
  Sun,
  Trash2,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { ThemeToggle } from './ThemeToggle';

type ProfileSubView = 'PROFILE' | 'SETTINGS' | 'APPEARANCE';

export function ProfileScreen() {
  const {
    userProfile,
    themeMode,
    toggleTheme,
    navigateTo,
    openModal,
    resetData,
  } = useSpendWise();

  const [subView, setSubView] = useState<ProfileSubView>('PROFILE');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isDark = themeMode === 'DARK';

  // 1. APPEARANCE VIEW
  if (subView === 'APPEARANCE') {
    return (
      <div className="flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-4 animate-fade-in font-sans min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('SETTINGS')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#1c1917] flex items-center justify-center border border-[#e7e5e4] dark:border-white/10 transition active:scale-95 text-[#0c0a09] dark:text-white shadow-2xs"
            aria-label="Back to Settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-light text-2xl tracking-[-0.32px] text-[#0c0a09] dark:text-white">
              Appearance
            </h1>
            <p className="text-[11px] text-[#777169] tracking-[0.16px]">
              Visual dialect and display theme.
            </p>
          </div>
        </div>

        {/* Animated Day & Night Toggle Showcase Card */}
        <div className="relative p-5 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex flex-col items-center justify-center text-center gap-3 mt-2 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Atmospheric bloom */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#c8b8e0]/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[#a8c8e8]/20 blur-2xl pointer-events-none" />

          <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.96px] text-[#777169]">
            Interactive Day & Night Switch
          </span>
          <p className="relative z-10 text-xs text-[#4e4e4e] dark:text-zinc-300 max-w-xs leading-relaxed">
            Toggle between bright natural daylight and celestial star-filled night sky.
          </p>
          <div className="relative z-10 py-2">
            <ThemeToggle fontSize="14px" showLabels />
          </div>
          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 text-[11px] font-medium text-[#0c0a09] dark:text-zinc-200">
            <span className="text-[#777169]">Currently Active:</span>
            <span className="font-medium">
              {isDark ? '🌙 Night Mode' : '☀️ Day Mode'}
            </span>
          </div>
        </div>

        {/* 2 Interactive Theme Option Cards with Quick Toggle */}
        <div className="flex flex-col gap-2.5">
          {/* Day Mode Card */}
          <div
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
              !isDark
                ? 'bg-white dark:bg-[#181615] border-[#0c0a09] dark:border-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-[#0c0a09]'
                : 'bg-white dark:bg-[#181615] border-[#e7e5e4] dark:border-white/[0.08] hover:border-[#d6d3d1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04] text-[#0c0a09] dark:text-white flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                    Day Mode
                  </h3>
                  {!isDark && (
                    <span className="px-2 py-0.5 rounded-full bg-[#292524] text-white text-[9px] font-medium tracking-wide">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5 tracking-[0.15px]">
                  Off-white canvas, warm near-black ink, soft pastel blooms.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                !isDark ? 'border-[#292524] bg-[#292524] text-white' : 'border-[#d6d3d1]'
              }`}
            >
              {!isDark && <Check className="w-3 h-3 stroke-[2.5]" />}
            </div>
          </div>

          {/* Night Mode Card */}
          <div
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
              isDark
                ? 'bg-[#181615] border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-white/60'
                : 'bg-white dark:bg-[#181615] border-[#e7e5e4] dark:border-white/[0.08] hover:border-[#d6d3d1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04] text-[#0c0a09] dark:text-white flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-xs text-[#0c0a09] dark:text-white tracking-[0.15px]">
                    Night Mode
                  </h3>
                  {isDark && (
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#0c0a09] text-[9px] font-medium tracking-wide">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5 tracking-[0.15px]">
                  Deep charcoal slate with moon craters and sparkling night sky.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isDark ? 'border-white bg-white text-[#0c0a09]' : 'border-[#d6d3d1]'
              }`}
            >
              {isDark && <Check className="w-3 h-3 stroke-[2.5]" />}
            </div>
          </div>
        </div>

        {/* Theme Preview Card */}
        <div className="mt-2 flex flex-col gap-2">
          <span className="text-xs font-medium text-[#777169] tracking-[0.15px]">Preview</span>
          <div className="p-4 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-1 rounded-full bg-[#292524] dark:bg-white" />
              <div className="w-14 h-1 rounded-full bg-[#777169]/40" />
              <div className="w-10 h-1 rounded-full bg-[#777169]/20" />
            </div>

            <div className="rounded-xl p-3 bg-[#fafafa] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex flex-col items-end">
              <span className="text-[9px] text-[#777169]">Total Balance</span>
              <span className="font-display font-light text-sm text-[#0c0a09] dark:text-white">₹ 48,250</span>
              <span className="text-[9px] text-[#16a34a] font-medium mt-0.5">↑ 8% this month</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. SETTINGS VIEW
  if (subView === 'SETTINGS') {
    return (
      <div className="flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-4 animate-fade-in overflow-y-auto no-scrollbar font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubView('PROFILE')}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1c1917] flex items-center justify-center border border-[#e7e5e4] dark:border-white/10 shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white"
              aria-label="Back to Profile"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display font-light text-2xl tracking-[-0.32px] text-[#0c0a09] dark:text-white">
                Settings
              </h1>
              <p className="text-[11px] text-[#777169] tracking-[0.16px]">
                Customize your ledger preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Appearance */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-[0.96px] text-[#777169] px-1">
            Appearance
          </span>
          <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs overflow-hidden">
            {/* Animated Day & Night Toggle Row */}
            <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-sm">
                  {isDark ? '🌙' : '☀️'}
                </div>
                <div>
                  <span className="text-xs font-medium text-[#0c0a09] dark:text-white block tracking-[0.15px]">
                    Day & Night Mode
                  </span>
                  <span className="text-[10px] text-[#777169] block">
                    {isDark ? 'Night (Dark Slate & Stars)' : 'Day (Editorial Light Canvas)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle fontSize="10.5px" />
              </div>
            </div>

            {/* Appearance Details Link */}
            <div
              onClick={() => setSubView('APPEARANCE')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-[#777169]" />
                <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">
                  Appearance Settings
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
            </div>
          </div>
        </div>

        {/* Section 2: Preferences */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-[0.96px] text-[#777169] px-1">
            Preferences
          </span>
          <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs overflow-hidden">
            <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5">
              <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">Currency</span>
              <div className="flex items-center gap-1 text-xs text-[#777169]">
                <span>INR ₹</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
              </div>
            </div>
            <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5">
              <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">Notifications</span>
              <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
            </div>
            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5">
              <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">Ledger Preferences</span>
              <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
            </div>
          </div>
        </div>

        {/* Section 3: Security */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-[0.96px] text-[#777169] px-1">
            Security
          </span>
          <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs overflow-hidden">
            <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5">
              <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">Change Password</span>
              <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
            </div>
            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5">
              <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">Passkey Authentication</span>
              <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
            </div>
          </div>
        </div>

        {/* Section 4: Data & Reset */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-[0.96px] text-[#777169] px-1">
            Data
          </span>
          <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs overflow-hidden">
            <div
              onClick={() => alert('Data exported to spendwise-ledger.json')}
              className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-white/5"
            >
              <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">Export Ledger Data</span>
              <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
            </div>
            <div
              onClick={() => {
                if (confirm('Reset to default demo data?')) resetData();
              }}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-[#dc2626]"
            >
              <span className="text-xs font-medium tracking-[0.15px]">Reset All Data</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Section 5: Account Log Out */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-[0.96px] text-[#777169] px-1">
            Account
          </span>
          <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs overflow-hidden">
            <div
              onClick={() => setShowLogoutDialog(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-[#dc2626]"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15px]">Log Out</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Logout Dialog Overlay */}
        {showLogoutDialog && renderLogoutDialog()}
      </div>
    );
  }

  // 3. MAIN PROFILE VIEW
  return (
    <div className="flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-4 animate-fade-in overflow-y-auto no-scrollbar font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-display font-light text-2xl tracking-[-0.32px] text-[#0c0a09] dark:text-white">
            Profile
          </h1>
          <p className="text-[11px] text-[#777169] tracking-[0.16px]">
            Personal ledger details and settings.
          </p>
        </div>

        <button
          onClick={() => setSubView('SETTINGS')}
          className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-2xs transition active:scale-95 text-[#0c0a09] dark:text-white"
          aria-label="Settings"
        >
          <MoreHorizontal className="w-4 h-4 opacity-70" />
        </button>
      </div>

      {/* Profile Photo Avatar with Atmospheric Pastel Bloom */}
      <div className="relative flex flex-col items-center justify-center py-2 shrink-0">
        {/* Pastel blooms */}
        <div className="absolute w-44 h-44 rounded-full bg-[#f4c5a8]/25 blur-3xl pointer-events-none" />
        <div className="absolute w-40 h-40 -bottom-2 rounded-full bg-[#a8c8e8]/25 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-22 h-22 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] p-1 shadow-sm">
            <div className="w-full h-full rounded-full bg-[#f0efed] dark:bg-white/10 text-[#0c0a09] dark:text-white flex items-center justify-center font-display font-light text-2xl">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => alert('Photo upload')}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#292524] text-white border-2 border-white dark:border-[#1c1917] flex items-center justify-center shadow-2xs hover:scale-105 transition"
            aria-label="Change photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <h2 className="font-display font-light text-xl text-[#0c0a09] dark:text-white mt-3 tracking-tight">
          {userProfile.name}
        </h2>
        <p className="text-[11px] text-[#777169] mt-0.5 tracking-[0.15px]">{userProfile.email}</p>

        <button
          onClick={() => openModal('AUTH_ONBOARDING')}
          className="mt-2.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#1c1917] border border-[#d6d3d1] dark:border-white/10 text-[11px] font-medium text-[#0c0a09] dark:text-zinc-200 shadow-2xs flex items-center gap-1.5 hover:bg-[#fafafa] transition tracking-[0.15px]"
        >
          <Pencil className="w-3 h-3 opacity-70" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 3 Stat Cards Row */}
      <div className="grid grid-cols-3 gap-2 shrink-0">
        <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center">
          <span className="text-[10px] text-[#777169] font-medium tracking-[0.15px]">Currency</span>
          <span className="font-display font-light text-base text-[#0c0a09] dark:text-white mt-0.5">
            {userProfile.currency || 'INR ₹'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center">
          <span className="text-[10px] text-[#777169] font-medium tracking-[0.15px]">Monthly Income</span>
          <span className="font-display font-light text-sm text-[#0c0a09] dark:text-white mt-0.5">
            {formatCurrency(userProfile.monthlyIncome || 45000)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center">
          <span className="text-[10px] text-[#777169] font-medium tracking-[0.15px]">Monthly Budget</span>
          <span className="font-display font-light text-sm text-[#0c0a09] dark:text-white mt-0.5">
            {formatCurrency(userProfile.monthlyBudget || 30000)}
          </span>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.96px] text-[#777169] px-1">
          Account Information
        </span>
        <div className="rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xs overflow-hidden">
          <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#777169]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-[#777169] block">Full Name</span>
                <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">
                  {userProfile.name}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
          </div>

          <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#777169]">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-[#777169] block">Email Address</span>
                <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">
                  {userProfile.email}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
          </div>

          <div className="p-3.5 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#777169]">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-[#777169] block">Member Since</span>
                <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">
                  {userProfile.memberSince || '12 Feb 2025'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#777169]">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-[#777169] block">Account Tier</span>
                <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">
                  {userProfile.accountType || 'Free Ledger'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
          </div>
        </div>
      </div>

      {/* Upgrade to Premium Card with Pastel Bloom */}
      <div className="relative p-4 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer hover:shadow-md transition shrink-0 overflow-hidden">
        {/* Soft peach bloom */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#f4c5a8]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 text-[#0c0a09] dark:text-white flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="font-display font-light text-sm text-[#0c0a09] dark:text-white tracking-tight">
              Upgrade to Premium
            </h4>
            <p className="text-[11px] text-[#777169] mt-0.5 tracking-[0.15px]">
              Advanced financial forecasting and unlimited ledger books.
            </p>
          </div>
        </div>
        <ChevronRight className="relative z-10 w-4 h-4 text-[#a8a29e] shrink-0" />
      </div>

      {/* Settings Navigation Shortcut Pill */}
      <button
        onClick={() => setSubView('SETTINGS')}
        className="w-full py-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white font-medium text-xs shadow-xs transition shrink-0 flex items-center justify-center gap-2 tracking-[0.15px]"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Open Settings</span>
      </button>

      {/* Logout Dialog Overlay */}
      {showLogoutDialog && renderLogoutDialog()}
    </div>
  );

  // Helper to render the Logout confirmation dialog
  function renderLogoutDialog() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
        <div
          onClick={() => setShowLogoutDialog(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        <div className="relative w-full max-w-[340px] rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl p-5 flex flex-col items-center text-center gap-3">
          {/* Close X */}
          <button
            onClick={() => setShowLogoutDialog(false)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#f0efed] dark:bg-white/5 flex items-center justify-center text-[#777169]"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#dc2626] flex items-center justify-center border border-rose-200 dark:border-rose-900/30 my-1">
            <LogOut className="w-5 h-5 stroke-[1.8]" />
          </div>

          <h3 className="font-display font-light text-lg text-[#0c0a09] dark:text-white">
            Log out of SpendWise?
          </h3>
          <p className="text-xs text-[#777169] px-2 leading-relaxed tracking-[0.15px]">
            You&apos;ll need to authenticate again to access your personal ledger and financial history.
          </p>

          {/* Actions with Ink Pill */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="py-2.5 rounded-full border border-[#d6d3d1] dark:border-white/10 text-xs font-medium text-[#0c0a09] dark:text-zinc-200 hover:bg-[#fafafa] transition tracking-[0.15px]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('spendwise_session_active');
                }
                setShowLogoutDialog(false);
                navigateTo('LANDING');
              }}
              className="py-2.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white text-xs font-medium shadow-xs transition tracking-[0.15px]"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }
}
