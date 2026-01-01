
import React from 'react';
import { 
  Utensils, 
  Home, 
  Wallet, 
  Car, 
  Film, 
  ShoppingBag, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import { Category, Transaction, TransactionType } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.FOOD]: <Utensils className="w-4 h-4" />,
  [Category.RENT]: <Home className="w-4 h-4" />,
  [Category.SALARY]: <Wallet className="w-4 h-4" />,
  [Category.TRANSPORT]: <Car className="w-4 h-4" />,
  [Category.ENTERTAINMENT]: <Film className="w-4 h-4" />,
  [Category.SHOPPING]: <ShoppingBag className="w-4 h-4" />,
  [Category.UTILITIES]: <Zap className="w-4 h-4" />,
  [Category.OTHERS]: <HelpCircle className="w-4 h-4" />,
};

// Fix: Explicitly type INITIAL_TRANSACTIONS as Transaction[] to prevent 'string' type widening and mismatch with TransactionType enum
export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 3500, type: TransactionType.INCOME, category: Category.SALARY, description: 'Monthly Salary', date: '2024-05-01' },
  { id: '2', amount: 1200, type: TransactionType.EXPENSE, category: Category.RENT, description: 'Apartment Rent', date: '2024-05-02' },
  { id: '3', amount: 45.50, type: TransactionType.EXPENSE, category: Category.FOOD, description: 'Grocery Store', date: '2024-05-03' },
  { id: '4', amount: 120, type: TransactionType.EXPENSE, category: Category.TRANSPORT, description: 'Fuel', date: '2024-05-05' },
  { id: '5', amount: 80, type: TransactionType.EXPENSE, category: Category.ENTERTAINMENT, description: 'Movie Night', date: '2024-05-07' },
];
