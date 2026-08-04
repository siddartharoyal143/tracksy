import { ExpenseCategory } from '../types';

export interface CategoryInfo {
  name: ExpenseCategory;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Food',
    emoji: '🍕',
    bgColor: 'bg-[#fff3d6]',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-300',
  },
  {
    name: 'Transport',
    emoji: '🚗',
    bgColor: 'bg-[#ffe4e6]',
    textColor: 'text-rose-900',
    borderColor: 'border-rose-300',
  },
  {
    name: 'Shopping',
    emoji: '🛍️',
    bgColor: 'bg-[#f3e8ff]',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-300',
  },
  {
    name: 'Bills',
    emoji: '📑',
    bgColor: 'bg-[#e0f2fe]',
    textColor: 'text-sky-900',
    borderColor: 'border-sky-300',
  },
  {
    name: 'Entertainment',
    emoji: '🎬',
    bgColor: 'bg-[#d1fae5]',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-300',
  },
  {
    name: 'Health',
    emoji: '💊',
    bgColor: 'bg-[#ffedd5]',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-300',
  },
  {
    name: 'Travel',
    emoji: '✈️',
    bgColor: 'bg-[#dbeafe]',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-300',
  },
  {
    name: 'Other',
    emoji: '💰',
    bgColor: 'bg-[#f1f5f9]',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
  },
];
