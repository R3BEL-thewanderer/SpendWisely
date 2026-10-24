'use client';

import React from 'react';

export type BrandLogoType =
  | 'spotify'
  | 'netflix'
  | 'youtube'
  | 'cultfit'
  | 'chatgpt'
  | 'apple'
  | 'googleone'
  | 'prime'
  | 'hotstar'
  | 'starbucks'
  | 'dmart'
  | 'pvr'
  | 'shell'
  | 'axis'
  | 'hdfc'
  | 'sbi'
  | 'icici'
  | 'subscriptions'
  | 'split'
  | 'voice'
  | 'statement'
  | 'categories'
  | 'goals'
  | 'sun'
  | 'moon'
  | 'card'
  | 'ai';

interface BrandLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export function BrandLogo({ name, size = 18, className = '' }: BrandLogoProps) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  let key: BrandLogoType = 'card';

  if (normalized.includes('spotif')) key = 'spotify';
  else if (normalized.includes('netfl')) key = 'netflix';
  else if (normalized.includes('youtub')) key = 'youtube';
  else if (normalized.includes('cult') || normalized.includes('gym')) key = 'cultfit';
  else if (normalized.includes('chatgpt') || normalized.includes('openai')) key = 'chatgpt';
  else if (normalized.includes('apple')) key = 'apple';
  else if (normalized.includes('google') || normalized.includes('cloud')) key = 'googleone';
  else if (normalized.includes('prime') || normalized.includes('amazon')) key = 'prime';
  else if (normalized.includes('hotstar') || normalized.includes('disney')) key = 'hotstar';
  else if (normalized.includes('starbuck') || normalized.includes('coffee')) key = 'starbucks';
  else if (normalized.includes('dmart') || normalized.includes('grocer')) key = 'dmart';
  else if (normalized.includes('pvr') || normalized.includes('movie')) key = 'pvr';
  else if (normalized.includes('shell') || normalized.includes('petrol')) key = 'shell';
  else if (normalized.includes('axis')) key = 'axis';
  else if (normalized.includes('hdfc')) key = 'hdfc';
  else if (normalized.includes('sbi')) key = 'sbi';
  else if (normalized.includes('icici')) key = 'icici';
  else if (normalized.includes('subscript') || normalized.includes('recur')) key = 'subscriptions';
  else if (normalized.includes('split') || normalized.includes('due')) key = 'split';
  else if (normalized.includes('voice') || normalized.includes('mic')) key = 'voice';
  else if (normalized.includes('statement') || normalized.includes('sheet')) key = 'statement';
  else if (normalized.includes('categor')) key = 'categories';
  else if (normalized.includes('goal')) key = 'goals';
  else if (normalized.includes('sun') || normalized.includes('day')) key = 'sun';
  else if (normalized.includes('moon') || normalized.includes('night')) key = 'moon';
  else if (normalized.includes('ai') || normalized.includes('intell') || normalized.includes('spark')) key = 'ai';

  const renderVectors = () => {
    switch (key) {
      case 'spotify':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14.5c2.5-1 5.5-1 8 0" />
              <path d="M7 11.5c3.2-1.3 6.8-1.3 10 0" />
              <path d="M6.5 8.5c3.7-1.5 7.3-1.5 11 0" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14.5c2.5-1 5.5-1 8 0" />
              <path d="M7 11.5c3.2-1.3 6.8-1.3 10 0" />
              <path d="M6.5 8.5c3.7-1.5 7.3-1.5 11 0" />
            </svg>
          ),
        };

      case 'netflix':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M7 3v18" />
              <path d="M17 3v18" />
              <path d="M7 3l10 18" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M7 3v18" />
              <path d="M17 3v18" />
              <path d="M7 3l10 18" />
            </svg>
          ),
        };

      case 'youtube':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="2" y="5" width="20" height="14" rx="4" />
              <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="2" y="5" width="20" height="14" rx="4" />
              <polygon points="10 9 15 12 10 15 10 9" />
            </svg>
          ),
        };

      case 'cultfit':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M6 18h12" />
              <path d="M6 6h12" />
              <path d="M12 2v20" />
              <rect x="3" y="10" width="3" height="4" rx="1" />
              <rect x="18" y="10" width="3" height="4" rx="1" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M6 18h12" />
              <path d="M6 6h12" />
              <path d="M12 2v20" />
              <rect x="3" y="10" width="3" height="4" rx="1" />
              <rect x="18" y="10" width="3" height="4" rx="1" />
            </svg>
          ),
        };

      case 'chatgpt':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2a5 5 0 0 1 5 5v1" />
              <path d="M21 9a5 5 0 0 1-2.5 4.3" />
              <path d="M18 19a5 5 0 0 1-5 2" />
              <path d="M12 22a5 5 0 0 1-5-5v-1" />
              <path d="M3 15a5 5 0 0 1 2.5-4.3" />
              <path d="M6 5a5 5 0 0 1 5-2" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2a5 5 0 0 1 5 5v1" />
              <path d="M21 9a5 5 0 0 1-2.5 4.3" />
              <path d="M18 19a5 5 0 0 1-5 2" />
              <path d="M12 22a5 5 0 0 1-5-5v-1" />
              <path d="M3 15a5 5 0 0 1 2.5-4.3" />
              <path d="M6 5a5 5 0 0 1 5-2" />
            </svg>
          ),
        };

      case 'apple':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2c.5 1.5 0 3-1 4-1 1-2.5 1-3 .5-.5-1.5 0-3 1-4 1-1 2.5-1 3-.5z" />
              <path d="M18.5 15.5c-.5 1-1.5 2.5-2.5 2.5s-1.5-1-3-1-2 1-3 1-2-1.5-2.5-2.5c-1.5-3-.5-7 2-7s2 1 3 1 2-1 3-1c1 0 2.5.5 3 2-2 1-2.5 3.5-1.5 5.5z" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2c.5 1.5 0 3-1 4-1 1-2.5 1-3 .5-.5-1.5 0-3 1-4 1-1 2.5-1 3-.5z" />
              <path d="M18.5 15.5c-.5 1-1.5 2.5-2.5 2.5s-1.5-1-3-1-2 1-3 1-2-1.5-2.5-2.5c-1.5-3-.5-7 2-7s2 1 3 1 2-1 3-1c1 0 2.5.5 3 2-2 1-2.5 3.5-1.5 5.5z" />
            </svg>
          ),
        };

      case 'googleone':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          ),
        };

      case 'prime':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M7 14c2.5 2 7.5 2 10 0" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M7 14c2.5 2 7.5 2 10 0" />
            </svg>
          ),
        };

      case 'hotstar':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        };

      case 'starbucks':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          ),
        };

      case 'dmart':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          ),
        };

      case 'pvr':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="2" y="3" width="20" height="18" rx="2" />
              <line x1="7" y1="3" x2="7" y2="21" />
              <line x1="17" y1="3" x2="17" y2="21" />
              <line x1="2" y1="9" x2="22" y2="9" />
              <line x1="2" y1="15" x2="22" y2="15" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="2" y="3" width="20" height="18" rx="2" />
              <line x1="7" y1="3" x2="7" y2="21" />
              <line x1="17" y1="3" x2="17" y2="21" />
              <line x1="2" y1="9" x2="22" y2="9" />
              <line x1="2" y1="15" x2="22" y2="15" />
            </svg>
          ),
        };

      case 'shell':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m8 17 4 4 4-4" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m8 17 4 4 4-4" />
            </svg>
          ),
        };

      case 'subscriptions':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          ),
        };

      case 'split':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        };

      case 'voice':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          ),
        };

      case 'statement':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          ),
        };

      case 'categories':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
          ),
        };

      case 'goals':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          ),
        };

      case 'sun':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ),
        };

      case 'moon':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ),
        };

      case 'ai':
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
            </svg>
          ),
        };

      case 'axis':
      case 'hdfc':
      case 'sbi':
      case 'icici':
      case 'card':
      default:
        return {
          static: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          ),
          flow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          ),
        };
    }
  };

  const { static: staticEl, flow: flowEl } = renderVectors();

  return (
    <span
      className={`logo-flow-container inline-flex shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={name}
      aria-label={name}
    >
      <span className="logo-static w-full h-full flex items-center justify-center">
        {staticEl}
      </span>
      <span className="logo-flow w-full h-full flex items-center justify-center">
        {flowEl}
      </span>
    </span>
  );
}
