# Finance Tracker - Cross-Platform Mobile Application

A comprehensive cross-platform mobile finance tracking application built with Expo (React Native) and TypeScript. The app follows an account-based financial model where users can track income, expenses, and transfers across multiple accounts, with additional features like budgeting, analytics, and goal tracking.

## 🚀 Features

- **Multi-Account Management**: Track finances across different account types (Cash, Bank, Mobile Money, Card, Savings)
- **Transaction Tracking**: Record income, expenses, and transfers between accounts
- **Category System**: Categorize transactions for better financial analysis
- **Analytics & Visualization**: Monthly expense breakdowns, income vs expense comparisons, and account balance charts
- **Budgeting**: Set monthly budgets per category with alerts
- **Savings Goals**: Create and track financial goals with progress indicators
- **SMS Parsing (Android)**: Automatic transaction tracking through bank SMS notifications
- **Offline Support**: View and add transactions even when offline
- **Cross-Platform**: Works on iOS, Android, and Web
- **Dark/Light Mode**: Adaptive UI based on system preferences

## 🛠️ Tech Stack

### Frontend
- **Framework**: Expo (React Native) with TypeScript
- **Routing**: Expo Router with file-based routing
- **UI Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand for client-side state and Supabase client for server state
- **Charts**: react-native-chart-kit for data visualization
- **Offline Support**: Expo SQLite for caching and offline transactions

### Backend
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth system
- **Storage**: Supabase Storage for receipts and icons

## 📋 Prerequisites

- Node.js (recommended version compatible with Expo)
- npm or yarn package manager
- Android SDK (for Android development)
- Xcode (for iOS development)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd team_hustler
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the development server

```bash
npx expo start
```

### 5. Platform-specific commands

- For Android: `npm run android`
- For iOS: `npm run ios`
- For Web: `npm run web`

## 📁 Project Structure

```
team_hustler/
├── app/                    # File-based routing structure
│   ├── _layout.tsx         # Root layout component
│   └── index.tsx           # Main home screen
├── assets/                 # Static assets (images, icons)
├── hooks/                  # Custom React hooks
├── providers/              # Context providers (Auth, Theme, etc.)
├── store/                  # Zustand stores
├── utils/                  # Utility functions
├── package.json            # Project dependencies and scripts
├── app.json                # Expo app configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🏗️ Architecture

### Account-Based Financial Model

Instead of simple income/expense entries, the app uses an **Account-Based Model**, similar to real banking and wallet systems. All money movements happen through accounts.

- Users create accounts, and transactions either **add to**, **subtract from**, or **transfer between** those accounts
- This model allows multiple accounts per user, accurate balances, realistic financial tracking, and easy expansion for budgets and savings

### Transaction Types

1. **Income**: Adds money to a selected account
2. **Expense**: Subtracts money from a selected account
3. **Transfer**: Moves money between two accounts

### SMS Parsing (Android Only)

For Android users, the app automatically tracks transactions by parsing bank SMS notifications:
- Automatic parsing of bank SMS notifications on Android
- Support for major local banks (CBE, Dashen, Awash, etc.)
- Transaction type detection (income/expense)
- Amount and balance extraction
- Merchant identification
- Duplicate transaction prevention
- User confirmation for parsed transactions

## 📊 Analytics & Visualization

The app provides multiple visualization options for financial data:

- **Pie Charts**: Monthly expense breakdown by category (maximum 5-6 categories for clarity)
- **Bar Charts**: Monthly income vs expenses, account balance comparison, spending per category

## 🔐 Security & Data Protection

- Row Level Security (RLS) on all database tables
- App-level authentication checks
- Secure token storage using Expo SecureStore
- Optional app lock (PIN/biometric) for additional security
- SMS permissions handled with user consent on Android

## 🚀 Deployment

### Expo EAS Build

To create production builds:

```bash
# Install EAS CLI
npm install -g @expo/cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have questions or need help, please open an issue in the repository.
