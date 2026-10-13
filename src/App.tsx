import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { FeaturedCollections } from './components/FeaturedCollections';
import { SeasonalPromoBanner } from './components/SeasonalPromoBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { InstagramSection } from './components/InstagramSection';
import { ReelModal } from './components/ReelModal';
import { NewsletterSection } from './components/NewsletterSection';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminDashboard } from './admin/AdminDashboard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  ShoppingBag,
  Filter,
} from 'lucide-react';

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const MainStorefront: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    categories,
    language,
    settings,
    isAdminView,
    loading,
    t,
  } = useStore();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const isAr = language === 'ar';

  // Filter products by activeCategory, in-stock, and searchQuery
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filtering with intelligent cross-category matching
        if (activeCategory === 'cat-new') {
          if (!p.isNewArrival && p.category !== 'cat-new') return false;
        } else if (activeCategory === 'cat-sale') {
          if ((!p.salePrice || p.salePrice >= p.price) && p.category !== 'cat-sale') return false;
        } else if (activeCategory === 'cat-knitwear') {
          const isKnit =
            p.category === 'cat-knitwear' ||
            p.slug.includes('knit') ||
            p.slug.includes('cardigan') ||
            p.slug.includes('sweater');
          if (!isKnit) return false;
        } else if (activeCategory === 'cat-vests') {
          const isVest =
            p.category === 'cat-vests' ||
            p.slug.includes('vest') ||
            p.slug.includes('cardigan');
          if (!isVest) return false;
        } else if (activeCategory === 'cat-tops') {
          const isTop =
            p.category === 'cat-tops' ||
            p.slug.includes('sweatshirt') ||
            p.slug.includes('shirt') ||
            p.slug.includes('top');
          if (!isTop) return false;
        } else if (activeCategory === 'cat-trousers') {
          const isPants =
            p.category === 'cat-trousers' ||
            p.slug.includes('palazzo') ||
            p.slug.includes('trousers') ||
            p.slug.includes('jeans');
          if (!isPants) return false;
        } else if (activeCategory === 'cat-dresses') {
          const isDress =
            p.category === 'cat-dresses' ||
            p.slug.includes('kaftan') ||
            p.slug.includes('gown') ||
            p.slug.includes('dress') ||
            p.slug.includes('abaya');
          if (!isDress) return false;
        } else if (activeCategory === 'cat-sets') {
          const isSet =
            p.category === 'cat-sets' ||
            p.slug.includes('set') ||
            p.slug.includes('outfit');
          if (!isSet) return false;
        } else if (activeCategory === 'cat-accessories') {
          const isAcc =
            p.category === 'cat-accessories' ||
            p.slug.includes('bag') ||
            p.slug.includes('tote') ||
            p.slug.includes('clutch');
          if (!isAcc) return false;
        } else if (activeCategory !== 'all') {
          if (p.category !== activeCategory) return false;
        }

        // In-stock toggle
        if (onlyInStock && p.stock <= 0) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName =
            p.name.en.toLowerCase().includes(q) || p.name.ar.toLowerCase().includes(q);
          const matchDesc =
            p.description.en.toLowerCase().includes(q) ||
            p.description.ar.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          return matchName || matchDesc || matchSku;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'price-asc') {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        }
        if (sortBy === 'price-desc') {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        }
        // 'featured'
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, onlyInStock, sortBy]);

  // Curated subsets for dedicated homepage sections
  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNewArrival).slice(0, 4);
  }, [products]);

  const bestSellers = useMemo(() => {
    return products.filter((p) => p.isBestSeller).slice(0, 4);
  }, [products]);

  const accessoriesList = useMemo(() => {
    return products
      .filter((p) => p.category === 'cat-accessories' || p.slug.includes('bag'))
      .slice(0, 4);
  }, [products]);

  const activeCatObj = useMemo(() => {
    return categories.find((c) => c.id === activeCategory);
  }, [categories, activeCategory]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-[#C5A880]/30 selection:text-stone-900 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Category Navigation Bar */}
      <CategoryBar />

      {/* 3. Featured Collections (Visual Lookbook & Category Cards) */}
      <FeaturedCollections />

      {/* 4. New Arrivals Section (Clean 4-column desktop grid / 2-column mobile) */}
      {newArrivals.length > 0 && activeCategory === 'all' && !searchQuery && (
        <section className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full border-b border-stone-200/60 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A5855A] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="truncate">{isAr ? 'وصل حديثاً إلى البوتيك' : 'Fresh Seasonal Arrivals'}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-stone-900 break-words">
                {isAr ? 'أحدث التصاميم الحصرية لهذا الأسبوع' : 'New Arrivals · Just In'}
              </h2>
            </div>

            <button
              onClick={() => {
                setActiveCategory('cat-new');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-[#A5855A] flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
            >
              <span>{isAr ? 'عرض جميع القطع الجديدة' : 'View All New Pieces'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Seasonal Promotional Banner (Spring/Summer Edit + Delivery Privilege) */}
      <SeasonalPromoBanner />

      {/* 6. Best Sellers Section (Clean 4-column desktop grid / 2-column mobile) */}
      {bestSellers.length > 0 && activeCategory === 'all' && !searchQuery && (
        <section className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full border-b border-stone-200/60 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A5855A] font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="truncate">{isAr ? 'الأكثر طلباً ومحبة' : 'Most Loved Across Lebanon'}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-stone-900 break-words">
                {isAr ? 'التصاميم الأكثر طلباً في المتجر' : 'Best Sellers · Iconic Outfits'}
              </h2>
            </div>

            <div className="text-xs text-stone-500 hidden sm:block">
              {isAr
                ? 'قطع مميزة حازت على إعجاب زبائننا في كافة أنحاء لبنان'
                : 'Signature silhouettes celebrated for exceptional quality & fit'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Main Catalog Section with Smart Filter & Sort Bar */}
      <section id="catalog-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex-1 w-full max-w-full overflow-hidden">
        
        {/* Section Heading & Result Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-200/80 w-full min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A5855A] font-semibold mb-1">
              <span>{isAr ? 'المتجر الإلكتروني' : 'Boutique Catalog'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{filteredProducts.length} {isAr ? 'قطعة' : 'pieces'}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-stone-900 break-words">
              {activeCategory === 'all'
                ? t('catalog.allTitle', 'All Signature Creations', 'جميع التصاميم المميزة')
                : isAr
                ? activeCatObj?.name.ar
                : activeCatObj?.name.en}
            </h2>
            {searchQuery && (
              <p className="text-xs text-stone-500 mt-1 truncate">
                {t('catalog.searchFor', 'Showing results for:', 'نتائج البحث عن:')}{' '}
                <span className="font-semibold text-stone-800">"{searchQuery}"</span>
              </p>
            )}
          </div>

          {/* Filter Toolbar: Sort & In-Stock */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 max-w-full">
            {/* In-Stock Filter Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer bg-white px-2.5 sm:px-3 py-1.5 border border-stone-200 rounded-xs select-none shrink-0">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#C5A880] rounded"
              />
              <span className="whitespace-nowrap">{isAr ? 'المتوفر فقط' : 'In Stock Only'}</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3 py-1.5 border border-stone-200 rounded-xs text-xs text-stone-700 min-w-0 max-w-full">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-stone-800 focus:outline-none cursor-pointer text-xs max-w-[130px] sm:max-w-none truncate"
              >
                <option value="featured">{isAr ? 'المميزة أولاً' : 'Featured'}</option>
                <option value="newest">{isAr ? 'الأحدث' : 'Newest Arrivals'}</option>
                <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>

            {/* Clear Filters Button if filtered */}
            {(activeCategory !== 'all' || searchQuery || onlyInStock) && (
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setOnlyInStock(false);
                  setSortBy('featured');
                }}
                className="text-xs text-[#A5855A] hover:underline font-medium px-2 py-1 shrink-0"
              >
                {isAr ? 'إعادة ضبط' : 'Reset'}
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid: 4 columns desktop / 3 tablet / 2 mobile */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-stone-100/80 border border-stone-200/70 rounded-xs aspect-3/4 animate-pulse p-3 sm:p-4 flex flex-col justify-end gap-2"
              >
                <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                <div className="h-3 bg-stone-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 sm:py-20 text-center space-y-4 bg-stone-100/50 rounded border border-stone-200 px-4">
            <Search className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg text-stone-800">
              {t('catalog.noProducts', 'No creations found', 'لم نتمكن من العثور على تصاميم مطابقة')}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {t('catalog.noProductsDesc', 'Try selecting another category or clearing your search.', 'جربي اختيار قسم آخر أو تغيير كلمات البحث.')}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
              }}
              className="mt-2 px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold rounded-xs"
            >
              {isAr ? 'عرض كافة التصاميم' : 'View All Creations'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* 8. Featured Accessories Spotlight Section */}
      {accessoriesList.length > 0 && activeCategory === 'all' && !searchQuery && (
        <section className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full border-t border-stone-200/60 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A5855A] font-semibold mb-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="truncate">{isAr ? 'إكسسوارات وحقائب فاخرة' : 'Haute Accessories & Bags'}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-stone-900 break-words">
                {isAr ? 'لمسات مكملة لإطلالتكِ الراقية' : 'Featured Accessories & Statement Handbags'}
              </h2>
            </div>

            <button
              onClick={() => {
                setActiveCategory('cat-accessories');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-[#A5855A] flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
            >
              <span>{isAr ? 'استكشفي الحقائب والإكسسوارات' : 'View All Accessories'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
            {accessoriesList.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 9. Atelier Craftsmanship & Lebanese Heritage Banner */}
      <section className="bg-[#141413] text-stone-100 py-12 sm:py-16 my-8 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left">
            
            <div className="space-y-2 p-2 sm:p-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#C5A880] mx-auto md:mx-0 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-medium text-stone-50">
                {isAr ? 'حرفية وتطريز لبناني فاخر' : 'Lebanese Couture Craftsmanship'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {isAr
                  ? 'كل قطعة تحاك بعناية فائقة باستخدام كروشيه يدوي متقن وخامات ناعمة ومطرزات ذهبية راقية.'
                  : 'Every silhouette is meticulously tailored using artisanal crochet, gold thread embroidery, and premium fabrics.'}
              </p>
            </div>

            <div className="space-y-2 p-2 sm:p-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#C5A880] mx-auto md:mx-0 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-medium text-stone-50">
                {isAr ? 'الدفع عند الاستلام والاستبدال' : 'Cash on Delivery & Easy Exchange'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {isAr
                  ? 'تسوقي باطمئنان تام مع خيار الدفع نقداً بالدولار أو الليرة عند الاستلام، وسياسة استبدال مرنة لضمان رضاكِ.'
                  : 'Shop with complete peace of mind. Pay in USD cash or LBP upon delivery with a flexible 3-day exchange policy.'}
              </p>
            </div>

            <div className="space-y-2 p-2 sm:p-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#C5A880] mx-auto md:mx-0 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-medium text-stone-50">
                {isAr ? 'طلب فوري ومباشر عبر واتساب' : 'Seamless WhatsApp Concierge'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {isAr
                  ? 'استشارة فورية مع فريق البوتيك لمساعدتكِ باختيار المقاس واللون وتأكيد موعد التسليم (+961 81 522 399).'
                  : 'Direct styling advice, custom sizing coordination, and instant order confirmation on WhatsApp (+961 81 522 399).'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Instagram Feed & Reels Section */}
      <InstagramSection />

      {/* 11. Newsletter Subscription Section */}
      <NewsletterSection />

      {/* 12. Elegant Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductModal />
      <ReelModal />
      <WhatsAppFloatingButton />
    </div>
  );
};

const StorefrontContent: React.FC = () => {
  const { isAdminView } = useStore();
  if (isAdminView) {
    return <AdminDashboard />;
  }
  return <MainStorefront />;
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
