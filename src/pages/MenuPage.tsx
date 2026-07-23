import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, UtensilsCrossed, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { CATEGORIES } from '../data/seedData';
import { DishCard } from '../components/DishCard';

interface MenuPageProps {
  initialCategory?: string;
}

export const MenuPage: React.FC<MenuPageProps> = ({ initialCategory = 'All' }) => {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDietary, setSelectedDietary] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (selectedCategory && selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (selectedDietary !== 'ALL') queryParams.set('dietary', selectedDietary);
        if (sortBy) queryParams.set('sort', sortBy);

        const res = await fetch(`/api/dishes?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setDishes(data);
        }
      } catch (err) {
        console.error('Failed to fetch dishes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [search, selectedCategory, selectedDietary, sortBy]);

  const categoriesList = useMemo(() => ['All', ...CATEGORIES.map(c => c.name)], []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-[0.3em]">
            Aromatic Delights
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white">
            Authentic Indian Menu
          </h1>
          <p className="text-xs text-white/50">
            Handcrafted with freshly ground spices, organic herbs, and pure ghee. All prices displayed in Indian Rupees (₹).
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search Paneer Butter Masala, Biryani, Naan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#C9A227] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-[#C9A227] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Toggle (Veg / Non-Veg / All) */}
            <div className="lg:col-span-4 flex items-center justify-center bg-[#0A0A0A] p-1 rounded-sm border border-white/10">
              <button
                onClick={() => setSelectedDietary('ALL')}
                className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-all ${
                  selectedDietary === 'ALL'
                    ? 'bg-[#C9A227] text-black shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setSelectedDietary('VEG')}
                className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all ${
                  selectedDietary === 'VEG'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/50 hover:text-emerald-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setSelectedDietary('NON_VEG')}
                className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all ${
                  selectedDietary === 'NON_VEG'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-white/50 hover:text-rose-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Sorting */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#C9A227] shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full bg-[#0A0A0A] border border-white/10 text-white text-xs uppercase tracking-wider rounded-sm px-3 py-2.5 focus:outline-none focus:border-[#C9A227]"
              >
                <option value="popular">Sort: Bestsellers</option>
                <option value="price_asc">Price: Low to High (₹)</option>
                <option value="price_desc">Price: High to Low (₹)</option>
                <option value="rating">Highest Rated ★</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'bg-[#0A0A0A] border border-white/10 text-white/70 hover:border-[#C9A227]/40 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-white/40 uppercase tracking-widest">
          <span>Showing <strong className="text-[#C9A227]">{dishes.length}</strong> delicacies</span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-[#C9A227] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-white/40 uppercase tracking-widest">Loading culinary items...</p>
          </div>
        ) : dishes.length === 0 ? (
          <div className="py-20 text-center bg-[#1A1A1A] rounded-2xl border border-white/10 space-y-4">
            <UtensilsCrossed className="w-12 h-12 text-[#C9A227]/40 mx-auto" />
            <h3 className="text-lg font-serif italic text-white">No dishes match your filter</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Try searching for something else or clearing search and category filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedDietary('ALL');
              }}
              className="px-5 py-2.5 rounded-sm bg-[#C9A227] text-black font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dishes.map(dish => (
              <DishCard key={dish.id} item={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
