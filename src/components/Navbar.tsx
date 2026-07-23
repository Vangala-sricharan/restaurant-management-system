import React, { useState } from 'react';
import { UtensilsCrossed, ShoppingBag, User as UserIcon, LogOut, Menu, X, ShieldAlert, ChevronDown, Compass, ScrollText, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'orders', label: 'My Orders', icon: ScrollText },
    { id: 'about', label: 'About', icon: Compass },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert });
  }

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 text-[#F5F5F0] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#C9A227] flex items-center justify-center text-black font-bold shadow-lg shadow-[#C9A227]/20 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-2xl font-serif tracking-tight text-white">
                RestaurantHub<span className="text-[#C9A227]">.</span>
              </span>
              <p className="text-[10px] tracking-[0.25em] text-[#C9A227] uppercase font-semibold">Management & Cuisine</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-white/10">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C9A227] text-black font-bold shadow-md shadow-[#C9A227]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-[#C9A227]/50 text-[#F5F5F0] hover:text-[#C9A227] transition-all duration-200 group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A227] text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Auth User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-[#C9A227]/50 text-[#F5F5F0] transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#C9A227] text-black font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white max-w-[100px] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#C9A227] uppercase tracking-wider font-mono">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/50" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-white/10">
                    <div className="px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/40">Signed in as</p>
                      <p className="text-xs font-bold text-[#C9A227] truncate">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#C9A227]/20 text-[#C9A227] text-[10px] font-bold rounded-md border border-[#C9A227]/30 uppercase tracking-wider">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227] flex items-center gap-2 transition-colors uppercase tracking-wider"
                      >
                        <UserCheck className="w-4 h-4 text-[#C9A227]" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavClick('orders')}
                        className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227] flex items-center gap-2 transition-colors uppercase tracking-wider"
                      >
                        <ScrollText className="w-4 h-4 text-[#C9A227]" />
                        My Orders
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2 text-xs text-[#C9A227] hover:bg-[#C9A227]/20 flex items-center gap-2 transition-colors font-semibold uppercase tracking-wider"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors uppercase tracking-wider"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#C9A227]/20 active:scale-95 transition-all duration-200"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white/80 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-b border-white/10 px-4 pt-3 pb-6 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-colors ${
                  isActive
                    ? 'bg-[#C9A227] text-black font-bold'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          {!user && (
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-[#C9A227] text-black font-bold uppercase tracking-widest text-xs"
              >
                <UserIcon className="w-4 h-4" />
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
