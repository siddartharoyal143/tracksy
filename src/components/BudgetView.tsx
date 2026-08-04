import React, { useState } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { BudgetConfig, Transaction, Subscription, ExpenseCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface BudgetViewProps {
  budget: BudgetConfig;
  transactions: Transaction[];
  subscriptions: Subscription[];
  onUpdateBudget: (newBudget: BudgetConfig) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budget,
  transactions,
  subscriptions,
  onUpdateBudget,
}) => {
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [tempOverall, setTempOverall] = useState(String(budget.overall));
  const [tempCatBudgets, setTempCatBudgets] = useState<
    Record<ExpenseCategory, string>
  >({
    Food: String(budget.categories?.Food || 0),
    Transport: String(budget.categories?.Transport || 0),
    Shopping: String(budget.categories?.Shopping || 0),
    Bills: String(budget.categories?.Bills || 0),
    Entertainment: String(budget.categories?.Entertainment || 0),
    Health: String(budget.categories?.Health || 0),
    Travel: String(budget.categories?.Travel || 0),
    Other: String(budget.categories?.Other || 0),
  });

  // Calculate spent amounts
  const activeSubs = subscriptions.filter((s) => s.active);
  const subSpent = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const expSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const combinedSpent = expSpent + subSpent;

  const totalBudget = budget.overall || 10000;
  const remaining = Math.max(0, totalBudget - combinedSpent);
  const percentUsed = Math.min(
    100,
    Math.round((combinedSpent / totalBudget) * 100)
  );

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const overallNum = parseFloat(tempOverall) || 10000;
    const catNums: Record<ExpenseCategory, number> = {} as any;

    Object.entries(tempCatBudgets).forEach(([cat, val]) => {
      catNums[cat as ExpenseCategory] = parseFloat(val as string) || 0;
    });

    onUpdateBudget({
      overall: overallNum,
      categories: catNums,
    });

    setIsSetModalOpen(false);
  };

  const activeCategoryBudgets = Object.entries(budget.categories || {}).filter(
    ([_, val]) => (val as number) > 0
  ) as [ExpenseCategory, number][];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{currentDateStr}</p>
        </div>

        {/* Set Button */}
        <button
          onClick={() => setIsSetModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Set Budget</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Overall Budget Card (Left 5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#fffbeb] border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Overall Budget
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-full">
                {percentUsed}% used
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                ₹{combinedSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                / ₹{totalBudget.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-amber-800/90">
              ₹{expSpent} expenses + ₹{subSpent} subs · ₹
              {remaining.toLocaleString('en-IN')} remaining
            </p>

            {/* Bottom progress bar */}
            <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden relative">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Category Budgets Section (Right 7 cols on lg) */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Category Breakdown</h2>

          {activeCategoryBudgets.length === 0 ? (
            <div className="bg-white/60 border border-slate-200/80 rounded-3xl p-8 text-center">
              <p className="text-sm text-slate-500 font-medium">
                No category budgets set yet. Tap "Set Budget" to allocate targets for Food, Shopping, Bills, etc.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCategoryBudgets.map(([catName, targetVal]) => {
                const catObj = CATEGORIES.find((c) => c.name === catName);

                // Calculate category spent
                const catTxSpent = transactions
                  .filter((t) => t.category === catName)
                  .reduce((a, b) => a + b.amount, 0);

                const catSubSpent = activeSubs
                  .filter((s) => s.category === catName)
                  .reduce((a, b) => a + b.amount, 0);

                const catTotalSpent = catTxSpent + catSubSpent;
                const rawPercent = Math.round((catTotalSpent / (Number(targetVal) || 1)) * 100);
                const catPercent = Math.min(100, rawPercent);
                const isOver80 = rawPercent >= 80;
                const isOver100 = rawPercent >= 100;

                return (
                  <div
                    key={catName}
                    className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl p-4 shadow-sm space-y-2.5 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{catObj?.emoji || '💰'}</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {catName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        ₹{catTotalSpent} / ₹{targetVal}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver100
                            ? 'bg-rose-500'
                            : isOver80
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>{rawPercent}% allocated</span>
                      {isOver100 && (
                        <span className="text-rose-600 flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Over limit!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Set Budget Modal */}
      {isSetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Set Monthly Budget
              </h3>
              <button
                onClick={() => setIsSetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Overall Budget (₹)
                </label>
                <input
                  type="number"
                  required
                  value={tempOverall}
                  onChange={(e) => setTempOverall(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Limits (Optional)
                </label>
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 w-32">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={tempCatBudgets[cat.name] || ''}
                      onChange={(e) =>
                        setTempCatBudgets({
                          ...tempCatBudgets,
                          [cat.name]: e.target.value,
                        })
                      }
                      className="w-32 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-right font-medium"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Save Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
