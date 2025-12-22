import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';

export interface Transaction {
  id: string;
  amount: number;
  transaction_type: 'income' | 'expense' | 'transfer';
  description: string; // Used as title
  date: string;
  categories?: {
    name: string;
    icon: string;
    color: string;
  } | null;
}

export interface Account {
  id: string;
  name: string;
  account_type: string;
  balance: number;
  currency: string;
}

export interface Budget {
  id: string;
  amount: number;
  spent: number;
  period_start: string;
  period_end: string;
  category_id?: string;
  category_name?: string;
}

export interface FinancialData {
  totalBalance: number;
  income: number;
  expense: number;
  recentTransactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useFinancialData() {
  const [data, setData] = useState<FinancialData>({
    totalBalance: 0,
    income: 0,
    expense: 0,
    recentTransactions: [],
    accounts: [],
    budgets: [],
    loading: true,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Accounts & Calculate Total Balance
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      if (accountsError) throw accountsError;

      let totalBal = 0;
      const accountsWithBalance: Account[] = [];

      if (accountsData && accountsData.length > 0) {
        // Calculate balance for each account using RPC
        const balancePromises = accountsData.map(async (account) => {
          const { data: balance, error: rpcError } = await supabase
            .rpc('calculate_account_balance', { p_account_id: account.id });
          
          if (rpcError) {
             console.error('Error calculating balance for account', account.id, rpcError);
             return { ...account, balance: 0 };
          }
          const bal = Number(balance) || 0;
          return { ...account, balance: bal };
        });

        const updatedAccounts = await Promise.all(balancePromises);
        accountsWithBalance.push(...updatedAccounts);
        totalBal = updatedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
      }

      // 2. Calculate Monthly Income & Expense
      const now = new Date();
      const start = formatISO(startOfMonth(now));
      const end = formatISO(endOfMonth(now));

      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('amount, transaction_type')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end);

      if (txError) throw txError;

      let monthlyIncome = 0;
      let monthlyExpense = 0;

      transactions?.forEach(tx => {
        if (tx.transaction_type === 'income') {
          monthlyIncome += Number(tx.amount);
        } else if (tx.transaction_type === 'expense') {
          monthlyExpense += Number(tx.amount);
        }
      });

      // 3. Fetch Recent Transactions
      const { data: recentTx, error: recentError } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          transaction_type,
          description,
          date,
          categories (
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // 4. Fetch Budgets and calculate spent amount
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select(`
          id,
          amount,
          period_start,
          period_end,
          categories (
            name
          )
        `)
        .eq('user_id', user.id)
        .gte('period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]) // Current month start
        .lte('period_end', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]); // Current month end

      if (budgetsError) throw budgetsError;

      // Calculate spent amount for each budget based on transactions
      let budgetsWithSpent: Budget[] = [];
      if (budgetsData && budgetsData.length > 0) {
        budgetsWithSpent = await Promise.all(budgetsData.map(async (budget) => {
          // Calculate expenses for this budget's category in the current month
          let spent = 0;
          if (budget.categories) {
            const { data: categoryExpenses, error: expensesError } = await supabase
              .from('transactions')
              .select('amount')
              .eq('user_id', user.id)
              .eq('category_id', budget.categories.id)
              .eq('transaction_type', 'expense')
              .gte('date', budget.period_start)
              .lte('date', budget.period_end);

            if (!expensesError && categoryExpenses) {
              spent = categoryExpenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
            }
          } else {
            // If no category specified, sum all expenses
            const { data: allExpenses, error: allExpensesError } = await supabase
              .from('transactions')
              .select('amount')
              .eq('user_id', user.id)
              .eq('transaction_type', 'expense')
              .gte('date', budget.period_start)
              .lte('date', budget.period_end);

            if (!allExpensesError && allExpenses) {
              spent = allExpenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
            }
          }

          return {
            id: budget.id,
            amount: Number(budget.amount),
            spent: spent,
            period_start: budget.period_start,
            period_end: budget.period_end,
            category_id: budget.categories?.id,
            category_name: budget.categories?.name
          };
        }));
      }

      setData({
        totalBalance: totalBal,
        income: monthlyIncome,
        expense: monthlyExpense,
        recentTransactions: (recentTx as any[])?.map(tx => ({
          ...tx,
          amount: Number(tx.amount), // Ensure number
          categories: Array.isArray(tx.categories) ? tx.categories[0] : tx.categories // Handle Supabase join array/object
        })) || [],
        accounts: accountsWithBalance,
        budgets: budgetsWithSpent,
        loading: false,
        refetch: fetchData,
      });

    } catch (error) {
      console.error('Error fetching financial data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, refetch: fetchData };
}
