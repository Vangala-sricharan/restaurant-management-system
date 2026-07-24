import { Category, MenuItem } from '../types.js';
import { STARTERS_ITEMS } from './dishes/starters.js';
import { SOUPS_ITEMS } from './dishes/soups.js';
import { MAIN_COURSE_ITEMS } from './dishes/mainCourse.js';
import { SOUTH_INDIAN_ITEMS } from './dishes/southIndian.js';
import { CHINESE_ITEMS } from './dishes/chinese.js';
import { BIRYANI_RICE_BREAD_ITEMS } from './dishes/biryaniAndRice.js';
import { DESSERTS_DRINKS_ITEMS } from './dishes/dessertsAndDrinks.js';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Starters', slug: 'starters', icon: 'Flame', description: 'Tandoori & sizzlers to ignite your palate' },
  { id: 'cat-2', name: 'Soups', slug: 'soups', icon: 'Soup', description: 'Aromatic piping hot broths' },
  { id: 'cat-3', name: 'North Indian', slug: 'north-indian', icon: 'UtensilsCrossed', description: 'Rich gravies & heritage Mughlai classics' },
  { id: 'cat-4', name: 'South Indian', slug: 'south-indian', icon: 'CookingPot', description: 'Crispy dosas, soft idlis & traditional sambar' },
  { id: 'cat-5', name: 'Chinese', slug: 'chinese', icon: 'Bowl', description: 'Indo-Chinese noodles, manchurian & fried rice' },
  { id: 'cat-6', name: 'Biryani', slug: 'biryani', icon: 'Drumstick', description: 'Slow-cooked aromatic dum biryanis with spices' },
  { id: 'cat-7', name: 'Rice', slug: 'rice', icon: 'Wheat', description: 'Basmati rice delicacies & jeera pullao' },
  { id: 'cat-8', name: 'Bread', slug: 'bread', icon: 'Sandwich', description: 'Freshly baked tandoori naans, rotis & parathas' },
  { id: 'cat-9', name: 'Paneer', slug: 'paneer', icon: 'Cheese', description: 'Succulent cottage cheese in rich artisanal gravies' },
  { id: 'cat-10', name: 'Chicken', slug: 'chicken', icon: 'Beef', description: 'Tender chicken preparations cooked to perfection' },
  { id: 'cat-11', name: 'Seafood', slug: 'seafood', icon: 'Fish', description: 'Fresh coastal fish & prawn curries' },
  { id: 'cat-12', name: 'Desserts', slug: 'desserts', icon: 'Dessert', description: 'Classic Indian sweets & gulab jamun' },
  { id: 'cat-13', name: 'Ice Cream', slug: 'ice-cream', icon: 'IceCream', description: 'Creamy scoops & artisanal kulfis' },
  { id: 'cat-14', name: 'Beverages', slug: 'beverages', icon: 'Coffee', description: 'Kulhad chai, mango lassi & cooling drinks' },
  { id: 'cat-15', name: 'Juices', slug: 'juices', icon: 'GlassWater', description: '100% cold-pressed fresh fruit juices' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  ...STARTERS_ITEMS,
  ...SOUPS_ITEMS,
  ...MAIN_COURSE_ITEMS,
  ...SOUTH_INDIAN_ITEMS,
  ...CHINESE_ITEMS,
  ...BIRYANI_RICE_BREAD_ITEMS,
  ...DESSERTS_DRINKS_ITEMS
];
