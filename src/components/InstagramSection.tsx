import React from 'react';
import { useStore } from '../context/StoreContext';
import { Play, Instagram, ShoppingBag, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  const {
    instagramMedia,
    setSelectedReel,
    setSelectedProduct,
    products,
    language,
    settings,
    formatPrice,
    t,
  } = useStore();

  const isAr = language === 'ar';
  const visibleItems = instagramMedia.filter((item) => item.showOnHome);

  if (visibleItems.length === 0) return null;

  const igUrl = settings?.instagramUrl || 'https://www.instagram.com/jouriboutiquee/';
  const igHandle = settings?.instagramHandle || '@jouriboutiquee';
  const avatar = settings?.logoUrl && !settings.logoUrl.includes('jouriboutiquee_profile.jpg') && !settings.logoUrl.includes('jouri_boutique_logo.svg')
    ? settings.logoUrl
    : '/jouri-logo.png';

  return (
    <section id="reels-section" className="py-12 sm:py-16 bg-[#F6F3EE] border-t border-stone-200/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Section Header with Official Instagram Profile Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 pb-6 border-b border-stone-200 w-full min-w-0">
          <div className="space-y-3 min-w-0">
            {/* Profile Bar */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F4ECE1] border border-[#e8ded1] shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={avatar}
                  alt="JOURI BOUTIQUE"
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover crisp-image-render"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-stone-900 text-xs sm:text-sm tracking-wide truncate">
                    {igHandle}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]/20 shrink-0" />
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                  {isAr ? '1,628 متابع · الحساب الرسمي المعتمد' : '1,628 followers · Official Brand Account'}
                </p>
              </div>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-stone-900 break-words">
              {t('ig.title', 'Official Instagram Reels & Fashion Feed', 'الريلز الرسمي وإطلالات إنستغرام')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed break-words">
              {t(
                'ig.subtitle',
                'Watch authentic video walkthroughs, lookbook details, and new releases directly from @jouriboutiquee. Tap any card to play or order on WhatsApp.',
                'شاهدي الفيديوهات الرسمية وتفاصيل القطع وإطلالات الكروشيه والقفاطين من حسابنا @jouriboutiquee. اضغطي لمشاهدة الريلز أو الطلب الفوري عبر واتساب.'
              )}
            </p>
          </div>

          <a
            href={igUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-stone-900 text-stone-50 hover:bg-[#A5855A] rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap self-start md:self-auto shadow-sm shrink-0"
          >
            <Instagram className="w-4 h-4 shrink-0" />
            <span>{t('ig.follow', 'Follow @jouriboutiquee', 'متابعة @jouriboutiquee')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          </a>
        </div>

        {/* Media Grid: Vertical Reels & Editorial Frames */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full max-w-full">
          {visibleItems.map((item) => {
            const isReel = item.type === 'reel';
            const linkedProd = products.find((p) => p.id === item.linkedProductId);
            const displayImage = item.thumbnailUrl || item.mediaUrl;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedReel(item)}
                className="group relative aspect-[9/16] sm:aspect-[3/4] md:aspect-[9/16] rounded-xs overflow-hidden bg-stone-900 cursor-pointer shadow-md border border-stone-200/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl w-full min-w-0"
              >
                <img
                  src={displayImage}
                  alt="Jouri Boutique Reel"
                  width={450}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/30 group-hover:from-stone-950/95 transition-colors" />

                {/* Top Badge: Reel or Frame */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs border border-white/20 whitespace-nowrap">
                  {isReel ? (
                    <>
                      <Play className="w-3 h-3 fill-white shrink-0" />
                      <span>{t('ig.reel', 'Reel Video', 'ريلز فيديو')}</span>
                    </>
                  ) : (
                    <span>{t('ig.post', 'Editorial Look', 'إطلالة')}</span>
                  )}
                </div>

                {/* Center Play Button for Reel */}
                {isReel && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-stone-900/85 backdrop-blur-md border border-[#C5A880]/80 text-white flex items-center justify-center shadow-xl">
                      <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-white ml-0.5 text-[#C5A880]" />
                    </div>
                  </div>
                )}

                {/* Bottom Caption, Metrics & Linked Product Link */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 text-white min-w-0">
                  {item.viewsOrLikes && (
                    <div className="text-[9px] sm:text-[10px] text-[#E6D7BE] font-mono tracking-wider truncate">
                      {item.viewsOrLikes}
                    </div>
                  )}

                  <p className="text-[11px] sm:text-xs line-clamp-2 text-stone-200 leading-snug font-normal drop-shadow-sm">
                    {isAr ? item.caption.ar : item.caption.en}
                  </p>

                  {linkedProd && (
                    <div className="pt-1.5 sm:pt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-[#C5A880] font-medium border-t border-white/20 min-w-0 gap-1">
                      <span className="truncate min-w-0">{isAr ? linkedProd.name.ar : linkedProd.name.en}</span>
                      <span className="font-mono tabular-nums font-bold shrink-0">{formatPrice(linkedProd.salePrice || linkedProd.price)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
