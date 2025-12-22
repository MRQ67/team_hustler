# Finance Tracker Project - QWEN Context

## Project Overview

This is a cross-platform mobile finance tracking application built with Expo (React Native) and TypeScript. The project follows an account-based financial model where users can track income, expenses, and transfers across multiple accounts. The app is designed to provide comprehensive financial management capabilities with features like budgeting, analytics, and goal tracking.

The project uses Expo's file-based routing system and is configured to work across iOS, Android, and web platforms. It leverages Supabase as a Backend-as-a-Service for authentication, database management, and storage.

## Architecture & Tech Stack

### Frontend
- **Framework**: Expo (React Native) with TypeScript
- **Routing**: Expo Router with file-based routing
- **UI Styling**: Likely Tailwind CSS or similar (based on planned architecture)
- **State Management**: Zustand for client-side state and Supabase client for server state
- **Charts**: react-native-chart-kit for data visualization
- **Offline Support**: Expo SQLite for caching and offline transactions

### Backend
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth system
- **Storage**: Supabase Storage for receipts and icons

### Key Dependencies
- Expo ecosystem libraries (expo-router, expo-constants, expo-font, etc.)
- React Navigation for routing
- react-native-chart-kit for financial charts
- zustand for state management
- uuid for unique identifiers
- date-fns for date manipulation

## Project Structure

```
team_hustler/
├── app/                    # File-based routing structure
│   ├── _layout.tsx         # Root layout component
│   └── index.tsx           # Main home screen
├── app-example/            # Original template files
├── assets/                 # Static assets (images, icons)
├── .expo/                  # Expo build artifacts
├── package.json            # Project dependencies and scripts
├── app.json                # Expo app configuration
├── tsconfig.json           # TypeScript configuration
├── PLAN.md                 # Detailed project architecture plan
└── README.md               # Project documentation
```

## Building and Running

### Prerequisites
- Node.js (recommended version compatible with Expo)
- npm or yarn package manager

### Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Alternative platform-specific commands:
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

## Core Features (Planned/Implemented)

Based on the PLAN.md document, the application includes:

### Account Management
- Multiple account types (Cash, Bank, Mobile Money, Card, Savings)
- Individual and total balance tracking
- Account customization (icons, colors)

### Transaction Management
- Three transaction types: Income, Expense, Transfer
- Categorization of transactions
- Balance calculation logic

### Analytics & Visualization
- Monthly expense breakdown (pie charts)
- Income vs expense comparisons (bar charts)
- Account balance comparisons

### Additional Features
- Budgeting with alerts
- Savings goals tracking
- Offline support
- Dark/light mode
- Secure authentication with Supabase

## Development Conventions

### File-Based Routing
- Uses Expo Router's file-based routing system
- Pages are created by adding files to the `app/` directory
- `_layout.tsx` defines the root layout for the app

### TypeScript Usage
- Strict TypeScript configuration enabled
- Type safety enforced throughout the codebase
- Path aliases configured (`@/*` maps to project root)

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