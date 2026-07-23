# RestaurantHub - Premium Restaurant Management System

An authentic, production-grade Restaurant Management System crafted with a dark & warm aesthetic, custom JWT authentication, real-time ordering workflow, and full administrative capabilities for 40+ Indian culinary delicacies.

---

## 🌟 Highlights & Features

- **Indian Rupee Formatting (`₹`)**: All prices are stored and formatted using the official Indian numbering system (e.g. `₹299`, `₹1,499`, `₹12,999`).
- **40+ Realistic Indian Dishes**: Categorized into 15 culinary categories (Starters, Soups, North Indian, South Indian, Chinese, Biryani, Rice, Bread, Paneer, Chicken, Seafood, Desserts, Ice Cream, Beverages, Juices).
- **Custom JWT Authentication**: Pure Node.js & Express JWT authentication with `bcryptjs` password hashing.
- **Role-Based Workflows**: Distinct views for Customers and Administrators.
- **Interactive Menu Controls**: Instant dish search, category filter pills, Veg/Non-Veg badge toggle, and price sorting (Bestsellers, Low to High, High to Low, Highest Rated).
- **Live Cart & Checkout Engine**: Slide-over food basket, GST tax calculation, free delivery thresholds, delivery address collector, Cash on Delivery, and UPI payment simulation with QR code.
- **Order History & Real-Time Tracking**: Full order lifecycle tracking with status stages (`Pending` → `Preparing` → `Completed` / `Cancelled`).
- **Admin Management Panel**:
  - Operational metrics dashboard (Total Revenue in `₹`, Total Orders, Customer Count, Active Menu Items).
  - Order Management table with real-time status updates.
  - Complete Menu Management CRUD (Add, Edit, Delete, Toggle stock).

---

## 🔑 Demo Login Credentials

### 1. Admin User
- **Email**: `admin@restauranthub.com`
- **Password**: `admin123`
- **Permissions**: Full access to Admin Dashboard, revenue metrics, order status manager, and menu editor.

### 2. Customer User
- **Email**: `user@example.com`
- **Password**: `user123`
- **Permissions**: Food browsing, cart customization, checkout, profile updates, and order history tracking.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Express.js (Node.js runtime with `tsx` & `esbuild`)
- **Authentication**: Custom JWT (`jsonwebtoken`) & `bcryptjs`
- **Bundler**: Vite & Esbuild CommonJS production server bundle

---

## 🚀 Quick Start Guide

### 1. Environment Variables
Copy `.env.example` to `.env`:
```env
JWT_SECRET="restaurant_hub_secret_key_2026"
DATABASE_URL="postgresql://user:password@localhost:5432/restauranthub"
```

### 2. Development Execution
```bash
npm install
npm run dev
```
The application boots on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Architecture

```
├── server.ts                 # Full-Stack Express API server & Vite middleware
├── src/
│   ├── components/           # UI components (Navbar, Footer, DishCard, CartDrawer, VegBadge, etc.)
│   ├── context/              # AuthContext & CartContext
│   ├── data/                 # Seed data with 40 Indian dishes & categories
│   ├── pages/                # HomePage, MenuPage, CheckoutPage, OrderHistoryPage, ProfilePage, AdminDashboard, Auth pages
│   ├── server/               # File-backed database engine with seed logic
│   ├── utils/                # Indian Rupee formatters
│   ├── types.ts              # Global TypeScript interfaces
│   ├── App.tsx               # Primary application container
│   └── main.tsx              # React DOM entry point
└── package.json
```

---

## 📜 License
Apache-2.0 License.
