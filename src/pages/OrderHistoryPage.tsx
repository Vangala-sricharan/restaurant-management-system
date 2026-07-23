import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, MapPin, Phone, RefreshCw } from 'lucide-react';

interface OrderHistoryPageProps {
  onExploreMenu: () => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onExploreMenu }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch user orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Order Placed (Pending)</span>
          </span>
        );
      case 'Preparing':
        return (
          <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Kitchen Preparing</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered & Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-20 text-center space-y-3 font-sans">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-white/40 uppercase tracking-widest">Fetching your order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-white">Order History</h1>
            <p className="text-xs text-white/50">Track current preparation & past culinary orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-[#1A1A1A] border border-white/10 text-[#C9A227] text-xs uppercase tracking-wider font-bold hover:border-[#C9A227]/50"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Refresh Status</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#C9A227]/40 mx-auto" />
            <h3 className="text-lg font-serif italic text-white">No past orders found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              You haven't placed any orders yet. Discover our menu of authentic dishes!
            </p>
            <button
              onClick={onExploreMenu}
              className="px-6 py-3 rounded-sm bg-[#C9A227] text-black font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Browse Menu Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl hover:border-[#C9A227]/40 transition-all"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-serif text-white">{order.id}</span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-xs text-white/40 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Paid ({order.paymentMethod})</p>
                    <p className="text-xl font-serif text-[#C9A227]">{formatINR(order.totalAmount)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-[#C9A227] uppercase tracking-[0.2em]">Ordered Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10 flex items-center gap-3"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-sm object-cover bg-black shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-serif italic text-white truncate">{item.name}</p>
                          <p className="text-white/50">
                            {formatINR(item.price)} × {item.quantity} ={' '}
                            <strong className="text-[#C9A227] font-serif">{formatINR(item.price * item.quantity)}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-3 border-t border-white/10 text-xs text-white/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
