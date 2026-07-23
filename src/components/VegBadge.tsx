import React from 'react';
import { DietaryType } from '../types';

interface VegBadgeProps {
  type: DietaryType;
  showText?: boolean;
  className?: string;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ type, showText = false, className = '' }) => {
  const isVeg = type === 'VEG';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center justify-center w-4 h-4 border-2 rounded-xs p-0.5 ${
          isVeg ? 'border-emerald-500' : 'border-rose-500'
        }`}
        title={isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isVeg ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />
      </span>
      {showText && (
        <span
          className={`text-xs font-semibold ${
            isVeg ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
};
