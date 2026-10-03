import { matchesCategoryName } from './categories';
import { isDateInBudgetMonth } from './dateUtils';
import { roundMoney } from './finance';
import {
  BudgetCalculationResult,
  BudgetItem,
  BudgetStatus,
  CategoryAllocation,
  CategoryBudgetResult,
  TransactionItem,
} from './types';

/**
 * Calculates spending for a category allocation within a budget's month.
 */
export function calculateCategoryBudget(
  allocation: CategoryAllocation,
  transactions: TransactionItem[],
  budgetMonth: string,
  alertThresholdPercent: number = 90,
  now: Date = new Date()
): CategoryBudgetResult {
  const matchingExpenses = transactions.filter(
    (tx) =>
      tx.type === 'EXPENSE' &&
      matchesCategoryName(tx.category, allocation.categoryName) &&
      isDateInBudgetMonth(tx.date, budgetMonth, now)
  );

  const spent = roundMoney(
    matchingExpenses.reduce((sum, it) => sum + (it.amount || 0), 0)
  );
  const limit = allocation.amount;
  const remaining = roundMoney(limit - spent);
  const usagePct = limit > 0 ? roundMoney((spent / limit) * 100) : 0;
  const remainingPct = roundMoney(100 - usagePct);
  const overBudget = spent > limit ? roundMoney(spent - limit) : 0;

  let status: BudgetStatus = 'UNDER_BUDGET';
  if (spent > limit) {
    status = 'OVER_BUDGET';
  } else if (usagePct >= alertThresholdPercent) {
    status = 'NEAR_LIMIT';
  }

  return {
    categoryName: allocation.categoryName,
    allocatedLimit: limit,
    spent,
    remaining,
    usagePercentage: usagePct,
    remainingPercentage: remainingPct,
    overBudgetAmount: overBudget,
    status,
  };
}

/**
 * Calculates complete budget metrics from actual transactions.
 */
export function calculateBudget(
  budget: BudgetItem,
  transactions: TransactionItem[],
  now: Date = new Date()
): BudgetCalculationResult {
  const periodExpenses = transactions.filter(
    (tx) =>
      tx.type === 'EXPENSE' && isDateInBudgetMonth(tx.date, budget.month, now)
  );

  const categoryResults = budget.allocations.map((alloc) =>
    calculateCategoryBudget(
      alloc,
      transactions,
      budget.month,
      budget.alertThresholdPercent ?? 90,
      now
    )
  );

  const totalSpentFromTxs = periodExpenses.reduce(
    (sum, it) => sum + (it.amount || 0),
    0
  );
  const totalSpent = roundMoney(totalSpentFromTxs);
  const limit = budget.totalLimit;
  const remaining = roundMoney(limit - totalSpent);
  const usagePct = limit > 0 ? roundMoney((totalSpent / limit) * 100) : 0;
  const remainingPct = roundMoney(100 - usagePct);
  const overBudget = totalSpent > limit ? roundMoney(totalSpent - limit) : 0;

  const threshold = budget.alertThresholdPercent ?? 90;
  let status: BudgetStatus = 'UNDER_BUDGET';
  if (totalSpent > limit) {
    status = 'OVER_BUDGET';
  } else if (usagePct >= threshold) {
    status = 'NEAR_LIMIT';
  }

  return {
    budgetId: budget.id,
    name: budget.name,
    month: budget.month,
    totalLimit: limit,
    totalSpent,
    remainingBudget: remaining,
    usagePercentage: usagePct,
    remainingPercentage: remainingPct,
    overBudgetAmount: overBudget,
    status,
    categoryResults,
  };
}
