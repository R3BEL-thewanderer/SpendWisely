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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Modal Card / Bottom Sheet */}
      <div className="w-full sm:w-[390px] h-[85vh] sm:h-[650px] bg-[#F8F7F4] dark:bg-[#15171a] sm:rounded-[36px] rounded-t-[32px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9B8FF] to-[#9CC9FF] flex items-center justify-center text-zinc-950 shadow-xs">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">SpendWise AI</h2>
              <p className="text-[11px] opacity-60">Verified financial analysis</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center transition hover:scale-105 active:scale-95"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none flex-shrink-0">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => askAssistant(s)}
              className="py-1 px-3 rounded-full text-[11px] font-medium whitespace-nowrap bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white active:scale-95 transition"
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
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                  msg.isUser
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-gradient-to-tr from-[#9CC9FF] to-[#C9B8FF] text-zinc-950 font-bold'
                }`}
              >
                {msg.isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-black/5 dark:border-white/10 rounded-tl-none shadow-xs'
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
            <div className="flex items-center gap-2 text-xs opacity-60 pl-9">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing verified calculations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-black/5 dark:border-white/5 flex items-center gap-2 flex-shrink-0 bg-white/50 dark:bg-white/5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask about spending, budgets, goals..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition placeholder:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isAssistantThinking}
            className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center disabled:opacity-40 transition active:scale-95 shadow-xs"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
