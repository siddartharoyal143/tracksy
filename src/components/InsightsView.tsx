import React, { useState } from 'react';
import { RotateCw, Sparkles, TrendingUp, Bot, MessageSquare } from 'lucide-react';
import { Transaction, Subscription, AIInsightData } from '../types';
import { CATEGORIES } from '../data/categories';
import { AIChatBot } from './AIChatBot';

interface InsightsViewProps {
  transactions: Transaction[];
  subscriptions: Subscription[];
  overallBudget: number;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  transactions,
  subscriptions,
  overallBudget,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<AIInsightData | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'bot'>('bot');

  // Compute category breakdown from transactions and active subscriptions
  const activeSubs = subscriptions.filter((s) => s.active);
  const categoryTotals: Record<string, number> = {};

  // Add subscriptions
  activeSubs.forEach((sub) => {
    categoryTotals[sub.category] =
      (categoryTotals[sub.category] || 0) + sub.amount;
  });

  // Add transactions
  transactions.forEach((tx) => {
    categoryTotals[tx.category] =
      (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const grandTotal = Object.values(categoryTotals).reduce(
    (a, b) => a + b,
    0
  );

  const categoryList = Object.entries(categoryTotals)
    .map(([name, amount]) => {
      const catObj = CATEGORIES.find((c) => c.name === name);
      const percentage =
        grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;
      return {
        name,
        amount,
        percentage,
        emoji: catObj?.emoji || '💰',
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenses: transactions,
          subscriptions: activeSubs,
          totalBudget: overallBudget,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight flex items-center gap-2">
            <span>AI Insights & Assistant</span>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Gemini AI
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Smart financial bot & budget analytics
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchAIAnalysis}
          disabled={loading}
          aria-label="Refresh AI Insights"
          className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-white shadow-sm transition active:scale-95"
        >
          <RotateCw
            className={`w-5 h-5 stroke-[1.8] ${loading ? 'animate-spin text-indigo-600' : ''}`}
          />
        </button>
      </div>

      {/* Sub-navigation Switcher for mobile/tablet */}
      <div className="lg:hidden bg-slate-200/60 p-1.5 rounded-2xl flex border border-slate-300/40">
        <button
          type="button"
          onClick={() => setActiveTab('bot')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'bot'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>AI Financial Bot</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'insights'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Overview & Advice</span>
        </button>
      </div>

      {/* Grid Layout: Side-by-side on lg+ screens, Tabbed on smaller screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Chat Bot (7 cols on lg) */}
        <div className={`lg:col-span-7 xl:col-span-7 ${activeTab === 'bot' ? 'block' : 'hidden lg:block'}`}>
          <AIChatBot
            transactions={transactions}
            subscriptions={subscriptions}
            overallBudget={overallBudget}
            categoryTotals={categoryTotals}
            grandTotal={grandTotal}
            isEmbedded={true}
          />
        </div>

        {/* Right Column: Overview & Advice (5 cols on lg) */}
        <div className={`lg:col-span-5 xl:col-span-5 space-y-5 ${activeTab === 'insights' ? 'block' : 'hidden lg:block'}`}>
          {/* 1. Personalized Analysis Card */}
          <div className="bg-indigo-50/70 border border-indigo-100/60 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Personalized AI Analysis</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {aiData?.summary ||
                (grandTotal === 0
                  ? 'Add expenses to unlock personalized AI insights.'
                  : `Based on current spending of ₹${grandTotal}, your projected monthly total is on track. You spend most on your top categories.`)}
            </p>

            {aiData?.recommendations && aiData.recommendations.length > 0 && (
              <div className="pt-3 border-t border-indigo-100/80 space-y-2">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                  Smart Advice
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {aiData.recommendations.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 2. Top Categories Card */}
          <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Top Categories</span>
            </div>

            {categoryList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No category data yet. Add an expense or subscription.
              </div>
            ) : (
              <div className="space-y-3.5">
                {categoryList.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span>
                        ₹{cat.amount.toLocaleString('en-IN')} · {cat.percentage}%
                      </span>
                    </div>
                    {/* Full-width green progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

