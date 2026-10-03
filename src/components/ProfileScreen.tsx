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

  // 1. APPEARANCE VIEW (Image 3 Screen 4)
  if (subView === 'APPEARANCE') {
    return (
      <div className="flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-4 animate-fade-in bg-zinc-950 text-white min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('SETTINGS')}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10 transition active:scale-95"
            aria-label="Back to Settings"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Appearance</h1>
            <p className="text-xs text-zinc-400">Choose how SpendWise looks on your device.</p>
          </div>
        </div>

        {/* 3 Theme Options */}
        <div className="flex flex-col gap-3 mt-2">
          {/* Light Mode Card */}
          <div
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`p-4 rounded-[26px] border cursor-pointer transition flex items-center justify-between ${
              !isDark
                ? 'bg-white/15 border-blue-500 shadow-md ring-1 ring-blue-500'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Light Mode</h3>
                <p className="text-[11px] text-zinc-400">Clean, bright and minimal for everyday use.</p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                !isDark ? 'border-blue-500 bg-blue-500 text-white' : 'border-zinc-500'
              }`}
            >
              {!isDark && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* Dark Mode Card (Highlighted with neon border matching Image 3 Screen 4) */}
          <div
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`p-4 rounded-[26px] border-2 cursor-pointer transition flex items-center justify-between ${
              isDark
                ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white">Dark Mode</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-[9px] uppercase tracking-wider">
                    Popular
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  A modern dark experience with beautiful gradients.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isDark ? 'border-purple-400 bg-purple-500 text-white' : 'border-zinc-500'
              }`}
            >
              {isDark && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* System Default Card */}
          <div className="p-4 rounded-[26px] bg-white/5 border border-white/10 flex items-center justify-between opacity-70">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">System Default</h3>
                <p className="text-[11px] text-zinc-400">
                  Automatically switch based on your system settings.
                </p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border border-zinc-600" />
          </div>
        </div>

        {/* Theme Preview Card (Image 3 Screen 4) */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-zinc-400">Theme Preview</span>
          <p className="text-[11px] text-zinc-500">See how SpendWise looks in dark mode.</p>

          <div className="p-4 rounded-[28px] bg-zinc-900 border border-white/10 shadow-lg flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="w-6 h-1.5 rounded-full bg-indigo-500" />
              <div className="w-12 h-1.5 rounded-full bg-indigo-500/50" />
              <div className="w-8 h-1.5 rounded-full bg-indigo-500/30" />
            </div>

            <div className="rounded-2xl p-3 bg-white/5 border border-white/10 flex flex-col items-end">
              <span className="text-[9px] text-zinc-400">Total Balance</span>
              <span className="text-sm font-black text-white">₹ 48,250</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-0.5">↑ 8%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. SETTINGS VIEW (Image 3 Screen 2)
  if (subView === 'SETTINGS') {
    return (
      <div className="flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-4 animate-fade-in overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubView('PROFILE')}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95"
              aria-label="Back to Profile"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Customize your experience on SpendWise.</p>
            </div>
          </div>
        </div>

        {/* Section 1: Appearance */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Appearance</span>
          <div className="rounded-[24px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs overflow-hidden">
            <div
              onClick={() => setSubView('APPEARANCE')}
              className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-zinc-900 dark:text-white">Light Mode</span>
              </div>
              {!isDark && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
            </div>

            <div
              onClick={() => setSubView('APPEARANCE')}
              className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-zinc-900 dark:text-white">Dark Mode</span>
              </div>
              {isDark ? (
                <Check className="w-4 h-4 text-purple-400 stroke-[3]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </div>

            <div
              onClick={() => setSubView('APPEARANCE')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-zinc-900 dark:text-white">System Default</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Section 2: Preferences */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Preferences</span>
          <div className="rounded-[24px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs overflow-hidden">
            <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 cursor-pointer">
              <span className="text-xs font-medium text-zinc-900 dark:text-white">Currency</span>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <span>INR ₹</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 cursor-pointer">
              <span className="text-xs font-medium text-zinc-900 dark:text-white">Notifications</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="p-3.5 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-zinc-900 dark:text-white">App Preferences</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Section 3: Security */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Security</span>
          <div className="rounded-[24px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs overflow-hidden">
            <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 cursor-pointer">
              <span className="text-xs font-medium text-zinc-900 dark:text-white">Change Password</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="p-3.5 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-zinc-900 dark:text-white">Security Settings</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>


        {/* Section 5: Data & Reset */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Data</span>
          <div className="rounded-[24px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs overflow-hidden">
            <div
              onClick={() => alert('Data exported to spendwise-backup.json')}
              className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              <span className="text-xs font-medium text-zinc-900 dark:text-white">Export Data</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
            <div
              onClick={() => {
                if (confirm('Reset to default demo data?')) resetData();
              }}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-500"
            >
              <span className="text-xs font-medium">Delete Account / Reset</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Section 5: Account Log Out */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Account</span>
          <div className="rounded-[24px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs overflow-hidden">
            <div
              onClick={() => setShowLogoutDialog(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-500"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-medium">Log Out</span>
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

  // 3. MAIN PROFILE VIEW (Image 3 Screen 1)
  return (
    <div className="flex-1 w-full px-5 pt-3 pb-28 flex flex-col gap-4 animate-fade-in overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Profile</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Your personal information and account details.</p>
        </div>

        <button
          onClick={() => setSubView('SETTINGS')}
          className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95"
          aria-label="Settings"
        >
          <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
        </button>
      </div>

      {/* Profile Photo Avatar with Glowing Orb (Image 3 Screen 1) */}
      <div className="relative flex flex-col items-center justify-center py-2 shrink-0">
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#FFD8CC]/40 via-[#E7E0FF]/30 to-[#9CC9FF]/40 blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD8CC] via-[#C9B8FF] to-[#9CC9FF] p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-zinc-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-inner">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => alert('Upload photo')}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-zinc-900 text-white border-2 border-white dark:border-zinc-900 flex items-center justify-center shadow-xs hover:scale-105 transition"
            aria-label="Change photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <h2 className="text-base font-extrabold text-zinc-900 dark:text-white mt-3">
          {userProfile.name}
        </h2>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{userProfile.email}</p>

        <button
          onClick={() => openModal('AUTH_ONBOARDING')}
          className="mt-2.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs flex items-center gap-1.5 hover:bg-zinc-50 transition"
        >
          <Pencil className="w-3 h-3" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 3 Stat Cards Row: Currency, Monthly Income, Monthly Budget (Image 3 Screen 1) */}
      <div className="grid grid-cols-3 gap-2 shrink-0">
        <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-0.5">₹</span>
          <span className="text-[9.5px] text-zinc-400 font-medium">Currency</span>
          <span className="text-xs font-extrabold text-zinc-900 dark:text-white mt-0.5">
            {userProfile.currency || 'INR ₹'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-0.5">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span className="text-[9.5px] text-zinc-400 font-medium">Monthly Income</span>
          <span className="text-xs font-extrabold text-zinc-900 dark:text-white mt-0.5">
            {formatCurrency(userProfile.monthlyIncome || 45000)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-0.5">
            <PieChart className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span className="text-[9.5px] text-zinc-400 font-medium">Monthly Budget</span>
          <span className="text-xs font-extrabold text-zinc-900 dark:text-white mt-0.5">
            {formatCurrency(userProfile.monthlyBudget || 30000)}
          </span>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">
          Account Information
        </span>
        <div className="rounded-[24px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="text-[10px] text-zinc-400 block">Full Name</span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {userProfile.name}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="text-[10px] text-zinc-400 block">Email Address</span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {userProfile.email}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="text-[10px] text-zinc-400 block">Member Since</span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {userProfile.memberSince || '12 Feb 2025'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] text-zinc-400 block">Account Type</span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {userProfile.accountType || 'Free Plan'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Upgrade to Premium Card (Image 3 Screen 1) */}
      <div className="p-4 rounded-[26px] bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 shadow-xs flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 fill-amber-500/40" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Upgrade to Premium</h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Get advanced analytics, unlimited budgets and more.
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
      </div>

      {/* Settings Navigation Shortcut */}
      <button
        onClick={() => setSubView('SETTINGS')}
        className="w-full py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition shrink-0 flex items-center justify-center gap-2"
      >
        <Sliders className="w-4 h-4" />
        <span>Open Settings</span>
      </button>

      {/* Logout Dialog Overlay */}
      {showLogoutDialog && renderLogoutDialog()}
    </div>
  );

  // Helper to render the exact Logout confirmation bottom dialog (Image 3 Screen 3)
  function renderLogoutDialog() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div
          onClick={() => setShowLogoutDialog(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <div className="relative w-full max-w-[340px] rounded-[32px] bg-white dark:bg-zinc-900 border border-white/60 dark:border-white/10 shadow-2xl p-5 flex flex-col items-center text-center gap-3">
          {/* Close X */}
          <button
            onClick={() => setShowLogoutDialog(false)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Glowing diffuse pink orb with red logout icon */}
          <div className="relative my-2">
            <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center border-2 border-rose-200/60 shadow-xs">
              <LogOut className="w-7 h-7 stroke-[2.2]" />
            </div>
          </div>

          <h3 className="font-bold text-base text-zinc-900 dark:text-white">
            Log out of SpendWise?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 px-2 leading-relaxed">
            You&apos;ll need to sign in again to access your account and view your financial data.
          </p>

          <div className="w-full p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/30 flex items-center gap-2 text-left">
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
              i
            </div>
            <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
              Your data will remain safe and synced with your account.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="py-2.5 rounded-full border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition"
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
              className="py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md hover:bg-rose-600 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }
}
