import React from 'react';
import { INITIAL_MENU_ITEMS } from '../data/seedData';
import { DishCard } from './DishCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PopularDishesSectionProps {
  onExploreMenu: () => void;
}

export const PopularDishesSection: React.FC<PopularDishesSectionProps> = ({ onExploreMenu }) => {
  const popularDishes = INITIAL_MENU_ITEMS.filter(item => item.isPopular).slice(0, 8);

  return (
    <section className="py-16 bg-[#0a0b0e] border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef's Choice</span>
            </div>
            <h2 className="text-3xl font-black text-white font-serif">Most Popular Dishes</h2>
          </div>
          <button
            onClick={onExploreMenu}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDishes.map(dish => (
            <DishCard key={dish.id} item={dish} />
          ))}
        </div>
      </div>
    </section>
  );
};
