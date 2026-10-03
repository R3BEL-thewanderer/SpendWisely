import { calculateBudget } from './budgets';
import { calculateCategoryBreakdown } from './categories';
import { isDateInPeriod, parseDate } from './dateUtils';
import { calculateTotals, roundMoney } from './finance';
import { calculateAllGoals } from './goals';
import {
  AnalyticsSummary,
  BudgetItem,
  CategoryItem,
  CustomDateRange,
  DatePeriod,
  GoalItem,
  MonthlyTrendItem,
  TransactionItem,
} from './types';

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Calculates monthly trends for the last [monthCount] months ending at [now].
 */
export function calculateMonthlyTrends(
  transactions: TransactionItem[],
  now: Date = new Date(),
  monthCount: number = 6
): MonthlyTrendItem[] {
  const result: MonthlyTrendItem[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
    const monthLabel = SHORT_MONTH_NAMES[m];

    const monthTxs = transactions.filter((tx) => {
      const txDate = parseDate(tx.date, now);
      return txDate !== null && txDate.getFullYear() === y && txDate.getMonth() === m;
    });

    const income = roundMoney(
      monthTxs
        .filter((it) => it.type === 'INCOME')
        .reduce((sum, it) => sum + (it.amount || 0), 0)
    );
    const expenses = roundMoney(
      monthTxs
        .filter((it) => it.type === 'EXPENSE')
        .reduce((sum, it) => sum + (it.amount || 0), 0)
    );
    const net = roundMoney(income - expenses);

    result.push({
      monthKey,
      monthLabel,
      income,
      expenses,
      net,
    });
  }

  return result;
}

/**
 * Computes complete analytics summary for the selected period.
 */
export function calculateAnalytics(
  transactions: TransactionItem[],
  categories: CategoryItem[],
  budgets: BudgetItem[],
  goals: GoalItem[],
  period: DatePeriod = 'CURRENT_MONTH',
  now: Date = new Date(),
  customRange?: CustomDateRange | null
): AnalyticsSummary {
  const periodTransactions = transactions.filter((tx) =>
    isDateInPeriod(tx.date, period, now, customRange)
  );

  const totals = calculateTotals(periodTransactions);
  const categoryBreakdown = calculateCategoryBreakdown(categories, periodTransactions);
  const budgetResults = budgets.map((b) => calculateBudget(b, transactions, now));
  const goalResults = calculateAllGoals(goals);
  const monthlyTrends = calculateMonthlyTrends(transactions, now, 6);
  const topCategory = categoryBreakdown.find((c) => c.spentAmount > 0) || null;

  return {
    period,
    totals,
    categoryBreakdown,
    budgetResults,
    goalResults,
    monthlyTrends,
    topCategory,
  };
}
