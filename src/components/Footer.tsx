import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-white/60 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center text-black font-bold">
                <UtensilsCrossed className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-serif text-white">
                RestaurantHub<span className="text-[#C9A227]">.</span>
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Crafting authentic Indian culinary experiences with hand-selected spices, traditional clay tandoors, and heritage royal recipes.
            </p>
            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C9A227] bg-[#1A1A1A] p-3 rounded-sm border border-white/10 w-fit">
              <span>Pure Ingredients</span> • <span>Free Delivery over ₹500</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider">
              <li>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('menu')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Explore 40+ Dishes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('orders')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Our Culinary Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings & Specialties */}
          <div>
            <h3 className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Timings & Service
            </h3>
            <ul className="space-y-3 text-xs text-white/60">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Lunch & Dinner</p>
                  <p className="text-xs">Mon - Sun: 11:30 AM - 11:30 PM</p>
                </div>
              </li>
              <li className="text-xs bg-[#1A1A1A] p-3 rounded-sm border border-white/10 text-white/70">
                <span className="text-[#C9A227] font-bold uppercase tracking-wider text-[10px] block mb-0.5">Express Delivery</span>
                Average prep time 20-25 mins across Mumbai & Metro areas.
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Contact & Location
            </h3>
            <ul className="space-y-3 text-xs text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>RestaurantHub Flagship, Bandra West, Mumbai, Maharashtra 400050</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>concierge@restauranthub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-[10px] uppercase tracking-widest text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RestaurantHub. All rights reserved.</p>
          <div className="flex items-center gap-1 text-white/50">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227] inline" />
            <span>for authentic Indian food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
