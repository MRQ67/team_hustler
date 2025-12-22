-- Supabase Database Migration for Finance Tracker App

-- Create users table extension (Supabase automatically creates a public.users table with auth)
-- But we'll create our own profiles table for additional user data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE
);

-- Create accounts table
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL, -- 'cash', 'bank', 'mobile_money', 'card', 'savings'
  starting_balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  category_type TEXT NOT NULL, -- 'income', 'expense'
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  account_id UUID REFERENCES accounts(id) NOT NULL,
  category_id UUID REFERENCES categories(id),
  transaction_type TEXT NOT NULL, -- 'income', 'expense', 'transfer'
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transfers table (for tracking transfers between accounts)
CREATE TABLE transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  from_account_id UUID REFERENCES accounts(id) NOT NULL,
  to_account_id UUID REFERENCES accounts(id) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id UUID REFERENCES categories(id),
  amount DECIMAL(15,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create savings_goals table
CREATE TABLE savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  account_id UUID REFERENCES accounts(id),
  name TEXT NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0.00,
  target_date DATE,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for accounts
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for categories
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for transfers
CREATE POLICY "Users can view own transfers" ON transfers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transfers" ON transfers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transfers" ON transfers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transfers" ON transfers
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for budgets
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for savings_goals
CREATE POLICY "Users can view own savings goals" ON savings_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals" ON savings_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals" ON savings_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals" ON savings_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Function to calculate account balance
CREATE OR REPLACE FUNCTION calculate_account_balance(p_account_id UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  balance DECIMAL(15,2);
  starting_bal DECIMAL(15,2);
BEGIN
  -- Get the starting balance
  SELECT COALESCE(starting_balance, 0) INTO starting_bal
  FROM accounts
  WHERE id = p_account_id;

  -- Calculate the sum of transactions affecting this account
  SELECT COALESCE(
    starting_bal +
    COALESCE(SUM(
      CASE
        WHEN t.transaction_type = 'income' THEN t.amount
        WHEN t.transaction_type = 'expense' THEN -t.amount
        ELSE 0
      END
    ), 0) +
    COALESCE(SUM(
      CASE
        WHEN tr.from_account_id = p_account_id THEN -tr.amount
        WHEN tr.to_account_id = p_account_id THEN tr.amount
        ELSE 0
      END
    ), 0),
    starting_bal
  ) INTO balance
  FROM transactions t
  FULL OUTER JOIN transfers tr ON (
    tr.from_account_id = p_account_id OR tr.to_account_id = p_account_id
  )
  WHERE (t.account_id = p_account_id OR tr.from_account_id = p_account_id OR tr.to_account_id = p_account_id)
    AND (t.user_id = (SELECT user_id FROM accounts WHERE id = p_account_id) 
         OR tr.user_id = (SELECT user_id FROM accounts WHERE id = p_account_id));

  RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update account balances when transactions change
CREATE OR REPLACE FUNCTION update_account_balance_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- This would update a cached balance column when transactions change
  -- For now, we'll rely on the calculate_account_balance function
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transactions table
CREATE TRIGGER update_balance_after_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_account_balance_trigger();

-- Create trigger for transfers table
CREATE TRIGGER update_balance_after_transfer_change
  AFTER INSERT OR UPDATE OR DELETE ON transfers
  FOR EACH ROW EXECUTE FUNCTION update_account_balance_trigger();