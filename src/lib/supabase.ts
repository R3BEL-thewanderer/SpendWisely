import { createClient } from '@supabase/supabase-js';
import {
  BudgetItem,
  CategoryItem,
  GoalItem,
  SettingsData,
  TransactionItem,
  UserProfile,
} from './types';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzhnanuguvnjimvkbrss.supabase.co';
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aG5hbnVndXZuamltdmticnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MzU5NTUsImV4cCI6MjEwNjUxMTk1NX0.tnZDbcyh08wHYLAvzrZby8B4aPmhvTb1ogWb9Y0XL0E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface SyncState {
  userProfile: UserProfile;
  transactions: TransactionItem[];
  budgets: BudgetItem[];
  goals: GoalItem[];
  categories: CategoryItem[];
  settings?: SettingsData;
}

// Check if Supabase connection is healthy and tables are reachable
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tablesAvailable: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.from('transactions').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, we are still connected to Supabase URL
      return {
        connected: true,
        tablesAvailable: false,
        error: error.message,
      };
    }
    return {
      connected: true,
      tablesAvailable: true,
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesAvailable: false,
      error: err?.message || 'Connection failed',
    };
  }
}

// Fetch all transactions from Supabase
export async function fetchTransactionsFromSupabase(): Promise<TransactionItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || '',
      amount: Number(row.amount),
      type: row.type as 'INCOME' | 'EXPENSE',
      category: row.category,
      date: row.date,
      time: row.time || 'Now',
      paymentMethod: row.payment_method || 'UPI',
      tags: Array.isArray(row.tags) ? row.tags : [],
      notes: row.notes || '',
      iconType: row.icon_type || 'food',
      colorHex: row.color_hex || '#EF9C8D',
    }));
  } catch {
    return null;
  }
}

// Upsert single transaction
export async function upsertTransactionToSupabase(tx: TransactionItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('transactions').upsert(
      {
        id: tx.id,
        title: tx.title,
        subtitle: tx.subtitle,
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        date: tx.date,
        time: tx.time,
        payment_method: tx.paymentMethod,
        tags: tx.tags,
        notes: tx.notes,
        icon_type: tx.iconType,
        color_hex: tx.colorHex,
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch {
    return false;
  }
}

// Delete single transaction
export async function deleteTransactionFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// Fetch budgets
export async function fetchBudgetsFromSupabase(): Promise<BudgetItem[] | null> {
  try {
    const { data, error } = await supabase.from('budgets').select('*');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      month: row.month,
      totalLimit: Number(row.total_limit),
      spent: Number(row.spent || 0),
      allocations: Array.isArray(row.allocations) ? row.allocations : [],
      alertThresholdPercent: Number(row.alert_threshold_percent || 90),
    }));
  } catch {
    return null;
  }
}

// Upsert budget
export async function upsertBudgetToSupabase(budget: BudgetItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('budgets').upsert(
      {
        id: budget.id,
        name: budget.name,
        month: budget.month,
        total_limit: budget.totalLimit,
        spent: budget.spent,
        allocations: budget.allocations,
        alert_threshold_percent: budget.alertThresholdPercent,
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch {
    return false;
  }
}

// Delete budget
export async function deleteBudgetFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// Fetch goals
export async function fetchGoalsFromSupabase(): Promise<GoalItem[] | null> {
  try {
    const { data, error } = await supabase.from('goals').select('*');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      targetAmount: Number(row.target_amount),
      currentSavings: Number(row.current_savings || 0),
      targetDate: row.target_date,
      category: row.category,
      iconType: row.icon_type,
      colorHex: row.color_hex,
      description: row.description || '',
      contributions: Array.isArray(row.contributions) ? row.contributions : [],
    }));
  } catch {
    return null;
  }
}

// Upsert goal
export async function upsertGoalToSupabase(goal: GoalItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('goals').upsert(
      {
        id: goal.id,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_savings: goal.currentSavings,
        target_date: goal.targetDate,
        category: goal.category,
        icon_type: goal.iconType,
        color_hex: goal.colorHex,
        description: goal.description,
        contributions: goal.contributions,
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch {
    return false;
  }
}

// Delete goal
export async function deleteGoalFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// Snapshot sync to app_state table (guarantees instantaneous atomic backup)
export async function syncAppStateToSupabase(key: string, data: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('app_state').upsert(
      {
        key,
        data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );
    return !error;
  } catch {
    return false;
  }
}

export async function fetchAppStateFromSupabase(key: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('data')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return null;
    return data.data;
  } catch {
    return null;
  }
}
