import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedCollections: React.FC = () => {
  const { categories, setActiveCategory, language, products, t } = useStore();
  const isAr = language === 'ar';

  // Filter out 'new' and 'sale' as they are meta-categories, focus on the primary fashion collections
  const curatedCategories = categories.filter(
    (c) => c.id !== 'cat-new' && c.id !== 'cat-sale'
  ).slice(0, 6);

  const getProductCount = (catId: string) => {
    return products.filter((p) => p.category === catId).length;
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7] border-b border-stone-200/60 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2.5 sm:space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A5855A] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span>{isAr ? 'تشكيلات البوتيك المميزة' : 'Curated Boutique Collections'}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-medium text-stone-900 tracking-tight break-words">
            {isAr ? 'عالم من الأناقة والتفاصيل الاستثنائية' : 'Featured Collections & Edit'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed break-words">
            {isAr
              ? 'تصفحي مجموعاتنا المختارة من أطقم الكروشيه اليدوية، السويت شيرت المقلمة، والقفاطين الملكية المصممة بعناية.'
              : 'Explore our signature handcrafted crochet sets, preppy striped sweatshirts, and gold-embroidered royal kaftans.'}
          </p>
        </div>

        {/* Collections Grid: 3 columns on tablet/desktop, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
          {curatedCategories.map((cat) => {
            const count = getProductCount(cat.id);
            const name = isAr ? cat.name.ar : cat.name.en;
            const desc = isAr ? cat.description?.ar : cat.description?.en;
            const image = cat.image || '/src/assets/images/hero_luxury_womens_boutique_1791816085374.jpg';

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative cursor-pointer overflow-hidden rounded-sm bg-stone-900 aspect-[3/4] sm:aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-stone-200/60 w-full min-w-0"
              >
                {/* Background Image */}
                <img
                  src={image}
                  alt={name}
                  width={600}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 opacity-90 group-hover:opacity-100"
                />

                {/* Subtle Luxury Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-between z-10 text-white min-w-0">
                  {/* Top Badge: Item Count */}
                  <div className="flex justify-end">
                    <span className="text-[9px] sm:text-xs font-mono uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs border border-white/30 text-stone-100 whitespace-nowrap">
                      {count} {isAr ? 'تصميم' : 'pieces'}
                    </span>
                  </div>

                  {/* Bottom Text & Action */}
                  <div className="space-y-1 sm:space-y-2 min-w-0">
                    <h3 className="font-serif text-sm sm:text-xl lg:text-2xl font-medium tracking-wide text-white group-hover:text-[#F3EFEA] transition-colors truncate">
                      {name}
                    </h3>
                    {desc && (
                      <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed opacity-90 font-light hidden xs:block">
                        {desc}
                      </p>
                    )}
                    <div className="pt-1 sm:pt-2 flex items-center gap-1.5 text-[11px] sm:text-xs text-[#E6D7BE] font-semibold tracking-wider group-hover:text-white transition-colors">
                      <span className="truncate">{isAr ? 'استكشفي المجموعة' : 'Explore Edit'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
