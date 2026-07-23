import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { VegBadge } from './VegBadge';

interface CartDrawerProps {
  onCheckout: () => void;
  onBrowseMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onBrowseMenu }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    deliveryFee,
    totalAmount
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1A1A1A] border-l border-white/10 text-[#F5F5F0] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C9A227] text-black flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-serif text-white">Your Culinary Selection</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#C9A227]">{items.length} unique items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/10">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/10 text-[#C9A227] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif italic text-white">Your basket is empty</h3>
                <p className="text-xs text-white/50 max-w-xs mx-auto">
                  Explore our menu of 40+ authentic Indian starters, biryanis, curries, and desserts.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onBrowseMenu();
                  }}
                  className="px-6 py-3 rounded-sm bg-[#C9A227] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#d8b02e] transition-all"
                >
                  Browse Full Menu
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.menuItem.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#0A0A0A] border border-white/10 shrink-0 opacity-90"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <VegBadge type={item.menuItem.dietary} />
                      <h4 className="text-xs font-serif italic text-white truncate">{item.menuItem.name}</h4>
                    </div>
                    <p className="text-[11px] text-[#C9A227] font-serif">{formatINR(item.menuItem.price)} each</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 p-1 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#C9A227] w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-serif text-white">
                          {formatINR(item.menuItem.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="text-white/40 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Billing Details */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0A0A0A] space-y-3">
              {subtotal < 500 ? (
                <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 p-2.5 rounded-sm text-[11px] text-[#C9A227] flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Add {formatINR(500 - subtotal)} more for FREE Delivery!</span>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-sm text-[11px] text-emerald-300 flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Congratulations! You unlocked FREE Delivery.</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-white/50 pt-1">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-white font-serif">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Taxes (5%)</span>
                  <span className="text-white font-serif">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-serif'}>
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-white/10">
                  <span>To Pay</span>
                  <span className="text-[#C9A227] font-serif font-bold">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full mt-2 py-3.5 px-4 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
