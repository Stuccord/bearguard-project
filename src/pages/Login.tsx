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
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 relative py-10">
      {onNavigate && (
        <button
          onClick={() => onNavigate('landing')}
          className="absolute left-6 top-6 sm:left-8 sm:top-8 flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors font-semibold text-[15px]"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      )}

      <div className="max-w-[420px] w-full bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        <div className="text-center mb-8">
          <img src="Ps-Leo_9-removebg-preview.png" alt="BearGuard" className="w-[60px] h-[60px] mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-1">BearGuard</h1>
          <p className="text-[#64748b] text-[15px]">Referral Rep Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
        {resetEmailSent && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            Reset link sent! Check your email inbox.
          </div>
        )}

        {showResetForm ? (
          <form onSubmit={handlePasswordReset} className="space-y-6 flex flex-col">
            <div>
              <label className="block text-[14px] font-semibold text-[#334155] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                placeholder="agent@insurance.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-[12px] font-bold text-[16px] transition-all shadow-[0_4px_14px_rgba(234,88,12,0.39)] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => { setShowResetForm(false); setError(''); }}
              className="w-full text-center text-[#ea580c] hover:text-[#c2410c] font-semibold text-[14px] transition-colors mt-6"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
            <div>
              <label className="block text-[14px] font-semibold text-[#334155] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                placeholder="agent@insurance.com"
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#334155] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-11 py-3.5 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-[12px] font-bold text-[16px] transition-all shadow-[0_4px_14px_rgba(234,88,12,0.39)] hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </div>

            <div className="pt-6 font-medium text-center space-y-4">
              <button
                type="button"
                onClick={() => { setShowResetForm(true); setError(''); }}
                className="block w-full text-center text-[#ea580c] hover:text-[#c2410c] font-semibold text-[14px] transition-colors"
              >
                Forgot Password?
              </button>
              
              {onNavigate && (
                <p className="text-center text-[14px] text-[#64748b]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('signup')}
                    className="text-[#ea580c] hover:text-[#c2410c] font-semibold transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );     </div>
      </div>
    </div>
  );
}
