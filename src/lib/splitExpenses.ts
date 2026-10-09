import { SplitDueItem } from './types';

export const INITIAL_SPLIT_DUES: SplitDueItem[] = [
  {
    id: 'split-1',
    transactionId: 'tx-1',
    expenseTitle: 'Burma Burma Dinner',
    totalAmount: 2400,
    friendName: 'Rahul Sharma',
    friendUpiId: 'rahul.sharma@okaxis',
    friendShare: 800,
    yourShare: 1600,
    status: 'PENDING',
    date: 'Yesterday',
    note: 'Dinner & Khao Suey split',
    splitType: 'EQUAL',
  },
  {
    id: 'split-2',
    transactionId: 'tx-airbnb',
    expenseTitle: 'Goa Villa Airbnb Deposit',
    totalAmount: 12000,
    friendName: 'Priya Patel',
    friendUpiId: 'priyapatel@oksbi',
    friendShare: 3000,
    yourShare: 9000,
    status: 'PENDING',
    date: '04 Oct 2026',
    note: '3 nights stay advance share',
    splitType: 'CUSTOM',
  },
  {
    id: 'split-3',
    transactionId: 'tx-blinkit',
    expenseTitle: 'Blinkit Weekend Snacks',
    totalAmount: 980,
    friendName: 'Amit Verma',
    friendUpiId: 'amitv@paytm',
    friendShare: 490,
    yourShare: 490,
    status: 'SETTLED',
    date: '01 Oct 2026',
    note: 'Party nachos & dips',
    splitType: 'EQUAL',
  },
];

const STORAGE_KEY = 'spendwise_split_dues_v2';

export function loadSplitDues(): SplitDueItem[] {
  if (typeof window === 'undefined') return INITIAL_SPLIT_DUES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSplitDues(INITIAL_SPLIT_DUES);
      return INITIAL_SPLIT_DUES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SPLIT_DUES;
  } catch {
    return INITIAL_SPLIT_DUES;
  }
}

export function saveSplitDues(dues: SplitDueItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dues));
  } catch {
    // ignore
  }
}

export interface SplitSummary {
  totalPendingDues: number;
  pendingCount: number;
  settledCount: number;
  friendDuesMap: { friendName: string; amount: number; count: number }[];
}

export function calculateSplitSummary(dues: SplitDueItem[]): SplitSummary {
  let totalPending = 0;
  let pendingCount = 0;
  let settledCount = 0;

  const friendMap: Record<string, { amount: number; count: number }> = {};

  dues.forEach((due) => {
    if (due.status === 'PENDING') {
      totalPending += due.friendShare;
      pendingCount += 1;

      if (!friendMap[due.friendName]) {
        friendMap[due.friendName] = { amount: 0, count: 0 };
      }
      friendMap[due.friendName].amount += due.friendShare;
      friendMap[due.friendName].count += 1;
    } else {
      settledCount += 1;
    }
  });

  const friendDuesMap = Object.entries(friendMap).map(([friendName, val]) => ({
    friendName,
    amount: Math.round(val.amount),
    count: val.count,
  }));

  friendDuesMap.sort((a, b) => b.amount - a.amount);

  return {
    totalPendingDues: Math.round(totalPending),
    pendingCount,
    settledCount,
    friendDuesMap,
  };
}

/**
 * Builds standard NPCI UPI payment deep link
 */
export function buildUpiDeepLink({
  upiId,
  payeeName,
  amount,
  note,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
  note: string;
}): string {
  const cleanUpi = upiId.trim() || 'spendwise@upi';
  const cleanName = payeeName.trim() || 'SpendWise User';
  const cleanAmount = Number(amount || 0).toFixed(2);
  const cleanNote = (note || 'Split bill payment via SpendWise').slice(0, 50);

  return `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(
    cleanName
  )}&am=${encodeURIComponent(cleanAmount)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
}

/**
 * Creates friendly WhatsApp share message with direct UPI link
 */
export function createWhatsAppShareMessage({
  friendName,
  expenseTitle,
  totalAmount,
  friendShare,
  userUpiId,
  upiLink,
}: {
  friendName: string;
  expenseTitle: string;
  totalAmount: number;
  friendShare: number;
  userUpiId: string;
  upiLink: string;
}): string {
  return (
    `Hey ${friendName}! 👋\n\n` +
    `Here's the split for *"${expenseTitle}"* via SpendWise:\n` +
    `• Total Bill: ₹${totalAmount.toLocaleString('en-IN')}\n` +
    `• Your Share: *₹${friendShare.toLocaleString('en-IN')}*\n\n` +
    `⚡ Pay directly with any UPI app (GPay / PhonePe / Paytm):\n` +
    `${upiLink}\n\n` +
    `Or send directly to UPI ID: \`${userUpiId}\`\n` +
    `— Tracked with SpendWise 📊`
  );
}
