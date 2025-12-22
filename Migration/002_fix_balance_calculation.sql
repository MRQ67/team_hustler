-- Fix the calculate_account_balance function to avoid FULL OUTER JOIN issue
CREATE OR REPLACE FUNCTION calculate_account_balance(p_account_id UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  balance DECIMAL(15,2);
  starting_bal DECIMAL(15,2);
  transaction_sum DECIMAL(15,2);
  transfer_sum DECIMAL(15,2);
BEGIN
  -- Get the starting balance
  SELECT COALESCE(starting_balance, 0) INTO starting_bal
  FROM accounts
  WHERE id = p_account_id;

  -- Calculate the sum of transactions affecting this account
  SELECT COALESCE(SUM(
    CASE
      WHEN transaction_type = 'income' THEN amount
      WHEN transaction_type = 'expense' THEN -amount
      ELSE 0
    END
  ), 0) INTO transaction_sum
  FROM transactions
  WHERE account_id = p_account_id;

  -- Calculate the sum of transfers affecting this account
  SELECT COALESCE(SUM(
    CASE
      WHEN from_account_id = p_account_id THEN -amount  -- Outgoing transfer
      WHEN to_account_id = p_account_id THEN amount     -- Incoming transfer
      ELSE 0
    END
  ), 0) INTO transfer_sum
  FROM transfers
  WHERE from_account_id = p_account_id OR to_account_id = p_account_id;

  -- Calculate final balance
  balance := starting_bal + COALESCE(transaction_sum, 0) + COALESCE(transfer_sum, 0);

  RETURN balance;
END;
$$ LANGUAGE plpgsql;