import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminStats, Order, MenuItem, DietaryType } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { CATEGORIES } from '../data/seedData';
import { VegBadge } from '../components/VegBadge';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  X,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders'>('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state for menu items
  const [menuSearch, setMenuSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State for Add/Edit Dish
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Form fields
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishPrice, setDishPrice] = useState<number | ''>(299);
  const [dishCategory, setDishCategory] = useState('North Indian');
  const [dishDietary, setDishDietary] = useState<DietaryType>('VEG');
  const [dishImageUrl, setDishImageUrl] = useState('');
  const [dishSpiciness, setDishSpiciness] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [dishPrepTime, setDishPrepTime] = useState('20 mins');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, dishesRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/dishes')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (dishesRes.ok) setDishes(await dishesRes.json());
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const openAddDishModal = () => {
    setEditingDish(null);
    setDishName('');
    setDishDescription('');
    setDishPrice(299);
    setDishCategory('North Indian');
    setDishDietary('VEG');
    setDishImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
    setDishSpiciness('Medium');
    setDishPrepTime('20 mins');
    setError('');
    setIsModalOpen(true);
  };

  const openEditDishModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishDescription(dish.description);
    setDishPrice(dish.price);
    setDishCategory(dish.category);
    setDishDietary(dish.dietary);
    setDishImageUrl(dish.imageUrl);
    setDishSpiciness(dish.spiciness || 'Medium');
    setDishPrepTime(dish.preparationTime || '20 mins');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !dishPrice) {
      setError('Name and price are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      name: dishName,
      description: dishDescription,
      price: Number(dishPrice),
      category: dishCategory,
      dietary: dishDietary,
      imageUrl: dishImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      spiciness: dishSpiciness,
      preparationTime: dishPrepTime
    };

    try {
      let res;
      if (editingDish) {
        res = await fetch(`/api/admin/dishes/${editingDish.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/dishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      } else {
        const d = await res.json();
        setError(d.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish from the menu?')) return;
    try {
      const res = await fetch(`/api/admin/dishes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to delete dish', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-rose-500/30 text-center space-y-4 max-w-md">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-serif text-white">Access Restricted</h2>
          <p className="text-xs text-white/50">You must be logged in as an Admin user to view this panel.</p>
        </div>
      </div>
    );
  }

  const filteredDishes = dishes.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(menuSearch.toLowerCase()) || d.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl font-serif text-white">Restaurant Operations</h1>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center bg-[#1A1A1A] p-1.5 rounded-sm border border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#C9A227] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#C9A227] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all ${
                activeTab === 'menu'
                  ? 'bg-[#C9A227] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Menu Items ({dishes.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-white/40 uppercase tracking-widest">Loading metrics...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Total Revenue</span>
                      <div className="p-2.5 rounded-sm bg-[#C9A227]/20 text-[#C9A227]">
                        <TrendingUp className="w-5 h-5 text-[#C9A227]" />
                      </div>
                    </div>
                    <p className="text-3xl font-serif text-[#C9A227] tracking-tight">
                      {formatINR(stats?.totalRevenue || 0)}
                    </p>
                    <p className="text-[10px] text-white/40">Gross orders total in Indian Rupees (₹)</p>
                  </div>

                  <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Total Orders</span>
                      <div className="p-2.5 rounded-sm bg-orange-500/20 text-orange-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-3xl font-serif text-white">{stats?.totalOrders || 0}</p>
                    <p className="text-[10px] text-[#C9A227] font-semibold">{stats?.pendingOrdersCount || 0} currently active</p>
                  </div>

                  <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Total Customers</span>
                      <div className="p-2.5 rounded-sm bg-emerald-500/20 text-emerald-400">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-3xl font-serif text-white">{stats?.totalCustomers || 0}</p>
                    <p className="text-[10px] text-white/40">Registered patron accounts</p>
                  </div>

                  <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Active Dishes</span>
                      <div className="p-2.5 rounded-sm bg-purple-500/20 text-purple-400">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-3xl font-serif text-white">{stats?.totalMenuItems || 0}</p>
                    <p className="text-[10px] text-white/40">Dishes across categories</p>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif text-white">Recent Live Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-white/80">
                      <thead className="bg-[#0A0A0A] text-[#C9A227] uppercase tracking-[0.15em] text-[10px]">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total (₹)</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-serif text-white">{o.id}</td>
                            <td className="p-3">
                              <p className="font-semibold text-white">{o.customerName}</p>
                              <p className="text-[10px] text-white/40">{o.customerPhone}</p>
                            </td>
                            <td className="p-3 max-w-xs truncate italic text-white/70">
                              {o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                            </td>
                            <td className="p-3 font-serif text-[#C9A227]">{formatINR(o.totalAmount)}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold ${
                                  o.orderStatus === 'Completed'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : o.orderStatus === 'Preparing'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : o.orderStatus === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={o.orderStatus}
                                onChange={e => handleUpdateOrderStatus(o.id, e.target.value as any)}
                                className="bg-[#0A0A0A] border border-white/10 text-[11px] text-white rounded-sm px-2 py-1 focus:outline-none focus:border-[#C9A227]"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif text-white">Order Management</h2>
                <div className="space-y-4">
                  {orders.map(o => (
                    <div
                      key={o.id}
                      className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-serif text-white">{o.id}</span>
                            <span className="text-xs text-white/40">{formatDate(o.createdAt)}</span>
                          </div>
                          <p className="text-xs text-white/70 mt-1">
                            Customer: <strong className="text-white">{o.customerName}</strong> ({o.customerPhone})
                          </p>
                          <p className="text-xs text-white/40 truncate max-w-lg">Address: {o.deliveryAddress}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Total ({o.paymentMethod})</p>
                            <p className="text-lg font-serif text-[#C9A227]">{formatINR(o.totalAmount)}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="block text-[10px] text-white/40 uppercase tracking-wider">Update Status</span>
                            <select
                              value={o.orderStatus}
                              onChange={e => handleUpdateOrderStatus(o.id, e.target.value as any)}
                              className="bg-[#0A0A0A] border border-white/10 text-xs font-bold text-[#C9A227] rounded-sm px-3 py-1.5 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {o.items.map(item => (
                          <div key={item.id} className="bg-[#0A0A0A] p-2.5 rounded-sm border border-white/10 text-xs flex justify-between items-center">
                            <div>
                              <p className="font-serif italic text-white">{item.name}</p>
                              <p className="text-[10px] text-white/40">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-serif text-[#C9A227]">{formatINR(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MENU MANAGEMENT TAB */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif text-white">Menu Management</h2>
                    <p className="text-xs text-white/50">Add, edit, or remove dishes from the dish catalog</p>
                  </div>
                  <button
                    onClick={openAddDishModal}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#C9A227] hover:bg-[#d8b02e] text-black font-bold text-xs uppercase tracking-widest shadow-lg"
                  >
                    <Plus className="w-4 h-4 text-black" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                {/* Filter */}
                <div className="flex flex-col sm:flex-row gap-3 bg-[#1A1A1A] p-4 rounded-2xl border border-white/10">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search dishes..."
                      value={menuSearch}
                      onChange={e => setMenuSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-sm bg-[#0A0A0A] text-xs text-white border border-white/10"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-[#0A0A0A] border border-white/10 text-xs text-white rounded-sm px-3 py-2"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Table */}
                <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-white/80">
                      <thead className="bg-[#0A0A0A] text-[#C9A227] uppercase tracking-[0.15em] text-[10px]">
                        <tr>
                          <th className="p-3">Dish</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Price (₹)</th>
                          <th className="p-3">Prep Time</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredDishes.map(dish => (
                          <tr key={dish.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={dish.imageUrl}
                                  alt={dish.name}
                                  className="w-10 h-10 rounded-sm object-cover bg-black"
                                />
                                <div>
                                  <p className="font-serif italic text-white">{dish.name}</p>
                                  <p className="text-[10px] text-white/40 line-clamp-1 max-w-xs">{dish.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-[#C9A227] font-semibold">{dish.category}</td>
                            <td className="p-3">
                              <VegBadge type={dish.dietary} showText />
                            </td>
                            <td className="p-3 font-serif text-[#C9A227]">{formatINR(dish.price)}</td>
                            <td className="p-3 text-white/40">{dish.preparationTime || '20 mins'}</td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => openEditDishModal(dish)}
                                className="p-1.5 rounded-sm bg-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/40"
                                title="Edit Dish"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDish(dish.id)}
                                className="p-1.5 rounded-sm bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
                                title="Delete Dish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif text-white">
                {editingDish ? 'Edit Dish Details' : 'Add New Dish to Menu'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded text-rose-300">{error}</div>}

            <form onSubmit={handleSaveDish} className="space-y-3">
              <div>
                <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer Pasanda"
                  value={dishName}
                  onChange={e => setDishName(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    value={dishPrice}
                    onChange={e => setDishPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-[#C9A227] font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Dietary Type *</label>
                  <select
                    value={dishDietary}
                    onChange={e => setDishDietary(e.target.value as DietaryType)}
                    className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white"
                  >
                    <option value="VEG">Pure Veg</option>
                    <option value="NON_VEG">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Category *</label>
                  <select
                    value={dishCategory}
                    onChange={e => setDishCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Spiciness Level</label>
                  <select
                    value={dishSpiciness}
                    onChange={e => setDishSpiciness(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={dishImageUrl}
                  onChange={e => setDishImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 uppercase tracking-wider text-[10px] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients and culinary description"
                  value={dishDescription}
                  onChange={e => setDishDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#0A0A0A] border border-white/10 text-white"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-sm bg-[#0A0A0A] border border-white/10 text-white/70 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-sm bg-[#C9A227] text-black font-bold uppercase tracking-widest shadow-lg"
                >
                  {submitting ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
