import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutSection } from './components/AboutSection';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const handleNavigateToMenu = (categoryName?: string) => {
    if (categoryName) {
      setSelectedCategoryFilter(categoryName);
    } else {
      setSelectedCategoryFilter('All');
    }
    setCurrentTab('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = () => {
    setCurrentTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f12] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Sticky Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage onNavigateToMenu={handleNavigateToMenu} />
        )}

        {currentTab === 'menu' && (
          <MenuPage initialCategory={selectedCategoryFilter} />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onBackToMenu={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'orders' && (
          <OrderHistoryPage onExploreMenu={() => handleNavigateToMenu()} />
        )}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'login' && (
          <LoginPage
            onSwitchToRegister={() => setCurrentTab('register')}
            onLoginSuccess={() => setCurrentTab(user?.role === 'ADMIN' ? 'admin' : 'menu')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onSwitchToLogin={() => setCurrentTab('login')}
            onRegisterSuccess={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}

        {currentTab === 'about' && (
          <div className="py-12">
            <AboutSection />
          </div>
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onCheckout={() => {
          if (!user) {
            setCurrentTab('login');
          } else {
            setCurrentTab('checkout');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBrowseMenu={() => handleNavigateToMenu()}
      />

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
