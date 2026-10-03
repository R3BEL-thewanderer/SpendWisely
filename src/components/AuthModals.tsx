'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

export function AuthModals() {
  const { activeModal, openModal, closeModal, navigateTo, showToast } = useSpendWise();

  // State for forms
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Setup form states
  const [setupName, setSetupName] = useState('Ashish Singh');
  const [setupCurrency, setSetupCurrency] = useState('INR ₹');
  const [setupIncome, setSetupIncome] = useState('65000');
  const [setupBudget, setSetupBudget] = useState('35000');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Food',
    'Transport',
    'Shopping',
    'Bills',
  ]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFinishAuth = (msg: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('spendwise_session_active', 'true');
    }
    showToast(msg);
    closeModal();
    navigateTo('HOME');
  };

  if (
    activeModal !== 'AUTH_SIGN_IN' &&
    activeModal !== 'AUTH_SIGN_UP' &&
    activeModal !== 'AUTH_FORGOT_PASSWORD' &&
    activeModal !== 'AUTH_ONBOARDING'
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[400px] max-h-[92vh] bg-[#f5f5f5] dark:bg-[#181615] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* ============================================================== */}
        {/* 1. SIGN IN MODAL */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_SIGN_IN' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[540px]">
            {/* Soft Pastel Atmospheric Bloom */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#f4c5a8]/25 blur-3xl pointer-events-none" />

            <div>
              {/* Header bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] flex items-center justify-center font-display font-light text-xs">
                    S
                  </div>
                  <span className="font-display font-light text-sm tracking-tight text-[#0c0a09] dark:text-white">
                    SpendWise
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mt-6">
                <h2 className="font-display font-light text-3xl tracking-tight text-[#0c0a09] dark:text-white leading-tight">
                  Welcome to your ledger.
                </h2>
                <p className="text-xs text-[#777169] dark:text-[#a8a29e] mt-1 tracking-[0.16px]">
                  Sign in to inspect and reconcile your accounts.
                </p>
              </div>

              {/* Form Inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFinishAuth('Welcome back to SpendWise');
                }}
                className="mt-6 flex flex-col gap-3"
              >
                {/* Email input */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <Mail className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Email Address</span>
                    <input
                      type="email"
                      defaultValue="ashish.singh@example.com"
                      placeholder="name@example.com"
                      className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e]"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <Lock className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Passphrase</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      defaultValue="••••••••••••"
                      placeholder="Enter passkey"
                      className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between text-xs mt-1 text-[#777169] dark:text-[#a8a29e]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-[#292524] dark:accent-white"
                    />
                    <span className="tracking-[0.15px]">Keep signed in</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => openModal('AUTH_FORGOT_PASSWORD')}
                    className="font-medium text-[#0c0a09] dark:text-white hover:underline tracking-[0.15px] cursor-pointer"
                  >
                    Recover passkey
                  </button>
                </div>

                {/* Primary Sign In Button - Near-Black Ink Pill */}
                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:text-[#0c0a09] dark:hover:bg-[#f0efed] text-white font-medium text-xs shadow-xs transition active:scale-[0.99] flex items-center justify-center gap-2 tracking-[0.15px] cursor-pointer"
                >
                  <span>Access Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Secondary Google Sign In */}
                <button
                  type="button"
                  onClick={() => handleFinishAuth('Authenticated with Google')}
                  className="w-full py-3 rounded-full bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] font-medium text-xs text-[#0c0a09] dark:text-white shadow-2xs hover:bg-[#fafafa] dark:hover:bg-white/5 transition flex items-center justify-center gap-2 tracking-[0.15px] cursor-pointer"
                >
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>

            {/* Bottom Switch Link */}
            <div className="text-center text-xs text-[#777169] mt-6 tracking-[0.15px]">
              <span>Need a personal ledger? </span>
              <button
                onClick={() => openModal('AUTH_SIGN_UP')}
                className="font-medium text-[#0c0a09] dark:text-white hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. SIGN UP MODAL */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_SIGN_UP' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[560px]">
            {/* Atmospheric Lavender Bloom */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#c8b8e0]/25 blur-3xl pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0c0a09] dark:bg-white text-white dark:text-[#0c0a09] flex items-center justify-center font-display font-light text-xs">
                    S
                  </div>
                  <span className="font-display font-light text-sm tracking-tight text-[#0c0a09] dark:text-white">
                    SpendWise
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* Headline */}
              <div className="mt-5">
                <h2 className="font-display font-light text-3xl tracking-tight text-[#0c0a09] dark:text-white leading-tight">
                  Open your ledger.
                </h2>
                <p className="text-xs text-[#777169] dark:text-[#a8a29e] mt-1 tracking-[0.16px]">
                  Establish clarity and discipline over your finances.
                </p>
              </div>

              {/* Inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openModal('AUTH_ONBOARDING');
                }}
                className="mt-5 flex flex-col gap-2.5"
              >
                {/* Full name */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <User className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Full Name</span>
                    <input
                      type="text"
                      placeholder="Your full name"
                      defaultValue="Ashish Singh"
                      className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <Mail className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Email Address</span>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      defaultValue="ashish.singh@example.com"
                      className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <Lock className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Passkey</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      defaultValue="Secret123!"
                      className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#a8a29e] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <Lock className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Confirm Passkey</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      defaultValue="Secret123!"
                      className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#a8a29e] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Create Account Button - Inverted Ink Pill */}
                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:text-[#0c0a09] dark:hover:bg-[#f0efed] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 tracking-[0.15px] cursor-pointer"
                >
                  <span>Continue to Ledger Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => openModal('AUTH_ONBOARDING')}
                  className="w-full py-3 rounded-full bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] font-medium text-xs text-[#0c0a09] dark:text-white shadow-2xs hover:bg-[#fafafa] dark:hover:bg-white/5 transition flex items-center justify-center gap-2 tracking-[0.15px] cursor-pointer"
                >
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>

            <div className="text-center text-xs text-[#777169] mt-4 tracking-[0.15px]">
              <span>Already have an account? </span>
              <button
                onClick={() => openModal('AUTH_SIGN_IN')}
                className="font-medium text-[#0c0a09] dark:text-white hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. FORGOT PASSWORD MODAL */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_FORGOT_PASSWORD' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[480px]">
            <div>
              {/* Back to sign in */}
              <button
                onClick={() => openModal('AUTH_SIGN_IN')}
                className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
              </button>

              <div className="mt-5 flex flex-col gap-2">
                <h2 className="font-display font-light text-3xl tracking-tight text-[#0c0a09] dark:text-white">
                  Recover Passkey
                </h2>
                <p className="text-xs text-[#777169] dark:text-[#a8a29e] tracking-[0.16px]">
                  Enter your email address and we&apos;ll send recovery instructions.
                </p>
              </div>

              {/* Email Box */}
              <div className="mt-6 flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                <Mail className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Email Address</span>
                  <input
                    type="email"
                    defaultValue="ashish.singh@example.com"
                    placeholder="Enter your email"
                    className="text-xs font-medium bg-transparent focus:outline-none text-[#0c0a09] dark:text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Recovery instructions dispatched to your email.');
                  openModal('AUTH_SIGN_IN');
                }}
                className="w-full py-3.5 mt-4 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:text-[#0c0a09] dark:hover:bg-[#f0efed] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 tracking-[0.15px] cursor-pointer"
              >
                <span>Send Instructions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => openModal('AUTH_SIGN_IN')}
                className="text-xs font-medium text-[#777169] hover:text-[#0c0a09] dark:text-[#a8a29e] dark:hover:text-white hover:underline flex items-center justify-center gap-1 mx-auto tracking-[0.15px] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. ONBOARDING SETUP */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_ONBOARDING' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[600px]">
            <div>
              {/* Top Progress & Back */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => openModal('AUTH_SIGN_UP')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
                </button>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Step 1 of 2</span>
                  <div className="w-24 h-1 rounded-full bg-[#f0efed] dark:bg-[#24211e] overflow-hidden">
                    <div className="w-1/2 h-full rounded-full bg-[#292524] dark:bg-white" />
                  </div>
                </div>

                <div className="w-8" />
              </div>

              {/* Title */}
              <div className="mt-5">
                <h2 className="font-display font-light text-3xl tracking-tight text-[#0c0a09] dark:text-white leading-tight">
                  Personalize your ledger
                </h2>
                <p className="text-xs text-[#777169] dark:text-[#a8a29e] mt-1 tracking-[0.16px]">
                  Establish currency baseline and planned monthly limits.
                </p>
              </div>

              {/* Inputs */}
              <div className="mt-5 flex flex-col gap-2.5">
                {/* Your Name */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <User className="w-4 h-4 text-[#a8a29e]" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Account Holder</span>
                    <input
                      type="text"
                      value={setupName}
                      onChange={(e) => setSetupName(e.target.value)}
                      className="text-xs font-medium text-[#0c0a09] dark:text-white bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#777169] dark:text-[#a8a29e]">₹</span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Currency</span>
                      <span className="text-xs font-medium text-[#0c0a09] dark:text-white">{setupCurrency}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#a8a29e]" />
                </div>

                {/* Monthly Income */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <Wallet className="w-4 h-4 text-[#a8a29e]" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Monthly Inflow</span>
                    <input
                      type="number"
                      value={setupIncome}
                      onChange={(e) => setSetupIncome(e.target.value)}
                      className="text-xs font-medium text-[#0c0a09] dark:text-white bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Monthly Spending Budget */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-2xs">
                  <span className="text-xs text-[#a8a29e]">📊</span>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">Monthly Planned Budget</span>
                    <input
                      type="number"
                      value={setupBudget}
                      onChange={(e) => setSetupBudget(e.target.value)}
                      className="text-xs font-medium text-[#0c0a09] dark:text-white bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preferred Categories Chips */}
                <div className="mt-2 flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-[#0c0a09] dark:text-white tracking-[0.15px]">
                    Active Tracking Categories
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health'].map((name) => {
                      const isSelected = selectedCategories.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleCategory(name)}
                          className={`py-2 px-2.5 rounded-full text-xs font-medium transition cursor-pointer tracking-[0.15px] ${
                            isSelected
                              ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] shadow-xs'
                              : 'bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e]'
                          }`}
                        >
                          <span>{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button - Inverted Ink Pill */}
            <button
              onClick={() => handleFinishAuth('Ledger configured successfully')}
              className="w-full py-3.5 mt-4 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:text-[#0c0a09] dark:hover:bg-[#f0efed] text-white font-medium text-xs shadow-xs transition active:scale-[0.99] flex items-center justify-center gap-2 tracking-[0.15px] cursor-pointer"
            >
              <span>Initialize Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
