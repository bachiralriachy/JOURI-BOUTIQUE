import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Tag, Check, MessageCircle } from 'lucide-react';

export const SeasonalPromoBanner: React.FC = () => {
  const { language, setActiveCategory, settings, t } = useStore();
  const [copied, setCopied] = useState(false);
  const isAr = language === 'ar';
  const promoCode = 'JOURIELEGANCE';

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShopSeasonal = () => {
    setActiveCategory('cat-sale');
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#FFF5F5] via-[#FAF4ED] to-[#FFF7F0] border-y border-[#EADCCB]/80 py-10 sm:py-16 my-8 w-full max-w-full">
      {/* Decorative Champagne Accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#FFD1DC]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full">
          
          {/* Left Column: Text & Privilege Offer */}
          <div className="lg:col-span-7 space-y-4 text-stone-900 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-[#E4D1BA] rounded-xs text-xs font-semibold text-[#A5855A] uppercase tracking-[0.2em] max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span className="truncate">{isAr ? 'عرض حصري للموسم الجديد' : 'Seasonal Boutique Privilege'}</span>
            </div>

            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-stone-900 leading-snug break-words">
              {isAr
                ? 'تشكيلة الربيع والصيف · لمسات كروشيه وأناقة لا تضاهى'
                : 'Spring / Summer 2026 Haute Edition · Crafted for Elegance'}
            </h2>

            <p className="text-xs sm:text-base text-stone-600 leading-relaxed max-w-2xl break-words">
              {isAr
                ? 'استمتعي بتوصيل مجاني لكافة الأراضي اللبنانية للطلبات التي تتجاوز 100$، مع هدية خاصة عند الطلب المباشر عبر واتساب.'
                : 'Enjoy complimentary nationwide delivery across Lebanon on boutique orders exceeding $100, with bespoke packaging and instant styling support on WhatsApp.'}
            </p>

            {/* Voucher Card & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 max-w-full">
              {/* Promo Code Badge */}
              <button
                onClick={handleCopyCode}
                className="group flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xs border border-dashed border-[#C5A880] text-xs font-mono font-semibold text-stone-900 hover:border-stone-900 transition-colors shadow-xs max-w-full"
                title="Click to copy voucher code"
              >
                <Tag className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="tracking-widest font-bold">{promoCode}</span>
                <span className="text-[10px] text-stone-500 font-sans group-hover:text-stone-900 font-normal shrink-0">
                  {copied ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" /> {isAr ? 'تم النسخ!' : 'Copied!'}
                    </span>
                  ) : (
                    <span>({isAr ? 'انسخي' : 'Copy'})</span>
                  )}
                </span>
              </button>

              {/* Shop Seasonal Button */}
              <button
                onClick={handleShopSeasonal}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-stone-900 hover:bg-[#A5855A] text-stone-50 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
              >
                <span>{isAr ? 'تسوقي العروض الخاصة' : 'Shop Seasonal Edit'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Campaign Preview Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative bg-white p-2.5 sm:p-3 rounded-xs shadow-xl border border-stone-200/80 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-500 max-w-full">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xs bg-stone-100">
                <img
                  src="/src/assets/images/outfit_ivory_gold_kaftan_duster_1791815982138.jpg"
                  alt="Seasonal Collection"
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#141413]/85 text-white text-[9px] sm:text-[10px] uppercase font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wider backdrop-blur-sm rounded-xs">
                  {isAr ? 'إصدار محدود' : 'Limited Edition'}
                </div>
              </div>
              <div className="p-2 sm:p-3 flex items-center justify-between text-xs text-stone-700 gap-2 min-w-0">
                <div className="min-w-0">
                  <p className="font-serif font-medium text-stone-900 text-xs sm:text-sm truncate">
                    {isAr ? 'إطلالة قفطان الدوشيس المطرز بالذهب' : 'Ivory Gold-Embroidered Kaftan Duster'}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 font-mono truncate">
                    {isAr ? 'شامل كلاتش القش الميتاليك' : 'Includes metallic straw clutch'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('cat-dresses');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#A5855A] font-semibold hover:underline text-xs shrink-0"
                >
                  {isAr ? 'معاينة' : 'View'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
