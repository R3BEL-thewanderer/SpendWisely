import { ParsedVoiceExpense } from './types';

// Word-to-number dictionary for spoken numbers
const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  lakh: 100000,
};

function parseSpokenWordsToNumber(text: string): number | null {
  const words = text.toLowerCase().split(/[\s-]+/);
  let total = 0;
  let current = 0;
  let foundAny = false;

  for (const w of words) {
    if (w in NUMBER_WORDS) {
      foundAny = true;
      const val = NUMBER_WORDS[w];
      if (val === 100) {
        current = (current || 1) * 100;
      } else if (val === 1000 || val === 100000) {
        current = (current || 1) * val;
        total += current;
        current = 0;
      } else {
        current += val;
      }
    }
  }

  total += current;
  return foundAny && total > 0 ? total : null;
}

export function parseVoiceExpense(rawTranscript: string): ParsedVoiceExpense {
  const text = rawTranscript.trim();
  const lower = text.toLowerCase();

  let confidence = 0.5;

  // 1. EXTRACT AMOUNT
  let amount = 0;

  // Match suffixes like "1.5k", "2k", "10k"
  const kMatch = lower.match(/\b(\d+(?:\.\d+)?)\s*k\b/);
  if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1000;
    confidence += 0.2;
  }

  // Match currency prefix/suffix: "450 rupees", "rs 450", "₹450", "450 inr", "450 bucks"
  if (!amount) {
    const currencyMatch = lower.match(/(?:(?:rs\.?|inr|₹)\s*(\d+(?:\.\d{1,2})?)|(\d+(?:\.\d{1,2})?)\s*(?:rupees|rs|bucks|inr))/);
    if (currencyMatch) {
      amount = parseFloat(currencyMatch[1] || currencyMatch[2]);
      confidence += 0.25;
    }
  }

  // Match any isolated number token
  if (!amount) {
    const numMatches = lower.match(/\b(\d+(?:\.\d{1,2})?)\b/g);
    if (numMatches && numMatches.length > 0) {
      // Pick the most realistic amount
      const candidate = parseFloat(numMatches[0]);
      if (candidate > 0 && candidate < 5000000) {
        amount = candidate;
        confidence += 0.15;
      }
    }
  }

  // Fallback to spoken number words
  if (!amount) {
    const spokenNum = parseSpokenWordsToNumber(lower);
    if (spokenNum && spokenNum > 0) {
      amount = spokenNum;
      confidence += 0.15;
    }
  }

  // Default fallback if still 0
  if (!amount) {
    amount = 250;
  }

  // 2. EXTRACT PAYMENT METHOD
  let paymentMethod = 'UPI';
  if (/\b(?:debit\s*card|debitcard|atm\s*card)\b/.test(lower)) {
    paymentMethod = 'Debit Card';
    confidence += 0.1;
  } else if (/\b(?:credit\s*card|creditcard|hdfc\s*card|icici\s*card|sbi\s*card|amex|card)\b/.test(lower)) {
    paymentMethod = 'Credit Card';
    confidence += 0.1;
  } else if (/\b(?:cash|nagad|in\s*cash|hard\s*cash)\b/.test(lower)) {
    paymentMethod = 'Cash';
    confidence += 0.1;
  } else if (/\b(?:net\s*banking|netbanking|bank\s*transfer|neft|imps)\b/.test(lower)) {
    paymentMethod = 'Net Banking';
    confidence += 0.1;
  } else if (/\b(?:upi|gpay|google\s*pay|phonepe|paytm|bhim|cred)\b/.test(lower)) {
    paymentMethod = 'UPI';
    confidence += 0.1;
  }

  // 3. EXTRACT CATEGORY & ENHANCED TITLE
  let category = 'Food & Dining';
  let defaultTitle = 'Quick Voice Expense';

  if (/\b(?:swiggy|zomato|dinner|lunch|breakfast|food|coffee|tea|starbucks|pizza|burger|biryani|restaurant|cafe|bar|drinks|snack|mcdonalds|kfc|subway|chai)\b/.test(lower)) {
    category = 'Food & Dining';
    defaultTitle = 'Food & Dining';
    confidence += 0.15;
  } else if (/\b(?:blinkit|zepto|instamart|grocery|groceries|vegetables|fruits|bigbasket|supermarket|milk|bread|curd|veggies)\b/.test(lower)) {
    category = 'Groceries';
    defaultTitle = 'Blinkit Groceries';
    confidence += 0.15;
  } else if (/\b(?:uber|ola|cab|taxi|petrol|diesel|fuel|shell|metro|auto|flight|indigo|train|irctc|toll|parking|bus|ride)\b/.test(lower)) {
    category = 'Travel & Commute';
    defaultTitle = 'Travel / Ride';
    confidence += 0.15;
  } else if (/\b(?:amazon|flipkart|myntra|clothes|shoes|zara|h&m|shopping|mall|electronic|laptop|headphones|tshirt|dress)\b/.test(lower)) {
    category = 'Shopping';
    defaultTitle = 'Shopping Order';
    confidence += 0.15;
  } else if (/\b(?:electricity|wifi|broadband|internet|mobile|recharge|airtel|jio|water|gas|cylinder|rent|maintenance|bill)\b/.test(lower)) {
    category = 'Bills & Utilities';
    defaultTitle = 'Utility Bill';
    confidence += 0.15;
  } else if (/\b(?:movie|pvr|cinema|inox|netflix|hotstar|spotify|prime|concert|show|game|steam|playstation)\b/.test(lower)) {
    category = 'Entertainment';
    defaultTitle = 'Entertainment';
    confidence += 0.15;
  } else if (/\b(?:gym|cult|cult\.fit|medicine|pharmacy|apollo|doctor|hospital|clinic|medicines|supplements|workout)\b/.test(lower)) {
    category = 'Health & Fitness';
    defaultTitle = 'Health & Fitness';
    confidence += 0.15;
  } else if (/\b(?:zerodha|groww|sip|mutual\s*fund|stock|stocks|shares|crypto|investment|nps)\b/.test(lower)) {
    category = 'Investments';
    defaultTitle = 'Investment SIP';
    confidence += 0.15;
  }

  // 4. EXTRACT SMART TITLE (Identify core merchant/subject)
  let title = defaultTitle;
  const merchantKeywords = [
    { key: 'swiggy', label: 'Swiggy Order' },
    { key: 'zomato', label: 'Zomato Meal' },
    { key: 'blinkit', label: 'Blinkit Groceries' },
    { key: 'zepto', label: 'Zepto Quick Delivery' },
    { key: 'starbucks', label: 'Starbucks Coffee' },
    { key: 'uber', label: 'Uber Ride' },
    { key: 'ola', label: 'Ola Cab' },
    { key: 'petrol', label: 'Fuel / Petrol' },
    { key: 'diesel', label: 'Fuel / Diesel' },
    { key: 'shell', label: 'Shell Fuel Station' },
    { key: 'amazon', label: 'Amazon Purchase' },
    { key: 'flipkart', label: 'Flipkart Order' },
    { key: 'myntra', label: 'Myntra Fashion' },
    { key: 'zara', label: 'Zara Clothing' },
    { key: 'netflix', label: 'Netflix Subscription' },
    { key: 'spotify', label: 'Spotify Premium' },
    { key: 'pvr', label: 'PVR Cinemas' },
    { key: 'inox', label: 'INOX Movie' },
    { key: 'cult', label: 'Cult.fit Fitness' },
    { key: 'apollo', label: 'Apollo Pharmacy' },
    { key: 'airtel', label: 'Airtel Bill Recharge' },
    { key: 'jio', label: 'Jio Mobile Recharge' },
    { key: 'wifi', label: 'WiFi Broadband' },
    { key: 'electricity', label: 'Electricity Bill' },
    { key: 'coffee', label: 'Coffee & Snacks' },
    { key: 'dinner', label: 'Dinner Out' },
    { key: 'lunch', label: 'Lunch Meal' },
    { key: 'groceries', label: 'Grocery Restock' },
  ];

  for (const mk of merchantKeywords) {
    if (lower.includes(mk.key)) {
      title = mk.label;
      break;
    }
  }

  // If title is still default, try cleaning the phrase
  if (title === defaultTitle && text.length > 0) {
    const cleaned = text
      .replace(/\b(?:spent|paid|bought|for|on|using|through|via|in|rupees|rs|bucks|inr|with|my|at|the|a|an)\b/gi, '')
      .replace(/\b\d+(\.\d+)?\b/g, '')
      .replace(/[₹$,]/g, '')
      .trim()
      .replace(/\s+/g, ' ');

    if (cleaned.length >= 3 && cleaned.length <= 35) {
      // Capitalize first letters
      title = cleaned
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }

  confidence = Math.min(0.98, Math.max(0.6, confidence));

  return {
    amount,
    title,
    category,
    paymentMethod,
    confidence,
    rawTranscript: text,
  };
}
