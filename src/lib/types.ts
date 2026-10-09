export type TransactionType = 'EXPENSE' | 'INCOME';

export interface TransactionItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // e.g. "Today", "Yesterday", "12 Feb 2025"
  time?: string;
  paymentMethod?: string;
  tags?: string[];
  notes?: string;
  iconType?: string;
  colorHex?: string;
}

export interface CategoryAllocation {
  categoryName: string;
  percentage: number;
  amount: number;
  colorHex?: string;
  iconType?: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  month: string;
  totalLimit: number;
  spent: number;
  allocations: CategoryAllocation[];
  alertThresholdPercent?: number;
}

export interface GoalContribution {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface GoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  category: string;
  iconType: string;
  colorHex: string;
  description?: string;
  contributions: GoalContribution[];
}

export interface CategoryItem {
  id: string;
  name: string;
  iconType: string;
  colorHex: string;
  spentAmount: number;
  transactionCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  monthlyIncome: number;
  monthlyBudget: number;
  preferredCategories: string[];
  memberSince: string;
  accountType: string;
}

export type BudgetStatus = 'UNDER_BUDGET' | 'NEAR_LIMIT' | 'OVER_BUDGET';

export interface FinanceTotals {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  netCashFlow: number;
  savings: number;
  savingsRate: number;
}

export interface CategorySpendingResult {
  categoryName: string;
  spentAmount: number;
  percentageOfTotal: number;
  transactionCount: number;
}

export interface CategoryBudgetResult {
  categoryName: string;
  allocatedLimit: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  remainingPercentage: number;
  overBudgetAmount: number;
  status: BudgetStatus;
}

export interface BudgetCalculationResult {
  budgetId: string;
  name: string;
  month: string;
  totalLimit: number;
  totalSpent: number;
  remainingBudget: number;
  usagePercentage: number;
  remainingPercentage: number;
  overBudgetAmount: number;
  status: BudgetStatus;
  categoryResults: CategoryBudgetResult[];
}

export interface GoalCalculationResult {
  goalId: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  isCompleted: boolean;
  gulakFillRatio: number; // 0.0 to 1.0
  contributionCount: number;
}

export type DatePeriod =
  | 'ALL_TIME'
  | 'CURRENT_WEEK'
  | 'CURRENT_MONTH'
  | 'PREVIOUS_MONTH'
  | 'CUSTOM';

export interface CustomDateRange {
  startDate: string;
  endDate: string;
}

export interface MonthlyTrendItem {
  monthKey: string;
  monthLabel: string;
  income: number;
  expenses: number;
  net: number;
}

export interface AnalyticsSummary {
  period: DatePeriod;
  totals: FinanceTotals;
  categoryBreakdown: CategorySpendingResult[];
  budgetResults: BudgetCalculationResult[];
  goalResults: GoalCalculationResult[];
  monthlyTrends: MonthlyTrendItem[];
  topCategory: CategorySpendingResult | null;
}

export type InsightType = 'SPENDING' | 'BUDGET' | 'GOAL' | 'SUMMARY' | 'ANOMALY';
export type InsightSeverity = 'INFO' | 'WARNING' | 'SUCCESS';

export interface SmartInsight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  severity: InsightSeverity;
  iconType: string;
  actionText?: string;
}

export interface MonthlyAiSummary {
  monthLabel: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  topCategory?: string;
  topCategoryAmount: number;
  budgetUsagePct: number;
  aiExplanation: string;
}

export interface PaymentMethodBreakdownItem {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface CreditCardRecommendation {
  id: string;
  cardName: string;
  issuer: string;
  category: string;
  rewardText: string;
  potentialMonthlySavings: number;
  potentialYearlySavings: number;
  joiningFeeText: string;
  applyUrl: string;
  badge?: string;
  colorHex?: string;
  perks: string[];
}

export type AssistantCardType =
  | 'PAYMENT_BREAKDOWN'
  | 'TOP_SPENDS'
  | 'CARD_RECOMMENDATION'
  | 'BUDGET_ALERT';

export interface AssistantCardPayload {
  type: AssistantCardType;
  paymentBreakdown?: PaymentMethodBreakdownItem[];
  topTransactions?: TransactionItem[];
  cardRecommendation?: CreditCardRecommendation;
  budgetAlert?: {
    category: string;
    spent: number;
    limit: number;
    percent: number;
  };
}

export interface AssistantMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  suggestedActions?: string[];
  cardPayload?: AssistantCardPayload;
}

export type AppScreen =
  | 'HOME'
  | 'TRANSACTIONS'
  | 'BUDGETS'
  | 'GOALS'
  | 'GOAL_DETAIL'
  | 'CATEGORIES'
  | 'ANALYTICS'
  | 'PROFILE'
  | 'SETTINGS'
  | 'LANDING';

export type ActiveModal =
  | 'NONE'
  | 'ADD_EXPENSE'
  | 'EDIT_EXPENSE'
  | 'ADD_INCOME'
  | 'EDIT_INCOME'
  | 'TRANSACTION_DETAIL'
  | 'CREATE_BUDGET'
  | 'CREATE_GOAL'
  | 'ADD_MONEY_GOAL'
  | 'AI_ASSISTANT'
  | 'TRANSACTION_FILTER'
  | 'SCAN_RECEIPT'
  | 'IMPORT_STATEMENT'
  | 'SUBSCRIPTIONS'
  | 'SPLIT_BILL'
  | 'VOICE_INPUT'
  | 'ADD_CATEGORY'
  | 'EDIT_CATEGORY'
  | 'AUTH_SIGN_IN'
  | 'AUTH_SIGN_UP'
  | 'AUTH_FORGOT_PASSWORD'
  | 'AUTH_ONBOARDING'
  | 'DELETE_CONFIRM';

export interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'MONTHLY' | 'YEARLY' | 'QUARTERLY';
  category: string;
  nextRenewalDate: string;
  daysUntilRenewal: number;
  serviceIcon: string;
  colorHex?: string;
  cancelUrl?: string;
  isZombie?: boolean;
  priceHikeAlert?: {
    previousAmount: number;
    difference: number;
    percentHike: number;
  };
  isActive: boolean;
  paymentMethod?: string;
}

export interface SplitDueItem {
  id: string;
  transactionId?: string;
  expenseTitle: string;
  totalAmount: number;
  friendName: string;
  friendUpiId?: string;
  friendShare: number;
  yourShare: number;
  status: 'PENDING' | 'SETTLED';
  date: string;
  note?: string;
  splitType: 'EQUAL' | 'CUSTOM';
}

export interface ParsedVoiceExpense {
  amount: number;
  title: string;
  category: string;
  paymentMethod: string;
  notes?: string;
  confidence: number;
  rawTranscript: string;
}

export type ThemeMode = 'LIGHT' | 'DARK';

export interface SettingsData {
  themeMode: ThemeMode;
  isBalanceVisible: boolean;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
