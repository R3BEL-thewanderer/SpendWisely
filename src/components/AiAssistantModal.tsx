'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Bot,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Send,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';

export function AiAssistantModal() {
  const {
    activeModal,
    closeModal,
    assistantMessages,
    isAssistantThinking,
    askAssistant,
  } = useSpendWise();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages, isAssistantThinking]);

  if (activeModal !== 'AI_ASSISTANT') return null;

  const suggestions = [
    'How did I pay most expenses?',
    'What was my highest single spend?',
    'Which credit card will save me money?',
    'Where did most of my money go?',
    'How much on food?',
    'Am I spending more than last month?',
    'What is my balance?',
  ];

  const handleSend = () => {
    if (!input.trim() || isAssistantThinking) return;
    askAssistant(input.trim());
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      {/* Modal Card / Bottom Sheet */}
      <div className="w-full sm:w-[440px] h-[88vh] sm:h-[680px] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#1c1917]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white flex items-center gap-1.5">
                <span>Ledger Intelligence</span>
                <span className="text-[9px] font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Llama 3.2 NIM
                </span>
              </h2>
              <p className="text-[10px] text-[#777169] tracking-[0.16px]">
                Powered by NVIDIA NIM • Payment breakdown & financial advisor
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-white/5 flex items-center justify-center transition hover:scale-105 active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="px-3.5 py-2 border-b border-[#e7e5e4] dark:border-white/5 overflow-x-auto flex items-center gap-1.5 scrollbar-none flex-shrink-0 bg-[#fafafa] dark:bg-[#181615]">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => askAssistant(s)}
              className="py-1 px-2.5 rounded-full text-[10.5px] font-medium whitespace-nowrap bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white active:scale-95 transition cursor-pointer tracking-[0.15px]"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages Chat List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 no-scrollbar">
          {assistantMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs border border-[#e7e5e4] dark:border-white/[0.08] ${
                  msg.isUser
                    ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09]'
                    : 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white'
                }`}
              >
                {msg.isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble + Rich Cards */}
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.isUser
                      ? 'bg-[#292524] dark:bg-white text-white dark:text-[#0c0a09] rounded-tr-none tracking-[0.15px]'
                      : 'bg-white dark:bg-[#181615] text-[#0c0a09] dark:text-zinc-100 border border-[#e7e5e4] dark:border-white/[0.08] rounded-tl-none shadow-xs tracking-[0.15px]'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-normal">
                    {msg.text
                      .replace(/\*\*/g, '')
                      .replace(/\*/g, '')
                      .split('\n')
                      .map((line, idx) => (
                        <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                          {line}
                        </p>
                      ))}
                  </div>
                </div>

                {/* RICH CARD 1: Payment Method Breakdown */}
                {msg.cardPayload?.type === 'PAYMENT_BREAKDOWN' &&
                  msg.cardPayload.paymentBreakdown && (
                    <div className="rounded-xl p-3 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/10 shadow-xs flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#0c0a09] dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-[#777169]" />
                          <span>Payment Mode Split</span>
                        </div>
                        <span className="text-[10px] text-[#777169]">Current Ledger</span>
                      </div>

                      {/* Multi-segment progress bar */}
                      <div className="w-full h-2 rounded-full bg-[#f0efed] dark:bg-white/10 overflow-hidden flex">
                        {msg.cardPayload.paymentBreakdown.map((b, i) => {
                          const colors = [
                            'bg-[#292524] dark:bg-white',
                            'bg-[#0284c7]',
                            'bg-[#16a34a]',
                            'bg-[#e11d48]',
                            'bg-[#ca8a04]',
                          ];
                          return (
                            <div
                              key={b.method}
                              style={{ width: `${Math.max(b.percentage, 4)}%` }}
                              className={`${colors[i % colors.length]} h-full transition-all`}
                              title={`${b.method}: ${b.percentage}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Breakdown List */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {msg.cardPayload.paymentBreakdown.map((b) => (
                          <div
                            key={b.method}
                            className="p-2 rounded-lg bg-[#fafafa] dark:bg-white/5 border border-[#e7e5e4]/60 dark:border-white/5 flex flex-col gap-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-[#777169] dark:text-[#a8a29e]">
                                {b.method}
                              </span>
                              <span className="text-[9.5px] font-semibold text-[#0c0a09] dark:text-white">
                                {b.percentage}%
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-[#0c0a09] dark:text-white font-mono">
                              {formatCurrency(b.amount)}
                            </span>
                            <span className="text-[9px] text-[#a8a29e]">
                              {b.count} transaction{b.count > 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* RICH CARD 2: Top Spends Highlight */}
                {msg.cardPayload?.type === 'TOP_SPENDS' &&
                  msg.cardPayload.topTransactions && (
                    <div className="rounded-xl p-3 bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/10 shadow-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#0c0a09] dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                          <span>Highest Recorded Spends</span>
                        </div>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium">
                          Top Outflows
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {msg.cardPayload.topTransactions.map((tx, idx) => (
                          <div
                            key={tx.id}
                            className="p-2 rounded-lg bg-[#fafafa] dark:bg-white/5 border border-[#e7e5e4]/60 dark:border-white/5 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  idx === 0
                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                    : 'bg-[#f0efed] dark:bg-white/10 text-[#777169] dark:text-white'
                                }`}
                              >
                                #{idx + 1}
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-[#0c0a09] dark:text-white leading-tight">
                                  {tx.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-[9.5px] text-[#777169] mt-0.5">
                                  <span>{tx.category}</span>
                                  <span>•</span>
                                  <span>{tx.paymentMethod || 'UPI'}</span>
                                  <span>•</span>
                                  <span>{tx.date}</span>
                                </div>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                              -{formatCurrency(tx.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* RICH CARD 3: Credit Card Recommendation & Affiliate Partner Card */}
                {msg.cardPayload?.type === 'CARD_RECOMMENDATION' &&
                  msg.cardPayload.cardRecommendation && (
                    <div className="rounded-xl overflow-hidden bg-white dark:bg-[#181615] border border-amber-200/80 dark:border-amber-500/20 shadow-sm flex flex-col">
                      {/* Card Header Banner */}
                      <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider block">
                              {msg.cardPayload.cardRecommendation.issuer}
                            </span>
                            <h4 className="text-xs font-bold text-[#0c0a09] dark:text-white">
                              {msg.cardPayload.cardRecommendation.cardName}
                            </h4>
                          </div>
                        </div>

                        {msg.cardPayload.cardRecommendation.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-[9px] font-semibold">
                            {msg.cardPayload.cardRecommendation.badge}
                          </span>
                        )}
                      </div>

                      {/* Savings Projection Callout */}
                      <div className="p-3 flex flex-col gap-2.5">
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                          <div>
                            <span className="text-[9.5px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-medium block">
                              Estimated Rewards Value
                            </span>
                            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                              +{formatCurrency(msg.cardPayload.cardRecommendation.potentialMonthlySavings)}
                              <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">
                                /month
                              </span>
                            </span>
                          </div>
                          <span className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300">
                            ~{formatCurrency(msg.cardPayload.cardRecommendation.potentialYearlySavings)} /yr
                          </span>
                        </div>

                        {/* Perks */}
                        <div className="flex flex-col gap-1">
                          {msg.cardPayload.cardRecommendation.perks.map((p, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[10.5px] text-[#44403c] dark:text-zinc-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[10px] text-[#777169] flex items-center justify-between pt-1 border-t border-[#e7e5e4] dark:border-white/5">
                          <span>Annual Fee: {msg.cardPayload.cardRecommendation.joiningFeeText}</span>
                        </div>

                        {/* Apply CTA with Affiliate Redirect */}
                        <a
                          href={msg.cardPayload.cardRecommendation.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-lg bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-[#0c0a09] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98"
                        >
                          <span>Apply Through SpendWise Partner</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <span className="text-[8.5px] text-center text-[#a8a29e]">
                          Verified Partner Link • Special Welcome Bonus Included
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isAssistantThinking && (
            <div className="flex items-center gap-2 text-xs text-[#777169] dark:text-[#a8a29e] pl-9">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Analyzing ledger balances & reward matrices...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-[#e7e5e4] dark:border-white/5 flex items-center gap-2 flex-shrink-0 bg-white dark:bg-[#181615]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Query spending, payment modes, card rewards..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-[#f0efed] dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] text-xs font-medium text-[#0c0a09] dark:text-white focus:outline-none focus:border-2 focus:border-[#0c0a09] dark:focus:border-white transition placeholder:text-[#a8a29e]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isAssistantThinking}
            className="w-8 h-8 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] flex items-center justify-center disabled:opacity-40 transition active:scale-95 shadow-xs cursor-pointer"
            aria-label="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
