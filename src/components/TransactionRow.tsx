'use client';

import React from 'react';
import {
  ArrowUpRight,
  Car,
  Coffee,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  LucideIcon,
  Receipt,
  ShoppingBag,
  Tv,
} from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import { TransactionItem } from '../lib/types';

interface TransactionRowProps {
  transaction: TransactionItem;
  onClick?: () => void;
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  const isIncome = transaction.type === 'INCOME';
  const cat = (transaction.category || '').toLowerCase();
  const title = (transaction.title || '').toLowerCase();

  // Dynamic Icon & Styling based on category / merchant matching reference
  let iconBg = 'bg-[#EFF6FF] text-[#2563EB]';
  let IconComp: LucideIcon = ShoppingBag;

  if (isIncome || cat.includes('salary') || cat.includes('income')) {
    iconBg = 'bg-[#EFF6FF] text-[#2563EB]';
    IconComp = ArrowUpRight;
  } else if (title.includes('starbucks') || cat.includes('food') || cat.includes('drink') || cat.includes('dining')) {
    iconBg = 'bg-[#ECFDF5] text-[#059669]';
    IconComp = Coffee;
  } else if (title.includes('uber') || cat.includes('transport') || cat.includes('cab')) {
    iconBg = 'bg-[#18181B] text-white dark:bg-zinc-700';
    IconComp = Car;
  } else if (cat.includes('shopping') || title.includes('amazon') || title.includes('blinkit')) {
    iconBg = 'bg-[#FFF1F2] text-[#E11D48]';
    IconComp = ShoppingBag;
  } else if (cat.includes('bill') || cat.includes('util') || title.includes('jio')) {
    iconBg = 'bg-[#EFF6FF] text-[#3B82F6]';
    IconComp = Receipt;
  } else if (cat.includes('entertain')) {
    iconBg = 'bg-[#ECFDF5] text-[#10B981]';
    IconComp = Tv;
  } else if (cat.includes('health')) {
    iconBg = 'bg-[#FEF2F2] text-[#EF4444]';
    IconComp = HeartPulse;
  } else if (cat.includes('edu')) {
    iconBg = 'bg-[#F5F3FF] text-[#8B5CF6]';
    IconComp = GraduationCap;
  }

  return (
    <div
      onClick={onClick}
      className="w-full flex items-center justify-between p-3.5 transition-all duration-150 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99] rounded-2xl"
    >
      <div className="flex items-center gap-3">
        {/* Circular Avatar matching Image 1 Screen 2 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} shadow-2xs`}>
          <IconComp className="w-4 h-4 stroke-[2.2]" />
        </div>

        {/* Title and subtitle */}
        <div className="flex flex-col">
          <span className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 leading-tight line-clamp-1">
            {transaction.title}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            {transaction.subtitle || transaction.category}
          </span>
        </div>
      </div>

      {/* Amount and Date */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span
          className={`font-black text-xs sm:text-sm tracking-tight ${
            isIncome ? 'text-[#059669]' : 'text-zinc-900 dark:text-zinc-100'
          }`}
        >
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
          {transaction.date}
        </span>
      </div>
    </div>
  );
}
