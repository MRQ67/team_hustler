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

export interface FinancialData {
  totalBalance: number;
  income: number;
  expense: number;
  recentTransactions: Transaction[];
  accounts: Account[];
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
