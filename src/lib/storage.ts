import {
  INITIAL_BUDGETS,
  INITIAL_CATEGORIES,
  INITIAL_GOALS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_PROFILE,
} from './mockData';
import {
  checkSupabaseConnection,
  deleteBudgetFromSupabase,
  deleteGoalFromSupabase,
  deleteTransactionFromSupabase,
  fetchAppStateFromSupabase,
  fetchBudgetsFromSupabase,
  fetchGoalsFromSupabase,
  fetchTransactionsFromSupabase,
  syncAppStateToSupabase,
  upsertBudgetToSupabase,
  upsertGoalToSupabase,
  upsertTransactionToSupabase,
} from './supabase';
import {
  BudgetItem,
  CategoryItem,
  GoalItem,
  SettingsData,
  TransactionItem,
  UserProfile,
} from './types';

export {
  INITIAL_BUDGETS,
  INITIAL_CATEGORIES,
  INITIAL_GOALS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_PROFILE,
};

const STORAGE_KEYS = {
  INITIALIZED: 'spendwise_initialized_v2',
  USER_PROFILE: 'spendwise_user_profile_v2',
  TRANSACTIONS: 'spendwise_transactions_v2',
  BUDGETS: 'spendwise_budgets_v2',
  GOALS: 'spendwise_goals_v2',
  CATEGORIES: 'spendwise_categories_v2',
  SETTINGS: 'spendwise_settings_v2',
};

// Safe LocalStorage helper
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// Ensure initial seed is saved into localStorage on first run
export function initializeStorageIfNeeded(): void {
  if (!isClient()) return;
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (e) {
    console.error('Storage initialization failed', e);
  }
}

// User Profile
export function loadUserProfile(): UserProfile {
  if (!isClient()) return INITIAL_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : INITIAL_USER_PROFILE;
  } catch {
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
  // Async Supabase sync
  syncAppStateToSupabase('user_profile', profile).catch(() => {});
}

// Transactions
export function loadTransactions(): TransactionItem[] {
  if (!isClient()) return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(txs: TransactionItem[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
  // Async Supabase sync
  syncAppStateToSupabase('transactions', txs).catch(() => {});
}

export function syncTransactionAddOrUpdate(tx: TransactionItem, allTxs: TransactionItem[]): void {
  saveTransactions(allTxs);
  upsertTransactionToSupabase(tx).catch(() => {});
}

export function syncTransactionDelete(id: string, allTxs: TransactionItem[]): void {
  saveTransactions(allTxs);
  deleteTransactionFromSupabase(id).catch(() => {});
}

// Budgets
export function loadBudgets(): BudgetItem[] {
  if (!isClient()) return INITIAL_BUDGETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return raw ? JSON.parse(raw) : INITIAL_BUDGETS;
  } catch {
    return INITIAL_BUDGETS;
  }
}

export function saveBudgets(budgets: BudgetItem[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to save budgets', e);
  }
  // Async Supabase sync
  syncAppStateToSupabase('budgets', budgets).catch(() => {});
}

export function syncBudgetAddOrUpdate(budget: BudgetItem, allBudgets: BudgetItem[]): void {
  saveBudgets(allBudgets);
  upsertBudgetToSupabase(budget).catch(() => {});
}

export function syncBudgetDelete(id: string, allBudgets: BudgetItem[]): void {
  saveBudgets(allBudgets);
  deleteBudgetFromSupabase(id).catch(() => {});
}

// Goals
export function loadGoals(): GoalItem[] {
  if (!isClient()) return INITIAL_GOALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    return raw ? JSON.parse(raw) : INITIAL_GOALS;
  } catch {
    return INITIAL_GOALS;
  }
}

export function saveGoals(goals: GoalItem[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
  // Async Supabase sync
  syncAppStateToSupabase('goals', goals).catch(() => {});
}

export function syncGoalAddOrUpdate(goal: GoalItem, allGoals: GoalItem[]): void {
  saveGoals(allGoals);
  upsertGoalToSupabase(goal).catch(() => {});
}

export function syncGoalDelete(id: string, allGoals: GoalItem[]): void {
  saveGoals(allGoals);
  deleteGoalFromSupabase(id).catch(() => {});
}

// Categories
export function loadCategories(): CategoryItem[] {
  if (!isClient()) return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveCategories(categories: CategoryItem[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
  // Async Supabase sync
  syncAppStateToSupabase('categories', categories).catch(() => {});
}

// Settings
export function loadSettings(): SettingsData {
  if (!isClient()) return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: SettingsData): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
  syncAppStateToSupabase('settings', settings).catch(() => {});
}

// Full Reset to default data
export function resetDemoData(): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } catch (e) {
    console.error('Failed to reset demo data', e);
  }
  // Reset in Supabase as well
  syncAppStateToSupabase('transactions', INITIAL_TRANSACTIONS).catch(() => {});
  syncAppStateToSupabase('budgets', INITIAL_BUDGETS).catch(() => {});
  syncAppStateToSupabase('goals', INITIAL_GOALS).catch(() => {});
  syncAppStateToSupabase('categories', INITIAL_CATEGORIES).catch(() => {});
  syncAppStateToSupabase('user_profile', INITIAL_USER_PROFILE).catch(() => {});
}

// Bidirectional Supabase Sync
export async function syncFromSupabase(): Promise<{
  synced: boolean;
  transactions?: TransactionItem[];
  budgets?: BudgetItem[];
  goals?: GoalItem[];
  userProfile?: UserProfile;
  message: string;
}> {
  try {
    const status = await checkSupabaseConnection();
    if (!status.connected) {
      return { synced: false, message: 'Supabase offline or unreachable' };
    }

    // Try structured tables first
    const remoteTxs = await fetchTransactionsFromSupabase();
    const remoteBudgets = await fetchBudgetsFromSupabase();
    const remoteGoals = await fetchGoalsFromSupabase();

    let txs = remoteTxs && remoteTxs.length > 0 ? remoteTxs : null;
    let budgets = remoteBudgets && remoteBudgets.length > 0 ? remoteBudgets : null;
    let goals = remoteGoals && remoteGoals.length > 0 ? remoteGoals : null;
    let profile: UserProfile | null = null;

    // Fallback to app_state snapshot if tables are not populated yet
    if (!txs) {
      const snapTxs = await fetchAppStateFromSupabase('transactions');
      if (Array.isArray(snapTxs) && snapTxs.length > 0) txs = snapTxs;
    }
    if (!budgets) {
      const snapBudgets = await fetchAppStateFromSupabase('budgets');
      if (Array.isArray(snapBudgets) && snapBudgets.length > 0) budgets = snapBudgets;
    }
    if (!goals) {
      const snapGoals = await fetchAppStateFromSupabase('goals');
      if (Array.isArray(snapGoals) && snapGoals.length > 0) goals = snapGoals;
    }
    const snapProfile = await fetchAppStateFromSupabase('user_profile');
    if (snapProfile && typeof snapProfile === 'object') profile = snapProfile;

    // If remote has data, persist locally
    if (txs) saveTransactions(txs);
    if (budgets) saveBudgets(budgets);
    if (goals) saveGoals(goals);
    if (profile) saveUserProfile(profile);

    // If remote was empty but local has data, seed remote
    if (!txs) {
      const localTxs = loadTransactions();
      syncAppStateToSupabase('transactions', localTxs).catch(() => {});
    }
    if (!budgets) {
      const localBudgets = loadBudgets();
      syncAppStateToSupabase('budgets', localBudgets).catch(() => {});
    }
    if (!goals) {
      const localGoals = loadGoals();
      syncAppStateToSupabase('goals', localGoals).catch(() => {});
    }

    return {
      synced: true,
      transactions: txs || undefined,
      budgets: budgets || undefined,
      goals: goals || undefined,
      userProfile: profile || undefined,
      message: 'Supabase synced successfully',
    };
  } catch (err: any) {
    return {
      synced: false,
      message: err?.message || 'Sync failed',
    };
  }
}
