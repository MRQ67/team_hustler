# 📲 SMS-Based Expense Tracking (Expo + Android)

## Overview
This document describes how to implement **automatic expense tracking** in an **Expo (React Native)** mobile app by reading **bank SMS messages** on Android using:

**Library:** `@maniac-tech/react-native-expo-read-sms`

The system listens for incoming SMS, parses bank transaction messages, and converts them into structured expense records inside the app.

> ⚠️ Android only.  
> ❌ Expo Go not supported.  
> ✅ Requires EAS Dev Build.

---

## 🎯 Goals
- Read incoming bank SMS messages
- Detect transaction-related SMS
- Parse amount, balance, merchant, and transaction type
- Normalize data into a unified transaction schema
- Automatically add expenses/income to the tracker

---

## 🧱 Tech Stack
- Expo (Managed Workflow)
- EAS Dev Build
- React Native
- Android
- Local storage (SQLite / MMKV / AsyncStorage)

---

## 🔐 Permissions Required
The app **must request**:
- `READ_SMS`
- `RECEIVE_SMS`

Handled via:
```ts
requestReadSMSPermission()
🏗️ Architecture
text
Copy code
Incoming SMS
     ↓
SMS Listener (expo-read-sms)
     ↓
Bank SMS Detector
     ↓
Bank-specific Parser (Regex)
     ↓
Normalized Transaction Object
     ↓
Expense Tracker Storage
📦 Installation
bash
Copy code
npm install @maniac-tech/react-native-expo-read-sms
Then create an EAS dev build:

bash
Copy code
npx expo prebuild
npx expo run:android
📡 SMS Listener Implementation
Permission Handling
ts
Copy code
import {
  checkIfHasSMSPermission,
  requestReadSMSPermission
} from "@maniac-tech/react-native-expo-read-sms";

const ensureSMSPermission = async () => {
  const status = await checkIfHasSMSPermission();
  if (!status.hasReadSmsPermission || !status.hasReceiveSmsPermission) {
    return await requestReadSMSPermission();
  }
  return true;
};
Start Listening for SMS
ts
Copy code
import { startReadSMS } from "@maniac-tech/react-native-expo-read-sms";

const startSMSListener = () => {
  startReadSMS(
    (sms) => {
      const [sender, body] = sms;
      handleIncomingSMS(sender, body);
    },
    (error) => console.error("SMS Error:", error)
  );
};
🧠 Bank SMS Detection
ts
Copy code
const BANK_SENDERS = ["CBE", "Dashen", "Awash", "BOA"];

const isBankSMS = (sender: string, message: string) => {
  return BANK_SENDERS.some(bank =>
    sender.toUpperCase().includes(bank) ||
    message.toUpperCase().includes(bank)
  );
};
🧾 Transaction Normalization Schema
ts
Copy code
type Transaction = {
  id: string;
  bank: string;
  type: "expense" | "income";
  amount: number;
  balance?: number;
  merchant?: string;
  timestamp: Date;
  rawSMS: string;
};
🧩 Bank SMS Parsing (Regex-Based)
Example: CBE SMS
text
Copy code
CBE: You spent 1,200.00 ETB at Shoa Supermarket.
Bal: 5,430.50 ETB
Parser
ts
Copy code
const parseCBESMS = (message: string): Transaction | null => {
  const amountMatch = message.match(/spent\s([\d,]+\.\d+)/i);
  const balanceMatch = message.match(/Bal:\s([\d,]+\.\d+)/i);
  const merchantMatch = message.match(/at\s(.+?)\./i);

  if (!amountMatch) return null;

  return {
    id: crypto.randomUUID(),
    bank: "CBE",
    type: "expense",
    amount: parseFloat(amountMatch[1].replace(/,/g, "")),
    balance: balanceMatch
      ? parseFloat(balanceMatch[1].replace(/,/g, ""))
      : undefined,
    merchant: merchantMatch?.[1],
    timestamp: new Date(),
    rawSMS: message
  };
};
🧠 Central Parser Dispatcher
ts
Copy code
const parseBankSMS = (sender: string, message: string) => {
  if (sender.includes("CBE")) return parseCBESMS(message);
  // Add Dashen, Awash, BOA parsers here
  return null;
};
💾 Saving to Expense Tracker
ts
Copy code
const handleIncomingSMS = (sender: string, message: string) => {
  if (!isBankSMS(sender, message)) return;

  const transaction = parseBankSMS(sender, message);
  if (!transaction) return;

  saveTransaction(transaction);
};
🛑 Limitations & Warnings
❌ Not allowed on Google Play without special approval

⚠️ SMS permission is considered high-risk

✅ Suitable for:

University projects

Internal tools

APK distribution

🚫 iOS does NOT support SMS reading

🧠 Recommended Enhancements
Toggle: Enable/Disable SMS auto-tracking

Bank selection settings

Manual review before saving transaction

Duplicate detection

Offline-first storage
