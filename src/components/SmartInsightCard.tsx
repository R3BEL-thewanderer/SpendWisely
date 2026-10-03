'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { SmartInsight } from '../lib/types';

interface SmartInsightCardProps {
  insight: SmartInsight;
  onAction?: () => void;
  onClick?: () => void;
}

export function SmartInsightCard({ insight, onAction, onClick }: SmartInsightCardProps) {
  const isWarning = insight.severity === 'WARNING';
  const isSuccess = insight.severity === 'SUCCESS';

  return (
    <div
      onClick={onClick}
      className={`min-w-[260px] max-w-[280px] p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between shadow-xs ${
        isWarning
          ? 'bg-white dark:bg-[#181615] border-rose-200 dark:border-rose-900/30'
          : isSuccess
          ? 'bg-white dark:bg-[#181615] border-emerald-200 dark:border-emerald-900/30'
          : 'bg-white dark:bg-[#181615] border-[#e7e5e4] dark:border-white/[0.08]'
      }`}
    >
      <div>
        {/* Header: Icon & Action */}
        <div className="flex items-center justify-between mb-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
              isWarning
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
                : isSuccess
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                : 'bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-white border-transparent dark:border-white/[0.04]'
            }`}
          >
            {isWarning ? (
              <AlertTriangle className="w-3.5 h-3.5 stroke-[1.8]" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 stroke-[1.8]" />
            )}
          </div>

          {insight.actionText && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
              className="inline-flex items-center text-[11px] font-medium text-[#0c0a09] dark:text-white hover:underline gap-0.5 font-sans"
            >
              <span>{insight.actionText}</span>
              <ChevronRight className="w-3 h-3 stroke-[2]" />
            </button>
          )}
        </div>

        {/* Title in Waldenburg / EB Garamond 300 */}
        <h4 className="font-display font-light text-[15px] tracking-tight text-[#0c0a09] dark:text-white leading-snug line-clamp-1">
          {insight.title}
        </h4>

        {/* Description */}
        <p className="text-[11.5px] text-[#777169] dark:text-[#a8a29e] mt-1.5 leading-relaxed line-clamp-3 font-sans">
          {insight.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-3.5 pt-2 border-t border-[#f0efed] dark:border-white/[0.05]">
        <Info className="w-3 h-3 text-[#a8a29e] dark:text-[#777169]" />
        <span className="text-[10px] uppercase tracking-wider font-medium text-[#777169] dark:text-[#a8a29e] font-sans">
          Editorial Observation
        </span>
      </div>
    </div>
  );
}
