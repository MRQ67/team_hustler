# Finance Tracker - Gemini Context

## Project Overview

**Finance Tracker** is a cross-platform mobile application built with **Expo (React Native)** and **Supabase**. It uses an **account-based financial model** to track income, expenses, and transfers across multiple accounts (Cash, Bank, Mobile Money, etc.).

### Key Technologies

*   **Frontend:** React Native (Expo SDK 52+), TypeScript
*   **Styling:** NativeWind (Tailwind CSS for React Native)
*   **Routing:** Expo Router (File-based routing)
*   **State Management:** Zustand (Client state), Supabase Client (Server state)
*   **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
*   **Charts:** React Native Chart Kit (Pie/Bar charts)
*   **Special Features:** SMS Parsing for automatic transaction tracking (Android only, via `@maniac-tech/react-native-expo-read-sms`)

## Architecture & Data Model

The app follows an **Account-Based Model**:
*   **Accounts:** Users have multiple accounts (e.g., "Main Checking", "Cash Wallet").
*   **Transactions:** Money moves *into* (Income), *out of* (Expense), or *between* (Transfer) these accounts.
*   **Balances:** Calculated dynamically from the transaction history and starting balances.

### Database Schema (Supabase)
*   `profiles`: Extended user data.
*   `accounts`: Stores account details (name, type, currency, balance).
*   `categories`: Income/Expense categories.
*   `transactions`: The core ledger of financial actions.
*   `transfers`: Links two accounts for money movement.
*   `budgets`: Monthly spending limits per category.
*   `savings_goals`: Progress tracking for specific financial goals.

**Security:** All tables have Row Level Security (RLS) enabled. Users can only access their own data.

## Building and Running

### Prerequisites
*   Node.js & npm/yarn
*   Expo Go app on your physical device OR Android/iOS Emulator
*   Supabase project credentials in `.env` (or `app.json` / `eas.json`)

### Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```

*   **Start Development Server:**
    ```bash
    npm start
    # OR
    npx expo start
    ```
    *   Press `a` for Android Emulator
    *   Press `i` for iOS Simulator
    *   Scan QR code with Expo Go for physical device

*   **Run on Web:**
    ```bash
    npm run web
    ```

*   **Reset Project (Clear `app/` folder):**
    ```bash
    npm run reset-project
    ```

## Development Conventions

### File Structure
*   `app/`: Main application code (Expo Router).
    *   `_layout.tsx`: Global providers (Auth, Theme).
    *   `(tabs)/`: Main tab navigation.
    *   `auth/`: Authentication screens (Login, Signup).
*   `components/`: Reusable UI components.
*   `store/`: Zustand stores (e.g., `authStore.ts`).
*   `utils/`: Helper functions and clients (e.g., `supabase.js`).
*   `providers/`: React Context providers.
*   `Migration/`: SQL files for Supabase schema management.

### Styling (Glassmorphism)
The project aims for a **Glassmorphism** aesthetic.
*   **Primary Color:** `#D34E4E`
*   **Secondary Color:** `#F9E7B2`
*   **Font:** DM Sans
*   **Utilities:** Use `expo-blur` and semi-transparent backgrounds with white borders to achieve the glass effect. Avoid heavy gradients on cards; prefer subtle transparency.

### State Management
*   Use **Zustand** for global client state (e.g., user session, theme preferences).
*   Use **React Query** (if added) or direct Supabase hooks for data fetching to ensure freshness.

### Database Changes
*   Always create a new SQL file in `Migration/` for schema changes.
*   Apply changes via the Supabase Dashboard or CLI.
*   Update the `types` interfaces to reflect schema changes.

## Current Status & Roadmap
*   **Status:** Supabase backend is fully set up. Basic auth flow is implemented.
*   **Next Steps:**
    1.  Implement UI components matching the Glassmorphism designs.
    2.  Connect UI to Supabase data (Accounts, Transactions).
    3.  Implement SMS parsing (Android).
