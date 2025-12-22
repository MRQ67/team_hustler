# Finance Tracker – Core Architecture, Account Model & Tech Stack

## Backend as a Service (BaaS)

We will use **Supabase** as the Backend as a Service for this project.

Supabase will handle:
- **Authentication** (user sign up, login, sessions)
- **Database** (PostgreSQL for structured financial data)
- **Row Level Security (RLS)** to ensure users only access their own data
- **Storage** (icons, optional receipts, backups)

This choice ensures strong data integrity, security, and scalability, which are critical for a finance-related application.

---

## Core Financial Model: Account-Based Tracking

Instead of simple income/expense entries, the app uses an **Account-Based Model**, similar to real banking and wallet systems.

All money movements happen **through accounts**.

### Key Idea
> Users create accounts, and transactions either **add to**, **subtract from**, or **transfer between** those accounts.

This model allows:
- Multiple accounts per user
- Accurate balances
- Realistic financial tracking
- Easy expansion (budgets, savings, transfers)

---

## Accounts

A user can have **multiple accounts**.

### Example Accounts
- Cash
- Bank Account
- Mobile Money
- Card
- Savings

### Account Properties
Each account includes:
- Account name (e.g. "Cash", "CBE Bank")
- Account type
- Starting balance
- Currency
- Icon / color (UI)
- Status (active / archived)

### All Accounts View
The app provides an **All Accounts** view that:
- Shows the total balance across all active accounts
- Lists individual account balances
- Acts as the user’s overall financial snapshot

---

## Transactions

Every financial action is stored as a **transaction**.

### Transaction Types

#### 1. Income
- Adds money to a selected account
- Example: Salary added to Bank account

#### 2. Expense
- Subtracts money from a selected account
- Example: Food paid from Cash account

#### 3. Transfer
- Moves money between two accounts
- Example: Bank → Wallet

Transfers affect **two accounts**:
- Source account decreases
- Destination account increases

---

## Categories

Categories are assigned to **transactions**, not accounts.

### Category Types
- Income categories (Salary, Gift, Bonus)
- Expense categories (Food, Transport, Rent, Bills)

> Transfers typically do not require categories.

---

## Balance Logic

- Account balance is derived from:
  - Starting balance
  - Plus all income transactions
  - Minus all expense transactions
  - Plus/minus transfers

For performance reasons, a current balance may be stored, but the system must always be able to **recalculate balances from transactions** to ensure accuracy.

---

## Data Visualization Strategy (Charts)

As software developers, the goal of data visualization is **clarity, accuracy, and decision support**.

### Chosen Approach: Use Both Pie and Bar Charts

### Pie Charts – Composition & Distribution
Used for:
- Monthly expense breakdown by category

Rules:
- Maximum 5–6 categories
- Only for expense composition

### Bar Charts – Comparison & Analysis
Used for:
- Monthly income vs expenses
- Account balance comparison
- Spending per category

Reasoning:
- More precise
- Supports comparisons and trends
- Better for financial decision-making

### Professional Design Principle
> Pie charts for insight, bar charts for decisions.

---

## Feature Set Overview (Necessary Features)

This section defines the **complete and necessary feature set** for the Finance Tracker application.

### 1. Authentication & User Management
- User sign up and login
- Secure session management
- Logout
- Password reset
- User profile linked to authentication ID
- Enforced using Supabase RLS

### 2. Account Management
- Create multiple accounts per user
- Edit account details
- Archive accounts
- Set starting balance
- View individual and total balances

### 3. Transaction Management
- Add income, expense, transfer transactions
- Edit/delete transactions
- Notes and timestamps
- Balance effects: income +, expense -, transfers ±

### 4. Categories
- Predefined and custom categories
- Linked to transactions
- Icons and colors

### 5. Balance & Calculation Logic
- Accurate balance per account
- Total balance across all accounts
- Recalculation from transaction history
- Transactions as source of truth

### 6. Analytics & Visualization
- Monthly summary
- Expense breakdown (pie chart)
- Income vs expense (bar chart)
- Account balances (bar chart)

### 7. Budgeting
- Monthly budget per category
- Overall budget optional
- Visual indicators for limits

### 8. Savings & Goals
- Create and track goals
- Assign to accounts
- Progress percentage
- Target amount and deadline

### 9. Filters & Search
- Filter by date, account, category
- Search by transaction note

### 10. Notifications
- Budget limit alerts
- Overspending alerts
- Monthly summaries
- Expo Notifications

### 11. Offline Support
- View cached data offline
- Add transactions offline
- Sync when online

### 12. Security & Data Protection
- RLS on all tables
- App-level auth checks
- Optional app lock (PIN/biometric)

### 13. Data Management
- Cloud storage (Supabase)
- Optional receipt images
- Future CSV export

### 14. App Experience (UX)
- Light/dark mode
- Clean UI
- Consistent navigation
- Clear error handling & validation

---

## Tech Stack

### Frontend
- **Expo (React Native)** – Cross-platform mobile framework
- **TypeScript** – Type safety and better DX
- **NativeWind (Tailwind for RN)** – Fast, consistent UI
- **Expo Router** – File-based routing and auth guards

### State Management
- **Zustand** – Simple client state
- **Supabase Client** – Server state and realtime

### Charts & Analytics
- **Victory Native** or **react-native-chart-kit**
- Pie charts for expense composition
- Bar charts for comparison

### Backend
- **Supabase** – Auth, PostgreSQL, RLS, Storage, Edge Functions
- **PostgreSQL** – Transactions, constraints, summaries
- **RLS** – Secure user data access

### Offline & Storage
- **Expo SQLite** – Cache offline transactions
- **Expo SecureStore** – Tokens and sensitive data

### Notifications
- **Expo Notifications** – Budget and monthly alerts

### Testing
- **Jest** – Unit tests
- **React Native Testing Library** – UI tests

### Deployment
- **Expo EAS Build** – Android APK/AAB, iOS build
- **Supabase Hosted Backend**

### Architecture Diagram
```txt
Expo (React Native)
 ├── Expo Router
 ├── NativeWind (UI)
 ├── Zustand (State)
 ├── Charts
 └── SQLite (Offline)
        ↓
Supabase
 ├── Auth
 ├── PostgreSQL
 ├── RLS
 ├── Storage
 └── Edge Functions
```

---

This account-based approach forms the foundation of the Finance Tracker application.

