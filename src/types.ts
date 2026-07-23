export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export type DietaryType = 'VEG' | 'NON_VEG';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // Stored in INR (₹)
  imageUrl: string;
  category: string;
  dietary: DietaryType;
  rating?: number;
  isPopular?: boolean;
  isAvailable: boolean;
  spiciness?: 'Mild' | 'Medium' | 'Spicy';
  preparationTime?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  instructions?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'Cash on Delivery' | 'UPI';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number; // In INR (₹)
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number; // In INR (₹)
  tax: number; // In INR (₹)
  deliveryFee: number; // In INR (₹)
  totalAmount: number; // In INR (₹)
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalRevenue: number; // In INR (₹)
  totalOrders: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
