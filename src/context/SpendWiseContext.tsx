'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { calculateAnalytics } from '../lib/analytics';
import { answerFinancialQuery } from '../lib/assistant';
import { calculateBudget } from '../lib/budgets';
import { calculateCategoryBreakdown } from '../lib/categories';
import { calculateTotals, roundMoney } from '../lib/finance';
import { calculateAllGoals, calculateGoal, calculateSavedAmount } from '../lib/goals';
import { generateInsights } from '../lib/insights';
import {
  INITIAL_BUDGETS,
  INITIAL_CATEGORIES,
  INITIAL_GOALS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_PROFILE,
  initializeStorageIfNeeded,
  loadBudgets,
  loadCategories,
  loadGoals,
  loadSettings,
  loadTransactions,
  loadUserProfile,
  resetDemoData,
  saveBudgets,
  saveCategories,
  saveGoals,
  saveSettings,
  saveTransactions,
  saveUserProfile,
  syncBudgetAddOrUpdate,
  syncBudgetDelete,
  syncFromSupabase,
  syncGoalAddOrUpdate,
  syncGoalDelete,
  syncTransactionAddOrUpdate,
  syncTransactionDelete,
} from '../lib/storage';
import { checkSupabaseConnection } from '../lib/supabase';
import {
  ActiveModal,
  AnalyticsSummary,
  AppScreen,
  AssistantMessage,
  BudgetCalculationResult,
  BudgetItem,
  CategoryItem,
  FinanceTotals,
  GoalCalculationResult,
  GoalItem,
  SmartInsight,
  ThemeMode,
  TransactionItem,
  UserProfile,
} from '../lib/types';

interface SpendWiseContextType {
  // Navigation & Modals
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  activeModal: ActiveModal;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;

  // Selected Entities
  selectedTransaction: TransactionItem | null;
  setSelectedTransaction: (tx: TransactionItem | null) => void;
  selectedGoal: GoalItem | null;
  setSelectedGoal: (goal: GoalItem | null) => void;
  selectedBudget: BudgetItem | null;
  setSelectedBudget: (budget: BudgetItem | null) => void;
  selectedCategory: CategoryItem | null;
  setSelectedCategory: (cat: CategoryItem | null) => void;

  // Theme & Profile
  themeMode: ThemeMode;
  toggleTheme: () => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;

  // Raw Entities
  transactions: TransactionItem[];
  budgets: BudgetItem[];
  goals: GoalItem[];
  categories: CategoryItem[];

  // Derived Financial Metrics (Single Source of Truth)
  totals: FinanceTotals;
  analytics: AnalyticsSummary;
  insights: SmartInsight[];
  budgetResults: BudgetCalculationResult[];
  goalResults: GoalCalculationResult[];

  // CRUD Operations
  addExpense: (data: {
    amount: number;
    title: string;
    category: string;
    date?: string;
    paymentMethod?: string;
    tags?: string[];
    notes?: string;
  }) => boolean;
  addIncome: (data: {
    amount: number;
    source: string;
    date?: string;
    category?: string;
    notes?: string;
  }) => boolean;
  updateTransaction: (tx: TransactionItem) => boolean;
  deleteTransaction: (id: string) => void;

  addGoal: (goal: Omit<GoalItem, 'id' | 'contributions'> & { initialSavings?: number }) => boolean;
  addMoneyToGoal: (goalId: string, amount: number) => boolean;
  deleteGoalContribution: (goalId: string, contributionId: string) => void;
  deleteGoal: (id: string) => void;

  createBudget: (budget: Omit<BudgetItem, 'id' | 'spent'>) => boolean;
  updateBudget: (budget: BudgetItem) => void;
  deleteBudget: (id: string) => void;

  // Categories CRUD
  addCategory: (cat: Omit<CategoryItem, 'id' | 'spentAmount' | 'transactionCount'>) => boolean;
  updateCategory: (cat: CategoryItem) => boolean;
  deleteCategory: (id: string) => void;

  // AI Assistant
  assistantMessages: AssistantMessage[];
  isAssistantThinking: boolean;
  askAssistant: (query: string) => void;

  // Supabase Cloud Sync
  supabaseStatus: {
    connected: boolean;
    tablesAvailable: boolean;
    lastSync: string | null;
    isSyncing: boolean;
  };
  triggerCloudSync: () => Promise<void>;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Reset
  resetData: () => void;
}

const SpendWiseContext = createContext<SpendWiseContextType | null>(null);

export function SpendWiseProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('LANDING');
  const [activeModal, setActiveModal] = useState<ActiveModal>('NONE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data initialized with INITIAL constants so SSR & initial mount have full data immediately
  const [userProfile, setUserProfileState] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [transactions, setTransactionsState] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgetsState] = useState<BudgetItem[]>(INITIAL_BUDGETS);
  const [goals, setGoalsState] = useState<GoalItem[]>(INITIAL_GOALS);
  const [categories, setCategoriesState] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('LIGHT');
  const [isBalanceVisible, setIsBalanceVisibleState] = useState(true);

  // Selected Entities
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(INITIAL_TRANSACTIONS[0] || null);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(INITIAL_GOALS[0] || null);
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(INITIAL_BUDGETS[0] || null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(INITIAL_CATEGORIES[0] || null);

  // Assistant State
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-initial',
      text: "Hello Ashish! I'm your SpendWise AI assistant. I analyze your verified financial data to provide instant clarity.\n\nWhat would you like to know today?",
      isUser: false,
      timestamp: 'Now',
      suggestedActions: [
        'Where did most of my money go?',
        'How much on food?',
        'Am I spending more than last month?',
        'How is my budget?',
        'What is my balance?',
      ],
    },
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Supabase Cloud Sync Status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    tablesAvailable: boolean;
    lastSync: string | null;
    isSyncing: boolean;
  }>({
    connected: true,
    tablesAvailable: false,
    lastSync: null,
    isSyncing: false,
  });

  const triggerCloudSync = async () => {
    setSupabaseStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const health = await checkSupabaseConnection();
      const result = await syncFromSupabase();
      if (result.synced) {
        if (result.transactions) setTransactionsState(result.transactions);
        if (result.budgets) setBudgetsState(result.budgets);
        if (result.goals) setGoalsState(result.goals);
        if (result.userProfile) setUserProfileState(result.userProfile);
        showToast('Cloud database synchronized');
      } else {
        showToast(result.message || 'Cloud check completed');
      }
      setSupabaseStatus({
        connected: health.connected,
        tablesAvailable: health.tablesAvailable,
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSyncing: false,
      });
    } catch {
      setSupabaseStatus((prev) => ({ ...prev, isSyncing: false }));
      showToast('Cloud sync attempted');
    }
  };

  // Client-side initialization to prevent hydration mismatches & sync Supabase
  useEffect(() => {
    // 1. Initialize local persistent seeds if empty
    initializeStorageIfNeeded();

    // 2. Load immediate cached data
    const loadedProfile = loadUserProfile();
    const loadedTxs = loadTransactions();
    const loadedBudgets = loadBudgets();
    const loadedGoals = loadGoals();
    const loadedCategories = loadCategories();
    const loadedSettings = loadSettings();

    setUserProfileState(loadedProfile);
    setTransactionsState(loadedTxs);
    setBudgetsState(loadedBudgets);
    setGoalsState(loadedGoals);
    setCategoriesState(loadedCategories);
    setThemeModeState(loadedSettings.themeMode || 'LIGHT');
    setIsBalanceVisibleState(loadedSettings.isBalanceVisible ?? true);

    setSelectedGoal(loadedGoals[0] || null);
    setSelectedBudget(loadedBudgets[0] || null);
    setSelectedTransaction(loadedTxs[0] || null);
    setSelectedCategory(loadedCategories[0] || null);

    // Check if session was active in this tab
    if (typeof window !== 'undefined') {
      const activeSession = sessionStorage.getItem('spendwise_session_active');
      if (activeSession === 'true') {
        setCurrentScreen('HOME');
      }
    }

    setIsLoaded(true);

    // 3. Background Supabase Sync & Health Check
    checkSupabaseConnection().then((health) => {
      setSupabaseStatus((prev) => ({
        ...prev,
        connected: health.connected,
        tablesAvailable: health.tablesAvailable,
      }));

      syncFromSupabase().then((res) => {
        if (res.synced) {
          if (res.transactions && res.transactions.length > 0) {
            setTransactionsState(res.transactions);
          }
          if (res.budgets && res.budgets.length > 0) {
            setBudgetsState(res.budgets);
          }
          if (res.goals && res.goals.length > 0) {
            setGoalsState(res.goals);
          }
          if (res.userProfile) {
            setUserProfileState(res.userProfile);
          }
          setSupabaseStatus((prev) => ({
            ...prev,
            lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
        }
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeMode === 'DARK') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [themeMode]);

  // Derived Categories with accurate live spent amount & transaction count (Single Source of Truth)
  const enrichedCategories = useMemo(() => {
    return categories.map((cat) => {
      const matchingTxs = transactions.filter(
        (t) => t.type === 'EXPENSE' && t.category.toLowerCase() === cat.name.toLowerCase()
      );
      const spent = matchingTxs.reduce((sum, t) => sum + t.amount, 0);
      return {
        ...cat,
        spentAmount: spent,
        transactionCount: matchingTxs.length,
      };
    });
  }, [categories, transactions]);

  // Derived Values (Single Source of Truth)
  const totals = calculateTotals(transactions);
  const budgetResults = budgets.map((b) => calculateBudget(b, transactions));
  const goalResults = calculateAllGoals(goals);
  const analytics = calculateAnalytics(transactions, enrichedCategories, budgets, goals, 'CURRENT_MONTH');
  const categoryBreakdown = calculateCategoryBreakdown(enrichedCategories, transactions);
  const insights = generateInsights(
    totals,
    categoryBreakdown,
    budgetResults,
    goalResults,
    analytics.monthlyTrends,
    transactions
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navigateTo = (screen: AppScreen) => {
    if (typeof window !== 'undefined') {
      if (screen !== 'LANDING') {
        sessionStorage.setItem('spendwise_session_active', 'true');
      } else {
        sessionStorage.removeItem('spendwise_session_active');
      }
    }
    setCurrentScreen(screen);
    // keep selected items in sync if applicable
    if (screen === 'GOALS' && !selectedGoal && goals.length > 0) {
      setSelectedGoal(goals[0]);
    }
    if (screen === 'BUDGETS' && !selectedBudget && budgets.length > 0) {
      setSelectedBudget(budgets[0]);
    }
  };

  const openModal = (modal: ActiveModal) => setActiveModal(modal);
  const closeModal = () => setActiveModal('NONE');

  const toggleTheme = () => {
    const nextTheme: ThemeMode = themeMode === 'LIGHT' ? 'DARK' : 'LIGHT';
    setThemeModeState(nextTheme);
    saveSettings({
      ...loadSettings(),
      themeMode: nextTheme,
    });
  };

  const toggleBalanceVisibility = () => {
    const next = !isBalanceVisible;
    setIsBalanceVisibleState(next);
    saveSettings({
      ...loadSettings(),
      isBalanceVisible: next,
    });
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...patch };
    setUserProfileState(updated);
    saveUserProfile(updated);
    showToast('Profile updated');
  };

  // Transactions CRUD
  const addExpense = (data: {
    amount: number;
    title: string;
    category: string;
    date?: string;
    paymentMethod?: string;
    tags?: string[];
    notes?: string;
  }): boolean => {
    if (!data.amount || data.amount <= 0) {
      showToast('Please enter a valid amount');
      return false;
    }
    const cleanAmount = roundMoney(data.amount);
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      title: data.title.trim() || data.category,
      subtitle: data.category,
      amount: cleanAmount,
      type: 'EXPENSE',
      category: data.category,
      date: data.date?.trim() || 'Today',
      time: 'Now',
      paymentMethod: data.paymentMethod || 'UPI',
      tags: data.tags || ['Essentials'],
      notes: data.notes || '',
      iconType: data.category.toLowerCase().includes('shopping')
        ? 'shopping'
        : data.category.toLowerCase().includes('transport')
        ? 'transport'
        : data.category.toLowerCase().includes('bill')
        ? 'bills'
        : data.category.toLowerCase().includes('entertainment')
        ? 'entertainment'
        : 'food',
      colorHex: '#EF9C8D',
    };

    const nextList = [newTx, ...transactions];
    setTransactionsState(nextList);
    syncTransactionAddOrUpdate(newTx, nextList);
    setSelectedTransaction(newTx);
    closeModal();
    showToast('Expense added successfully');
    return true;
  };

  const addIncome = (data: {
    amount: number;
    source: string;
    date?: string;
    category?: string;
    notes?: string;
  }): boolean => {
    if (!data.amount || data.amount <= 0) {
      showToast('Please enter a valid income amount');
      return false;
    }
    const cleanAmount = roundMoney(data.amount);
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      title: data.source.trim() || 'Income',
      subtitle: data.category || 'Salary',
      amount: cleanAmount,
      type: 'INCOME',
      category: data.category || 'Salary',
      date: data.date?.trim() || 'Today',
      time: 'Now',
      paymentMethod: 'Bank Transfer',
      tags: ['Income'],
      notes: data.notes || '',
      iconType: 'salary',
      colorHex: '#B9DEC9',
    };

    const nextList = [newTx, ...transactions];
    setTransactionsState(nextList);
    syncTransactionAddOrUpdate(newTx, nextList);
    setSelectedTransaction(newTx);
    closeModal();
    showToast('Income added successfully');
    return true;
  };

  const updateTransaction = (updatedTx: TransactionItem): boolean => {
    const idx = transactions.findIndex((it) => it.id === updatedTx.id);
    if (idx === -1) return false;
    const nextList = [...transactions];
    nextList[idx] = { ...updatedTx, amount: roundMoney(updatedTx.amount) };
    setTransactionsState(nextList);
    syncTransactionAddOrUpdate(nextList[idx], nextList);
    if (selectedTransaction?.id === updatedTx.id) {
      setSelectedTransaction(nextList[idx]);
    }
    closeModal();
    showToast('Transaction updated');
    return true;
  };

  const deleteTransaction = (id: string) => {
    const nextList = transactions.filter((it) => it.id !== id);
    setTransactionsState(nextList);
    syncTransactionDelete(id, nextList);
    if (selectedTransaction?.id === id) {
      setSelectedTransaction(nextList[0] || null);
    }
    closeModal();
    showToast('Transaction deleted');
  };

  // Goals CRUD
  const addGoal = (goalData: Omit<GoalItem, 'id' | 'contributions'> & { initialSavings?: number }): boolean => {
    if (!goalData.name.trim()) {
      showToast('Please enter a goal name');
      return false;
    }
    if (!goalData.targetAmount || goalData.targetAmount <= 0) {
      showToast('Please enter a valid target amount');
      return false;
    }

    const initial = roundMoney(goalData.initialSavings || goalData.currentSavings || 0);
    const target = roundMoney(goalData.targetAmount);

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      name: goalData.name.trim(),
      targetAmount: target,
      currentSavings: initial,
      targetDate: goalData.targetDate || '31 Dec 2026',
      category: goalData.category || 'Savings',
      iconType: goalData.iconType || 'laptop',
      colorHex: goalData.colorHex || '#9CC9FF',
      description: goalData.description || '',
      contributions: initial > 0 ? [{ id: `c-${Date.now()}`, amount: initial, date: 'Today', note: 'Initial deposit' }] : [],
    };

    const nextGoals = [newGoal, ...goals];
    setGoalsState(nextGoals);
    syncGoalAddOrUpdate(newGoal, nextGoals);
    setSelectedGoal(newGoal);
    closeModal();
    showToast('Goal created successfully');
    return true;
  };

  const addMoneyToGoal = (goalId: string, amount: number): boolean => {
    if (!amount || amount <= 0) {
      showToast('Please enter a deposit amount');
      return false;
    }
    const idx = goals.findIndex((g) => g.id === goalId);
    if (idx === -1) return false;

    const g = goals[idx];
    const roundedAmt = roundMoney(amount);
    const newContrib = {
      id: `c-${Date.now()}`,
      amount: roundedAmt,
      date: 'Today',
      note: 'Added Money',
    };
    const nextContribs = [newContrib, ...(g.contributions || [])];
    const updatedGoal: GoalItem = {
      ...g,
      currentSavings: calculateSavedAmount({ ...g, contributions: nextContribs }),
      contributions: nextContribs,
    };

    const nextGoals = [...goals];
    nextGoals[idx] = updatedGoal;
    setGoalsState(nextGoals);
    syncGoalAddOrUpdate(updatedGoal, nextGoals);
    setSelectedGoal(updatedGoal);
    closeModal();
    showToast(`Added ₹${roundedAmt} to ${g.name}! 🎉`);
    return true;
  };

  const deleteGoalContribution = (goalId: string, contributionId: string) => {
    const idx = goals.findIndex((g) => g.id === goalId);
    if (idx === -1) return;

    const g = goals[idx];
    const nextContribs = (g.contributions || []).filter((c) => c.id !== contributionId);
    const updatedGoal: GoalItem = {
      ...g,
      currentSavings: calculateSavedAmount({ ...g, contributions: nextContribs }),
      contributions: nextContribs,
    };

    const nextGoals = [...goals];
    nextGoals[idx] = updatedGoal;
    setGoalsState(nextGoals);
    syncGoalAddOrUpdate(updatedGoal, nextGoals);
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(updatedGoal);
    }
    showToast('Contribution removed');
  };

  const deleteGoal = (id: string) => {
    const nextGoals = goals.filter((g) => g.id !== id);
    setGoalsState(nextGoals);
    syncGoalDelete(id, nextGoals);
    setSelectedGoal(nextGoals[0] || null);
    closeModal();
    showToast('Goal deleted');
  };

  // Budgets CRUD
  const createBudget = (budgetData: Omit<BudgetItem, 'id' | 'spent'>): boolean => {
    if (!budgetData.name.trim()) {
      showToast('Please enter a budget name');
      return false;
    }
    if (!budgetData.totalLimit || budgetData.totalLimit <= 0) {
      showToast('Please enter a valid limit');
      return false;
    }

    const newBudget: BudgetItem = {
      id: `budget-${Date.now()}`,
      name: budgetData.name.trim(),
      month: budgetData.month || 'Current Month',
      totalLimit: roundMoney(budgetData.totalLimit),
      spent: 0,
      allocations: budgetData.allocations || [],
      alertThresholdPercent: budgetData.alertThresholdPercent ?? 90,
    };

    const nextBudgets = [newBudget, ...budgets];
    setBudgetsState(nextBudgets);
    syncBudgetAddOrUpdate(newBudget, nextBudgets);
    setSelectedBudget(newBudget);
    closeModal();
    showToast('Budget created');
    return true;
  };

  const updateBudget = (updated: BudgetItem) => {
    const idx = budgets.findIndex((b) => b.id === updated.id);
    if (idx === -1) return;
    const nextBudgets = [...budgets];
    nextBudgets[idx] = { ...updated, totalLimit: roundMoney(updated.totalLimit) };
    setBudgetsState(nextBudgets);
    syncBudgetAddOrUpdate(nextBudgets[idx], nextBudgets);
    setSelectedBudget(nextBudgets[idx]);
    closeModal();
    showToast('Budget updated');
  };

  const deleteBudget = (id: string) => {
    const nextBudgets = budgets.filter((b) => b.id !== id);
    setBudgetsState(nextBudgets);
    syncBudgetDelete(id, nextBudgets);
    setSelectedBudget(nextBudgets[0] || null);
    closeModal();
    showToast('Budget deleted');
  };

  // Categories CRUD
  const addCategory = (data: Omit<CategoryItem, 'id' | 'spentAmount' | 'transactionCount'>): boolean => {
    if (!data.name.trim()) {
      showToast('Please enter a category name');
      return false;
    }
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: data.name.trim(),
      iconType: data.iconType || 'other',
      colorHex: data.colorHex || '#9CC9FF',
      spentAmount: 0,
      transactionCount: 0,
    };
    const nextList = [...categories, newCat];
    setCategoriesState(nextList);
    saveCategories(nextList);
    setSelectedCategory(newCat);
    closeModal();
    showToast('Category created');
    return true;
  };

  const updateCategory = (updated: CategoryItem): boolean => {
    const idx = categories.findIndex((c) => c.id === updated.id);
    if (idx === -1) return false;
    const nextList = [...categories];
    nextList[idx] = updated;
    setCategoriesState(nextList);
    saveCategories(nextList);
    if (selectedCategory?.id === updated.id) {
      setSelectedCategory(updated);
    }
    closeModal();
    showToast('Category updated');
    return true;
  };

  const deleteCategory = (id: string) => {
    const nextList = categories.filter((c) => c.id !== id);
    setCategoriesState(nextList);
    saveCategories(nextList);
    if (selectedCategory?.id === id) {
      setSelectedCategory(nextList[0] || null);
    }
    closeModal();
    showToast('Category deleted');
  };

  // AI Assistant Chat
  const askAssistant = (userQuery: string) => {
    const q = userQuery.trim();
    if (!q) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}-u`,
      text: q,
      isUser: true,
      timestamp: 'Now',
    };

    setAssistantMessages((prev) => [...prev, userMsg]);
    setIsAssistantThinking(true);

    setTimeout(() => {
      const answer = answerFinancialQuery(
        q,
        totals,
        categoryBreakdown,
        budgetResults,
        goalResults,
        analytics.monthlyTrends,
        transactions
      );

      const aiMsg: AssistantMessage = {
        id: `msg-${Date.now()}-a`,
        text: answer,
        isUser: false,
        timestamp: 'Now',
        suggestedActions: [
          'Where did most of my money go?',
          'How much on food?',
          'Am I spending more than last month?',
          'How is my budget?',
        ],
      };

      setAssistantMessages((prev) => [...prev, aiMsg]);
      setIsAssistantThinking(false);
    }, 450);
  };

  // Reset
  const resetData = () => {
    resetDemoData();
    setUserProfileState(loadUserProfile());
    setTransactionsState(loadTransactions());
    setBudgetsState(loadBudgets());
    setGoalsState(loadGoals());
    setCategoriesState(loadCategories());
    setThemeModeState('LIGHT');
    setIsBalanceVisibleState(true);
    setCurrentScreen('HOME');
    closeModal();
    showToast('Restored default demo data');
  };

  return (
    <SpendWiseContext.Provider
      value={{
        currentScreen,
        navigateTo,
        activeModal,
        openModal,
        closeModal,
        selectedTransaction,
        setSelectedTransaction,
        selectedGoal,
        setSelectedGoal,
        selectedBudget,
        setSelectedBudget,
        selectedCategory,
        setSelectedCategory,
        themeMode,
        toggleTheme,
        userProfile,
        updateUserProfile,
        isBalanceVisible,
        toggleBalanceVisibility,
        transactions,
        budgets,
        goals,
        categories: enrichedCategories,
        totals,
        analytics,
        insights,
        budgetResults,
        goalResults,
        addExpense,
        addIncome,
        updateTransaction,
        deleteTransaction,
        addGoal,
        addMoneyToGoal,
        deleteGoalContribution,
        deleteGoal,
        createBudget,
        updateBudget,
        deleteBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        assistantMessages,
        isAssistantThinking,
        askAssistant,
        supabaseStatus,
        triggerCloudSync,
        toastMessage,
        showToast,
        resetData,
      }}
    >
      {children}
    </SpendWiseContext.Provider>
  );
}

export function useSpendWise() {
  const context = useContext(SpendWiseContext);
  if (!context) {
    throw new Error('useSpendWise must be used within a SpendWiseProvider');
  }
  return context;
}
