import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, ArrowRight, User, Mail, Lock, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { TracksyLogo } from './TracksyLogo';
import { UserProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (userProfile: Partial<UserProfile>, isNewAccount?: boolean) => void;
  onSkip: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onSkip,
}) => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser = (cleanEmail === 'admi@gmail.com' || cleanEmail === 'admin') && password === 'admin';

    if (isAdminUser) {
      onLoginSuccess(
        {
          name: 'System Admin',
          email: 'admi@gmail.com',
          handle: '@admin_master',
          isAdmin: true,
          role: 'admin',
          healthScore: 100,
          rewardsPoints: 9999,
          streakDays: 365,
        },
        false
      );
      return;
    }

    const finalName = isCreateAccount && name.trim() ? name.trim() : (email.split('@')[0] || 'User');
    onLoginSuccess(
      {
        name: finalName,
        email: email || 'user@tracksy.ai',
        handle: `@${finalName.toLowerCase().replace(/\s+/g, '')}`,
        isAdmin: false,
        role: 'user',
      },
      isCreateAccount
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSubmitted(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#dbeafe] via-[#e0e7ff] to-[#f3e8ff]">
      {/* Liquid Glass Background Orbs (Fluid Motion) */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-gradient-to-tr from-indigo-400/40 via-purple-400/30 to-pink-300/40 rounded-full blur-[80px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-cyan-300/40 via-indigo-300/30 to-purple-400/40 rounded-full blur-[90px] animate-pulse pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[250px] h-[250px] bg-gradient-to-tr from-pink-400/30 to-amber-300/30 rounded-full blur-[60px] pointer-events-none" />

      <div className="w-full max-w-sm flex flex-col items-center space-y-5 relative z-10">
        {/* Liquid Glass Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-white/80 shadow-[4px_4px_12px_rgba(163,177,198,0.25),-4px_-4px_12px_rgba(255,255,255,0.9)] text-xs font-bold text-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          <span>Next-Gen Liquid AI Finance</span>
        </div>

        {/* Tracksy Brand Logo & Title */}
        <div className="text-center space-y-1">
          <TracksyLogo size="lg" showText animated showTagline={false} className="justify-center" />
          <p className="text-xs font-semibold text-slate-600/80 tracking-wide">
            Track Smart & Spend Better
          </p>
        </div>

        {/* Main Liquid Neu-Glass Card */}
        <div className="w-full bg-white/45 backdrop-blur-2xl border border-white/70 rounded-[32px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(31,38,135,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-5 relative overflow-hidden">
          {/* Subtle Top Liquid Specular Reflection Sheen */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          {isForgotPassword ? (
            /* Forgot Password Flow */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Reset Password</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Enter your registered email address to receive password reset instructions.
                </p>
              </div>

              {resetSubmitted ? (
                <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-400/50 text-emerald-900 p-4 rounded-2xl text-center space-y-2 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.04),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold">Reset Link Sent!</p>
                  <p className="text-[11px] text-emerald-800">
                    We have sent password reset instructions to <strong>{forgotEmail || email || 'your email'}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSubmitted(false);
                    }}
                    className="mt-2 text-xs font-bold text-indigo-700 hover:underline block mx-auto"
                  >
                    Return to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 pl-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 text-xs font-medium outline-none focus:bg-white/90 focus:border-indigo-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] transition"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-[5px_5px_15px_rgba(99,102,241,0.35),-3px_-3px_10px_rgba(255,255,255,0.8)] transition active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                    >
                      ← Back to Log In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Log In / Create Account Flow */
            <>
              {/* Neomorphic Mode Switcher Tabs */}
              <div className="p-1.5 rounded-2xl bg-slate-200/50 backdrop-blur-md border border-white/60 flex shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]">
                <button
                  type="button"
                  onClick={() => setIsCreateAccount(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                    !isCreateAccount
                      ? 'bg-white text-indigo-700 shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateAccount(true)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                    isCreateAccount
                      ? 'bg-white text-indigo-700 shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name input for Create Account */}
                {isCreateAccount && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Siddartha Royal"
                        className="w-full px-4 py-3 pl-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 text-xs font-medium outline-none focus:bg-white/90 focus:border-indigo-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] transition"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 pl-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 text-xs font-medium outline-none focus:bg-white/90 focus:border-indigo-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] transition"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="block text-xs font-extrabold text-slate-700">
                      Password
                    </label>
                    {!isCreateAccount && (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setIsForgotPassword(true);
                        }}
                        className="text-[11px] font-bold text-indigo-700 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pl-10 pr-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 text-xs font-medium outline-none focus:bg-white/90 focus:border-indigo-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] transition"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Neomorphic Glossy Action Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white font-extrabold text-xs tracking-wide shadow-[6px_6px_16px_rgba(30,41,59,0.35),-4px_-4px_12px_rgba(255,255,255,0.8)] hover:shadow-[8px_8px_20px_rgba(30,41,59,0.45)] transition active:scale-[0.98] flex items-center justify-center gap-2 border border-slate-700/50"
                >
                  <span>{isCreateAccount ? 'Create Account' : 'Log In'}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </button>
              </form>

              {/* Bottom Mode Switcher */}
              <div className="text-center pt-3 border-t border-white/60">
                {isCreateAccount ? (
                  <p className="text-xs text-slate-600 font-medium">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsCreateAccount(false)}
                      className="font-extrabold text-indigo-700 hover:underline ml-1"
                    >
                      Log In
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-600 font-medium">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsCreateAccount(true)}
                      className="font-extrabold text-indigo-700 hover:underline ml-1"
                    >
                      Create an Account
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Skip Button with Liquid Glass pill */}
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-extrabold text-slate-600 hover:text-indigo-900 transition px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/70 shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.8)] active:scale-95 flex items-center gap-1.5"
        >
          <span>Skip for now & explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

