import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Phone, Building, Eye, EyeOff, Check, DollarSign, Users, Shield, TrendingUp, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignupProps {
  onNavigate: (page: string) => void;
}

export default function Signup({ onNavigate }: SignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    hospitalAffiliation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain uppercase, lowercase, and number');
      return;
    }

    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/login`;

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            hospital_affiliation: formData.hospitalAffiliation
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        setSuccessEmail(formData.email);
        setSuccess(true);
        setLoading(false);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: '',
          hospitalAffiliation: ''
        });
      }
    } catch (err: any) {
      if (err.message.includes('User already registered')) {
        setError('An account with this email already exists. Please login instead.');
      } else if (err.message.includes('weak_password') || err.message.includes('weak')) {
        setError('Please choose a stronger password (avoid common words, use mix of characters)');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  const perks = [
    { icon: DollarSign, title: 'GHC 200 Per Referral', desc: 'Earn for every successful client you refer' },
    { icon: Users, title: 'Open to Everyone', desc: 'Doctors, nurses, staff, community leaders' },
    { icon: TrendingUp, title: 'Monthly Payouts', desc: 'Reliable commissions paid every month' },
    { icon: Shield, title: 'Trusted & Secure', desc: 'Backed by Ghana\'s #1 claims agency' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 relative py-12">
      <button
        onClick={() => onNavigate('landing')}
        className="absolute left-6 top-6 sm:left-8 sm:top-8 flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors font-semibold text-[15px]"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-[500px] w-full bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 my-8">
        <div className="text-center mb-8">
          <img src="Ps-Leo_9-removebg-preview.png" alt="BearGuard" className="w-[60px] h-[60px] mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-1">Create Account</h1>
          <p className="text-[#64748b] text-[15px]">Join the BearGuard Referral Network</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-[16px] p-8 text-center mt-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">Check Your Inbox!</h3>
            <p className="text-[#475569] mb-8 text-[15px]">
              A confirmation email has been sent to{' '}
              <strong className="text-[#0f172a]">{successEmail}</strong>.
              Click the link inside to activate your account.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-[12px] font-bold transition-all shadow-[0_4px_14px_rgba(234,88,12,0.39)]"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[12px] text-red-700 text-[14px] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-[#334155] mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#334155] mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                  placeholder="agent@insurance.com"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#334155] mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                  placeholder="050 123 4567"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#334155] mb-2">
                  Hospital / Organisation <span className="text-[#94a3b8] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.hospitalAffiliation}
                  onChange={(e) => setFormData({ ...formData, hospitalAffiliation: e.target.value })}
                  className="w-full px-4 py-3 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                  placeholder="Ridge Hospital"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-semibold text-[#334155] mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-4 pr-11 py-3 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-[#334155] mb-2">Confirm</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-4 pr-11 py-3 text-[15px] border border-[#e2e8f0] rounded-[12px] focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder:text-[#94a3b8]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-[#94a3b8] -mt-1 pb-1">
                8+ characters · uppercase · lowercase · number
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-[12px] font-bold text-[16px] transition-all shadow-[0_4px_14px_rgba(234,88,12,0.39)] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account…' : 'Sign Up'}
              </button>

              <div className="pt-4 pb-2">
                <p className="text-center text-[14px] text-[#64748b]">
                  Already have an account?{' '}
                  <button
                    onClick={() => onNavigate('login')}
                    type="button"
                    className="text-[#ea580c] hover:text-[#c2410c] font-semibold transition-colors"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
