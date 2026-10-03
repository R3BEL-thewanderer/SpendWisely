import { formatCurrency } from './currency';
import {
  BudgetCalculationResult,
  CategorySpendingResult,
  FinanceTotals,
  GoalCalculationResult,
  MonthlyTrendItem,
  TransactionItem,
} from './types';

/**
 * Answers natural language financial queries deterministically using the verified domain calculations.
 * Returns clean formatted text without raw markdown asterisks.
 */
export function answerFinancialQuery(
  query: string,
  totals: FinanceTotals,
  categoryBreakdown: CategorySpendingResult[],
  budgetResults: BudgetCalculationResult[],
  goalResults: GoalCalculationResult[],
  monthlyTrends: MonthlyTrendItem[],
  transactions: TransactionItem[]
): string {
  const q = query.trim().toLowerCase();

  // 1. Where did most of my money go / Top category
  if (
    q.includes('most of my money') ||
    q.includes('highest') ||
    q.includes('top spend') ||
    q.includes('where did my money go') ||
    q.includes('where did money go')
  ) {
    const top = categoryBreakdown.find((it) => it.spentAmount > 0);
    if (top && totals.totalExpenses > 0) {
      return `Based on your recorded transactions, most of your money went to ${
        top.categoryName
      } at ${formatCurrency(top.spentAmount)}, which makes up ${Math.round(
        top.percentageOfTotal
      )}% of your total spending (${formatCurrency(totals.totalExpenses)}).`;
    } else {
      return "You haven't recorded any expenses yet for this period, so no category dominates your spending.";
    }
  }

  // 2. Specific category query (e.g. food, shopping, transport, bills, health)
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

      return `You have spent ${formatCurrency(cat.spentAmount)} across ${
        cat.transactionCount
      } transaction(s) in ${cat.categoryName}, accounting for ${Math.round(
        cat.percentageOfTotal
      )}% of total expenses.${budgetNote}`;
    }
  }

  // 3. Comparison with last month / Trend
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
        return `Yes, you have spent ${formatCurrency(
          current.expenses
        )} this month compared to ${formatCurrency(prev.expenses)} in ${
          prev.monthLabel
        } (+${formatCurrency(diff)}, a ${pct}% increase).`;
      } else if (diff < 0) {
        const pct = prev.expenses > 0 ? Math.round(((-diff) / prev.expenses) * 100) : 0;
        return `No, you are actually spending less! You spent ${formatCurrency(
          current.expenses
        )} this month versus ${formatCurrency(prev.expenses)} in ${
          prev.monthLabel
        } (a savings of ${formatCurrency(-diff)}, or ${pct}% reduction).`;
      } else {
        return `Your spending this month (${formatCurrency(
          current.expenses
        )}) is identical to ${prev.monthLabel}.`;
      }
    } else {
      return `You have spent ${formatCurrency(
        totals.totalExpenses
      )} this month. Additional historical data is needed to compare with previous months.`;
    }
  }

  // 4. Budget status
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
      return `For ${b.name} (${b.month}), you have spent ${formatCurrency(
        b.totalSpent
      )} out of ${formatCurrency(b.totalLimit)}.\n\n${statusText}`;
    } else {
      return "You haven't set up an active budget yet. Tap 'Create Budget' in the Budgets tab to track your spending limits!";
    }
  }

  // 5. Balance / Cash / Money status
  if (
    q.includes('balance') ||
    q.includes('how much money') ||
    q.includes('cash flow') ||
    q.includes('savings') ||
    q.includes('what is my balance')
  ) {
    return `Your current balance is ${formatCurrency(
      totals.balance
    )} (Total Income: ${formatCurrency(totals.totalIncome)}, Total Expenses: ${formatCurrency(
      totals.totalExpenses
    )}). Your savings rate is ${Math.round(totals.savingsRate)}% with net savings of ${formatCurrency(
      totals.savings
    )}.`;
  }

  // 6. Savings Goals / Gulak / Goal Forecasting
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
      return `Here is the status of your savings goals:\n\n${lines.join('\n')}`;
    } else {
      return "You don't have any savings goals yet. You can create one in the Goals tab to track your Digital Gulak progress!";
    }
  }

  // 7. Recurring transactions & Subscriptions
  if (
    q.includes('recurring') ||
    q.includes('subscription') ||
    q.includes('bill') ||
    q.includes('netflix') ||
    q.includes('spotify')
  ) {
    const recurringKeywords = [
      'netflix', 'spotify', 'rent', 'gym', 'prime', 'electricity', 'wifi', 'subscription'
    ];
    const matches = transactions.filter((tx) => {
      const titleLower = tx.title.toLowerCase();
      return (
        recurringKeywords.some((k) => titleLower.includes(k)) ||
        transactions.filter((it) => it.title.toLowerCase() === titleLower).length >= 2
      );
    });

    const uniqueMap = new Map<string, TransactionItem>();
    matches.forEach((m) => {
      if (!uniqueMap.has(m.title.toLowerCase())) {
        uniqueMap.set(m.title.toLowerCase(), m);
      }
    });
    const uniqueMatches = Array.from(uniqueMap.values());

    if (uniqueMatches.length > 0) {
      const list = uniqueMatches
        .map((m) => `• ${m.title}: ${formatCurrency(m.amount)} (${m.category})`)
        .join('\n');
      return `Here are your detected recurring payments and subscriptions:\n\n${list}`;
    } else {
      return 'No recurring subscription patterns detected in your recent records.';
    }
  }

  // 8. Unusually high spending / Anomalies
  if (
    q.includes('unusual') ||
    q.includes('anomaly') ||
    q.includes('high spend') ||
    q.includes('spike')
  ) {
    const expenses = transactions.filter((it) => it.type === 'EXPENSE');
    if (expenses.length > 0) {
      const avg = expenses.reduce((s, it) => s + (it.amount || 0), 0) / expenses.length;
      const highSpends = expenses.filter((it) => it.amount > avg * 2.0);
      if (highSpends.length > 0) {
        const list = highSpends
          .map((it) => `• ${it.title}: ${formatCurrency(it.amount)} (${it.category})`)
          .join('\n');
        return `Found ${highSpends.length} expense(s) significantly higher than your average (${formatCurrency(
          avg
        )}):\n\n${list}`;
      } else {
        return `All your recent expenses are within normal spending patterns (average: ${formatCurrency(
          avg
        )}).`;
      }
    }
  }

  // Default fallback response
  return `You have recorded ${formatCurrency(
    totals.totalIncome
  )} in income and ${formatCurrency(
    totals.totalExpenses
  )} in expenses, leaving a current balance of ${formatCurrency(
    totals.balance
  )}. You can ask about specific categories (e.g. "How much on food?"), budget status, or comparisons to last month!`;
}
