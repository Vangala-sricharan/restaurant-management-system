import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { PopularDishesSection } from '../components/PopularDishesSection';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

interface HomePageProps {
  onNavigateToMenu: (categoryFilter?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToMenu }) => {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100">
      <HeroSection onExploreMenu={() => onNavigateToMenu()} />
      <CategoriesSection onSelectCategory={(cat) => onNavigateToMenu(cat)} />
      <PopularDishesSection onExploreMenu={() => onNavigateToMenu()} />
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
};
