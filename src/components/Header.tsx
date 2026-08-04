import React from 'react';
import { Bell, Settings, Home, BarChart2, BookOpen, MoreHorizontal } from 'lucide-react';
import { UserProfile, TabType } from '../types';
import { TracksyLogo } from './TracksyLogo';

interface HeaderProps {
  user: UserProfile;
  currentTab?: TabType;
  onSelectTab?: (tab: TabType) => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentTab = 'home',
  onSelectTab,
  onOpenNotifications,
  onOpenSettings,
}) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'insights', label: 'Insights & AI', icon: BarChart2 },
    { id: 'budget', label: 'Budget Planner', icon: BookOpen },
    { id: 'more', label: 'Account & More', icon: MoreHorizontal },
  ];

  return (
    <header className="w-full max-w-7xl mx-auto pt-4 pb-3 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between gap-4">
        {/* Left: User Avatar & Name + Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-indigo-500/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm flex items-center justify-center font-extrabold text-white text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                {user.name}
              </h1>
              {user.email === 'admi@gmail.com' && (
                <span className="bg-slate-900 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{user.handle}</p>
          </div>
        </div>

        {/* Desktop & Laptop Header Navigation (Visible on md, lg, xl screens) */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Tracksy Brand Logo & Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block border-r border-slate-200/80 pr-4 mr-1">
            <TracksyLogo size="sm" showText animated />
          </div>

          {/* Bell notification button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-white hover:border-indigo-300 shadow-sm transition active:scale-95"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-white hover:border-indigo-300 shadow-sm transition active:scale-95"
          >
            <Settings className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </header>
  );
};

