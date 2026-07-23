import React from 'react';
import { Flame, Award, Heart, Sparkles, ChefHat } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#0d0f12] border-b border-amber-900/20 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800"
                alt="Tandoori Grill"
                className="rounded-2xl border border-amber-900/30 object-cover h-64 w-full shadow-xl"
              />
              <div className="bg-[#161920] p-5 rounded-2xl border border-amber-900/30 text-center">
                <ChefHat className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-white font-serif">Master Chefs</p>
                <p className="text-xs text-slate-400">20+ Years Heritage Experience</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-[#161920] p-5 rounded-2xl border border-amber-900/30 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-white font-serif">Traditional Clay Oven</p>
                <p className="text-xs text-slate-400">Authentic Charcoal Aromas</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800"
                alt="Paneer Gravy"
                className="rounded-2xl border border-amber-900/30 object-cover h-64 w-full shadow-xl"
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif leading-tight">
              Honoring India's Rich Gastronomic Legacy Since 2012
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              At <strong className="text-amber-400">RestaurantHub</strong>, every dish tells a story. We source hand-selected whole spices directly from Kerala spice gardens, stone-grind them daily, and slow-cook our dishes using traditional brass handis and clay tandoors.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-[#161920] p-3.5 rounded-xl border border-amber-900/20">
                <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Authentic Royal Recipes</h4>
                  <p className="text-xs text-slate-400">Heritage Mughal, Punjabi, and South Indian recipes refined over generations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#161920] p-3.5 rounded-xl border border-amber-900/20">
                <Heart className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Zero Preservatives & Pure Desi Ghee</h4>
                  <p className="text-xs text-slate-400">Prepared fresh to order using premium A2 Gir cow ghee and cold-pressed oil.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
