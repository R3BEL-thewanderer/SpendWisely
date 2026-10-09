import { calculateCardRecommendations, getBestCardForCategory } from './creditCards';
import { formatCurrency } from './currency';
import {
  AssistantCardPayload,
  BudgetCalculationResult,
  CategorySpendingResult,
  FinanceTotals,
  GoalCalculationResult,
  MonthlyTrendItem,
  PaymentMethodBreakdownItem,
  TransactionItem,
} from './types';

export interface AssistantQueryResult {
  text: string;
  cardPayload?: AssistantCardPayload;
  suggestedActions?: string[];
}

/**
 * Answers natural language financial queries deterministically using the verified domain calculations.
 * Returns clean formatted text + optional rich card payloads for interactive UI widgets.
 */
export function answerFinancialQuery(
  query: string,
  totals: FinanceTotals,
  categoryBreakdown: CategorySpendingResult[],
  budgetResults: BudgetCalculationResult[],
  goalResults: GoalCalculationResult[],
  monthlyTrends: MonthlyTrendItem[],
  transactions: TransactionItem[]
): AssistantQueryResult {
  const q = query.trim().toLowerCase();
  const expenses = transactions.filter((t) => t.type === 'EXPENSE');

  // Helper to compute payment methods breakdown
  const computePaymentBreakdown = (): PaymentMethodBreakdownItem[] => {
    const map = new Map<string, { amount: number; count: number }>();
    const totalExp = totals.totalExpenses || 1;

    expenses.forEach((tx) => {
      const method = tx.paymentMethod?.trim() || 'UPI';
      const cur = map.get(method) || { amount: 0, count: 0 };
      cur.amount += tx.amount;
      cur.count += 1;
      map.set(method, cur);
    });

    const items: PaymentMethodBreakdownItem[] = Array.from(map.entries()).map(([method, data]) => ({
      method,
      amount: data.amount,
      count: data.count,
      percentage: Math.round((data.amount / totalExp) * 100),
    }));

    return items.sort((a, b) => b.amount - a.amount);
  };

  // 0. CONVERSATIONAL GREETINGS & SMALL TALK
  const isGreeting = /^(hello|hi|hey|good\s*(morning|afternoon|evening)|namaste|hola|sup|greetings|howdy)\b/i.test(q);
  const isHowAreYou = /^(how\s*are\s*you|how's\s*it\s*going|how\s*are\s*things|what's\s*up|wassup)\b/i.test(q);
  const isIdentityOrHelp = /^(who\s*are\s*you|what\s*can\s*you\s*do|help|what\s*do\s*you\s*do|introduce\s*yourself|what\s*are\s*your\s*features)\b/i.test(q);

  if (isGreeting || isHowAreYou) {
    return {
      text: `Hello! I'm your SpendWise financial assistant 👋\n\nI analyze your verified transactions to give you clear, instant insights about your money, payment methods, credit card savings, and budgets.\n\nWhat would you like to explore today?`,
      suggestedActions: [
        'How did I pay most expenses?',
        'What was my highest single spend?',
        'Which credit card will save me money?',
        'Where did most of my money go?',
      ],
    };
  }

  if (isIdentityOrHelp) {
    return {
      text: `I'm **SpendWise Intelligence**, your personal financial co-pilot 🧠✨\n\nHere is how I can help you:\n• **Payment Breakdown**: See how much you paid via UPI, Credit Card, or Cash.\n• **Spending Leaderboard**: Spot your biggest single spends and top merchant drains.\n• **Credit Card Advisor**: Recommend cards that maximize cashback for your unique spending.\n• **Budget & Goals**: Monitor your monthly limits and Digital Gulak savings pace.\n\nAsk me anything in plain words, or tap any suggestion below!`,
      suggestedActions: [
        'How did I pay most expenses?',
        'What was my highest single spend?',
        'Which credit card will save me money?',
        'How are my savings goals doing?',
      ],
    };
  }

  // Savings advice & tips
  if (
    q.includes('how to save') ||
    q.includes('save money') ||
    q.includes('tips') ||
    q.includes('advice') ||
    q.includes('cut down') ||
    q.includes('spend less')
  ) {
    const topCat = categoryBreakdown[0];
    const topAmount = topCat?.spentAmount || 0;
    const potentialSaving = Math.round(topAmount * 0.1);

    return {
      text: `Here are 3 tailored insights to optimize your monthly cash flow:\n\n1. **Trim Top Category**: Your highest spend is **${topCat?.categoryName || 'Food & Dining'}** (${formatCurrency(topAmount)}). Reducing this by just 10% saves you **${formatCurrency(potentialSaving)}/month**.\n2. **Eliminate Zombie Spends**: Audit your Subscriptions tab to cancel duplicate streaming or unused memberships.\n3. **Maximize Payment Rewards**: Shift major dining, grocery, and utility spends to an optimal cashback card to earn 2%–5% back automatically.`,
      suggestedActions: [
        'Which credit card will save me money?',
        'Where did most of my money go?',
        'How did I pay most expenses?',
      ],
    };
  }

  // 1. PAYMENT METHOD QUERIES ("How did I pay?", "Where and how paid", "UPI vs Card")
  if (
    q.includes('how paid') ||
    q.includes('how did i pay') ||
    q.includes('payment method') ||
    q.includes('mode of payment') ||
    q.includes('how i paid') ||
    q.includes('how was it paid') ||
    q.includes('where and how') ||
    q.includes('upi') ||
    q.includes('credit card split') ||
    q.includes('cash spend')
  ) {
    const breakdown = computePaymentBreakdown();
    if (breakdown.length === 0) {
      return {
        text: 'You have not recorded any expenses yet to determine your payment methods.',
        suggestedActions: ['Where did most of my money go?', 'What is my balance?'],
      };
    }

    const topMethod = breakdown[0];
    const details = breakdown
      .map((b) => `• ${b.method}: ${formatCurrency(b.amount)} (${b.percentage}% across ${b.count} txns)`)
      .join('\n');

    return {
      text: `You paid most of your expenses using ${topMethod.method} (${formatCurrency(
        topMethod.amount
      )}, accounting for ${topMethod.percentage}% of all spends).\n\nHere is your payment method breakdown:\n${details}`,
      cardPayload: {
        type: 'PAYMENT_BREAKDOWN',
        paymentBreakdown: breakdown,
      },
      suggestedActions: [
        'What was my highest single spend?',
        'Which credit card will save me money?',
        'Where did most of my money go?',
      ],
    };
  }

  // 2. CREDIT CARD RECOMMENDATIONS / AFFILIATE SAVINGS QUERY
  if (
    q.includes('credit card') ||
    q.includes('card recommendation') ||
    q.includes('which card') ||
    q.includes('suggest card') ||
    q.includes('best card') ||
    q.includes('cashback') ||
    q.includes('save money with card') ||
    q.includes('earn rewards')
  ) {
    const cardRecs = calculateCardRecommendations(transactions, categoryBreakdown);
    const topCard = cardRecs[0];

    if (!topCard) {
      return {
        text: 'Record more transactions so we can recommend the highest cashback card for your lifestyle.',
      };
    }

    return {
      text: `Based on your highest spending in ${topCard.category}, we recommend the **${
        topCard.cardName
      }** by ${topCard.issuer}.\n\nBy routing your ${topCard.category} spends through this card, you could save up to **${formatCurrency(
        topCard.potentialMonthlySavings
      )}/month** (~${formatCurrency(topCard.potentialYearlySavings)}/year) in rewards and cashback.`,
      cardPayload: {
        type: 'CARD_RECOMMENDATION',
        cardRecommendation: topCard,
      },
      suggestedActions: [
        'How did I pay most expenses?',
        'What was my highest single spend?',
        'How is my budget looking?',
      ],
    };
  }

  // 3. TOP SPENDS / HIGHEST SINGLE SPEND / "MOST PAID"
  if (
    q.includes('most paid') ||
    q.includes('highest') ||
    q.includes('biggest') ||
    q.includes('largest') ||
    q.includes('top spend') ||
    q.includes('single highest') ||
    q.includes('most expensive')
  ) {
    const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    if (sortedExpenses.length === 0) {
      return {
        text: 'You do not have any recorded expenses yet.',
      };
    }

    const topTx = sortedExpenses[0];
    const top3 = sortedExpenses.slice(0, 3);
    const list = top3
      .map(
        (t, idx) =>
          `${idx + 1}. **${t.title}**: ${formatCurrency(t.amount)} (${t.category}) via ${t.paymentMethod || 'UPI'}`
      )
      .join('\n');

    return {
      text: `Your single most paid transaction was **${topTx.title}** for **${formatCurrency(
        topTx.amount
      )}** in ${topTx.category}, paid via ${topTx.paymentMethod || 'UPI'}.\n\nTop largest transactions:\n${list}`,
      cardPayload: {
        type: 'TOP_SPENDS',
        topTransactions: top3,
      },
      suggestedActions: [
        'Which credit card will save me money?',
        'How did I pay most expenses?',
        'How much on food?',
      ],
    };
  }

  // 4. "WHERE DID MOST OF MY MONEY GO" / TOP CATEGORY (Attaches Card Recommendation to Monetize!)
  if (
    q.includes('most of my money') ||
    q.includes('top category') ||
    q.includes('top spend') ||
    q.includes('where did my money go') ||
    q.includes('where did money go')
  ) {
    const topCat = categoryBreakdown.find((it) => it.spentAmount > 0);
    if (topCat && totals.totalExpenses > 0) {
      const bestCard = getBestCardForCategory(topCat.categoryName, topCat.spentAmount);

      return {
        text: `Based on your recorded transactions, most of your money went to **${
          topCat.categoryName
        }** at **${formatCurrency(topCat.spentAmount)}**, which is ${Math.round(
          topCat.percentageOfTotal
        )}% of your total spending (${formatCurrency(totals.totalExpenses)}).\n\n💡 Pro Tip: Since ${
          topCat.categoryName
        } is your biggest spend, using the **${bestCard?.cardName}** would unlock ~**${formatCurrency(
          bestCard?.potentialMonthlySavings || 0
        )}/month** in direct savings!`,
        cardPayload: bestCard
          ? {
              type: 'CARD_RECOMMENDATION',
              cardRecommendation: bestCard,
            }
          : undefined,
        suggestedActions: [
          'How did I pay most expenses?',
          'What was my highest single spend?',
          'How is my budget looking?',
        ],
      };
    } else {
      return {
        text: "You haven't recorded any expenses yet for this period, so no category dominates your spending.",
      };
    }
  }

  // 5. Specific category query (e.g. food, shopping, transport, bills, health)
  for (const cat of categoryBreakdown) {
    const catName = cat.categoryName.toLowerCase();
    let simplifiedName = catName;
    if (catName.includes('food')) simplifiedName = 'food';
    else if (catName.includes('shop')) simplifiedName = 'shopping';
    else if (catName.includes('transport')) simplifiedName = 'transport';
    else if (catName.includes('bill') || catName.includes('util')) simplifiedName = 'bill';
    else if (catName.includes('entertain')) simplifiedName = 'entertainment';
    else if (catName.includes('health')) simplifiedName = 'health';
    else if (catName.includes('edu')) simplifiedName = 'education';

    if (
      q.includes(simplifiedName) &&
      (q.includes('spent') ||
        q.includes('spend') ||
        q.includes('how much') ||
        q.includes('cost') ||
        q.includes('food') ||
        q.includes('shopping') ||
        q.includes('transport') ||
        q.includes('bill'))
    ) {
      const budget = budgetResults
        .flatMap((b) => b.categoryResults)
        .find((c) => c.categoryName.toLowerCase() === cat.categoryName.toLowerCase());

      let budgetNote = '';
      if (budget) {
        if (budget.status === 'OVER_BUDGET') {
          budgetNote = ` ⚠️ (Over budget by ${formatCurrency(budget.overBudgetAmount)})`;
        } else if (budget.status === 'NEAR_LIMIT') {
          budgetNote = ` ⚠️ (${Math.round(budget.usagePercentage)}% of ${formatCurrency(
            budget.allocatedLimit
          )} limit)`;
        } else {
          budgetNote = ` ✅ (${Math.round(budget.usagePercentage)}% of ${formatCurrency(
            budget.allocatedLimit
          )} limit)`;
        }
      }

      // If category has high spend, suggest matching card
      const matchingCard = getBestCardForCategory(cat.categoryName, cat.spentAmount);

      return {
        text: `You have spent ${formatCurrency(cat.spentAmount)} across ${
          cat.transactionCount
        } transaction(s) in ${cat.categoryName}, accounting for ${Math.round(
          cat.percentageOfTotal
        )}% of total expenses.${budgetNote}`,
        cardPayload: matchingCard && cat.spentAmount > 1500
          ? {
              type: 'CARD_RECOMMENDATION',
              cardRecommendation: matchingCard,
            }
          : undefined,
        suggestedActions: [
          'How did I pay most expenses?',
          'What was my highest single spend?',
          'Where did most of my money go?',
        ],
      };
    }
  }

  // 6. Comparison with last month / Trend
  if (
    q.includes('last month') ||
    q.includes('more than') ||
    q.includes('spending trend') ||
    q.includes('compare') ||
    q.includes('am i spending more')
  ) {
    if (monthlyTrends.length >= 2) {
      const current = monthlyTrends[monthlyTrends.length - 1];
      const prev = monthlyTrends[monthlyTrends.length - 2];
      const diff = current.expenses - prev.expenses;
      if (diff > 0) {
        const pct = prev.expenses > 0 ? Math.round((diff / prev.expenses) * 100) : 0;
        return {
          text: `Yes, you have spent ${formatCurrency(
            current.expenses
          )} this month compared to ${formatCurrency(prev.expenses)} in ${
            prev.monthLabel
          } (+${formatCurrency(diff)}, a ${pct}% increase).`,
        };
      } else if (diff < 0) {
        const pct = prev.expenses > 0 ? Math.round(((-diff) / prev.expenses) * 100) : 0;
        return {
          text: `No, you are actually spending less! You spent ${formatCurrency(
            current.expenses
          )} this month versus ${formatCurrency(prev.expenses)} in ${
            prev.monthLabel
          } (a savings of ${formatCurrency(-diff)}, or ${pct}% reduction).`,
        };
      } else {
        return {
          text: `Your spending this month (${formatCurrency(
            current.expenses
          )}) is identical to ${prev.monthLabel}.`,
        };
      }
    } else {
      return {
        text: `You have spent ${formatCurrency(
          totals.totalExpenses
        )} this month. Additional historical data is needed to compare with previous months.`,
      };
    }
  }

  // 7. Budget status
  if (q.includes('budget') || q.includes('on track') || q.includes('limit')) {
    const b = budgetResults[0];
    if (b) {
      let statusText = '';
      if (b.status === 'OVER_BUDGET') {
        statusText = `⚠️ Over Budget: You have exceeded your limit by ${formatCurrency(
          b.overBudgetAmount
        )}.`;
      } else if (b.status === 'NEAR_LIMIT') {
        statusText = `⚠️ Near Limit: You have used ${Math.round(
          b.usagePercentage
        )}% of your budget (${formatCurrency(b.remainingBudget)} remaining).`;
      } else {
        statusText = `✅ On Track: You have used ${Math.round(
          b.usagePercentage
        )}% of your ${formatCurrency(b.totalLimit)} budget with ${formatCurrency(
          b.remainingBudget
        )} remaining.`;
      }
      return {
        text: `For ${b.name} (${b.month}), you have spent ${formatCurrency(
          b.totalSpent
        )} out of ${formatCurrency(b.totalLimit)}.\n\n${statusText}`,
      };
    } else {
      return {
        text: "You haven't set up an active budget yet. Tap 'Create Budget' in the Budgets tab to track your spending limits!",
      };
    }
  }

  // 8. Balance / Cash / Money status
  if (
    q.includes('balance') ||
    q.includes('how much money') ||
    q.includes('cash flow') ||
    q.includes('savings') ||
    q.includes('what is my balance')
  ) {
    return {
      text: `Your current balance is ${formatCurrency(
        totals.balance
      )} (Total Income: ${formatCurrency(totals.totalIncome)}, Total Expenses: ${formatCurrency(
        totals.totalExpenses
      )}). Your savings rate is ${Math.round(totals.savingsRate)}% with net savings of ${formatCurrency(
        totals.savings
      )}.`,
      suggestedActions: [
        'How did I pay most expenses?',
        'Where did most of my money go?',
        'Which credit card will save me money?',
      ],
    };
  }

  // 9. Savings Goals / Gulak / Goal Forecasting
  if (
    q.includes('goal') ||
    q.includes('gulak') ||
    q.includes('saving for') ||
    q.includes('forecast') ||
    q.includes('how long') ||
    q.includes('laptop')
  ) {
    if (goalResults.length > 0) {
      const lines = goalResults.map((g) => {
        const status = g.isCompleted
          ? '🎉 Complete!'
          : `${Math.round(g.progressPercent)}% (${formatCurrency(g.remainingAmount)} left)`;
        const forecast =
          !g.isCompleted && g.remainingAmount > 0
            ? ` (Est. ~${Math.ceil(g.remainingAmount / 5000)} mo at ₹5k/mo)`
            : '';
        return `• ${g.name}: ${formatCurrency(g.savedAmount)} / ${formatCurrency(
          g.targetAmount
        )} — ${status}${forecast}`;
      });
      return {
        text: `Here is the status of your savings goals:\n\n${lines.join('\n')}`,
      };
    } else {
      return {
        text: "You don't have any savings goals yet. You can create one in the Goals tab to track your Digital Gulak progress!",
      };
    }
  }

  // Default fallback response
  return {
    text: `I'm analyzing your ledger for "${query}". Your current balance is ${formatCurrency(
      totals.balance
    )} with ${formatCurrency(totals.totalExpenses)} in total expenses.\n\nYou can ask me specific questions like your payment breakdown, highest expenses, card recommendations, or savings tips!`,
    suggestedActions: [
      'How did I pay most expenses?',
      'What was my highest single spend?',
      'Which credit card will save me money?',
      'Where did most of my money go?',
    ],
  };
}

/**
 * Enhanced async AI caller:
 * If a Gemini API key is configured, queries Gemini Flash with live financial context.
 * Otherwise, uses the instant local intelligence engine.
 */
export async function generateAiFinancialResponse(
  query: string,
  totals: FinanceTotals,
  categoryBreakdown: CategorySpendingResult[],
  budgetResults: BudgetCalculationResult[],
  goalResults: GoalCalculationResult[],
  monthlyTrends: MonthlyTrendItem[],
  transactions: TransactionItem[]
): Promise<AssistantQueryResult> {
  const localResult = answerFinancialQuery(
    query,
    totals,
    categoryBreakdown,
    budgetResults,
    goalResults,
    monthlyTrends,
    transactions
  );

  // Attempt to call the server-side NVIDIA NIM Llama 3.2 route
  try {
    const topCat = categoryBreakdown[0];
    const topExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map((t) => `${t.title} (₹${t.amount.toLocaleString('en-IN')})`)
      .join(', ');

    const goalsSummary = goalResults
      .slice(0, 2)
      .map((g) => `${g.name} (${Math.round(g.progressPercent)}%)`)
      .join(', ');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        financialContext: {
          balance: totals.balance,
          totalIncome: totals.totalIncome,
          totalExpenses: totals.totalExpenses,
          topCategory: topCat?.categoryName || 'Food & Dining',
          topCategoryAmount: topCat?.spentAmount || 0,
          topSpends: topExpenses,
          goalsSummary,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text && typeof data.text === 'string' && data.text.trim()) {
        return {
          text: data.text.trim(),
          cardPayload: localResult.cardPayload, // Preserve rich card widget if query matches
          suggestedActions: localResult.suggestedActions,
        };
      }
    }
  } catch (err) {
    console.warn('NVIDIA NIM Chat API call failed, using verified domain engine:', err);
  }

  // Graceful fallback to verified domain intelligence engine
  return localResult;
}

