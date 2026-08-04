export type TabType = 'home' | 'insights' | 'budget' | 'more' | 'login';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Travel'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: ExpenseCategory;
  merchant?: string;
  note?: string;
  date: string;
  isSubscription?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  icon: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  active: boolean;
  yearlyAmount: number;
  category: ExpenseCategory;
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  avatarUrl?: string;
  healthScore: number;
  rewardsPoints: number;
  streakDays: number;
  isAdmin?: boolean;
  role?: 'admin' | 'user';
}

export interface TrackedUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatarUrl?: string;
  status: 'Active' | 'Suspended' | 'Flagged';
  healthScore: number;
  streakDays: number;
  totalExpenses: number;
  monthlyBudget: number;
  joinDate: string;
  lastActive: string;
  transactionsCount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface BudgetConfig {
  overall: number; // e.g., 10000
  categories: Record<ExpenseCategory, number>;
}

export interface AIInsightData {
  summary: string;
  topCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
    icon: string;
  }>;
  healthScore: number;
  recommendations: string[];
}
