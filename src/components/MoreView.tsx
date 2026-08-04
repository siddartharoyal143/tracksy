import React from 'react';
import {
  Tv,
  Mic,
  Camera,
  Activity,
  Sparkles,
  Trophy,
  Bell,
  Shield,
  LogOut,
  Upload,
} from 'lucide-react';
import { UserProfile, TabType } from '../types';

interface MoreViewProps {
  user: UserProfile;
  onSelectTab: (tab: TabType) => void;
  onOpenSubsModal: () => void;
  onOpenVoiceModal: () => void;
  onOpenReceiptModal: () => void;
  onOpenHealthModal: () => void;
  onOpenRewardsModal: () => void;
  onOpenNotificationsModal: () => void;
  onOpenSecurityModal: () => void;
  onSignOut: () => void;
  onUpdateAvatar: (url: string) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  user,
  onSelectTab,
  onOpenSubsModal,
  onOpenVoiceModal,
  onOpenReceiptModal,
  onOpenHealthModal,
  onOpenRewardsModal,
  onOpenNotificationsModal,
  onOpenSecurityModal,
  onSignOut,
  onUpdateAvatar,
}) => {
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-28">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          Account & Utilities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage profile, subscription trackers, smart scanner & settings</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-indigo-50/70 border border-indigo-100/60 rounded-3xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center font-extrabold text-indigo-700 text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Upload badge overlay */}
            <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition border-2 border-white">
              <Upload className="w-3 h-3" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </label>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{user.name}</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {user.email === 'admi@gmail.com' ? 'Super Admin' : 'Standard Member'}
            </span>
          </div>
        </div>

        {/* Sign Out Button (Desktop position) */}
        <button
          onClick={onSignOut}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200/80 shadow-sm transition active:scale-95 text-xs sm:text-sm"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Grid of Pastel Utility Tiles (2 cols on mobile, 4 cols on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* 1. OTT & Subs (peach/pink tile) */}
        <button
          onClick={onOpenSubsModal}
          className="bg-[#ffe4e6] hover:bg-[#fecdd3] border border-rose-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Tv className="w-5 h-5 text-rose-600 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">OTT & Subs</h3>
            <p className="text-xs text-rose-700/80 font-medium mt-0.5">Recurring tracker</p>
          </div>
        </button>

        {/* 2. Voice Entry (yellowish/orange tile) */}
        <button
          onClick={onOpenVoiceModal}
          className="bg-[#ffedd5] hover:bg-[#fed7aa] border border-orange-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Mic className="w-5 h-5 text-amber-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Voice Entry</h3>
            <p className="text-xs text-amber-800/80 font-medium mt-0.5">AI speech logging</p>
          </div>
        </button>

        {/* 3. Scan Receipt (light blue tile) */}
        <button
          onClick={onOpenReceiptModal}
          className="bg-[#e0f2fe] hover:bg-[#bae6fd] border border-sky-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Camera className="w-5 h-5 text-sky-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Scan Receipt</h3>
            <p className="text-xs text-sky-800/80 font-medium mt-0.5">OCR auto extraction</p>
          </div>
        </button>

        {/* 4. Health Score (mint green tile) */}
        <button
          onClick={onOpenHealthModal}
          className="bg-[#d1fae5] hover:bg-[#a7f3d0] border border-emerald-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Activity className="w-5 h-5 text-emerald-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Health Score</h3>
            <p className="text-xs text-emerald-800/80 font-medium mt-0.5">Financial wellness</p>
          </div>
        </button>

        {/* 5. AI Insights (light purple tile) */}
        <button
          onClick={() => onSelectTab('insights')}
          className="bg-[#f3e8ff] hover:bg-[#e9d5ff] border border-purple-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Sparkles className="w-5 h-5 text-purple-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">AI Insights</h3>
            <p className="text-xs text-purple-800/80 font-medium mt-0.5">Bot & forecasting</p>
          </div>
        </button>

        {/* 6. Rewards (gold/yellow tile) */}
        <button
          onClick={onOpenRewardsModal}
          className="bg-[#fff3d6] hover:bg-[#fef08a] border border-amber-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Trophy className="w-5 h-5 text-amber-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Rewards</h3>
            <p className="text-xs text-amber-800/80 font-medium mt-0.5">Badges & streaks</p>
          </div>
        </button>

        {/* 7. Notifications (peach/pink tile) */}
        <button
          onClick={onOpenNotificationsModal}
          className="bg-[#ffedd5] hover:bg-[#fed7aa] border border-orange-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Bell className="w-5 h-5 text-orange-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Notifications</h3>
            <p className="text-xs text-orange-800/80 font-medium mt-0.5">Reminders & alerts</p>
          </div>
        </button>

        {/* 8. Security (light slate tile) */}
        <button
          onClick={onOpenSecurityModal}
          className="bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-slate-200/60 rounded-3xl p-5 text-left space-y-2.5 transition hover:shadow-md active:scale-[0.98] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
            <Shield className="w-5 h-5 text-slate-700 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Security</h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">Passcode & privacy</p>
          </div>
        </button>
      </div>

      {/* Mobile Sign Out Button */}
      <button
        onClick={onSignOut}
        className="sm:hidden w-full py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-200/50 shadow-sm transition active:scale-[0.99]"
      >
        <LogOut className="w-4 h-4 text-slate-600" />
        <span>Sign out</span>
      </button>
    </div>
  );
};
