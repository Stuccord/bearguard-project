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
    <div className="min-h-screen flex bg-slate-950">

      {/* ── Left Panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 px-14 py-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Logo */}
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

        {/* Pitch copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold mb-6">
              <Star className="w-4 h-4 fill-orange-400" />
              Referral Partner Program
            </div>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              Earn While<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Helping Others
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Refer accident victims to BearGuard and earn <strong className="text-orange-400">GHC 200</strong> for every successful case—paid monthly.
            </p>
          </div>

          <div className="space-y-4">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{perk.title}</p>
                    <p className="text-gray-400 text-sm">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonial quote */}
        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-gray-300 italic text-base leading-relaxed mb-3">
            "I've already earned over GHC 2,000 just by referring patients I meet in the ward. It's easy and it helps them too."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white">N</div>
            <div>
              <p className="text-white font-semibold text-sm">Nurse Abena</p>
              <p className="text-gray-500 text-xs">Partner, Korle Bu Teaching Hospital</p>
            </div>
            <div className="flex ml-auto">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 bg-white overflow-y-auto">

        {/* Mobile back + logo */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <img src="Ps-Leo_9-removebg-preview.png" alt="BearGuard" className="w-10 h-10" />
        </div>

        {/* Back link (desktop) */}
        <button
          onClick={() => onNavigate('landing')}
          className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm mb-10 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create Your Account</h1>
            <p className="text-gray-500 text-base">Join the BearGuard Referral Network and start earning today.</p>
          </div>

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Inbox!</h3>
              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to{' '}
                <strong className="text-gray-900">{successEmail}</strong>.
                Click the link to activate your account.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Form */}
          {!success && (
            <>
              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                      placeholder="050 123 4567"
                    />
                  </div>
                </div>

                {/* Hospital Affiliation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Hospital / Organisation <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.hospitalAffiliation}
                      onChange={(e) => setFormData({ ...formData, hospitalAffiliation: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                      placeholder="Ridge Hospital"
                    />
                  </div>
                </div>

                {/* Password row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 -mt-2">
                  8+ characters · uppercase · lowercase · number
                </p>

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
                      Creating Account…
                    </>
                  ) : 'Join the Network'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
