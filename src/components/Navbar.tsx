import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Tag, Layers, Search } from 'lucide-react';

interface NavbarProps {
  className?: string;
  showCurrencyToggle?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  className = '',
  showCurrencyToggle = false,
}) => {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    language,
    currency,
    setCurrency,
    t,
  } = useStore();

  const isAr = language === 'ar';

  const handleNavClick = (catId: string) => {
    setActiveCategory(catId);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`flex items-center justify-between flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 py-2.5 text-xs xl:text-sm font-medium tracking-wide text-stone-700 w-full ${className}`}
      aria-label="Main Store Navigation"
    >
      <div className="flex items-center justify-center flex-wrap gap-x-4 sm:gap-x-7 gap-y-2 mx-auto">
        <button
          onClick={() => handleNavClick('all')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
            activeCategory === 'all'
              ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
              : 'hover:border-b-2 hover:border-stone-300'
          }`}
        >
          {t('nav.all', 'All Collections', 'جميع التصاميم')}
        </button>

        <button
          onClick={() => handleNavClick('cat-new')}
          className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
            activeCategory === 'cat-new'
              ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
              : 'hover:border-b-2 hover:border-stone-300'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>{t('nav.new', 'New Arrivals', 'وصل حديثاً')}</span>
        </button>

        <button
          onClick={() => handleNavClick('cat-vests')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
            activeCategory === 'cat-vests' || activeCategory === 'cat-knitwear'
              ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
              : 'hover:border-b-2 hover:border-stone-300'
          }`}
        >
          {t('nav.knitwear', 'Vests & Knitwear', 'جيليهات وتريكو')}
        </button>

        <button
          onClick={() => handleNavClick('cat-dresses')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
            activeCategory === 'cat-dresses'
              ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
              : 'hover:border-b-2 hover:border-stone-300'
          }`}
        >
          {t('nav.dresses', 'Dresses & Kaftans', 'فساتين وقفاطين')}
        </button>

        <button
          onClick={() => handleNavClick('cat-sets')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
            activeCategory === 'cat-sets'
              ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
              : 'hover:border-b-2 hover:border-stone-300'
          }`}
        >
          {t('nav.sets', 'Matching Sets', 'أطقم منسقة')}
        </button>

        <button
          onClick={() => handleNavClick('cat-bags')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
            activeCategory === 'cat-bags' || activeCategory === 'cat-accessories'
              ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
              : 'hover:border-b-2 hover:border-stone-300'
          }`}
        >
          {t('nav.bags', 'Bags & Accessories', 'حقائب وإكسسوارات')}
        </button>

        <button
          onClick={() => handleNavClick('cat-sale')}
          className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeCategory === 'cat-sale'
              ? 'text-amber-800 font-bold border-b-2 border-amber-600'
              : 'text-amber-700 hover:text-amber-900 hover:border-b-2 hover:border-amber-400 font-medium'
          }`}
        >
          <Tag className="w-3 h-3 text-amber-600" />
          <span>{t('nav.sale', 'Seasonal Sale', 'عروض الموسم')}</span>
        </button>
      </div>

      {showCurrencyToggle && (
        <div className="hidden xl:inline-flex items-center p-0.5 bg-stone-100 rounded border border-stone-300 text-xs font-semibold shrink-0">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2 py-0.5 rounded-xs transition-all ${
              currency === 'USD'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Display in US Dollars ($)"
          >
            USD
          </button>
          <button
            onClick={() => setCurrency('LBP')}
            className={`px-2 py-0.5 rounded-xs transition-all ${
              currency === 'LBP'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Display in Lebanese Pounds (L.L.)"
          >
            LBP
          </button>
        </div>
      )}
    </nav>
  );
};
