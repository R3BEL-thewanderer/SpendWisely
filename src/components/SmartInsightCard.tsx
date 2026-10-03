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
      className={`min-w-[260px] max-w-[280px] p-4 rounded-3xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.99] flex flex-col justify-between shadow-sm ${
        isWarning
          ? 'bg-gradient-to-br from-rose-500/10 to-orange-500/5 border-rose-500/20'
          : isSuccess
          ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20'
          : 'bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10'
      }`}
    >
      <div>
        {/* Header: Icon & Action */}
        <div className="flex items-center justify-between mb-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              isWarning
                ? 'bg-rose-500/20 text-rose-500'
                : isSuccess
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-blue-500/20 text-blue-500'
            }`}
          >
            {isWarning ? (
              <AlertTriangle className="w-4 h-4" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>

          {insight.actionText && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
              className="flex items-center text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              {insight.actionText}
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          )}
        </div>

        {/* Title */}
        <h4 className="font-bold text-sm leading-snug line-clamp-1">
          {insight.title}
        </h4>

        {/* Description */}
        <p className="text-xs opacity-75 mt-1 leading-relaxed line-clamp-3">
          {insight.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-black/5 dark:border-white/5">
        <Info className="w-3 h-3 opacity-40" />
        <span className="text-[10px] opacity-50 uppercase tracking-wider font-semibold">
          SpendWise AI Insight
        </span>
      </div>
    </div>
  );
}
