import React, { useState } from 'react';
import { X, Trophy, Flame, Gift, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardsPoints: number;
  streakDays: number;
  onClaimPoints: (amount: number) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  rewardsPoints,
  streakDays,
  onClaimPoints,
}) => {
  const [claimedToday, setClaimedToday] = useState(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    if (claimedToday) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClaimPoints(50);
    setClaimedToday(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Tracksy Rewards
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Gamified Savings & Smart Streaks
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

        {/* Stats banner */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl text-center">
            <Trophy className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-slate-900 block">
              {rewardsPoints}
            </span>
            <span className="text-xs font-semibold text-amber-800">
              Reward Points
            </span>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200/60 rounded-2xl text-center">
            <Flame className="w-6 h-6 text-rose-500 mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-slate-900 block">
              {streakDays} Days
            </span>
            <span className="text-xs font-semibold text-rose-800">
              Tracking Streak
            </span>
          </div>
        </div>

        {/* Daily Claim Box */}
        <div className="p-4 bg-purple-50 border border-purple-200/60 rounded-2xl space-y-2 text-center">
          <Gift className="w-8 h-8 text-purple-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">Daily Check-in Bonus</h3>
          <p className="text-xs text-slate-600">
            Log your daily expenses to maintain your streak and earn 50 pts!
          </p>
          <button
            onClick={handleClaim}
            disabled={claimedToday}
            className={`w-full py-2.5 rounded-xl font-bold text-xs shadow transition ${
              claimedToday
                ? 'bg-emerald-500 text-white cursor-default'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {claimedToday ? (
              <span className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Claimed Today (+50 pts)
              </span>
            ) : (
              'Claim 50 Bonus Points'
            )}
          </button>
        </div>

        {/* Achievements list */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Badges & Milestones
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-bold text-xs text-slate-800">
                    Budget Master
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Keep expenses under monthly budget
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Unlocked</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="font-bold text-xs text-slate-800">
                    AI Power User
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Generate 5 AI Insights
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
