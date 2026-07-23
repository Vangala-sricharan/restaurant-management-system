import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  ensureDbInitialized,
  findUserByEmail,
  findUserById,
  getPasswordHash,
  createUser,
  updateUserProfile,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getAdminStats
} from './db';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'restaurant_hub_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// Auth Middleware
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

const app = express();
app.use(express.json());

// Ensure DB is initialized before processing requests
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (error) {
    console.error('Error initializing DB:', error);
    next(error);
  }
});

const router = express.Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'RestaurantHub API' });
});

// Auth Routes
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await createUser({
      name,
      email,
      password,
      phone,
      address,
      role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const hash = getPasswordHash(user.id);
    if (!hash) {
      return res.status(401).json({ message: 'Authentication error' });
    }

    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
});

router.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user });
});

router.put('/user/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const updatedUser = updateUserProfile(req.user!.id, { name, phone, address });
    res.json({ user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
});

// Public Menu & Categories Routes
router.get('/dishes', (req: Request, res: Response) => {
  const { search, category, dietary, sort } = req.query;
  const items = getMenuItems({
    search: search as string,
    category: category as string,
    dietary: dietary as string,
    sort: sort as string
  });
  res.json(items);
});

router.get('/categories', (req: Request, res: Response) => {
  const categories = getCategories();
  res.json(categories);
});

// Orders Routes
router.post('/orders', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { items, customerName, customerPhone, deliveryAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!customerName || !customerPhone || !deliveryAddress) {
      return res.status(400).json({ message: 'Customer details and address are required' });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const deliveryFee = subtotal > 500 ? 0 : 49; // Free delivery over ₹500
    const totalAmount = subtotal + tax + deliveryFee;

    const order = createOrder({
      userId: req.user!.id,
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      orderStatus: 'Pending'
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
});

router.get('/orders/user', authenticateToken, (req: AuthRequest, res: Response) => {
  const orders = getUserOrders(req.user!.id);
  res.json(orders);
});

// Admin Routes
router.get('/admin/stats', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const stats = getAdminStats();
  res.json(stats);
});

router.get('/admin/orders', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const orders = getAllOrders();
  res.json(orders);
});

router.patch('/admin/orders/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const order = updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update order status' });
  }
});

router.post('/admin/dishes', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, imageUrl, category, dietary, spiciness, preparationTime } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const dish = addMenuItem({
      name,
      description: description || '',
      price: Number(price),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      category,
      dietary: dietary === 'NON_VEG' ? 'NON_VEG' : 'VEG',
      rating: 4.8,
      isPopular: false,
      isAvailable: true,
      spiciness: spiciness || 'Medium',
      preparationTime: preparationTime || '20 mins'
    });

    res.status(201).json(dish);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add dish' });
  }
});

router.put('/admin/dishes/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const dish = updateMenuItem(req.params.id, req.body);
    res.json(dish);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update dish' });
  }
});

router.delete('/admin/dishes/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    deleteMenuItem(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to delete dish' });
  }
});

// Mount router on BOTH '/api' and '/' for dual path support
app.use('/api', router);
app.use('/', router);

export default app;
