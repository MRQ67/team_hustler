/**
 * SMS Parser utility for extracting transaction information from bank SMS notifications
 */

// Define the structure for parsed transaction data
export interface ParsedTransaction {
  amount: number;
  type: 'income' | 'expense';
  merchant?: string;
  description?: string;
  balance?: number;
  timestamp: string;
  bank: string;
  rawMessage: string;
}

// Define bank-specific parsing rules
const bankParsingRules = {
  CBE: {
    regex: /([\w\s]+) has been (debited|credited) with Birr ([\d,]+\.?\d*) on (\d{2}\/\d{2}\/\d{4}) at (\d{2}:\d{2})\. Available Balance: Birr ([\d,]+\.?\d*)/,
    parse: (match: RegExpMatchArray): ParsedTransaction => {
      const [, merchant, action, amountStr, date, time, balanceStr] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const balance = parseFloat(balanceStr.replace(/,/g, ''));
      const type = action === 'debited' ? 'expense' : 'income';
      const timestamp = new Date(`${date} ${time}`).toISOString();

      return {
        amount,
        type,
        merchant,
        description: `${action === 'debited' ? 'Debit' : 'Credit'} from ${merchant}`,
        balance,
        timestamp,
        bank: 'CBE',
        rawMessage: match.input || '',
      };
    },
  },
  Dashen: {
    regex: /Your account has been (credited|debited) with Birr ([\d,]+\.?\d*) on (\d{2}\/\d{2}\/\d{4}) at (\d{2}:\d{2})\. Available Balance: Birr ([\d,]+\.?\d*)/,
    parse: (match: RegExpMatchArray): ParsedTransaction => {
      const [, action, amountStr, date, time, balanceStr] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const balance = parseFloat(balanceStr.replace(/,/g, ''));
      const type = action === 'debited' ? 'expense' : 'income';
      const timestamp = new Date(`${date} ${time}`).toISOString();

      return {
        amount,
        type,
        description: `${action === 'debited' ? 'Debit' : 'Credit'} transaction`,
        balance,
        timestamp,
        bank: 'Dashen',
        rawMessage: match.input || '',
      };
    },
  },
  Awash: {
    regex: /(IN|OUT) TRANSFER of Birr ([\d,]+\.?\d*) on (\d{2}\/\d{2}\/\d{4}) at (\d{2}:\d{2})\. Balance Birr ([\d,]+\.?\d*)/,
    parse: (match: RegExpMatchArray): ParsedTransaction => {
      const [, direction, amountStr, date, time, balanceStr] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const balance = parseFloat(balanceStr.replace(/,/g, ''));
      const type = direction === 'OUT' ? 'expense' : 'income';
      const timestamp = new Date(`${date} ${time}`).toISOString();

      return {
        amount,
        type,
        description: `${direction} transfer`,
        balance,
        timestamp,
        bank: 'Awash',
        rawMessage: match.input || '',
      };
    },
  },
  // Common international format
  Generic: {
    regex: /([\w\s]+?) (?:has )?(credited|debited|sent|received) you with ([\d,]+\.?\d*) ([A-Z]{3}) on (\d{2}[\/\-]\d{2}[\/\-]\d{2,4}) at (\d{1,2}:\d{2})\. Available balance: ([\d,]+\.?\d*) \2/,
    parse: (match: RegExpMatchArray): ParsedTransaction => {
      const [, merchant, action, amountStr, currency, date, time, balanceStr] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const balance = parseFloat(balanceStr.replace(/,/g, ''));
      const type = ['debited', 'sent'].includes(action.toLowerCase()) ? 'expense' : 'income';
      const timestamp = new Date(`${date} ${time}`).toISOString();

      return {
        amount,
        type,
        merchant,
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} from ${merchant}`,
        balance,
        timestamp,
        bank: 'Generic',
        rawMessage: match.input || '',
      };
    },
  },
  // Ethiopian banks format
  CommercialBankOfEthiopia: {
    regex: /Your account .* has been (debited|credited) with Birr ([\d,]+\.?\d*) on (\d{2}\/\d{2}\/\d{4}) at (\d{2}:\d{2})\. Available Balance: Birr ([\d,]+\.?\d*)/,
    parse: (match: RegExpMatchArray): ParsedTransaction => {
      const [, action, amountStr, date, time, balanceStr] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const balance = parseFloat(balanceStr.replace(/,/g, ''));
      const type = action === 'debited' ? 'expense' : 'income';
      const timestamp = new Date(`${date} ${time}`).toISOString();

      return {
        amount,
        type,
        description: `${action === 'debited' ? 'Debit' : 'Credit'} transaction`,
        balance,
        timestamp,
        bank: 'Commercial Bank of Ethiopia',
        rawMessage: match.input || '',
      };
    },
  },
  // Add more banks as needed
};

/**
 * Parse an SMS message to extract transaction information
 * @param smsMessage The raw SMS message text
 * @returns Parsed transaction data or null if the message doesn't match any known format
 */
export const parseSmsMessage = (smsMessage: string): ParsedTransaction | null => {
  // Normalize the SMS message by converting to uppercase and removing extra spaces
  const normalizedMessage = smsMessage.toUpperCase().replace(/\s+/g, ' ').trim();

  // Check each bank's parsing rules
  for (const [bank, rule] of Object.entries(bankParsingRules)) {
    const match = normalizedMessage.match(rule.regex);
    if (match) {
      return rule.parse(match);
    }
  }

  // If no known format matched, return null
  return null;
};

/**
 * Detect if an SMS is a bank transaction notification
 * @param smsMessage The raw SMS message text
 * @returns True if the SMS appears to be a bank transaction notification
 */
export const isBankSms = (smsMessage: string): boolean => {
  const normalizedMessage = smsMessage.toUpperCase();

  // Look for keywords that indicate a bank transaction
  const bankKeywords = [
    'BIRR', 'BALANCE', 'DEBITED', 'CREDITED', 'TRANSFER', 'TRANSACTION',
    'ACCOUNT', 'AVAILABLE BALANCE', 'AMOUNT', 'WITHDRAWAL', 'DEPOSIT'
  ];

  return bankKeywords.some(keyword => normalizedMessage.includes(keyword));
};

/**
 * Validate if a parsed transaction is likely legitimate
 * @param transaction The parsed transaction data
 * @returns True if the transaction appears valid
 */
export const validateParsedTransaction = (transaction: ParsedTransaction): boolean => {
  // Basic validation checks
  if (isNaN(transaction.amount) || transaction.amount <= 0) {
    return false;
  }

  if (!['income', 'expense'].includes(transaction.type)) {
    return false;
  }

  if (isNaN(new Date(transaction.timestamp).getTime())) {
    return false;
  }

  // Check if the bank is recognized
  const recognizedBanks = Object.keys(bankParsingRules);
  if (!recognizedBanks.includes(transaction.bank)) {
    return false;
  }

  return true;
};

/**
 * Remove duplicate transactions based on amount, timestamp, and description
 * @param transactions Array of parsed transactions
 * @returns Array of unique transactions
 */
export const removeDuplicateTransactions = (transactions: ParsedTransaction[]): ParsedTransaction[] => {
  const seen = new Set<string>();
  const uniqueTransactions: ParsedTransaction[] = [];

  for (const transaction of transactions) {
    // Create a unique key based on amount, timestamp, and description
    const key = `${transaction.amount}-${transaction.timestamp}-${transaction.description || ''}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueTransactions.push(transaction);
    }
  }

  return uniqueTransactions;
};