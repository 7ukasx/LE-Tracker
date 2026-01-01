
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = 'FOOD',
  RENT = 'RENT',
  SALARY = 'SALARY',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  UTILITIES = 'UTILITIES',
  OTHERS = 'OTHERS'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon?: string;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  dayOfMonth: number;
}

export interface UserProfile {
  name: string;
  currency: string;
  language: 'de' | 'en';
  country: string;
  monthlyGoal: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age?: number;
  tosAccepted?: boolean;
  avatarSeed?: string;
  customAvatar?: string;
  monthlySalary?: number;
  salaryDay?: number;
  recurringTransactions: RecurringTransaction[];
  lastAutoUpdate?: string;
}

export interface UserData {
  transactions: Transaction[];
  budgets: Record<string, number>;
  profile: UserProfile;
  savingGoals: SavingGoal[];
}
