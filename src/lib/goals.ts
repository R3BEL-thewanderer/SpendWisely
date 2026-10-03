import { roundMoney } from './finance';
import { GoalCalculationResult, GoalItem } from './types';

/**
 * Determines actual amount saved for a goal.
 * If contributions are present, their sum is prioritized, or falls back to currentSavings.
 */
export function calculateSavedAmount(goal: GoalItem): number {
  if (goal.contributions && goal.contributions.length > 0) {
    const sum = goal.contributions.reduce((acc, c) => acc + (c.amount || 0), 0);
    return roundMoney(sum);
  }
  return roundMoney(goal.currentSavings || 0);
}

/**
 * Calculates Digital Gulak fill ratio clamped between 0.0 and 1.0.
 * Formula: Amount Saved / Target Amount
 */
export function calculateGulakFillRatio(savedAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  const ratio = savedAmount / targetAmount;
  return Math.min(Math.max(ratio, 0), 1);
}

/**
 * Calculates progress percentage.
 * Formula: (Amount Saved / Target Amount) * 100
 */
export function calculateProgressPercent(savedAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  const pct = (savedAmount / targetAmount) * 100;
  return roundMoney(pct);
}

/**
 * Calculates remaining goal amount.
 * Formula: max(0, Target Amount - Amount Saved)
 */
export function calculateRemainingAmount(savedAmount: number, targetAmount: number): number {
  return roundMoney(Math.max(0, targetAmount - savedAmount));
}

/**
 * Checks if goal is completed.
 * Formula: Amount Saved >= Target Amount
 */
export function isGoalCompleted(savedAmount: number, targetAmount: number): boolean {
  if (targetAmount <= 0) return false;
  return savedAmount >= targetAmount;
}

/**
 * Computes complete goal calculation result for a GoalItem.
 */
export function calculateGoal(goal: GoalItem): GoalCalculationResult {
  const saved = calculateSavedAmount(goal);
  const remaining = calculateRemainingAmount(saved, goal.targetAmount);
  const progress = calculateProgressPercent(saved, goal.targetAmount);
  const completed = isGoalCompleted(saved, goal.targetAmount);
  const gulakRatio = calculateGulakFillRatio(saved, goal.targetAmount);

  return {
    goalId: goal.id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    savedAmount: saved,
    remainingAmount: remaining,
    progressPercent: progress,
    isCompleted: completed,
    gulakFillRatio: gulakRatio,
    contributionCount: goal.contributions ? goal.contributions.length : 0,
  };
}

/**
 * Computes results for all goals.
 */
export function calculateAllGoals(goals: GoalItem[]): GoalCalculationResult[] {
  return goals.map((g) => calculateGoal(g));
}

/**
 * Computes overall goal savings progress across all goals.
 */
export function calculateOverallProgress(goals: GoalItem[]): number {
  const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  if (totalTarget <= 0) return 0;
  const totalSaved = goals.reduce((sum, g) => sum + calculateSavedAmount(g), 0);
  return roundMoney((totalSaved / totalTarget) * 100);
}
