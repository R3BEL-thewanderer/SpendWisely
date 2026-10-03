'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[390px] max-h-[92vh] bg-[#FAF8F5] dark:bg-[#121316] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
        {/* ============================================================== */}
        {/* 1. SIGN IN MODAL (Image 2 Screen 2) */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_SIGN_IN' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[560px]">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-[#FFD8CC]/40 via-[#E7E0FF]/40 to-[#C8E2FF]/40 blur-2xl pointer-events-none" />

            <div>
              {/* Header bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF] p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF]" />
                    </div>
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">SpendWise</span>
                </div>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mt-7">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Welcome <span className="text-[#3B82F6]">back</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Sign in to continue your journey towards smarter spending.
                </p>
              </div>

              {/* Form Inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFinishAuth('Welcome back, Ashish!');
                }}
                className="mt-6 flex flex-col gap-3.5"
              >
                {/* Email input */}
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <Mail className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Email</span>
                    <input
                      type="email"
                      defaultValue="ashish.singh@example.com"
                      placeholder="Enter your email address"
                      className="text-xs font-medium bg-transparent focus:outline-none placeholder:opacity-40"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <Lock className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Password</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      defaultValue="••••••••••••"
                      placeholder="Enter your password"
                      className="text-xs font-medium bg-transparent focus:outline-none placeholder:opacity-40"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="opacity-40 hover:opacity-100"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between text-xs mt-1">
                  <label className="flex items-center gap-2 cursor-pointer opacity-80">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => openModal('AUTH_FORGOT_PASSWORD')}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-4 mt-2 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-1.5"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={() => handleFinishAuth('Signed in with Google')}
                  className="w-full py-3.5 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 font-bold text-xs shadow-xs hover:bg-black/5 transition flex items-center justify-center gap-2"
                >
                  <span className="font-bold text-blue-500">G</span>
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>

            {/* Bottom Switch Link */}
            <div className="text-center text-xs opacity-80 mt-6">
              <span>Don&apos;t have an account? </span>
              <button
                onClick={() => openModal('AUTH_SIGN_UP')}
                className="font-bold text-blue-600 hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. SIGN UP MODAL (Image 2 Screen 1) */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_SIGN_UP' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[580px]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF] p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF]" />
                    </div>
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">SpendWise</span>
                </div>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* Headline */}
              <div className="mt-5">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Create your <span className="text-[#8B5CF6]">account</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Start your journey towards smarter money habits.
                </p>
              </div>

              {/* Inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openModal('AUTH_ONBOARDING');
                }}
                className="mt-5 flex flex-col gap-3"
              >
                {/* Full name */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <User className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Full Name</span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      defaultValue="Ashish Singh"
                      className="text-xs font-medium bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <Mail className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Email</span>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      defaultValue="ashish.singh@example.com"
                      className="text-xs font-medium bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <Lock className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Password</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      defaultValue="Secret123!"
                      className="text-xs font-medium bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="opacity-40"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <Lock className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Confirm Password</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      defaultValue="Secret123!"
                      className="text-xs font-medium bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="opacity-40"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  className="w-full py-4 mt-2 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => openModal('AUTH_ONBOARDING')}
                  className="w-full py-3.5 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 font-bold text-xs shadow-xs hover:bg-black/5 transition flex items-center justify-center gap-2"
                >
                  <span className="font-bold text-blue-500">G</span>
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>

            <div className="text-center text-xs opacity-80 mt-4">
              <span>Already have an account? </span>
              <button
                onClick={() => openModal('AUTH_SIGN_IN')}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. FORGOT PASSWORD MODAL (Image 2 Screen 3) */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_FORGOT_PASSWORD' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Back to sign in */}
              <button
                onClick={() => openModal('AUTH_SIGN_IN')}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF] p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#FF8A73] via-[#7B61FF] to-[#00D2FF]" />
                    </div>
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">SpendWise</span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white mt-3">
                  Forgot your <br />
                  <span className="text-[#FF6584]">password?</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No worries! Enter your email address and we&apos;ll send you a reset link.
                </p>
              </div>

              {/* Email Box */}
              <div className="mt-6 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                <Mail className="w-4 h-4 opacity-40 flex-shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-semibold opacity-50 uppercase">Email</span>
                  <input
                    type="email"
                    defaultValue="ashish.singh@example.com"
                    placeholder="Enter your email address"
                    className="text-xs font-medium bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Reset link sent to your email!');
                  openModal('AUTH_SIGN_IN');
                }}
                className="w-full py-4 mt-4 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-1.5"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Graphic Icon card */}
              <div className="mt-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  A reset link will be sent to your email
                </h4>
                <p className="text-[11px] text-zinc-500 max-w-[200px] mt-0.5">
                  You&apos;ll see a confirmation message here after submission.
                </p>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => openModal('AUTH_SIGN_IN')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. ONBOARDING SETUP (Image 2 Screen 4: Step 1 of 3) */}
        {/* ============================================================== */}
        {activeModal === 'AUTH_ONBOARDING' && (
          <div className="relative p-6 flex flex-col justify-between min-h-[620px]">
            <div>
              {/* Top Progress & Back */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => openModal('AUTH_SIGN_UP')}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold opacity-60">Step 1 of 3</span>
                  <div className="w-28 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="w-1/3 h-full rounded-full bg-blue-500" />
                  </div>
                </div>

                <div className="w-8" />
              </div>

              {/* Title */}
              <div className="mt-5">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Let&apos;s set up <br />
                  your <span className="text-[#3B82F6]">SpendWise</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Tell us a bit about yourself to personalize your experience.
                </p>
              </div>

              {/* Inputs */}
              <div className="mt-5 flex flex-col gap-2.5">
                {/* Your Name */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <User className="w-4 h-4 opacity-40" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Your Name</span>
                    <input
                      type="text"
                      value={setupName}
                      onChange={(e) => setSetupName(e.target.value)}
                      className="text-xs font-semibold bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold opacity-60">₹</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold opacity-50 uppercase">Currency</span>
                      <span className="text-xs font-semibold">{setupCurrency}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </div>

                {/* Monthly Income */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <Wallet className="w-4 h-4 opacity-40" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Monthly Income</span>
                    <input
                      type="number"
                      value={setupIncome}
                      onChange={(e) => setSetupIncome(e.target.value)}
                      className="text-xs font-semibold bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Monthly Spending Budget */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xs">
                  <div className="w-4 h-4 flex items-center justify-center font-bold text-xs opacity-40">📊</div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold opacity-50 uppercase">Monthly Spending Budget</span>
                    <input
                      type="number"
                      value={setupBudget}
                      onChange={(e) => setSetupBudget(e.target.value)}
                      className="text-xs font-semibold bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preferred Categories Chips */}
                <div className="mt-2 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    Preferred Spending Categories
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: 'Food', color: 'bg-blue-50 text-blue-600', icon: '🍽️' },
                      { name: 'Transport', color: 'bg-purple-50 text-purple-600', icon: '🚗' },
                      { name: 'Shopping', color: 'bg-pink-50 text-pink-600', icon: '🛍️' },
                      { name: 'Bills', color: 'bg-amber-50 text-amber-600', icon: '🏠' },
                      { name: 'Entertainment', color: 'bg-emerald-50 text-emerald-600', icon: '🎮' },
                      { name: 'Health', color: 'bg-rose-50 text-rose-600', icon: '❤️' },
                    ].map((item) => {
                      const isSelected = selectedCategories.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleCategory(item.name)}
                          className={`py-2 px-2.5 rounded-2xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                            isSelected
                              ? `${item.color} border border-current shadow-xs`
                              : 'bg-white dark:bg-zinc-800 border border-black/5 opacity-60'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => handleFinishAuth('SpendWise personalized successfully! 🎉')}
              className="w-full py-4 mt-4 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
