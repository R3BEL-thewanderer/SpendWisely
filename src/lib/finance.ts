import { isDateInPeriod } from './dateUtils';
import { CustomDateRange, DatePeriod, FinanceTotals, TransactionItem } from './types';

/**
 * Rounds monetary value to 2 decimal places to prevent floating-point precision issues.
 */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculates total income from a list of transactions.
 * Formula: Sum of all income transaction amounts.
 */
export function calculateIncome(transactions: TransactionItem[]): number {
  const total = transactions
    .filter((it) => it.type === 'INCOME')
    .reduce((sum, it) => sum + (it.amount || 0), 0);
  return roundMoney(total);
}

/**
 * Calculates total expenses from a list of transactions.
 * Formula: Sum of all expense transaction amounts.
 */
export function calculateExpenses(transactions: TransactionItem[]): number {
  const total = transactions
    .filter((it) => it.type === 'EXPENSE')
    .reduce((sum, it) => sum + (it.amount || 0), 0);
  return roundMoney(total);
}

/**
 * Calculates total balance.
 * Formula: Total Income - Total Expenses.
 */
export function calculateBalance(incomeOrTxs: number | TransactionItem[], expenses?: number): number {
  if (Array.isArray(incomeOrTxs)) {
    const income = calculateIncome(incomeOrTxs);
    const exp = calculateExpenses(incomeOrTxs);
    return roundMoney(income - exp);
  }
  const income = incomeOrTxs;
  const exp = expenses ?? 0;
  return roundMoney(income - exp);
}

/**
 * Calculates Net Cash Flow.
 * Formula: Income - Expenses.
 */
export function calculateNetCashFlow(income: number, expenses: number): number {
  return roundMoney(income - expenses);
}

/**
 * Calculates Savings.
 * Formula: Income - Expenses.
 */
export function calculateSavings(income: number, expenses: number): number {
  return roundMoney(income - expenses);
}

/**
 * Calculates Savings Rate %.
 * Formula: ((Income - Expenses) / Income) * 100
 * Handles Income <= 0 safely without division by zero.
 */
export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  const rate = ((income - expenses) / income) * 100;
  return roundMoney(rate);
}

/**
 * Computes all financial totals into a unified domain result object.
 */
export function calculateTotals(transactions: TransactionItem[]): FinanceTotals {
  const income = calculateIncome(transactions);
  const expenses = calculateExpenses(transactions);
  const balance = calculateBalance(income, expenses);
  const netCashFlow = calculateNetCashFlow(income, expenses);
  const savings = calculateSavings(income, expenses);
  const savingsRate = calculateSavingsRate(income, expenses);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance,
    netCashFlow,
    savings,
    savingsRate,
  };
}

/**
 * Computes period-filtered totals.
 */
export function calculatePeriodTotals(
  transactions: TransactionItem[],
  period: DatePeriod,
  now: Date = new Date(),
  customRange?: CustomDateRange | null
): FinanceTotals {
  const filtered = transactions.filter((tx) =>
    isDateInPeriod(tx.date, period, now, customRange)
  );
  return calculateTotals(filtered);
}
