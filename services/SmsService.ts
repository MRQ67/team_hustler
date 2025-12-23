import { parseSmsMessage, isBankSms, validateParsedTransaction, ParsedTransaction } from '../utils/smsParser';
import { supabase } from '../utils/supabase';
import { Alert } from 'react-native';

// Interface for SMS data
export interface SmsData {
  _id: string;
  originatingAddress: string;
  body: string;
  date: number; // Unix timestamp
  read: number; // 0 = unread, 1 = read
}

/**
 * Service for handling SMS parsing and integration with the app's transaction system
 */
class SmsService {
  /**
   * Request SMS permissions on Android
   * @returns Promise<boolean> indicating if permissions were granted
   */
  async requestSmsPermissions(): Promise<boolean> {
    // This is a placeholder for the actual permission request
    // In a real implementation, you'd use the react-native-permissions library
    // For now, we'll just return true for simulation purposes
    console.log('Requesting SMS permissions...');
    return true;
  }

  /**
   * Read recent SMS messages
   * @returns Promise<SmsData[]> array of SMS messages
   */
  async readSmsMessages(): Promise<SmsData[]> {
    // Import the SMS reading functionality
    try {
      // Import the SMS reading library
      const { readSMS } = await import('@maniac-tech/react-native-expo-read-sms');
      
      // Read SMS messages with the following criteria:
      // - Only from the last 7 days
      // - Only bank-related messages
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
      
      // Read SMS messages
      const smsList: SmsData[] = await readSMS({
        filter: {
          box: 'inbox',
          maxCount: 100, // Limit to 100 messages to prevent performance issues
          // Filter for messages from the last 7 days
          date_from: sevenDaysAgo,
        },
      });

      // Filter to only include bank-related messages
      const bankSmsList = smsList.filter(sms => isBankSms(sms.body));
      
      console.log(`Found ${bankSmsList.length} bank-related SMS messages`);
      return bankSmsList;
    } catch (error) {
      console.error('Error reading SMS messages:', error);
      Alert.alert('Permission Error', 'Could not read SMS messages. Please grant SMS permissions to the app.');
      return [];
    }
  }

  /**
   * Process SMS messages to extract transaction data
   * @param smsMessages Array of SMS messages to process
   * @returns Promise<ParsedTransaction[]> array of parsed transactions
   */
  async processSmsMessages(smsMessages: SmsData[]): Promise<ParsedTransaction[]> {
    const parsedTransactions: ParsedTransaction[] = [];
    
    for (const sms of smsMessages) {
      // Check if the SMS is a bank transaction notification
      if (isBankSms(sms.body)) {
        // Attempt to parse the SMS
        const parsedTransaction = parseSmsMessage(sms.body);
        
        if (parsedTransaction) {
          // Validate the parsed transaction
          if (validateParsedTransaction(parsedTransaction)) {
            // Add the date from the SMS
            parsedTransaction.timestamp = new Date(sms.date).toISOString();
            parsedTransactions.push(parsedTransaction);
          } else {
            console.warn('Invalid parsed transaction:', parsedTransaction);
          }
        }
      }
    }
    
    return parsedTransactions;
  }

  /**
   * Save parsed transactions to the database
   * @param transactions Array of parsed transactions to save
   * @param userId The ID of the user to associate the transactions with
   * @returns Promise<boolean> indicating success
   */
  async saveTransactions(transactions: ParsedTransaction[], userId: string): Promise<boolean> {
    try {
      // Prepare transactions for insertion
      const transactionsToInsert = transactions.map(transaction => ({
        user_id: userId,
        account_id: null, // Will need to be associated with an account later
        category_id: null, // Will need to be categorized later
        transaction_type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || `SMS-parsed transaction from ${transaction.bank}`,
        notes: `Parsed from SMS: ${transaction.rawMessage}`,
        date: transaction.timestamp,
      }));

      // Insert transactions into the database
      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert);

      if (error) {
        console.error('Error saving transactions:', error);
        return false;
      }

      console.log(`Successfully saved ${transactionsToInsert.length} transactions from SMS`);
      return true;
    } catch (error) {
      console.error('Error in saveTransactions:', error);
      return false;
    }
  }

  /**
   * Main method to process SMS messages and save transactions
   * @returns Promise<boolean> indicating success
   */
  async processAndSaveSmsTransactions(): Promise<boolean> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      // Request permissions
      const permissionsGranted = await this.requestSmsPermissions();
      if (!permissionsGranted) {
        console.error('SMS permissions not granted');
        return false;
      }

      // Read SMS messages
      const smsMessages = await this.readSmsMessages();
      
      // Process SMS messages to extract transactions
      const parsedTransactions = await this.processSmsMessages(smsMessages);
      
      // Save transactions to the database
      const saveSuccess = await this.saveTransactions(parsedTransactions, user.id);
      
      return saveSuccess;
    } catch (error) {
      console.error('Error in processAndSaveSmsTransactions:', error);
      return false;
    }
  }

  /**
   * Check for new SMS transactions periodically
   * This method would typically be called by a background task
   */
  async checkForNewSmsTransactions(): Promise<void> {
    console.log('Checking for new SMS transactions...');
    await this.processAndSaveSmsTransactions();
  }
}

// Export a singleton instance of the SMS service
export const smsService = new SmsService();

// Export the class itself for testing purposes
export default SmsService;