import React, { useState } from 'react';
import { Star, Plus, Minus, Flame, Clock } from 'lucide-react';
import { MenuItem } from '../types';
import { VegBadge } from './VegBadge';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface DishCardProps {
  item: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [instructions, setInstructions] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const cartEntry = items.find(i => i.menuItem.id === item.id);
  const currentQty = cartEntry ? cartEntry.quantity : 0;

  const handleAdd = () => {
    addToCart(item, 1, instructions);
    setShowNotes(false);
  };

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 hover:border-[#C9A227]/40 transition-all duration-300 hover:shadow-2xl flex flex-col overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0A0A0A]">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />

        {/* Veg/Non-Veg Badge Top Left */}
        <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-md">
          <VegBadge type={item.dietary} showText />
        </div>

        {/* Rating Top Right */}
        {item.rating && (
          <div className="absolute top-3 right-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#C9A227]/30 flex items-center gap-1 text-xs font-bold text-[#C9A227]">
            <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Popular Ribbon if true */}
        {item.isPopular && (
          <div className="absolute bottom-3 left-3 bg-[#C9A227] text-black font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-lg">
            Chef Special
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#C9A227] uppercase tracking-[0.2em] font-semibold mb-1">
            <span>{item.category}</span>
            {item.spiciness && (
              <span className="flex items-center gap-1 text-white/40 text-[10px]">
                <Flame className="w-3 h-3 text-[#C9A227] inline" />
                {item.spiciness}
              </span>
            )}
          </div>

          <h3 className="text-lg font-serif italic text-white group-hover:text-[#C9A227] transition-colors">
            {item.name}
          </h3>

          <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed font-sans">
            {item.description}
          </p>
        </div>

        {/* Footer info: Prep time & Price & Add button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[10px] text-white/40 mb-0.5 uppercase tracking-wider">
              <Clock className="w-3 h-3 text-[#C9A227]" />
              <span>{item.preparationTime || '20 mins'}</span>
            </div>
            <span className="text-lg font-serif text-[#C9A227] font-bold">
              {formatINR(item.price)}
            </span>
          </div>

          {currentQty > 0 ? (
            <div className="flex items-center gap-2 bg-[#C9A227] text-black p-1 rounded-sm shadow-lg font-bold">
              <button
                onClick={() => updateQuantity(item.id, currentQty - 1)}
                className="w-7 h-7 rounded-sm bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-black"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-xs font-bold min-w-[20px] text-center">{currentQty}</span>
              <button
                onClick={() => updateQuantity(item.id, currentQty + 1)}
                className="w-7 h-7 rounded-sm bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-black"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
