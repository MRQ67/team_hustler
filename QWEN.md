# Finance Tracker Project - QWEN Context

## Project Overview

This is a cross-platform mobile finance tracking application built with Expo (React Native) and TypeScript. The project follows an account-based financial model where users can track income, expenses, and transfers across multiple accounts. The app is designed to provide comprehensive financial management capabilities with features like budgeting, analytics, and goal tracking.

The project uses Expo's file-based routing system and is configured to work across iOS, Android, and web platforms. It leverages Supabase as a Backend-as-a-Service for authentication, database management, and storage.

## Architecture & Tech Stack

### Frontend
- **Framework**: Expo (React Native) with TypeScript
- **Routing**: Expo Router with file-based routing
- **UI Styling**: NativeWind (Tailwind CSS for React Native) with custom glassmorphism effects
- **State Management**: Zustand for client-side state and Supabase client for server state
- **Charts**: react-native-chart-kit for financial charts
- **Offline Support**: Expo SQLite for caching and offline transactions
- **UI Components**: Custom GlassPane and ScreenWrapper components for glassmorphism effects

### Backend
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth system
- **Storage**: Supabase Storage for receipts and icons

### Key Dependencies
- Expo ecosystem libraries (expo-router, expo-constants, expo-font, etc.)
- React Navigation for routing
- react-native-chart-kit for financial charts
- NativeWind for styling
- zustand for state management
- uuid for unique identifiers
- date-fns for date manipulation
- @expo-google-fonts for custom fonts
- expo-blur for glassmorphism effects
- expo-linear-gradient for visual effects

## Project Structure

```
D:\fintech\
├── app/                    # File-based routing structure
│   ├── (tabs)/            # Main tab navigation
│   │   ├── _layout.tsx    # Tab layout with custom glassmorphism tab bar
│   │   ├── index.tsx      # Home screen with financial overview
│   │   ├── accounts.tsx   # Accounts management screen
│   │   ├── add.tsx        # Add transaction (tab placeholder)
│   │   ├── analytics.tsx  # Analytics and charts screen
│   │   ├── settings.tsx   # Settings screen
│   │   └── transactions.tsx # Transactions list screen
│   ├── auth/              # Authentication screens
│   │   ├── _layout.tsx    # Auth layout
│   │   ├── index.tsx      # Auth entry point
│   │   ├── login.tsx      # Login screen
│   │   ├── sign-up.tsx    # Sign up screen
│   │   └── forgot-password.tsx # Forgot password screen
│   ├── modal/             # Modal screens
│   │   ├── _layout.tsx    # Modal layout
│   │   └── transaction.tsx # Add transaction modal
│   ├── _layout.tsx        # Root layout component
│   └── index.tsx          # Splash/index redirect
├── assets/                # Static assets (images, icons)
├── components/            # Reusable UI components
│   ├── GlassPane.tsx      # Glassmorphism container component
│   └── ScreenWrapper.tsx  # Screen wrapper with background effects
├── designs/               # Design files
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useFinancialData.ts # Financial data fetching hook
├── Migration/             # Database migration files
├── providers/             # React context providers
│   └── AuthProvider.tsx   # Authentication context provider
├── store/                 # State management stores
│   └── authStore.ts       # Authentication state store (Zustand)
├── utils/                 # Utility functions
│   └── supabase.js        # Supabase client configuration
├── package.json           # Project dependencies and scripts
├── app.json               # Expo app configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # NativeWind/Tailwind configuration
├── global.css             # Global CSS styles
├── PLAN.md                # Detailed project architecture plan
└── README.md              # Project documentation
```

## Building and Running

### Prerequisites
- Node.js (recommended version compatible with Expo)
- npm or yarn package manager
- Expo CLI or development build

### Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_KEY=your_supabase_key
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Alternative platform-specific commands:
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

### Development Scripts
- `npm start` or `npm run dev`: Start Expo development server
- `npm run android`: Open in Android emulator/device
- `npm run ios`: Open in iOS simulator/device
- `npm run web`: Open in web browser
- `npm run reset-project`: Reset the project to starter code
- `npm run lint`: Lint the codebase

## Core Features (Implemented)

Based on the PLAN.md document and current implementation, the application includes:

### Account Management
- Multiple account types (Cash, Bank, Mobile Money, Card, Savings)
- Individual and total balance tracking
- Account customization (icons, colors)
- Balance calculation using Supabase RPC functions

### Transaction Management
- Three transaction types: Income, Expense, Transfer
- Categorization of transactions
- Balance calculation logic
- Add transaction modal with keypad interface

### Analytics & Visualization
- Monthly expense breakdown (pie charts)
- Income vs expense comparisons
- Account balance comparisons
- Spending category breakdowns

### UI/UX Features (Newly Implemented)
- Glassmorphism UI design with blur effects
- Custom tab bar with floating "Add" button
- Gradient backgrounds and ambient lighting effects
- Responsive design with NativeWind (Tailwind for React Native)
- Dark theme with custom color palette
- Custom GlassPane component for translucent UI elements
- ScreenWrapper with background effects

### Additional Features
- Budgeting with progress indicators
- Savings goals tracking
- Offline support (planned)
- Secure authentication with Supabase
- SMS parsing for Android (planned)

## Development Conventions

### File-Based Routing
- Uses Expo Router's file-based routing system
- Pages are created by adding files to the `app/` directory
- `_layout.tsx` defines the layout for nested routes
- `(tabs)` directory creates tab-based navigation

### TypeScript Usage
- Strict TypeScript configuration enabled
- Type safety enforced throughout the codebase
- Path aliases configured (`@/*` maps to project root)

### UI/Style Guidelines
- NativeWind (Tailwind CSS for React Native) for styling
- Custom color palette defined in tailwind.config.js
- Glassmorphism effects using expo-blur and custom components
- Consistent typography using Google Fonts (DMSans and Manrope)
- Custom components for reusable UI patterns

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- React Compiler enabled for performance optimization

## Key Configuration Files

### app.json
- Defines app metadata (name, icon, splash screen)
- Configures plugins (expo-router, expo-splash-screen)
- Sets platform-specific configurations
- Enables experimental features (typed routes, React Compiler)

### package.json
- Contains project dependencies and development tools
- Defines npm scripts for common tasks
- Specifies compatibility with Expo SDK version

### tailwind.config.js
- NativeWind preset configuration
- Custom color palette (primary: #D34E4E, accent: #F9E7B2)
- Font family definitions for display and body text

### tsconfig.json
- Extends Expo's base TypeScript configuration
- Enables strict type checking
- Configures path aliases for easier imports

## Project Planning

The detailed architecture and feature specifications are documented in `PLAN.md`, which outlines:
- The account-based financial model
- Database schema and relationships
- Security considerations (RLS, authentication)
- Technical implementation strategy
- UI/UX design principles
- SMS parsing capabilities for Android