import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { VegBadge } from '../components/VegBadge';
import { CheckCircle2, ShieldCheck, QrCode, CreditCard, Truck, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { PaymentMethod } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: () => void;
  onBackToMenu: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onBackToMenu }) => {
  const { items, subtotal, tax, deliveryFee, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please complete all required contact and delivery details.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your food basket is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        deliveryAddress,
        paymentMethod,
        items: items.map(i => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          price: i.menuItem.price,
          quantity: i.quantity,
          imageUrl: i.menuItem.imageUrl
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit order');
      }

      clearCart();
      onOrderSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#C9A227] mx-auto" />
          <h2 className="text-xl font-serif text-white">Your Selection is Empty</h2>
          <p className="text-xs text-white/50">Add some delicious Indian dishes before checking out.</p>
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 rounded-sm bg-[#C9A227] text-black font-bold text-xs uppercase tracking-widest"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Back Link */}
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-widest hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <h1 className="text-3xl font-serif text-white">Checkout & Delivery</h1>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-sm text-rose-300 text-xs uppercase tracking-wider">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Delivery & Contact */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-serif text-[#C9A227] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#C9A227]" />
                <span>1. Customer & Delivery Address</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">
                    Delivery Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                    <textarea
                      required
                      rows={3}
                      placeholder="Flat/House No., Street Name, Landmark, City & Pincode"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-serif text-[#C9A227] uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C9A227]" />
                <span>2. Payment Method</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-sm border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#C9A227] bg-[#C9A227]/10 text-white font-bold'
                      : 'border-white/10 bg-[#0A0A0A] text-white/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-xs uppercase tracking-wider">UPI Payment</span>
                  </div>
                  <span className="text-[10px] text-[#C9A227] mt-2">Google Pay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-sm border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#C9A227] bg-[#C9A227]/10 text-white font-bold'
                      : 'border-white/10 bg-[#0A0A0A] text-white/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-xs uppercase tracking-wider">Cash on Delivery</span>
                  </div>
                  <span className="text-[10px] text-white/40 mt-2">Pay in cash to delivery agent</span>
                </button>
              </div>

              {/* UPI QR Simulation */}
              {paymentMethod === 'UPI' && (
                <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 bg-white rounded-md">
                    <QrCode className="w-20 h-20 text-black" />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Scan & Pay via any UPI App</p>
                    <p className="text-xs font-mono text-[#C9A227]">restauranthub@upi</p>
                    <p className="text-[10px] text-white/40">Amount payable: <strong className="text-white font-serif">{formatINR(totalAmount)}</strong></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-serif text-white border-b border-white/10 pb-3">
                Order Items ({items.length})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.menuItem.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <VegBadge type={item.menuItem.dietary} />
                      <span className="text-white/80 font-serif italic truncate">{item.menuItem.name}</span>
                      <span className="text-[#C9A227] font-bold">x{item.quantity}</span>
                    </div>
                    <span className="font-serif text-white shrink-0">
                      {formatINR(item.menuItem.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/50">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-serif">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="text-white font-serif">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-[#C9A227] font-serif font-bold">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-black" />
                <span>{isSubmitting ? 'Placing Order...' : `Confirm Order (${formatINR(totalAmount)})`}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
