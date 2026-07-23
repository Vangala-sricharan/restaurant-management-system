import React from 'react';
import { CATEGORIES } from '../data/seedData';
import { Utensils, Flame, Soup, CookingPot, UtensilsCrossed, Drumstick, Wheat, Fish, Coffee, GlassWater, Cake, Sparkles, ChefHat, ArrowRight } from 'lucide-react';

interface CategoriesSectionProps {
  onSelectCategory: (categoryName: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Flame,
  Soup,
  UtensilsCrossed,
  CookingPot,
  Bowl: UtensilsCrossed,
  Drumstick,
  Wheat,
  Sandwich: Utensils,
  Cheese: ChefHat,
  Beef: Drumstick,
  Fish,
  Dessert: Cake,
  IceCream: Cake,
  Coffee,
  GlassWater
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 bg-[#0A0A0A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-[0.3em]">Culinary Spectrum</span>
            <h2 className="text-3xl font-serif text-[#F5F5F0] mt-1">Explore Dishes By Category</h2>
          </div>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-2 md:mt-0">15 authentic categories crafted for every appetite</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => {
            const IconComponent = ICON_MAP[cat.icon || 'Utensils'] || Utensils;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group bg-[#1A1A1A] border border-white/5 hover:border-[#C9A227]/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-white/10 text-[#C9A227] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#C9A227] group-hover:text-black transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="mt-4">
                  <h3 className="font-serif italic text-white text-base group-hover:text-[#C9A227] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5 font-sans">
                    {cat.description || 'Authentic delicacies'}
                  </p>
                </div>

                <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1">
                  <span>Browse Menu</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
