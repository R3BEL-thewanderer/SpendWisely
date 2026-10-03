'use client';

import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  Coffee,
  GraduationCap,
  HeartPulse,
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

  let IconComp: LucideIcon = ShoppingBag;

  if (isIncome || cat.includes('salary') || cat.includes('income')) {
    IconComp = ArrowDownLeft;
  } else if (title.includes('starbucks') || cat.includes('food') || cat.includes('drink') || cat.includes('dining')) {
    IconComp = Coffee;
  } else if (title.includes('uber') || cat.includes('transport') || cat.includes('cab')) {
    IconComp = Car;
  } else if (cat.includes('shopping') || title.includes('amazon') || title.includes('blinkit')) {
    IconComp = ShoppingBag;
  } else if (cat.includes('bill') || cat.includes('util') || title.includes('jio')) {
    IconComp = Receipt;
  } else if (cat.includes('entertain')) {
    IconComp = Tv;
  } else if (cat.includes('health')) {
    IconComp = HeartPulse;
  } else if (cat.includes('edu')) {
    IconComp = GraduationCap;
  }

  return (
    <div
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 px-3.5 transition-all duration-150 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.03] active:scale-[0.99] border-b border-[#f0efed] dark:border-white/[0.06] last:border-b-0"
    >
      <div className="flex items-center gap-3">
        {/* Editorial Voice-plate Circle: 32px diameter, surface-strong plate */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#f0efed] dark:bg-[#24211e] text-[#0c0a09] dark:text-[#ffffff] border border-transparent dark:border-white/[0.04]">
          <IconComp className="w-4 h-4 stroke-[1.8]" />
        </div>

        {/* Title and subtitle */}
        <div className="flex flex-col">
          <span className="font-medium text-xs sm:text-[13px] text-[#0c0a09] dark:text-[#ffffff] leading-tight line-clamp-1 font-sans">
            {transaction.title}
          </span>
          <span className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5 font-sans">
            {transaction.subtitle || transaction.category}
          </span>
        </div>
      </div>

      {/* Amount and Date */}
      <div className="flex flex-col items-end flex-shrink-0 font-sans">
        <span
          className={`font-medium text-xs sm:text-sm tracking-tight ${
            isIncome
              ? 'text-[#16a34a] dark:text-[#4ade80]'
              : 'text-[#0c0a09] dark:text-[#ffffff]'
          }`}
        >
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </span>
        <span className="text-[10.5px] text-[#a8a29e] dark:text-[#777169] mt-0.5">
          {transaction.date}
        </span>
      </div>
    </div>
  );
}
