import React from 'react';
import { Home, BarChart2, BookOpen, MoreHorizontal, Plus } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
}) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-lg md:max-w-xl lg:max-w-2xl mx-auto pointer-events-none transition-all">
      <div className="pointer-events-auto relative flex items-center justify-between bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_15px_35px_rgba(31,38,135,0.15)] rounded-full px-5 sm:px-8 py-3">
        {/* Home Tab */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentTab === 'home'
              ? 'text-indigo-600 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        {/* Insights Tab */}
        <button
          onClick={() => onSelectTab('insights')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentTab === 'insights'
              ? 'text-indigo-600 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <BarChart2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">Insights</span>
        </button>

        {/* Center Floating Action Button (+) */}
        <div className="relative -top-5 flex items-center justify-center">
          <button
            onClick={onOpenAddModal}
            aria-label="Add Expense"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Budget Tab */}
        <button
          onClick={() => onSelectTab('budget')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentTab === 'budget'
              ? 'text-indigo-600 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">Budget</span>
        </button>

        {/* More Tab */}
        <button
          onClick={() => onSelectTab('more')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentTab === 'more'
              ? 'text-indigo-600 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">More</span>
        </button>
      </div>
    </div>
  );
};
