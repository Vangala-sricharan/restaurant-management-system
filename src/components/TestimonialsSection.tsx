import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Mukherjee',
      role: 'Food Critic, Mumbai Times',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'The Butter Chicken and Garlic Naan at RestaurantHub are unmatched in tenderness and authentic clay oven smoky aroma. Ordering online is seamless and lightning fast!',
      rating: 5
    },
    {
      id: 2,
      name: 'Rohan Mehta',
      role: 'Regular Diner & Tech Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'The Hyderabadi Chicken Dum Biryani has perfect long-grain rice and tender chicken chunks. Their express 25-minute delivery never misses a beat.',
      rating: 5
    },
    {
      id: 3,
      name: 'Ananya Deshmukh',
      role: 'Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      comment: 'I love that their entire menu clearly highlights Veg and Non-Veg items with prices in INR. The Paneer Butter Masala and Gulab Jamun with Rabri are heavenly!',
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-[#0a0b0e] border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Patron Love</span>
          <h2 className="text-3xl font-black text-white font-serif mt-1">Loved By 12,000+ Foodies</h2>
          <p className="text-xs text-slate-400 mt-2">Read real experiences from our valued customers across India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-[#161920] p-6 rounded-2xl border border-amber-900/30 relative flex flex-col justify-between hover:border-amber-500/50 transition-all"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-amber-500/10 pointer-events-none" />

              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-amber-900/20">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-amber-500/80">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
