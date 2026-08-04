import React, { useState } from 'react';
import { X, Tv, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Subscription, ExpenseCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface SubscriptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onAddSub: (sub: Omit<Subscription, 'id' | 'yearlyAmount'>) => void;
  onDeleteSub: (id: string) => void;
  onToggleSub: (id: string) => void;
}

export const SubscriptionsModal: React.FC<SubscriptionsModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onAddSub,
  onDeleteSub,
  onToggleSub,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Entertainment');

  if (!isOpen) return null;

  const activeSubs = subscriptions.filter((s) => s.active);
  const monthlyTotal = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const yearlyTotal = activeSubs.reduce(
    (acc, curr) => acc + curr.yearlyAmount,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddSub({
      name: name.trim(),
      amount: parsedAmount,
      billingCycle: 'monthly',
      active: true,
      category,
      icon: '📺',
    });

    setName('');
    setAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recurring Subscriptions
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                ₹{monthlyTotal}/mo · ₹{yearlyTotal.toLocaleString('en-IN')}/yr
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subscription List */}
        <div className="space-y-2 mb-4">
          {subscriptions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No active subscriptions. Tap "+ Add Subscription" below.
            </p>
          ) : (
            subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  sub.active
                    ? 'bg-slate-50 border-slate-200/80'
                    : 'bg-slate-50/50 border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sub.icon || '📺'}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      ₹{sub.amount}/mo · ₹{sub.yearlyAmount}/yr
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSub(sub.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      sub.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sub.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => onDeleteSub(sub.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Subscription Form / Button */}
        {showAddForm ? (
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-3"
          >
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Add New Subscription
            </h4>
            <input
              type="text"
              required
              placeholder="Name (e.g. Netflix, Spotify)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none"
            />
            <input
              type="number"
              required
              placeholder="Monthly Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none font-bold"
            />
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow"
              >
                Save Subscription
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl flex items-center justify-center gap-1.5 text-xs transition border border-indigo-200/60"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        )}
      </div>
    </div>
  );
};
