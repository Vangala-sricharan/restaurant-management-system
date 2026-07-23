import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await register({ name, email, password, phone, address });
    if (result.success) {
      onRegisterSuccess();
    } else {
      setError(result.error || 'Registration failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-[#C9A227] text-black font-bold flex items-center justify-center mx-auto shadow-xl">
            <UtensilsCrossed className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-serif text-white">Create Account</h1>
          <p className="text-xs text-white/50">Join RestaurantHub for seamless online food ordering</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-sm text-rose-300 text-xs text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Mukherjee"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Password *</label>
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

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder="Street name, landmark, city"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <span>{isSubmitting ? 'Registering...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-xs text-white/50">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#C9A227] font-bold uppercase tracking-wider hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
