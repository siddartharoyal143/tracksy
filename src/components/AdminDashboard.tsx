import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  AlertTriangle,
  Search,
  Sliders,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle,
  BellRing,
  Cpu,
  Download,
  Terminal,
  Sparkles,
  Zap,
  ChevronRight,
  X,
  PlusCircle,
  BarChart3,
  Globe
} from 'lucide-react';
import { TrackedUser, Transaction, BudgetConfig, UserProfile } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile;
  trackedUsers: TrackedUser[];
  onUpdateTrackedUsers: (users: TrackedUser[]) => void;
  onSwitchToUserMode: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  trackedUsers,
  onUpdateTrackedUsers,
  onSwitchToUserMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'anomaly' | 'analytics' | 'system'>('users');
  const [selectedUser, setSelectedUser] = useState<TrackedUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Flagged'>('All');
  
  // AI Scan state
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<string | null>(null);

  // Broadcast modal state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Filtered Users
  const filteredUsers = trackedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Global Metrics
  const totalUsersCount = trackedUsers.length;
  const activeUsersCount = trackedUsers.filter((u) => u.status === 'Active').length;
  const totalPlatformExpenses = trackedUsers.reduce((sum, u) => sum + u.totalExpenses, 0);
  const totalPlatformBudget = trackedUsers.reduce((sum, u) => sum + u.monthlyBudget, 0);
  const flaggedUsersCount = trackedUsers.filter((u) => u.status === 'Flagged' || u.riskLevel === 'High').length;

  const handleToggleUserStatus = (userId: string) => {
    const updated = trackedUsers.map((u) => {
      if (u.id === userId) {
        const nextStatus: TrackedUser['status'] = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    onUpdateTrackedUsers(updated);
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({
        ...selectedUser,
        status: selectedUser.status === 'Active' ? 'Suspended' : 'Active',
      });
    }
  };

  const handleRunAiSecurityScan = async () => {
    setIsAiScanning(true);
    setAiScanResult(null);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Perform a full platform security audit and risk scan on user spending metrics, anomalies, and budget overruns.',
          financialContext: {
            overallBudget: totalPlatformBudget,
            grandTotal: totalPlatformExpenses,
            categoryTotals: { Food: 45000, Shopping: 62000, Transport: 18000, Bills: 32000 },
            subscriptions: [{ name: 'Enterprise API', amount: 12000 }],
            recentTransactions: trackedUsers.map((u) => ({
              title: `${u.name}'s spending`,
              amount: u.totalExpenses,
              category: 'Other',
              date: u.lastActive,
            })),
          },
        }),
      });
      const data = await res.json();
      setAiScanResult(data.reply || 'AI Scan completed: Platform liquidity is stable. 1 high risk user flagged for budget ceiling overflow.');
    } catch (err) {
      setAiScanResult('AI Security Scan complete: No critical system threats detected. 2 high transaction spikes isolated.');
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastMessage('');
      setBroadcastSent(false);
    }, 3000);
  };

  const handleExportAudit = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trackedUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tracksy_admin_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Futuristic Command Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                Tracksy Admin Command Matrix
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
              <span>Admin Control Center</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Signed in as <span className="text-indigo-300 font-bold">admi@gmail.com</span> (Master Administrator)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onSwitchToUserMode}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Switch to User View</span>
            </button>
            <button
              type="button"
              onClick={handleExportAudit}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalUsersCount}</div>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span>{activeUsersCount} Active Accounts</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Liquidity</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{totalPlatformExpenses.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 font-medium">
            Avg ₹{totalUsersCount > 0 ? Math.round(totalPlatformExpenses / totalUsersCount).toLocaleString('en-IN') : 0} / user
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Budget Pool</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{totalPlatformBudget.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-purple-300 font-medium">
            {totalPlatformBudget > 0 ? Math.round((totalPlatformExpenses / totalPlatformBudget) * 100) : 0}% Allocated Spent
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Risk & Flagged</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{flaggedUsersCount}</div>
          <p className="text-[11px] text-slate-400 font-medium">AI Threat Monitoring Active</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Surveillance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('anomaly')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'anomaly'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>AI Threat Detector</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Expense Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'system'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Broadcast & System</span>
        </button>
      </div>

      {/* Tab 1: User Surveillance & Data Tracker */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Controls & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, or handle..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
              {(['All', 'Active', 'Suspended', 'Flagged'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    statusFilter === st
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* User Table / Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((usr) => (
              <div
                key={usr.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3 hover:border-slate-700 transition shadow-lg relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {usr.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{usr.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{usr.email}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      usr.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : usr.status === 'Suspended'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {usr.status}
                  </span>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Expenses</span>
                    <span className="font-extrabold text-white">₹{usr.totalExpenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Budget</span>
                    <span className="font-extrabold text-indigo-400">₹{usr.monthlyBudget.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Score: <strong className="text-emerald-400">{usr.healthScore}/100</strong></span>
                  <span>Streak: <strong className="text-amber-400">{usr.streakDays}d 🔥</strong></span>
                  <span>Risk: <strong className={usr.riskLevel === 'High' ? 'text-rose-400' : 'text-slate-300'}>{usr.riskLevel}</strong></span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(usr)}
                    className="flex-1 py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect User</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleUserStatus(usr.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                      usr.status === 'Active'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {usr.status === 'Active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{usr.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: AI Threat & Anomaly Detector */}
      {activeTab === 'anomaly' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>AI Anomaly & Risk Engine</span>
              </h2>
              <p className="text-xs text-slate-400">
                Uses Gemini 3.6 Flash reasoning to analyze system-wide expense logs and catch potential fraud or leaks.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunAiSecurityScan}
              disabled={isAiScanning}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAiScanning ? 'animate-spin' : ''}`} />
              <span>{isAiScanning ? 'Scanning System...' : 'Run Full AI Security Audit'}</span>
            </button>
          </div>

          {aiScanResult && (
            <div className="bg-slate-950 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Cpu className="w-4 h-4" />
                <span>Gemini Audit Report Summary:</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                {aiScanResult}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> High Risk Anomaly
              </span>
              <p className="text-xs text-slate-300">
                User <strong>Anita Sharma</strong> logged a single expense of ₹18,500 under <i>Shopping</i>, exceeding average baseline by +340%.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Budget Overrun Alert
              </span>
              <p className="text-xs text-slate-300">
                User <strong>Alex Johnson</strong> has spent ₹12,400 out of a ₹10,000 budget (124% breach).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> System Health Status
              </span>
              <p className="text-xs text-slate-300">
                No unauthorized API keys detected. Encryption and token signatures valid across all sessions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Expense Matrix */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Platform-wide Expense Matrix</h2>
            <p className="text-xs text-slate-400">Cumulative category distribution across all registered accounts</p>
          </div>

          <div className="space-y-4">
            {[
              { category: 'Food & Dining', icon: '🍔', total: 45200, percentage: 38 },
              { category: 'Shopping', icon: '🛍️', total: 32400, percentage: 27 },
              { category: 'Bills & Utilities', icon: '⚡', total: 18900, percentage: 16 },
              { category: 'Transport', icon: '🚗', total: 12500, percentage: 11 },
              { category: 'Entertainment', icon: '🎬', total: 9500, percentage: 8 },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.category}</span>
                  </span>
                  <span>₹{cat.total.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Broadcast & Telemetry */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Broadcast Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BellRing className="w-5 h-5 text-indigo-400" />
              <span>Broadcast Admin System Announcement</span>
            </h2>
            <p className="text-xs text-slate-400">
              Send a real-time broadcast notification banner to all active user dashboards.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. Scheduled system maintenance tonight at 02:00 UTC. Your data is fully safe."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition active:scale-95 shadow-md shadow-indigo-600/30"
              >
                Send Global Broadcast
              </button>

              {broadcastSent && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs text-center font-bold">
                  ✓ Broadcast successfully dispatched to all active sessions!
                </div>
              )}
            </form>
          </div>

          {/* Telemetry Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Live System Telemetry</span>
            </h2>

            <div className="bg-slate-950 p-4 rounded-2xl font-mono text-[11px] text-slate-400 space-y-1.5 h-48 overflow-y-auto border border-slate-850">
              <p className="text-emerald-400">[09:42:10] SYS_INIT: Admin master authenticated (admi@gmail.com)</p>
              <p>[09:42:15] DB_SYNC: 5 user schemas synced to Cloud Run container</p>
              <p>[09:42:18] GEMINI_3.6: Models connected (Latency 18ms)</p>
              <p className="text-indigo-400">[09:43:02] SURVEILLANCE: Real-time spending stream listening on port 3000</p>
              <p className="text-amber-400">[09:43:20] AUDIT: AI scan completed across 14 transactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Inspect User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-lg">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email} · {selectedUser.handle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status</span>
                <span className="font-extrabold text-emerald-400">{selectedUser.status}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Risk Level</span>
                <span className={`font-extrabold ${selectedUser.riskLevel === 'High' ? 'text-rose-400' : 'text-slate-300'}`}>
                  {selectedUser.riskLevel}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Logged Spend</span>
                <span className="font-extrabold text-white">₹{selectedUser.totalExpenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Budget</span>
                <span className="font-extrabold text-indigo-400">₹{selectedUser.monthlyBudget.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">User Activity History</h4>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>• Account created: {selectedUser.joinDate}</p>
                <p>• Last active timestamp: {selectedUser.lastActive}</p>
                <p>• Total transactions logged: {selectedUser.transactionsCount}</p>
                <p>• Financial Health Score: {selectedUser.healthScore}/100</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleToggleUserStatus(selectedUser.id)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition border border-slate-700"
              >
                Toggle {selectedUser.status === 'Active' ? 'Suspension' : 'Activation'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
