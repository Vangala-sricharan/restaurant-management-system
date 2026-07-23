import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Phone, MapPin, Mail, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    const ok = await updateProfile({ name, phone, address });
    if (ok) {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex items-center justify-center p-4 font-sans">
        <p className="text-xs text-white/50 uppercase tracking-widest">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Customer Profile</h1>
          <p className="text-xs text-white/50">Manage your contact details and default delivery address</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-sm text-emerald-300 text-xs flex items-center gap-2 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <div className="w-14 h-14 rounded-xl bg-[#C9A227] text-black font-bold text-xl flex items-center justify-center shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-serif text-white">{user.name}</h2>
              <p className="text-xs text-[#C9A227]">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#C9A227]/20 text-[#C9A227] text-[10px] uppercase tracking-wider font-bold rounded-sm">
                Role: {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A]/60 border border-white/5 text-white/40 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Full Name</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Default Delivery Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="Flat No, Street Name, Landmark, City & Pincode"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-4 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4 text-black" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
