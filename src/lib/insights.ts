import { formatCurrency } from './currency';
import { roundMoney } from './finance';
import {
  BudgetCalculationResult,
  CategorySpendingResult,
  FinanceTotals,
  GoalCalculationResult,
  MonthlyAiSummary,
  MonthlyTrendItem,
  SmartInsight,
  TransactionItem,
} from './types';

/**
 * Generates ranked actionable, data-driven smart insights based on domain calculations.
 */
export function generateInsights(
  totals: FinanceTotals,
  categoryBreakdown: CategorySpendingResult[],
  budgetResults: BudgetCalculationResult[],
  goalResults: GoalCalculationResult[],
  monthlyTrends: MonthlyTrendItem[],
  transactions: TransactionItem[]
): SmartInsight[] {
  const insights: SmartInsight[] = [];

  // 1. Budget Alerts & Utilization (Highest Priority)
  const overBudget = budgetResults.find((it) => it.status === 'OVER_BUDGET');
  const nearLimit = budgetResults.find((it) => it.status === 'NEAR_LIMIT');

  if (overBudget) {
    insights.push({
      id: 'insight-budget-over',
      title: 'Budget Exceeded',
      description: `Your ${overBudget.name} has exceeded its limit by ${formatCurrency(
        overBudget.overBudgetAmount
      )} (${Math.round(overBudget.usagePercentage)}% used).`,
      type: 'BUDGET',
      severity: 'WARNING',
      iconType: 'warning',
      actionText: 'Review Budget',
    });
  } else if (nearLimit) {
    insights.push({
      id: 'insight-budget-near',
      title: 'Budget Warning',
      description: `Your ${nearLimit.name} is approaching its limit at ${Math.round(
        nearLimit.usagePercentage
      )}% capacity (${formatCurrency(nearLimit.remainingBudget)} remaining).`,
      type: 'BUDGET',
      severity: 'WARNING',
      iconType: 'alert',
      actionText: 'Track Spending',
    });
  }

  // 2. Category-Level Budget Allocation Alerts
  for (const b of budgetResults) {
    const catNear = b.categoryResults.find(
      (it) => it.status === 'NEAR_LIMIT' || it.status === 'OVER_BUDGET'
    );
    if (catNear) {
      const isOver = catNear.status === 'OVER_BUDGET';
      insights.push({
        id: `insight-cat-${catNear.categoryName.toLowerCase()}`,
        title: isOver
          ? `${catNear.categoryName} Over Budget`
          : `${catNear.categoryName} Budget Alert`,
        description: isOver
          ? `You have exceeded your ${catNear.categoryName} allocation by ${formatCurrency(
              catNear.overBudgetAmount
            )}.`
          : `Your ${catNear.categoryName} budget is at ${Math.round(
              catNear.usagePercentage
            )}% capacity based on your recent spending.`,
        type: 'BUDGET',
        severity: isOver ? 'WARNING' : 'INFO',
        iconType: 'category',
        actionText: 'View Category',
      });
      break;
    }
  }

  // 3. Top Spending Insight
  const topCategory = categoryBreakdown.find((it) => it.spentAmount > 0);
  if (topCategory && totals.totalExpenses > 0) {
    insights.push({
      id: 'insight-spending-top',
      title: 'Top Spending Category',
      description: `${topCategory.categoryName} was your largest expense this period at ${formatCurrency(
        topCategory.spentAmount
      )}, representing ${Math.round(topCategory.percentageOfTotal)}% of your total recorded spend.`,
      type: 'SPENDING',
      severity: 'INFO',
      iconType: 'pie',
      actionText: 'See Breakdown',
    });
  }

  // 4. Goal Progress & Milestones
  const completedGoal = goalResults.find((it) => it.isCompleted);
  const inProgressGoal = goalResults.find((it) => !it.isCompleted && it.savedAmount > 0);

  if (completedGoal) {
    insights.push({
      id: 'insight-goal-complete',
      title: 'Goal Achieved! 🎉',
      description: `You've successfully reached your target of ${formatCurrency(
        completedGoal.targetAmount
      )} for '${completedGoal.name}'!`,
      type: 'GOAL',
      severity: 'SUCCESS',
      iconType: 'trophy',
      actionText: 'Celebrate',
    });
  }
  if (inProgressGoal) {
    insights.push({
      id: 'insight-goal-progress',
      title: `${inProgressGoal.name} Savings`,
      description: `You have ${formatCurrency(
        inProgressGoal.remainingAmount
      )} remaining on your '${inProgressGoal.name}' goal (${Math.round(
        inProgressGoal.progressPercent
      )}% saved).`,
      type: 'GOAL',
      severity: 'INFO',
      iconType: 'savings',
      actionText: 'Add Money',
    });
  }

  // 5. Savings Rate & Cash Flow Insight
  if (totals.totalIncome > 0) {
    if (totals.savingsRate >= 20.0) {
      insights.push({
        id: 'insight-savings-rate',
        title: 'Strong Savings Rate',
        description: `You are saving ${Math.round(
          totals.savingsRate
        )}% of your income (${formatCurrency(
          totals.savings
        )}), outperforming the standard 20% financial wellness benchmark.`,
        type: 'SUMMARY',
        severity: 'SUCCESS',
        iconType: 'trending-up',
        actionText: 'View Net Flow',
      });
    } else if (totals.savingsRate < 0.0) {
      insights.push({
        id: 'insight-negative-cashflow',
        title: 'Negative Cash Flow',
        description: `Your expenses exceed your income this period by ${formatCurrency(
          -totals.savings
        )}. Consider pacing discretionary purchases.`,
        type: 'SUMMARY',
        severity: 'WARNING',
        iconType: 'trending-down',
        actionText: 'Manage Expenses',
      });
    }
  }

  // 6. Trend Comparison (Current vs Previous Month)
  if (monthlyTrends.length >= 2) {
    const current = monthlyTrends[monthlyTrends.length - 1];
    const previous = monthlyTrends[monthlyTrends.length - 2];
    if (previous.expenses > 0) {
      const diff = current.expenses - previous.expenses;
      const pctChange = roundMoney((diff / previous.expenses) * 100);
      if (pctChange < -5.0) {
        insights.push({
          id: 'insight-trend-lower',
          title: 'Spending Down vs Last Month',
          description: `Your spending this month is ${Math.round(
            -pctChange
          )}% lower than ${previous.monthLabel} (saved ${formatCurrency(
            -diff
          )} more). Great job!`,
          type: 'SPENDING',
          severity: 'SUCCESS',
          iconType: 'sparkles',
        });
      } else if (pctChange > 15.0) {
        insights.push({
          id: 'insight-trend-higher',
          title: 'Higher Spending Pace',
          description: `Your spending is ${Math.round(
            pctChange
          )}% higher than ${previous.monthLabel} (+${formatCurrency(
            diff
          )}). Check category breakdown for drivers.`,
          type: 'SPENDING',
          severity: 'INFO',
          iconType: 'trending-up',
        });
      }
    }
  }

  // 7. Spending Anomaly Detection (> 2.5x avg)
  const expensesList = transactions.filter((it) => it.type === 'EXPENSE');
  if (expensesList.length > 0) {
    const totalExp = expensesList.reduce((sum, e) => sum + (e.amount || 0), 0);
    const avgExpense = totalExp / expensesList.length;
    const anomaly = expensesList.find(
      (it) => it.amount > avgExpense * 2.5 && it.amount >= 2000.0
    );
    if (anomaly) {
      insights.push({
        id: `insight-anomaly-${anomaly.id}`,
        title: 'Unusual Expense Flagged',
        description: `${anomaly.title} (${formatCurrency(
          anomaly.amount
        )}) in ${anomaly.category} is unusually high compared to your typical expense average of ${formatCurrency(
          avgExpense
        )}.`,
        type: 'ANOMALY',
        severity: 'WARNING',
        iconType: 'alert',
        actionText: 'Review',
      });
    }
  }

  // 8. Recurring Transaction Detection
  const recurringTitles = [
    'netflix', 'spotify', 'rent', 'gym', 'prime', 'electricity',
    'wifi', 'internet', 'subscription'
  ];
  const recurringTx = expensesList.find((tx) => {
    const t = tx.title.toLowerCase();
    return (
      recurringTitles.some((k) => t.includes(k)) ||
      expensesList.filter((e) => e.title.toLowerCase() === t).length >= 2
    );
  });
  if (recurringTx) {
    insights.push({
      id: `insight-recurring-${recurringTx.title.toLowerCase().slice(0, 8)}`,
      title: 'Recurring Payment Detected',
      description: `Identified recurring pattern for '${recurringTx.title}' (${formatCurrency(
        recurringTx.amount
      )}). Tracked under ${recurringTx.category}.`,
      type: 'SPENDING',
      severity: 'INFO',
      iconType: 'repeat',
      actionText: 'Manage',
    });
  }

  // 9. Goal Forecasting
  const forecastGoal = goalResults.find((it) => !it.isCompleted && it.savedAmount > 0);
  if (forecastGoal && forecastGoal.remainingAmount > 0) {
    const estimatedMonthly = 5000;
    const monthsLeft = Math.ceil(forecastGoal.remainingAmount / estimatedMonthly);
    if (monthsLeft > 0) {
      insights.push({
        id: `insight-forecast-${forecastGoal.goalId}`,
        title: `Goal Forecast: ${forecastGoal.name}`,
        description: `At a contribution pace of ₹5,000/month, you will reach your ${formatCurrency(
          forecastGoal.targetAmount
        )} goal in ~${monthsLeft} month(s).`,
        type: 'GOAL',
        severity: 'INFO',
        iconType: 'trending-up',
        actionText: 'Save More',
      });
    }
  }

  // Fallback default insight if none triggered
  if (insights.length === 0) {
    insights.push({
      id: 'insight-default',
      title: 'Financial Health',
      description:
        'Your finances are balanced. Keep tracking expenses and setting savings goals to build wealth.',
      type: 'SUMMARY',
      severity: 'INFO',
      iconType: 'sparkles',
    });
  }

  return insights;
}

/**
 * Generates structured monthly financial summary with smart commentary.
 */
export function generateMonthlySummary(
  monthLabel: string,
  totals: FinanceTotals,
  topCategory: CategorySpendingResult | null,
  budgetResults: BudgetCalculationResult[]
): MonthlyAiSummary {
  const totalBudget = budgetResults.reduce((sum, it) => sum + it.totalLimit, 0);
  const totalUsed = budgetResults.reduce((sum, it) => sum + it.totalSpent, 0);
  const budgetUsagePct = totalBudget > 0 ? roundMoney((totalUsed / totalBudget) * 100) : 0;

  let explanation = `In ${monthLabel}, you earned ${formatCurrency(
    totals.totalIncome
  )} and spent ${formatCurrency(totals.totalExpenses)}, resulting in ${formatCurrency(
    totals.savings
  )} saved (${Math.round(totals.savingsRate)}% savings rate). `;

  if (topCategory && topCategory.spentAmount > 0) {
    explanation += `${topCategory.categoryName} was your highest expenditure (${formatCurrency(
      topCategory.spentAmount
    )}). `;
  }
  if (totalBudget > 0) {
    explanation += `Overall budget utilization is at ${Math.round(budgetUsagePct)}%.`;
  }

  return {
    monthLabel,
    income: totals.totalIncome,
    expenses: totals.totalExpenses,
    savings: totals.savings,
    savingsRate: totals.savingsRate,
    topCategory: topCategory?.categoryName,
    topCategoryAmount: topCategory?.spentAmount || 0,
    budgetUsagePct,
    aiExplanation: explanation,
  };
}
