import React from 'react';
import { Tv } from 'lucide-react';
import { Transaction, Subscription, UserProfile, BudgetConfig } from '../types';
import { CATEGORIES } from '../data/categories';

interface HomeViewProps {
  user: UserProfile;
  budget: BudgetConfig;
  transactions: Transaction[];
  subscriptions: Subscription[];
  onOpenAddModal: () => void;
  onNavigateToSubs: () => void;
  onNavigateToHealth: () => void;
  onNavigateToRewards: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  budget,
  transactions,
  subscriptions,
  onOpenAddModal,
  onNavigateToSubs,
  onNavigateToHealth,
  onNavigateToRewards,
}) => {
  // Compute totals
  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const activeSubs = subscriptions.filter((s) => s.active);
  const subSpent = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);

  const combinedTotal = totalSpent + subSpent;
  const overallBudget = budget.overall || 10000;
  const percentage = Math.min(
    100,
    Math.round((combinedTotal / overallBudget) * 100)
  );

  const yearlySubTotal = activeSubs.reduce(
    (acc, curr) => acc + curr.yearlyAmount,
    0
  );

  const daysInMonth = 31;
  const currentDay = new Date().getDate();
  const avgPerDay = Math.round(combinedTotal / (currentDay || 1));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-28">
      {/* Laptop & Desktop Multi-column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Column (8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* 1. MONTHLY SNAPSHOT CARD */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-50/90 via-rose-50/80 to-indigo-50/90 border border-white/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
                  MONTHLY SNAPSHOT
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    ₹{combinedTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    / ₹{overallBudget.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  ₹{totalSpent} spent · ₹{subSpent} subs · avg ₹{avgPerDay}/day
                </p>
              </div>

              {/* Circular Progress Meter with red dot */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#f43f5e"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="201"
                    strokeDashoffset={201 - (201 * percentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-extrabold text-rose-600">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. RECURRING SUBSCRIPTIONS CARD */}
          <div
            onClick={onNavigateToSubs}
            className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border border-indigo-100/60 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:scale-105 transition">
                <Tv className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Recurring subscriptions
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeSubs.length} active · ₹
                  {yearlySubTotal.toLocaleString('en-IN')}/yr
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{subSpent}
              </span>
              <span className="text-xs font-medium text-slate-400">/mo</span>
            </div>
          </div>

          {/* 3. BOTTOM GRID CARDS (Health Score & Rewards) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Health Score Card */}
            <div
              onClick={onNavigateToHealth}
              className="bg-[#e6f4ea] border border-emerald-200/60 rounded-3xl p-5 cursor-pointer hover:shadow-md transition"
            >
              <span className="text-2xl mb-1 block">💪</span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Health Score</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {user.healthScore}/100 · Excellent
              </p>
            </div>

            {/* Rewards Card */}
            <div
              onClick={onNavigateToRewards}
              className="bg-[#f3e8ff] border border-purple-200/60 rounded-3xl p-5 cursor-pointer hover:shadow-md transition"
            >
              <span className="text-2xl mb-1 block">🏆</span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Rewards</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {user.rewardsPoints} pts · {user.streakDays}d streak
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: RECENT TRANSACTIONS SECTION (5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Transactions
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {transactions.length} this month
            </span>
          </div>

          {transactions.length === 0 ? (
            /* Empty Inset Container */
            <div className="bg-slate-100/60 border border-slate-200/50 rounded-3xl p-10 text-center shadow-inner">
              <p className="text-sm font-semibold text-slate-500 mb-1">
                No expenses yet.
              </p>
              <p className="text-xs text-slate-400">
                Tap <span className="font-bold text-indigo-600">+</span> to add
                your first one.
              </p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-3 shadow-sm space-y-1.5 max-h-[500px] overflow-y-auto no-scrollbar">
              {transactions.map((tx) => {
                const catInfo = CATEGORIES.find((c) => c.name === tx.category);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          catInfo?.bgColor || 'bg-slate-100'
                        } flex items-center justify-center text-lg shrink-0`}
                      >
                        {catInfo?.emoji || '💰'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {tx.merchant || tx.category}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(tx.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          {tx.note && `· ${tx.note}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm shrink-0 ml-2">
                      -₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
