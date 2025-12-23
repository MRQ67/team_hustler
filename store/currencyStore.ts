import { create } from 'zustand';

interface CurrencyState {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  getCurrencySymbol: () => string;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ETB: 'Br',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  // Add more currencies as needed
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  selectedCurrency: 'USD',
  
  setSelectedCurrency: (currency: string) => set({ selectedCurrency: currency }),
  
  getCurrencySymbol: () => {
    return currencySymbols[get().selectedCurrency] || '$';
  },
}));