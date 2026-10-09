import { SubscriptionItem, TransactionItem } from './types';

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub-netflix',
    name: 'Netflix Premium (4K HDR)',
    amount: 649,
    billingCycle: 'MONTHLY',
    category: 'Entertainment',
    nextRenewalDate: '15 Oct 2026',
    daysUntilRenewal: 3,
    serviceIcon: '🎬',
    colorHex: '#e50914',
    cancelUrl: 'https://www.netflix.com/youraccount',
    isActive: true,
    paymentMethod: 'Credit Card',
  },
  {
    id: 'sub-spotify',
    name: 'Spotify Premium Individual',
    amount: 149,
    billingCycle: 'MONTHLY',
    category: 'Music & Audio',
    nextRenewalDate: '21 Oct 2026',
    daysUntilRenewal: 9,
    serviceIcon: '🎵',
    colorHex: '#1db954',
    cancelUrl: 'https://www.spotify.com/account/overview/',
    isZombie: true,
    priceHikeAlert: {
      previousAmount: 119,
      difference: 30,
      percentHike: 25,
    },
    isActive: true,
    paymentMethod: 'UPI',
  },
  {
    id: 'sub-youtube',
    name: 'YouTube Premium Family',
    amount: 149,
    billingCycle: 'MONTHLY',
    category: 'Entertainment',
    nextRenewalDate: '26 Oct 2026',
    daysUntilRenewal: 14,
    serviceIcon: '▶️',
    colorHex: '#ff0000',
    cancelUrl: 'https://www.youtube.com/paid_memberships',
    isZombie: true, // Overlap with Spotify
    isActive: true,
    paymentMethod: 'UPI',
  },
  {
    id: 'sub-cultfit',
    name: 'Cult.fit Elite Gym Membership',
    amount: 1800,
    billingCycle: 'MONTHLY',
    category: 'Health & Fitness',
    nextRenewalDate: '18 Oct 2026',
    daysUntilRenewal: 6,
    serviceIcon: '🏋️',
    colorHex: '#ff3278',
    cancelUrl: 'https://www.cult.fit/me/memberships',
    isZombie: true, // Inactive flag: no gym visit logged in 45 days
    isActive: true,
    paymentMethod: 'Debit Card',
  },
  {
    id: 'sub-chatgpt',
    name: 'ChatGPT Plus (GPT-4o / Canvas)',
    amount: 1999,
    billingCycle: 'MONTHLY',
    category: 'Productivity & AI',
    nextRenewalDate: '23 Oct 2026',
    daysUntilRenewal: 11,
    serviceIcon: '🤖',
    colorHex: '#10a37f',
    cancelUrl: 'https://chatgpt.com/#settings/subscription',
    isActive: true,
    paymentMethod: 'Credit Card',
  },
  {
    id: 'sub-amazon',
    name: 'Amazon Prime Yearly',
    amount: 1499,
    billingCycle: 'YEARLY',
    category: 'Shopping & Delivery',
    nextRenewalDate: '10 Dec 2026',
    daysUntilRenewal: 59,
    serviceIcon: '📦',
    colorHex: '#00a8e1',
    cancelUrl: 'https://www.amazon.in/mc/manage',
    isActive: true,
    paymentMethod: 'Credit Card',
  },
  {
    id: 'sub-icloud',
    name: 'Apple iCloud+ 50GB',
    amount: 75,
    billingCycle: 'MONTHLY',
    category: 'Cloud Storage',
    nextRenewalDate: '28 Oct 2026',
    daysUntilRenewal: 16,
    serviceIcon: '☁️',
    colorHex: '#5fc9f8',
    cancelUrl: 'https://support.apple.com/HT207594',
    isActive: true,
    paymentMethod: 'UPI',
  },
];

const STORAGE_KEY = 'spendwise_subscriptions_v2';

export function loadSubscriptions(): SubscriptionItem[] {
  if (typeof window === 'undefined') return INITIAL_SUBSCRIPTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSubscriptions(INITIAL_SUBSCRIPTIONS);
      return INITIAL_SUBSCRIPTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SUBSCRIPTIONS;
  } catch {
    return INITIAL_SUBSCRIPTIONS;
  }
}

export function saveSubscriptions(items: SubscriptionItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export interface SubscriptionMetrics {
  totalMonthlyCommitment: number;
  totalAnnualCommitment: number;
  activeCount: number;
  zombieCount: number;
  potentialZombieSavings: number;
  upcomingIn7Days: SubscriptionItem[];
  categoryBreakdown: { category: string; monthlyAmount: number; count: number }[];
}

export function calculateSubscriptionMetrics(items: SubscriptionItem[]): SubscriptionMetrics {
  let totalMonthly = 0;
  let totalAnnual = 0;
  let activeCount = 0;
  let zombieCount = 0;
  let potentialZombieSavings = 0;

  const upcomingIn7Days: SubscriptionItem[] = [];
  const categoryMap: Record<string, { monthlyAmount: number; count: number }> = {};

  items.forEach((item) => {
    if (!item.isActive) return;

    activeCount += 1;

    // Monthly equivalent
    let monthlyAmount = item.amount;
    if (item.billingCycle === 'YEARLY') {
      monthlyAmount = Math.round(item.amount / 12);
      totalAnnual += item.amount;
    } else if (item.billingCycle === 'QUARTERLY') {
      monthlyAmount = Math.round(item.amount / 3);
      totalAnnual += item.amount * 4;
    } else {
      totalAnnual += item.amount * 12;
    }

    totalMonthly += monthlyAmount;

    if (item.isZombie) {
      zombieCount += 1;
      potentialZombieSavings += monthlyAmount;
    }

    if (item.daysUntilRenewal <= 7) {
      upcomingIn7Days.push(item);
    }

    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { monthlyAmount: 0, count: 0 };
    }
    categoryMap[item.category].monthlyAmount += monthlyAmount;
    categoryMap[item.category].count += 1;
  });

  upcomingIn7Days.sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

  const categoryBreakdown = Object.entries(categoryMap).map(([category, val]) => ({
    category,
    monthlyAmount: val.monthlyAmount,
    count: val.count,
  }));

  categoryBreakdown.sort((a, b) => b.monthlyAmount - a.monthlyAmount);

  return {
    totalMonthlyCommitment: Math.round(totalMonthly),
    totalAnnualCommitment: Math.round(totalAnnual),
    activeCount,
    zombieCount,
    potentialZombieSavings: Math.round(potentialZombieSavings),
    upcomingIn7Days,
    categoryBreakdown,
  };
}

/**
 * Scan regular transactions to find possible unrecognized recurring subscriptions.
 */
export function scanTransactionsForSubscriptions(transactions: TransactionItem[]): {
  detectedTitle: string;
  monthlyEstimate: number;
  occurrences: number;
}[] {
  const recurringKeywords = ['netflix', 'spotify', 'hotstar', 'prime', 'youtube', 'gym', 'apple', 'google', 'cloud', 'membership'];
  const titleMap: Record<string, { amounts: number[]; count: number }> = {};

  transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .forEach((tx) => {
      const lower = tx.title.toLowerCase();
      const isKnown = recurringKeywords.some((kw) => lower.includes(kw));
      if (isKnown) {
        const key = tx.title.trim();
        if (!titleMap[key]) {
          titleMap[key] = { amounts: [], count: 0 };
        }
        titleMap[key].amounts.push(tx.amount);
        titleMap[key].count += 1;
      }
    });

  return Object.entries(titleMap)
    .filter(([, data]) => data.count >= 1)
    .map(([detectedTitle, data]) => ({
      detectedTitle,
      monthlyEstimate: Math.round(data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length),
      occurrences: data.count,
    }));
}
