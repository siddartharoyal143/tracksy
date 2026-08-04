import React from 'react';
import { X, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface HealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Financial Health Score
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Real-time liquidity & budget wellness
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

        {/* Big Score Card */}
        <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center shadow-lg space-y-1">
          <span className="text-5xl font-black">{user.healthScore}</span>
          <span className="text-sm font-bold block opacity-90">
            Out of 100 · Excellent Health
          </span>
          <p className="text-xs opacity-80 pt-2 border-t border-white/20">
            Your spending is well within limits and subscription overhead is optimal.
          </p>
        </div>

        {/* Metrics breakdown */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Health Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Budget Adherence
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700">98% (Great)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Subscription Ratio
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-700">Low (₹89/mo)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">
                  Daily Average Spending
                </span>
              </div>
              <span className="text-xs font-bold text-amber-700">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
