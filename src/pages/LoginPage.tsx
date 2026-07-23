import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Mail, Lock, ArrowRight, ShieldAlert, User } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-[#C9A227] text-black font-bold flex items-center justify-center mx-auto shadow-xl">
            <UtensilsCrossed className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-serif text-white">Welcome Back</h1>
          <p className="text-xs text-white/50">Sign in to RestaurantHub to place & track culinary orders</p>
        </div>

        {/* Demo Accounts Quick Pill Box */}
        <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl space-y-2 text-xs">
          <p className="font-bold text-[#C9A227] uppercase tracking-[0.2em] text-[10px]">One-Click Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@restauranthub.com', 'admin123')}
              className="p-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 hover:border-[#C9A227] text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#C9A227] uppercase tracking-wider text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Admin User</span>
              </div>
              <p className="text-[10px] text-white/40 mt-0.5 truncate">admin@restauranthub.com</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('user@example.com', 'user123')}
              className="p-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 hover:border-[#C9A227] text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer User</span>
              </div>
              <p className="text-[10px] text-white/40 mt-0.5 truncate">user@example.com</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-sm text-rose-300 text-xs text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-xs text-white/50">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#C9A227] font-bold uppercase tracking-wider hover:underline"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
