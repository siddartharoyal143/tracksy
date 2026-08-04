import React, { useState, useEffect } from 'react';
import {
  TabType,
  UserProfile,
  BudgetConfig,
  Transaction,
  Subscription,
  TrackedUser,
} from './types';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './components/HomeView';
import { InsightsView } from './components/InsightsView';
import { BudgetView } from './components/BudgetView';
import { MoreView } from './components/MoreView';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/AdminDashboard';
import { AddExpenseModal } from './components/AddExpenseModal';
import { SubscriptionsModal } from './components/SubscriptionsModal';
import { RewardsModal } from './components/RewardsModal';
import { HealthScoreModal } from './components/HealthScoreModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SecurityModal } from './components/SecurityModal';
import { LoadingScreen } from './components/LoadingScreen';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const INITIAL_USER: UserProfile = {
  name: 'New User',
  handle: '@newuser',
  email: 'user@tracksy.ai',
  healthScore: 100,
  rewardsPoints: 0,
  streakDays: 0,
};

const INITIAL_TRACKED_USERS: TrackedUser[] = [
  {
    id: 'u-admin',
    name: 'System Admin',
    email: 'admi@gmail.com',
    handle: '@admin_master',
    status: 'Active',
    healthScore: 100,
    streakDays: 365,
    totalExpenses: 0,
    monthlyBudget: 50000,
    joinDate: '2026-01-01',
    lastActive: 'Just now',
    transactionsCount: 0,
    riskLevel: 'Low',
  },
  {
    id: 'u-1',
    name: 'Siddartha Royal',
    email: 'siddartharoyal143@gmail.com',
    handle: '@siddartharoyal143',
    status: 'Active',
    healthScore: 92,
    streakDays: 14,
    totalExpenses: 24500,
    monthlyBudget: 40000,
    joinDate: '2026-02-15',
    lastActive: '2 mins ago',
    transactionsCount: 18,
    riskLevel: 'Low',
  },
  {
    id: 'u-2',
    name: 'Reddy Sekhar',
    email: 'reddysekhar@gmail.com',
    handle: '@reddysekhar',
    status: 'Active',
    healthScore: 88,
    streakDays: 8,
    totalExpenses: 15200,
    monthlyBudget: 25000,
    joinDate: '2026-03-01',
    lastActive: '12 mins ago',
    transactionsCount: 11,
    riskLevel: 'Low',
  },
  {
    id: 'u-3',
    name: 'Anita Sharma',
    email: 'anita.sharma@example.com',
    handle: '@anita_s',
    status: 'Flagged',
    healthScore: 65,
    streakDays: 3,
    totalExpenses: 48900,
    monthlyBudget: 30000,
    joinDate: '2026-04-10',
    lastActive: '1 hour ago',
    transactionsCount: 29,
    riskLevel: 'High',
  },
  {
    id: 'u-4',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    handle: '@alex_j',
    status: 'Active',
    healthScore: 95,
    streakDays: 21,
    totalExpenses: 8400,
    monthlyBudget: 20000,
    joinDate: '2026-05-02',
    lastActive: '3 hours ago',
    transactionsCount: 6,
    riskLevel: 'Low',
  },
];

const INITIAL_BUDGET: BudgetConfig = {
  overall: 0,
  categories: {
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Bills: 0,
    Entertainment: 0,
    Health: 0,
    Travel: 0,
    Other: 0,
  },
};

const INITIAL_SUBSCRIPTIONS: Subscription[] = [];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [adminViewMode, setAdminViewMode] = useState<'dashboard' | 'preview'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('tracksy_logged_in') === 'true';
  });

  // Tracked Users state for Admin
  const [trackedUsers, setTrackedUsers] = useState<TrackedUser[]>(() => {
    const saved = localStorage.getItem('tracksy_admin_tracked_users');
    return saved ? JSON.parse(saved) : INITIAL_TRACKED_USERS;
  });

  // User State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tracksy_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Budget State
  const [budget, setBudget] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem('tracksy_budget');
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('tracksy_subs');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tracksy_txs');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubsModalOpen, setIsSubsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Initial loading splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Save state changes
  useEffect(() => {
    localStorage.setItem('tracksy_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tracksy_admin_tracked_users', JSON.stringify(trackedUsers));
  }, [trackedUsers]);

  // Real-time synchronization of user profile, transactions, and budget to Admin Dashboard trackedUsers
  useEffect(() => {
    if (!isLoggedIn || !user.email) return;

    const isAdmin = user.isAdmin || user.role === 'admin' || user.email.trim().toLowerCase() === 'admi@gmail.com';
    if (isAdmin) return;

    const activeSubs = subscriptions.filter((s) => s.active);
    const subTotal = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
    const txTotal = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const currentTotalSpend = subTotal + txTotal;

    const riskLevel: 'Low' | 'Medium' | 'High' =
      budget.overall > 0 && currentTotalSpend > budget.overall ? 'High' : 'Low';

    setTrackedUsers((prevTracked) => {
      const emailLower = user.email.toLowerCase();
      const existingIdx = prevTracked.findIndex((u) => u.email.toLowerCase() === emailLower);

      if (existingIdx >= 0) {
        const updated = [...prevTracked];
        updated[existingIdx] = {
          ...updated[existingIdx],
          name: user.name || updated[existingIdx].name,
          email: user.email,
          handle: user.handle || updated[existingIdx].handle,
          avatarUrl: user.avatarUrl || updated[existingIdx].avatarUrl,
          healthScore: user.healthScore,
          streakDays: user.streakDays,
          totalExpenses: currentTotalSpend,
          monthlyBudget: budget.overall,
          lastActive: 'Just now',
          transactionsCount: transactions.length,
          riskLevel,
        };
        return updated;
      } else {
        const newUserRecord: TrackedUser = {
          id: 'u-' + Date.now(),
          name: user.name || 'New User',
          email: user.email,
          handle: user.handle || `@${user.email.split('@')[0]}`,
          avatarUrl: user.avatarUrl,
          status: 'Active',
          healthScore: user.healthScore || 100,
          streakDays: user.streakDays || 0,
          totalExpenses: currentTotalSpend,
          monthlyBudget: budget.overall,
          joinDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now',
          transactionsCount: transactions.length,
          riskLevel,
        };
        return [newUserRecord, ...prevTracked];
      }
    });
  }, [
    isLoggedIn,
    user.email,
    user.name,
    user.handle,
    user.avatarUrl,
    user.healthScore,
    user.streakDays,
    transactions,
    subscriptions,
    budget.overall,
  ]);

  useEffect(() => {
    localStorage.setItem('tracksy_budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('tracksy_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('tracksy_txs', JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const handleAddTransaction = (
    txData: Omit<Transaction, 'id'>,
    isSubToggle?: boolean
  ) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If marked as subscription, create a subscription item
    if (isSubToggle) {
      const newSub: Subscription = {
        id: 'sub-' + Date.now(),
        name: txData.merchant || txData.category,
        icon: '📺',
        amount: txData.amount,
        billingCycle: 'monthly',
        active: true,
        yearlyAmount: txData.amount * 12,
        category: txData.category,
      };
      setSubscriptions((prev) => [newSub, ...prev]);
    }

    // Award rewards points for logging an expense
    setUser((prev) => ({
      ...prev,
      rewardsPoints: prev.rewardsPoints + 10,
    }));
  };

  const handleAddSubscription = (
    subData: Omit<Subscription, 'id' | 'yearlyAmount'>
  ) => {
    const newSub: Subscription = {
      ...subData,
      id: 'sub-' + Date.now(),
      yearlyAmount: subData.amount * 12,
    };
    setSubscriptions((prev) => [...prev, newSub]);
  };

  const handleDeleteSub = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSub = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleClaimPoints = (pts: number) => {
    setUser((prev) => ({
      ...prev,
      rewardsPoints: prev.rewardsPoints + pts,
      streakDays: prev.streakDays + 1,
    }));
  };

  const handleUpdateAvatar = (url: string) => {
    setUser((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleLoginSuccess = (userProfile?: Partial<UserProfile>, isNewAccount: boolean = false) => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      setUser((prev) => ({
        ...prev,
        ...userProfile,
        healthScore: isNewAccount ? 100 : (userProfile.healthScore ?? prev.healthScore),
        rewardsPoints: isNewAccount ? 0 : (userProfile.rewardsPoints ?? prev.rewardsPoints),
        streakDays: isNewAccount ? 0 : (userProfile.streakDays ?? prev.streakDays),
      }));
    }

    if (isNewAccount) {
      const zeroBudget: BudgetConfig = {
        overall: 0,
        categories: {
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Bills: 0,
          Entertainment: 0,
          Health: 0,
          Travel: 0,
          Other: 0,
        },
      };
      setBudget(zeroBudget);
      setTransactions([]);
      setSubscriptions([]);
      localStorage.setItem('tracksy_budget', JSON.stringify(zeroBudget));
      localStorage.setItem('tracksy_txs', JSON.stringify([]));
      localStorage.setItem('tracksy_subs', JSON.stringify([]));
    }

    setIsLoggedIn(true);
    localStorage.setItem('tracksy_logged_in', 'true');
    if (userProfile?.isAdmin || userProfile?.role === 'admin' || userProfile?.email?.trim().toLowerCase() === 'admi@gmail.com') {
      setAdminViewMode('dashboard');
    }
    setCurrentTab('home');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('tracksy_logged_in');
    setCurrentTab('login');
  };

  // Show Loading Screen animation with logo
  if (loading) {
    return <LoadingScreen message="Initializing Tracksy AI Engine..." />;
  }

  // Show Login Screen if currentTab is 'login' or not logged in
  if (!isLoggedIn || currentTab === 'login') {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onSkip={() => handleLoginSuccess()}
      />
    );
  }

  // Admin Check
  const isAdminLoggedIn = user.isAdmin || user.role === 'admin' || user.email === 'admi@gmail.com';

  // If Admin is logged in and in 'dashboard' mode, render the Admin Control Center
  if (isAdminLoggedIn && adminViewMode === 'dashboard') {
    return (
      <AdminDashboard
        currentUser={user}
        trackedUsers={trackedUsers}
        onUpdateTrackedUsers={(updated) => setTrackedUsers(updated)}
        onSwitchToUserMode={() => setAdminViewMode('preview')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#ece9e6] to-[#fbc2eb] font-sans antialiased text-slate-800 selection:bg-indigo-500 selection:text-white pb-6">
      {/* Admin Mode Floating Top Banner */}
      {isAdminLoggedIn && (
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-md sticky top-0 z-50 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Preview Mode (<strong className="text-indigo-300">admi@gmail.com</strong>)</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminViewMode('dashboard')}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] transition shadow-sm"
          >
            Return to Command Center
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        user={user}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenSettings={() => setIsSecurityModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="pt-2">
        {currentTab === 'home' && (
          <HomeView
            user={user}
            budget={budget}
            transactions={transactions}
            subscriptions={subscriptions}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onNavigateToSubs={() => setIsSubsModalOpen(true)}
            onNavigateToHealth={() => setIsHealthModalOpen(true)}
            onNavigateToRewards={() => setIsRewardsModalOpen(true)}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsView
            transactions={transactions}
            subscriptions={subscriptions}
            overallBudget={budget.overall}
          />
        )}

        {currentTab === 'budget' && (
          <BudgetView
            budget={budget}
            transactions={transactions}
            subscriptions={subscriptions}
            onUpdateBudget={(b) => setBudget(b)}
          />
        )}

        {currentTab === 'more' && (
          <MoreView
            user={user}
            onSelectTab={setCurrentTab}
            onOpenSubsModal={() => setIsSubsModalOpen(true)}
            onOpenVoiceModal={() => setIsAddModalOpen(true)}
            onOpenReceiptModal={() => setIsAddModalOpen(true)}
            onOpenHealthModal={() => setIsHealthModalOpen(true)}
            onOpenRewardsModal={() => setIsRewardsModalOpen(true)}
            onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
            onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
            onSignOut={handleSignOut}
            onUpdateAvatar={handleUpdateAvatar}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Interactive Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <SubscriptionsModal
        isOpen={isSubsModalOpen}
        onClose={() => setIsSubsModalOpen(false)}
        subscriptions={subscriptions}
        onAddSub={handleAddSubscription}
        onDeleteSub={handleDeleteSub}
        onToggleSub={handleToggleSub}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        rewardsPoints={user.rewardsPoints}
        streakDays={user.streakDays}
        onClaimPoints={handleClaimPoints}
      />

      <HealthScoreModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        user={user}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
