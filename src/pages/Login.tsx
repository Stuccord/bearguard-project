import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Check, Shield, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onNavigate?: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetEmailSent(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      setTimeout(() => {
        setShowResetForm(false);
        setResetEmailSent(false);
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: DollarSign, label: 'GHC 200 per referral' },
    { icon: TrendingUp, label: 'Monthly commission payouts' },
    { icon: Users, label: 'Growing partner network' },
    { icon: Shield, label: 'Secure & trusted platform' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 px-14 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Logo */}
        {onNavigate ? (
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 group w-fit relative z-10"
          >
            <img src="Ps-Leo_9-removebg-preview.png" alt="BearGuard" className="w-12 h-12" />
            <div>
              <span className="text-2xl font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors">
                Bear<span className="text-orange-500">Guard</span>
              </span>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Support Services</p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 relative z-10">
            <img src="Ps-Leo_9-removebg-preview.png" alt="BearGuard" className="w-12 h-12" />
            <div>
              <span className="text-2xl font-bold text-white">Bear<span className="text-orange-500">Guard</span></span>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Support Services</p>
            </div>
          </div>
        )}

        {/* Welcome copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-orange-400 font-semibold text-sm uppercase tracking-widest mb-4">Referral Rep Portal</p>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              Welcome<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Back!
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Sign in to track your referrals, view your commissions, and manage your account.
            </p>
          </div>

          <div className="space-y-3">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer caption */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-gray-500 text-sm">
            Don't have an account yet?{' '}
            {onNavigate && (
              <button
                onClick={() => onNavigate('signup')}
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                Join the network →
              </button>
            )}
          </p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 bg-white overflow-y-auto">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          {onNavigate && (
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <img src="Ps-Leo_9-removebg-preview.png" alt="BearGuard" className="w-10 h-10 ml-auto" />
        </div>

        {/* Desktop back link */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('landing')}
            className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm mb-10 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {showResetForm ? 'Reset Password' : 'Sign In'}
            </h1>
            <p className="text-gray-500 text-base">
              {showResetForm
                ? 'Enter your email and we\'ll send you a reset link.'
                : 'Access your BearGuard referral dashboard.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          {resetEmailSent && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              Reset link sent! Check your email inbox.
            </div>
          )}

          {/* Reset form */}
          {showResetForm ? (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sending…
                  </>
                ) : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => { setShowResetForm(false); setError(''); }}
                className="w-full text-center text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          ) : (
            /* Login form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowResetForm(true); setError(''); }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-[1.02] active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in…
                  </>
                ) : 'Sign In'}
              </button>

              {onNavigate && (
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('signup')}
                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                  >
                    Join the Network
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
