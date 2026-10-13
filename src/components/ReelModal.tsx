import React, { useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Play, Pause, Volume2, VolumeX, MessageCircle, ExternalLink, ShoppingBag } from 'lucide-react';

export const ReelModal: React.FC = () => {
  const {
    selectedReel,
    setSelectedReel,
    products,
    setSelectedProduct,
    language,
    settings,
    sendProductWhatsAppInquiry,
    formatPrice,
    t,
  } = useStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!selectedReel) return null;

  const isAr = language === 'ar';
  const caption = isAr ? selectedReel.caption.ar : selectedReel.caption.en;
  const linkedProduct = products.find((p) => p.id === selectedReel.linkedProductId);

  const isVideo =
    selectedReel.type === 'reel' || selectedReel.mediaUrl.endsWith('.mp4');

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const igUrl =
    selectedReel.instagramUrl ||
    settings?.instagramUrl ||
    'https://www.instagram.com/reel/DdA88uiqa1u/';

  const avatar = settings?.logoUrl && !settings.logoUrl.includes('jouriboutiquee_profile.jpg') && !settings.logoUrl.includes('jouri_boutique_logo.svg')
    ? settings.logoUrl
    : '/jouri-logo.png';

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-stone-900 text-stone-100 rounded-sm overflow-hidden shadow-2xl border border-stone-800">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedReel(null)}
          className="absolute top-4 right-4 z-30 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors shadow-lg"
          aria-label="Close reel viewer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vertical Reel Viewport */}
        <div
          className="relative aspect-[9/16] w-full bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none"
          onClick={isVideo ? togglePlay : undefined}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={selectedReel.mediaUrl}
              poster={selectedReel.thumbnailUrl}
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={selectedReel.mediaUrl}
              alt="Instagram Reel"
              width={400}
              height={700}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/40 pointer-events-none" />

          {/* Sound Toggle Button (For Videos) */}
          {isVideo && (
            <button
              onClick={toggleMute}
              className="absolute top-4 left-4 z-20 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* Center Play/Pause Indicator when paused */}
          {isVideo && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white shadow-2xl">
                <Play className="w-7 h-7 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Header Banner: Official Profile Picture & Username */}
          <div className="absolute top-16 left-4 flex items-center gap-2.5 z-10 pointer-events-auto">
            <div className="w-9 h-9 rounded-full bg-[#F4ECE1] border border-[#e8ded1] shadow-md overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={avatar}
                alt="JOURI BOUTIQUE"
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover crisp-image-render"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight text-white drop-shadow-sm">
                {settings?.instagramHandle || '@jouriboutiquee'}
              </p>
              <p className="text-[10px] text-stone-300 drop-shadow-sm">
                JOURI BOUTIQUE · Official Reel
              </p>
            </div>
          </div>

          {/* Bottom Content & Interactive Controls */}
          <div
            className="absolute inset-x-0 bottom-0 p-5 space-y-3 z-10 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reel Caption */}
            <p className="text-xs text-stone-100 leading-relaxed font-normal drop-shadow-sm">
              {caption}
            </p>

            {/* Linked Product Banner */}
            {linkedProduct && (
              <div className="bg-stone-900/95 backdrop-blur-md p-3 rounded-xs border border-stone-700/80 flex items-center justify-between gap-3 shadow-lg">
                <div
                  className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
                  onClick={() => {
                    setSelectedReel(null);
                    setSelectedProduct(linkedProduct);
                  }}
                >
                  <img
                    src={linkedProduct.images[0] || selectedReel.thumbnailUrl || selectedReel.mediaUrl}
                    alt={linkedProduct.name.en}
                    width={40}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-12 object-cover rounded-xs border border-stone-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-100 group-hover:text-[#C5A880] truncate transition-colors">
                      {isAr ? linkedProduct.name.ar : linkedProduct.name.en}
                    </p>
                    <p className="text-xs text-[#C5A880] font-mono tabular-nums font-bold">
                      {formatPrice(linkedProduct.salePrice || linkedProduct.price)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sendProductWhatsAppInquiry(linkedProduct);
                  }}
                  className="px-3 py-1.5 bg-[#0B6640] hover:bg-[#084b2f] text-white rounded-xs text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition-colors shrink-0 shadow-sm"
                >
                  <MessageCircle className="w-3 h-3 fill-current" />
                  <span>{t('reel.order', 'Order on WhatsApp', 'طلب عبر واتساب')}</span>
                </button>
              </div>
            )}

            {/* Direct Instagram Link Button */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <a
                href={igUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium underline underline-offset-4 decoration-white/40"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('reel.viewOnIg', 'Watch on Instagram (DdA88uiqa1u)', 'مشاهدة على إنستغرام')}</span>
              </a>

              <span className="text-[11px] text-stone-400 font-mono">
                {selectedReel.viewsOrLikes || '146 views · 16 likes'}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
