import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, MenuItem, Category, Order, AdminStats } from '../types.js';
import { CATEGORIES, INITIAL_MENU_ITEMS } from '../data/seedData.js';

const READONLY_SEED_FILE = path.join(process.cwd(), 'restauranthub_data.json');
const WRITEABLE_DB_FILE = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'restauranthub_data.json')
  : path.join(process.cwd(), 'restauranthub_data.json');

interface DbSchema {
  users: User[];
  passwordHashes: Record<string, string>; // userId -> hashedPassword
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
}

let memoryDb: DbSchema = {
  users: [],
  passwordHashes: {},
  menuItems: [],
  categories: [],
  orders: []
};

let dbInitialized = false;

export async function ensureDbInitialized() {
  if (!dbInitialized || memoryDb.users.length === 0) {
    await initDb();
    dbInitialized = true;
  }
}

// Initialize DB with seed data if not present
export async function initDb() {
  if (fs.existsSync(WRITEABLE_DB_FILE)) {
    try {
      const data = fs.readFileSync(WRITEABLE_DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      console.log('Loaded database from', WRITEABLE_DB_FILE);
      dbInitialized = true;
      return;
    } catch (e) {
      console.error('Failed to parse writeable database file, falling back to seed...', e);
    }
  }

  if (fs.existsSync(READONLY_SEED_FILE) && READONLY_SEED_FILE !== WRITEABLE_DB_FILE) {
    try {
      const data = fs.readFileSync(READONLY_SEED_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      console.log('Loaded seed database from', READONLY_SEED_FILE);
      dbInitialized = true;
      saveDb();
      return;
    } catch (e) {
      console.error('Failed to parse seed file, re-seeding...', e);
    }
  }

  console.log('Seeding database with demo users, categories, and 40 Indian dishes...');
  
  // Hash demo passwords
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  const adminUser: User = {
    id: 'usr-admin-1',
    name: 'Chef Rajat (Admin)',
    email: 'admin@restauranthub.com',
    role: 'ADMIN',
    phone: '+91 98765 43210',
    address: 'RestaurantHub Flagship, Bandra West, Mumbai, Maharashtra 400050',
    createdAt: new Date().toISOString()
  };

  const customerUser: User = {
    id: 'usr-customer-1',
    name: 'Aarav Sharma',
    email: 'user@example.com',
    role: 'CUSTOMER',
    phone: '+91 98123 45678',
    address: 'Flat 402, Lotus Towers, Koramangala 4th Block, Bengaluru, Karnataka 560034',
    createdAt: new Date().toISOString()
  };

  const initialOrders: Order[] = [
    {
      id: 'ORD-1001',
      userId: customerUser.id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone!,
      deliveryAddress: customerUser.address!,
      items: [
        {
          id: 'item-1',
          menuItemId: 'dish-26',
          name: 'Butter Chicken (Murgh Makhani)',
          price: 429,
          quantity: 2,
          imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'item-2',
          menuItemId: 'dish-21',
          name: 'Garlic Naan',
          price: 69,
          quantity: 4,
          imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'item-3',
          menuItemId: 'dish-37',
          name: 'Mango Lassi',
          price: 119,
          quantity: 2,
          imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800'
        }
      ],
      subtotal: 1372,
      tax: 68,
      deliveryFee: 49,
      totalAmount: 1489,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Completed',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'ORD-1002',
      userId: customerUser.id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone!,
      deliveryAddress: customerUser.address!,
      items: [
        {
          id: 'item-4',
          menuItemId: 'dish-17',
          name: 'Chicken Dum Biryani',
          price: 399,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'item-5',
          menuItemId: 'dish-32',
          name: 'Gulab Jamun with Rabri (2 pcs)',
          price: 149,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
        }
      ],
      subtotal: 548,
      tax: 27,
      deliveryFee: 49,
      totalAmount: 624,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Preparing',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString()
    }
  ];

  memoryDb = {
    users: [adminUser, customerUser],
    passwordHashes: {
      [adminUser.id]: adminHash,
      [customerUser.id]: userHash
    },
    menuItems: INITIAL_MENU_ITEMS,
    categories: CATEGORIES,
    orders: initialOrders
  };

  saveDb();
}

export function saveDb() {
  try {
    const dir = path.dirname(WRITEABLE_DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(WRITEABLE_DB_FILE, JSON.stringify(memoryDb, null, 2));
  } catch (e) {
    console.error('Failed to save DB to file', e);
  }
}

// User methods
export function findUserByEmail(email: string): User | undefined {
  return memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return memoryDb.users.find(u => u.id === id);
}

export function getPasswordHash(userId: string): string | undefined {
  return memoryDb.passwordHashes[userId];
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: 'ADMIN' | 'CUSTOMER';
}): Promise<User> {
  const existing = findUserByEmail(userData.email);
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser: User = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: userData.name,
    email: userData.email,
    role: userData.role || 'CUSTOMER',
    phone: userData.phone || '',
    address: userData.address || '',
    createdAt: new Date().toISOString()
  };

  memoryDb.users.push(newUser);
  memoryDb.passwordHashes[newUser.id] = hashedPassword;
  saveDb();
  return newUser;
}

export function updateUserProfile(userId: string, data: { name?: string; phone?: string; address?: string }): User {
  const user = memoryDb.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (data.name) user.name = data.name;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.address !== undefined) user.address = data.address;
  saveDb();
  return user;
}

// Menu methods
export function getMenuItems(filters?: {
  search?: string;
  category?: string;
  dietary?: string;
  sort?: string;
}): MenuItem[] {
  let items = [...memoryDb.menuItems];

  if (filters?.category && filters.category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === filters.category?.toLowerCase());
  }

  if (filters?.dietary && filters.dietary !== 'ALL') {
    items = items.filter(i => i.dietary === filters.dietary);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }

  if (filters?.sort) {
    if (filters.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sort === 'popular') {
      items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
  }

  return items;
}

export function addMenuItem(dish: Omit<MenuItem, 'id'>): MenuItem {
  const newDish: MenuItem = {
    ...dish,
    id: `dish-${Date.now()}`
  };
  memoryDb.menuItems.unshift(newDish);
  saveDb();
  return newDish;
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem {
  const index = memoryDb.menuItems.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('Menu item not found');
  }
  memoryDb.menuItems[index] = {
    ...memoryDb.menuItems[index],
    ...updates
  };
  saveDb();
  return memoryDb.menuItems[index];
}

export function deleteMenuItem(id: string): void {
  memoryDb.menuItems = memoryDb.menuItems.filter(m => m.id !== id);
  saveDb();
}

export function getCategories(): Category[] {
  return memoryDb.categories;
}

// Order methods
export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memoryDb.orders.unshift(newOrder);
  saveDb();
  return newOrder;
}

export function getUserOrders(userId: string): Order[] {
  return memoryDb.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllOrders(): Order[] {
  return memoryDb.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateOrderStatus(orderId: string, status: Order['orderStatus']): Order {
  const order = memoryDb.orders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  order.orderStatus = status;
  order.updatedAt = new Date().toISOString();
  saveDb();
  return order;
}

export function getAdminStats(): AdminStats {
  const totalRevenue = memoryDb.orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrders = memoryDb.orders.length;
  const totalCustomers = memoryDb.users.filter(u => u.role === 'CUSTOMER').length;
  const totalMenuItems = memoryDb.menuItems.length;
  const pendingOrdersCount = memoryDb.orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing').length;
  const completedOrdersCount = memoryDb.orders.filter(o => o.orderStatus === 'Completed').length;

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalMenuItems,
    pendingOrdersCount,
    completedOrdersCount
  };
}
