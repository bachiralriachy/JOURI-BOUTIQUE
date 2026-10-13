import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import officialJouriLogo from '../assets/jouri-logo.png';
import {
  ShoppingBag,
  Heart,
  Search,
  X,
  Phone,
  SlidersHorizontal,
  Menu,
  Sparkles,
  Tag,
  Coins,
  Check,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    exchangeRate,
    settings,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    categories,
    setIsAdminView,
    t,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isAr = language === 'ar';

  const storeTitle = isAr
    ? settings?.storeName?.ar || 'جوري بوتيك'
    : settings?.storeName?.en || 'JOURI BOUTIQUE';

  const logoText = settings?.logoText || 'JOURI BOUTIQUE';
  // Official circular beige Instagram profile logo (@jouriboutiquee)
  const logoSrc = (!settings?.logoUrl || settings?.logoUrl?.includes('jouriboutiquee_profile.jpg') || settings?.logoUrl?.includes('jouri_boutique_logo.svg'))
    ? officialJouriLogo
    : settings.logoUrl;

  const handleNavClick = (catId: string) => {
    setActiveCategory(catId);
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-stone-200/80 transition-colors w-full max-w-full">
      {/* 1. Top Utility Bar: Announcement, Exchange Rate, Currency Switcher (USD / LBP) & Language Switcher */}
      {settings?.announcement?.enabled && isAnnouncementVisible && (
        <div className="bg-[#141413] text-[#FAF8F5] text-xs py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-all w-full max-w-full">
          {/* Announcement text & Rate badge */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs min-w-0 truncate">
            <span className="font-normal text-stone-200 truncate">
              {isAr ? settings.announcement.text.ar : settings.announcement.text.en}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#C5A880] text-[10px] font-mono border-l border-stone-700 pl-2.5 shrink-0">
              <Coins className="w-3 h-3" />
              <span>1 USD = {exchangeRate.toLocaleString()} LBP</span>
            </span>
          </div>

          {/* Right: Currency Toggle [ USD | LBP ] & Language Switcher [ العربية | EN ] in top bar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Dynamic Currency Switcher [ USD | LBP ] */}
            <div
              className="inline-flex items-center p-0.5 bg-stone-800 rounded border border-stone-700 text-xs font-semibold shrink-0 shadow-2xs"
              role="group"
              aria-label="Currency Selector"
            >
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-1.5 sm:px-2 py-0.5 rounded-xs transition-all duration-150 text-[10px] sm:text-xs font-semibold ${
                  currency === 'USD'
                    ? 'bg-[#C5A880] text-stone-950 font-bold shadow-2xs'
                    : 'text-stone-300 hover:text-white font-medium'
                }`}
                title="Display prices in US Dollars ($)"
                aria-label="Switch currency to USD"
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setCurrency('LBP')}
                className={`px-1.5 sm:px-2 py-0.5 rounded-xs transition-all duration-150 text-[10px] sm:text-xs font-semibold ${
                  currency === 'LBP'
                    ? 'bg-[#C5A880] text-stone-950 font-bold shadow-2xs'
                    : 'text-stone-300 hover:text-white font-medium'
                }`}
                title={`Display prices in Lebanese Pounds (Rate: 1$ = ${exchangeRate.toLocaleString()} L.L.)`}
                aria-label="Switch currency to LBP"
              >
                LBP
              </button>
            </div>

            {/* Language Switcher Button [ العربية | EN ] */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wider text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              title={language === 'en' ? 'التحويل للغة العربية' : 'Switch to English'}
              aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              {language === 'en' ? 'العربية' : 'EN'}
            </button>

            <button
              onClick={() => setIsAnnouncementVisible(false)}
              className="text-stone-400 hover:text-white p-0.5 transition-colors shrink-0 ml-1 hidden sm:block"
              aria-label="Close announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Brand Header Bar: Cleanly Centered Luxury Logo & Full Space */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 h-20 sm:h-24 w-full min-w-0">
          
          {/* Left Column:
              - Mobile: Menu drawer toggle + Search trigger
              - Desktop: Direct WhatsApp Concierge hotline badge
          */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 lg:w-64 min-w-0">
            {/* Mobile Menu & Search triggers (< 1024px) */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-800 hover:text-stone-950 focus:outline-none focus:ring-1 focus:ring-stone-400 rounded-sm transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-stone-700 hover:text-stone-950 transition-colors rounded-sm"
                aria-label="Search boutique"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Desktop WhatsApp Concierge Hotline */}
            <div className="hidden lg:flex items-center">
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '96181522399'}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-full text-xs text-stone-700 hover:text-[#0B6640] transition-colors font-medium tracking-wide shadow-2xs"
                title="Direct WhatsApp Concierge"
              >
                <Phone className="w-3.5 h-3.5 text-[#0B6640]" />
                <span className="hidden xl:inline">{isAr ? 'خدمة الزبائن:' : 'Concierge:'}</span>
                <span className="font-mono text-stone-900 font-semibold">+961 81 522 399</span>
              </a>
            </div>
          </div>

          {/* Center Column:
              - Cleanly Centered Luxury Circular Logo + Brand Typography
              - Full space and focus for the official Instagram profile emblem (@jouriboutiquee)
          */}
          <div className="flex items-center justify-center flex-1 min-w-0 text-center py-1">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3.5 leading-none transition-transform hover:scale-[1.01]"
              aria-label="JOURI BOUTIQUE Home"
            >
              {/* Official Round Circular Beige Logo Badge with HD sharpness:
                  - rounded-full shadow-sm border border-[#e8ded1]
                  - Size: h-12 w-12 sm:h-14 sm:w-14
                  - object-cover / object-contain with image-rendering: -webkit-optimize-contrast
              */}
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm border border-[#e8ded1] bg-[#F4ECE1] overflow-hidden shrink-0 flex items-center justify-center group-hover:border-[#C5A880] group-hover:shadow-md transition-all">
                <img
                  src={logoSrc}
                  alt={storeTitle}
                  width={56}
                  height={56}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover rounded-full crisp-image-render"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== '/jouri-logo.png') {
                      img.src = '/jouri-logo.png';
                    }
                  }}
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col items-center sm:items-start min-w-0">
                <span className="font-serif text-lg sm:text-2xl lg:text-[25px] tracking-[0.16em] sm:tracking-[0.2em] font-bold text-stone-900 group-hover:text-[#A5855A] transition-colors uppercase whitespace-nowrap">
                  {logoText}
                </span>
                <span className="text-[8px] sm:text-[9.5px] tracking-[0.28em] text-[#A5855A] uppercase mt-0.5 sm:mt-1 font-sans font-medium">
                  {isAr ? 'أزياء راقية · بيروت' : 'Haute Couture · Beirut'}
                </span>
              </div>
            </a>
          </div>

          {/* Right Column: Actions (Search, Wishlist, Bag, Admin) */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 xl:gap-3 shrink-0 lg:w-64">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden lg:block p-2 text-stone-700 hover:text-stone-950 transition-colors shrink-0 rounded hover:bg-stone-100/70"
              aria-label="Search boutique"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Button (Tablet/Desktop) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 sm:p-2 text-stone-700 hover:text-stone-950 transition-colors hidden sm:block shrink-0 rounded hover:bg-stone-100/70"
              aria-label="Open wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C5A880] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-stone-900 text-stone-50 hover:bg-[#A5855A] rounded transition-colors whitespace-nowrap shrink-0 shadow-xs"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs font-medium tracking-wide hidden md:inline">
                {t('cart.bag', 'Bag', 'الحقيبة')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tabular-nums bg-stone-800 px-1.5 py-0.5 rounded text-stone-200">
                {cartCount}
              </span>
            </button>

            {/* Admin Portal Cog */}
            <button
              onClick={() => setIsAdminView(true)}
              className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-800 transition-colors hidden sm:block shrink-0 rounded hover:bg-stone-100/70"
              title="Admin Panel"
              aria-label="Open Admin Panel"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tier 2: Dedicated Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center flex-wrap gap-x-6 xl:gap-x-9 gap-y-2 py-2.5 border-t border-stone-200/70 text-xs xl:text-sm font-medium tracking-wide text-stone-700 w-full">
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
            onClick={() => handleNavClick('cat-accessories')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-0.5 ${
              activeCategory === 'cat-accessories'
                ? 'text-stone-950 font-semibold border-b-2 border-[#C5A880]'
                : 'hover:border-b-2 hover:border-stone-300'
            }`}
          >
            {t('nav.accessories', 'Bags & Accessories', 'حقائب وإكسسوارات')}
          </button>

          <button
            onClick={() => handleNavClick('cat-sale')}
            className={`flex items-center gap-1 font-semibold text-[#A5855A] hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeCategory === 'cat-sale'
                ? 'border-b-2 border-[#A5855A]'
                : 'hover:border-b-2 hover:border-[#A5855A]'
            }`}
          >
            <Tag className="w-3 h-3 text-[#A5855A]" />
            <span>{t('nav.sale', 'Seasonal Sale', 'عروض الموسم')}</span>
          </button>
        </nav>

        {/* Expandable Search Input Row */}
        {isSearchOpen && (
          <div className="py-2.5 sm:py-3 border-t border-stone-200/80 flex items-center gap-2 sm:gap-3 w-full">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder={t(
                'search.placeholder',
                'Search evening gowns, abayas, fabrics, SKU...',
                'ابحثي عن فساتين سهرة، عبايات، كود القطعة...'
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none min-w-0"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-600 p-1 shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Mobile Navigation Dropdown Menu (Full-width, cleanly padded) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200/80 space-y-3 w-full animate-fadeIn bg-[#FAF8F5]">
            {/* Currency & Exchange Rate Selector Banner inside Mobile Drawer */}
            <div className="p-3 bg-white rounded border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{isAr ? 'عملة عرض الأسعار:' : 'Store Currency:'}</span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  1$ = {exchangeRate.toLocaleString()} L.L.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    currency === 'USD'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>USD ($)</span>
                  {currency === 'USD' && <Check className="w-3 h-3 text-[#C5A880]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('LBP')}
                  className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    currency === 'LBP'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>LBP (ل.ل)</span>
                  {currency === 'LBP' && <Check className="w-3 h-3 text-[#C5A880]" />}
                </button>
              </div>
            </div>

            {/* Collection Links */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('all')}
                className={`block w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-[#A5855A]'
                }`}
              >
                {t('nav.all', 'All Collections', 'جميع التصاميم')}
              </button>

              <button
                onClick={() => handleNavClick('cat-new')}
                className={`flex items-center justify-between w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === 'cat-new'
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-[#A5855A]'
                }`}
              >
                <span>{t('nav.new', 'New Arrivals', 'وصل حديثاً')}</span>
                <span className="text-[10px] bg-[#C5A880] text-white px-1.5 py-0.5 rounded font-semibold uppercase">
                  New
                </span>
              </button>

              <button
                onClick={() => handleNavClick('cat-vests')}
                className={`block w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === 'cat-vests' || activeCategory === 'cat-knitwear'
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-[#A5855A]'
                }`}
              >
                {t('nav.knitwear', 'Vests & Knitwear', 'جيليهات وتريكو')}
              </button>

              <button
                onClick={() => handleNavClick('cat-dresses')}
                className={`block w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === 'cat-dresses'
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-[#A5855A]'
                }`}
              >
                {t('nav.dresses', 'Dresses & Kaftans', 'فساتين وقفاطين')}
              </button>

              <button
                onClick={() => handleNavClick('cat-sets')}
                className={`block w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === 'cat-sets'
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-[#A5855A]'
                }`}
              >
                {t('nav.sets', 'Matching Sets', 'أطقم منسقة')}
              </button>

              <button
                onClick={() => handleNavClick('cat-accessories')}
                className={`block w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === 'cat-accessories'
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-[#A5855A]'
                }`}
              >
                {t('nav.accessories', 'Bags & Accessories', 'حقائب وإكسسوارات')}
              </button>

              <button
                onClick={() => handleNavClick('cat-sale')}
                className={`flex items-center justify-between w-full text-left rtl:text-right py-2 px-3 rounded text-xs sm:text-sm font-semibold transition-colors ${
                  activeCategory === 'cat-sale'
                    ? 'bg-[#A5855A] text-white'
                    : 'text-[#A5855A] hover:bg-stone-100'
                }`}
              >
                <span>{t('nav.sale', 'Seasonal Sale', 'عروض الموسم')}</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">
                  Sale
                </span>
              </button>
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600 px-1">
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '96181522399'}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#0B6640] font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+961 81 522 399</span>
              </a>
              <button
                onClick={() => {
                  setIsWishlistOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-stone-700 font-medium"
              >
                <Heart className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>
                  {t('wishlist.title', 'Wishlist', 'المفضلة')} ({wishlistCount})
                </span>
              </button>
            </div>

            {/* Admin Dashboard Entry */}
            <div className="pt-2 border-t border-stone-100 px-1">
              <button
                onClick={() => {
                  setIsAdminView(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-800 py-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t('footer.admin', 'Admin Dashboard', 'لوحة تحكم الإدارة')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
