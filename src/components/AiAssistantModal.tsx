'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

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
    'Where did most of my money go?',
    'How much on food?',
    'Am I spending more than last month?',
    'How is my budget looking?',
    'What is my balance?',
    'What subscriptions do I have?',
    'How long until I reach my laptop goal?',
  ];

  const handleSend = () => {
    if (!input.trim() || isAssistantThinking) return;
    askAssistant(input.trim());
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      {/* Modal Card / Bottom Sheet */}
      <div className="w-full sm:w-[400px] h-[85vh] sm:h-[650px] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#1c1917]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
                Ledger Intelligence
              </h2>
              <p className="text-[10px] text-[#777169] tracking-[0.16px]">Disciplined financial reasoning</p>
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
        <div className="px-4 py-2 border-b border-[#e7e5e4] dark:border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none flex-shrink-0 bg-[#fafafa] dark:bg-[#181615]">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => askAssistant(s)}
              className="py-1 px-3 rounded-full text-[11px] font-medium whitespace-nowrap bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white active:scale-95 transition cursor-pointer tracking-[0.15px]"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages Chat List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
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

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
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
            </div>
          ))}

          {/* Thinking Indicator */}
          {isAssistantThinking && (
            <div className="flex items-center gap-2 text-xs text-[#777169] dark:text-[#a8a29e] pl-9">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing ledger balances...</span>
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
            placeholder="Query spending, allocations, goals..."
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
