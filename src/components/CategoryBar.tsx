import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoryBar: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, language, t } = useStore();

  return (
    <div className="border-y border-stone-200/80 bg-[#F7F4EF]/60 py-3 sm:py-4 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        <div
          className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 w-full max-w-full"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}
        >
          {/* All Creations Button */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider font-medium rounded transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            {t('cat.all', 'All Creations', 'جميع التصاميم')}
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const label = language === 'ar' ? cat.name.ar : cat.name.en;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider font-medium rounded transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
