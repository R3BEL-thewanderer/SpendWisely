import { formatCurrency } from './currency';
import { CategorySpendingResult, CreditCardRecommendation, TransactionItem } from './types';

export interface CreditCardProfile {
  id: string;
  cardName: string;
  issuer: string;
  tagline: string;
  targetCategories: string[];
  rewardRateMap: Record<string, number>; // e.g. { 'Food & Dining': 0.10, 'Shopping': 0.05, 'default': 0.01 }
  joiningFeeText: string;
  annualFee: number;
  badge: string;
  colorHex: string;
  gradient: string;
  applyUrl: string;
  perks: string[];
}

export const CREDIT_CARDS_CATALOG: CreditCardProfile[] = [
  {
    id: 'hdfc-swiggy',
    cardName: 'HDFC Swiggy Card',
    issuer: 'HDFC Bank',
    tagline: '10% Cashback on Swiggy & Dining',
    targetCategories: ['Food & Dining', 'Food', 'Dining', 'Groceries', 'Quick Commerce'],
    rewardRateMap: {
      'Food & Dining': 0.1,
      'Food': 0.1,
      'Shopping': 0.05,
      'default': 0.01,
    },
    joiningFeeText: '₹500 (Waived on ₹2L spend)',
    annualFee: 500,
    badge: 'Best for Foodies',
    colorHex: '#FC8019',
    gradient: 'from-[#FC8019] to-[#E23744]',
    applyUrl: 'https://apply.spendwise.app/cards/hdfc-swiggy?affiliate_id=spendwise_partner&ref=chat',
    perks: [
      '10% direct cashback on Swiggy Food, Instamart & Dineout',
      '5% cashback on Amazon, Flipkart, Uber, Myntra, Nykaa',
      '1% cashback on all other eligible spends',
    ],
  },
  {
    id: 'amazon-pay-icici',
    cardName: 'Amazon Pay ICICI Card',
    issuer: 'ICICI Bank',
    tagline: '5% Unlimited Cashback on Shopping',
    targetCategories: ['Shopping', 'E-commerce', 'Entertainment', 'Electronics'],
    rewardRateMap: {
      'Shopping': 0.05,
      'Bills & Utilities': 0.02,
      'default': 0.01,
    },
    joiningFeeText: 'Lifetime Free (Zero Annual Fee)',
    annualFee: 0,
    badge: 'Lifetime Free',
    colorHex: '#FF9900',
    gradient: 'from-[#232F3E] via-[#FF9900] to-[#146EB4]',
    applyUrl: 'https://apply.spendwise.app/cards/amazon-pay-icici?affiliate_id=spendwise_partner&ref=chat',
    perks: [
      '5% unlimited cashback on Amazon for Prime members',
      '2% cashback on flights, utility bills, recharges',
      '1% flat unlimited cashback on all offline and other spends',
    ],
  },
  {
    id: 'sbi-cashback',
    cardName: 'SBI Cashback Card',
    issuer: 'State Bank of India',
    tagline: '5% Flat Cashback on ANY Online Platform',
    targetCategories: ['Shopping', 'Subscriptions', 'Food & Dining', 'Travel'],
    rewardRateMap: {
      'Shopping': 0.05,
      'Food & Dining': 0.05,
      'Entertainment': 0.05,
      'default': 0.01,
    },
    joiningFeeText: '₹999 (Waived on ₹2L spend)',
    annualFee: 999,
    badge: 'Highest Online Cashback',
    colorHex: '#0083CA',
    gradient: 'from-[#0083CA] to-[#0A2F6D]',
    applyUrl: 'https://apply.spendwise.app/cards/sbi-cashback?affiliate_id=spendwise_partner&ref=chat',
    perks: [
      '5% cashback on almost all online transactions up to ₹5,000/mo',
      '1% cashback on offline transactions',
      'No merchant restrictions like typical co-branded cards',
    ],
  },
  {
    id: 'airtel-axis',
    cardName: 'Airtel Axis Bank Card',
    issuer: 'Axis Bank',
    tagline: '25% on Mobile, Wi-Fi & 10% on Utilities',
    targetCategories: ['Bills & Utilities', 'Bills', 'Utilities', 'Food & Dining'],
    rewardRateMap: {
      'Bills & Utilities': 0.25,
      'Food & Dining': 0.1,
      'Shopping': 0.1,
      'default': 0.01,
    },
    joiningFeeText: '₹500 (500 Amazon voucher bonus)',
    annualFee: 500,
    badge: 'Best for Bills & Utilities',
    colorHex: '#ED1C24',
    gradient: 'from-[#ED1C24] to-[#97144D]',
    applyUrl: 'https://apply.spendwise.app/cards/airtel-axis?affiliate_id=spendwise_partner&ref=chat',
    perks: [
      '25% cashback on Airtel mobile, broadband & DTH recharges',
      '10% cashback on electricity, gas & water bills via Airtel Thanks',
      '10% cashback on Swiggy, Zomato and BigBasket',
    ],
  },
  {
    id: 'axis-atlas',
    cardName: 'Axis Bank Atlas Card',
    issuer: 'Axis Bank',
    tagline: '5x AirMiles & Premium Travel Privileges',
    targetCategories: ['Travel', 'Flights', 'Hotels', 'Transport'],
    rewardRateMap: {
      'Travel': 0.08,
      'Transport': 0.04,
      'default': 0.02,
    },
    joiningFeeText: '₹5,000 (Includes 5,000 EDGE Miles bonus)',
    annualFee: 5000,
    badge: 'Best for Travel & AirMiles',
    colorHex: '#97144D',
    gradient: 'from-[#97144D] via-[#1E1E24] to-[#B8860B]',
    applyUrl: 'https://apply.spendwise.app/cards/axis-atlas?affiliate_id=spendwise_partner&ref=chat',
    perks: [
      '5 EDGE Miles per ₹100 on airlines and hotel bookings',
      '2 EDGE Miles per ₹100 on other spends (1:2 airline transfer)',
      'Complimentary airport lounge access across domestic and intl airports',
    ],
  },
  {
    id: 'bpcl-sbi-octane',
    cardName: 'BPCL SBI Card Octane',
    issuer: 'State Bank of India',
    tagline: '7.25% Valueback on Fuel & Daily Commutes',
    targetCategories: ['Transportation', 'Transport', 'Fuel', 'Groceries'],
    rewardRateMap: {
      'Transportation': 0.0725,
      'Transport': 0.0725,
      'Groceries': 0.025,
      'default': 0.01,
    },
    joiningFeeText: '₹1,499 (Includes 6,000 Reward Points)',
    annualFee: 1499,
    badge: 'Best for Fuel & Commute',
    colorHex: '#FFC20E',
    gradient: 'from-[#0083CA] via-[#004C97] to-[#FFC20E]',
    applyUrl: 'https://apply.spendwise.app/cards/bpcl-sbi-octane?affiliate_id=spendwise_partner&ref=chat',
    perks: [
      '7.25% equivalent valueback (25 reward points per ₹100) at BPCL petrol pumps',
      '1% fuel surcharge waiver up to ₹4,000',
      '10x reward points on Groceries, Dining & Movies',
    ],
  },
];

/**
 * Calculates tailored credit card recommendations based on actual spending distribution.
 */
export function calculateCardRecommendations(
  transactions: TransactionItem[],
  categoryBreakdown: CategorySpendingResult[]
): CreditCardRecommendation[] {
  // Aggregate expenses by category for current period
  const expenses = transactions.filter((t) => t.type === 'EXPENSE');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  if (totalExpense === 0 || expenses.length === 0) {
    // Return top general-purpose cards with estimated baseline
    return CREDIT_CARDS_CATALOG.slice(0, 3).map((card) => ({
      id: card.id,
      cardName: card.cardName,
      issuer: card.issuer,
      category: card.targetCategories[0],
      rewardText: card.tagline,
      potentialMonthlySavings: 500,
      potentialYearlySavings: 6000,
      joiningFeeText: card.joiningFeeText,
      applyUrl: card.applyUrl,
      badge: card.badge,
      colorHex: card.colorHex,
      perks: card.perks,
    }));
  }

  // Calculate projected savings for each card based on category breakdown
  const ranked = CREDIT_CARDS_CATALOG.map((card) => {
    let monthlyCashback = 0;

    for (const cat of categoryBreakdown) {
      const catName = cat.categoryName;
      // Match category
      let rate = card.rewardRateMap['default'] || 0.01;

      for (const [key, cardRate] of Object.entries(card.rewardRateMap)) {
        if (key !== 'default' && catName.toLowerCase().includes(key.toLowerCase())) {
          rate = cardRate;
          break;
        }
      }

      monthlyCashback += cat.spentAmount * rate;
    }

    const roundedMonthly = Math.round(monthlyCashback);
    const roundedYearly = roundedMonthly * 12;

    return {
      id: card.id,
      cardName: card.cardName,
      issuer: card.issuer,
      category: card.targetCategories[0],
      rewardText: card.tagline,
      potentialMonthlySavings: roundedMonthly,
      potentialYearlySavings: roundedYearly,
      joiningFeeText: card.joiningFeeText,
      applyUrl: card.applyUrl,
      badge: card.badge,
      colorHex: card.colorHex,
      perks: card.perks,
    };
  });

  // Sort by highest potential monthly savings
  ranked.sort((a, b) => b.potentialMonthlySavings - a.potentialMonthlySavings);

  return ranked;
}

/**
 * Returns a single best credit card match for a given category name.
 */
export function getBestCardForCategory(
  categoryName: string,
  monthlySpend: number
): CreditCardRecommendation | null {
  const cName = categoryName.toLowerCase();

  let matchedProfile: CreditCardProfile | undefined;

  if (cName.includes('food') || cName.includes('dining') || cName.includes('restaurant')) {
    matchedProfile = CREDIT_CARDS_CATALOG.find((c) => c.id === 'hdfc-swiggy');
  } else if (cName.includes('shop') || cName.includes('clothing') || cName.includes('electronics')) {
    matchedProfile = CREDIT_CARDS_CATALOG.find((c) => c.id === 'amazon-pay-icici');
  } else if (cName.includes('bill') || cName.includes('util') || cName.includes('recharge')) {
    matchedProfile = CREDIT_CARDS_CATALOG.find((c) => c.id === 'airtel-axis');
  } else if (cName.includes('travel') || cName.includes('flight') || cName.includes('hotel')) {
    matchedProfile = CREDIT_CARDS_CATALOG.find((c) => c.id === 'axis-atlas');
  } else if (cName.includes('transport') || cName.includes('fuel') || cName.includes('cab')) {
    matchedProfile = CREDIT_CARDS_CATALOG.find((c) => c.id === 'bpcl-sbi-octane');
  } else {
    matchedProfile = CREDIT_CARDS_CATALOG.find((c) => c.id === 'sbi-cashback');
  }

  if (!matchedProfile) matchedProfile = CREDIT_CARDS_CATALOG[0];

  // Calculate approximate savings
  const rate =
    matchedProfile.rewardRateMap[categoryName] ||
    matchedProfile.rewardRateMap['Food & Dining'] ||
    0.05;

  const monthlySavings = Math.round(monthlySpend * rate);

  return {
    id: matchedProfile.id,
    cardName: matchedProfile.cardName,
    issuer: matchedProfile.issuer,
    category: categoryName,
    rewardText: matchedProfile.tagline,
    potentialMonthlySavings: Math.max(monthlySavings, 250),
    potentialYearlySavings: Math.max(monthlySavings * 12, 3000),
    joiningFeeText: matchedProfile.joiningFeeText,
    applyUrl: matchedProfile.applyUrl,
    badge: matchedProfile.badge,
    colorHex: matchedProfile.colorHex,
    perks: matchedProfile.perks,
  };
}
