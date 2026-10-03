import { calculateExpenses, roundMoney } from './finance';
import { CategoryItem, CategorySpendingResult, TransactionItem } from './types';

/**
 * Robust category name matching that handles slight variations (e.g. Food & Dining vs Food & Drinks).
 */
export function matchesCategoryName(cat1: string, cat2: string): boolean {
  if (!cat1 || !cat2) return false;
  const c1 = cat1.toLowerCase().trim();
  const c2 = cat2.toLowerCase().trim();
  if (c1 === c2) return true;
  if (
    (c1.includes('food') || c1.includes('dining') || c1.includes('drink')) &&
    (c2.includes('food') || c2.includes('dining') || c2.includes('drink'))
  ) {
    return true;
  }
  if (
    (c1.includes('bill') || c1.includes('util')) &&
    (c2.includes('bill') || c2.includes('util'))
  ) {
    return true;
  }
  if (c1.includes('shop') && c2.includes('shop')) {
    return true;
  }
  return false;
}

/**
 * Calculates total spending for a specific category.
 * Formula: Sum of expenses belonging to that category.
 */
export function calculateCategorySpending(
  categoryName: string,
  transactions: TransactionItem[]
): number {
  const total = transactions
    .filter(
      (it) =>
        it.type === 'EXPENSE' &&
        matchesCategoryName(it.category, categoryName)
    )
    .reduce((sum, it) => sum + (it.amount || 0), 0);
  return roundMoney(total);
}

/**
 * Calculates category expense percentage of total expenses.
 * Formula: (Category Spending / Total Expenses) * 100
 * Handles Total Expenses == 0 safely.
 */
export function calculateCategoryExpensePercentage(
  categorySpent: number,
  totalExpenses: number
): number {
  if (totalExpenses <= 0 || categorySpent <= 0) return 0;
  const percent = (categorySpent / totalExpenses) * 100;
  return roundMoney(percent);
}

/**
 * Generates a complete category spending breakdown for all categories based on transactions.
 */
export function calculateCategoryBreakdown(
  categories: CategoryItem[],
  transactions: TransactionItem[]
): CategorySpendingResult[] {
  const totalExpenses = calculateExpenses(transactions);

  return categories
    .map((cat) => {
      const catTransactions = transactions.filter(
        (it) =>
          it.type === 'EXPENSE' &&
          matchesCategoryName(it.category, cat.name)
      );
      const spent = roundMoney(
        catTransactions.reduce((sum, it) => sum + (it.amount || 0), 0)
      );
      const pct = calculateCategoryExpensePercentage(spent, totalExpenses);

      return {
        categoryName: cat.name,
        spentAmount: spent,
        percentageOfTotal: pct,
        transactionCount: catTransactions.length,
      };
    })
    .sort((a, b) => b.spentAmount - a.spentAmount);
}
