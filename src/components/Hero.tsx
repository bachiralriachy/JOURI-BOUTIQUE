import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, settings, t } = useStore();

  const heroImage =
    settings?.hero?.imageUrl ||
    '/src/assets/images/hero_luxury_womens_boutique_1791816085374.jpg';

  const title =
    language === 'ar'
      ? settings?.hero?.title?.ar || 'اكتشفي أسلوبكِ الراقي والفريد'
      : settings?.hero?.title?.en || 'Discover Your Elegant Style';

  const subtitle =
    language === 'ar'
      ? settings?.hero?.subtitle?.ar ||
        'أزياء خالدة، تفاصيل مميزة، وأناقة لا تتلاشى تناسب كل لحظاتكِ الجميلة.'
      : settings?.hero?.subtitle?.en ||
        'Timeless fashion, beautiful details, and effortless elegance.';

  const ctaText =
    language === 'ar'
      ? settings?.hero?.ctaText?.ar || 'تسوقي الآن'
      : settings?.hero?.ctaText?.en || 'Shop Now';

  const whatsappNum = settings?.whatsappNumber || '96181522399';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFF8F8] to-[#FAF8F5] border-b border-stone-200/60 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 sm:space-y-6 text-stone-900 z-10 min-w-0">
            
            {/* Editorial Kicker with blush & rose accent */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A5855A] font-semibold min-w-0">
              <span className="text-[#C5A880] shrink-0">JOURI BOUTIQUE</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{language === 'ar' ? 'تشكيلة 2026 الحصرية' : '2026 Collection'}</span>
            </div>

            {/* Display Headline */}
            <h1
              className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900 leading-[1.18] break-words"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sm sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl break-words">
              {subtitle}
            </p>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2 max-w-full">
              <button
                onClick={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 sm:px-7 py-3 sm:py-3.5 bg-stone-900 text-stone-50 hover:bg-[#A5855A] rounded-xs text-xs sm:text-sm uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 sm:gap-2.5 shadow-md group whitespace-nowrap shrink-0"
              >
                <span>{ctaText}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                  language === 'ar'
                    ? 'مرحباً جوري بوتيك! أود الاطلاع على أحدث التشكيلات والطلب عبر واتساب.'
                    : 'Hello Jouri Boutique! I would like to inquire about the new arrivals and order via WhatsApp.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 sm:px-5 py-3 sm:py-3.5 border border-stone-300 hover:border-stone-900 text-stone-800 hover:text-stone-950 rounded-xs text-xs sm:text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2 whitespace-nowrap bg-white/60 shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-[#0B6640]" />
                <span>{t('hero.whatsapp', 'WhatsApp Concierge', 'استشارة عبر واتساب')}</span>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-5 sm:pt-6 border-t border-stone-200/90 flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-x-6 text-[11px] sm:text-xs text-stone-500 font-medium">
              <span>{t('trust.delivery', 'Delivery across all Lebanon', 'توصيل لكافة الأراضي اللبنانية')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('trust.cash', 'Cash on Delivery (USD / LBP)', 'الدفع عند الاستلام متاح')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('trust.bespoke', 'Authentic Handcraft & Crochet', 'كروشيه وتطريز يدوي متقن')}</span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Editorial Hero Imagery */}
          <div className="lg:col-span-7 relative w-full max-w-full">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-sm overflow-hidden bg-stone-200 shadow-xl sm:shadow-2xl border border-stone-200/70 group w-full">
              <img
                src={heroImage}
                alt="JOURI BOUTIQUE Luxury Women's Fashion"
                width={1200}
                height={900}
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Refined subtle vignette & caption scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent pointer-events-none" />

              {/* Quiet editorial watermark card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-sm bg-stone-900/85 backdrop-blur-md text-stone-100 p-3 sm:p-4 rounded-xs border border-stone-800/80">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C5A880] font-semibold mb-0.5 sm:mb-1">
                  {language === 'ar' ? 'المجموعة الحصرية 2026' : 'Exclusive 2026 Collection'}
                </p>
                <p className="text-[11px] sm:text-xs font-serif leading-snug">
                  {language === 'ar'
                    ? 'أطقم كروشيه يدوية، كنزات ناعمة، قفاطين مطرزة بالذهب وحقائب جلدية مميزة'
                    : 'Handcrafted crochet vests, ribbed knitwear, gold kaftans & designer leather bags'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
