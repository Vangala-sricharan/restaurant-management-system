import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Sparkles, Flame, Clock, Award } from 'lucide-react';
import { INITIAL_MENU_ITEMS } from '../data/seedData';

interface HeroSectionProps {
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreMenu }) => {
  const [dishCount, setDishCount] = useState<number>(INITIAL_MENU_ITEMS.length);

  useEffect(() => {
    fetch('/api/dishes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDishCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] pt-12 pb-20 border-b border-white/10">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A227]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column: Editorial Hero */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Royal Culinary Management System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F5F5F0] leading-[1.15]">
              Crafting <span className="italic text-[#C9A227]">Excellence</span> <br />in Every Heritage Bite.
            </h1>

            <p className="text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed font-sans">
              Seamlessly explore and order our culinary empire. From charcoal-singed tandoori tikka to slow-dum biryanis and silky butter chicken — experience {dishCount}+ authentic dishes curated fresh by master chefs.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-8 py-4 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black text-xs uppercase font-bold tracking-widest shadow-xl shadow-[#C9A227]/10 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Browse Menu ({dishCount} Dishes)</span>
              </button>

              <div className="flex items-center gap-2 px-6 py-3.5 rounded-sm bg-[#1A1A1A] border border-white/10 text-white/80 text-xs font-medium uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Express Delivery in 25 mins</span>
              </div>
            </div>

            {/* Feature stats */}
            <div className="mt-8 pt-8 flex gap-12 items-center border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-3xl font-serif text-[#C9A227]">{dishCount}+</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Authentic Dishes</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-3xl font-serif text-[#C9A227]">12k</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Orders Served</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-3xl font-serif text-[#C9A227]">4.9 ★</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#1A1A1A] shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=1000"
                  alt="Royal Butter Chicken"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />

                {/* Floating Dish Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#1A1A1A]/95 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A227] font-bold">Trending Dish</span>
                    <div className="text-lg font-serif italic text-white mt-0.5">Murgh Makhani Royale</div>
                    <div className="text-base font-serif text-[#C9A227]">₹429</div>
                  </div>
                  <button
                    onClick={onExploreMenu}
                    className="px-5 py-2.5 rounded-sm bg-[#C9A227] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#d8b02e] transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
