import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  Check,
  ZoomIn,
  ArrowRight,
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    products,
    language,
    formatPrice,
    addToCart,
    sendProductWhatsAppInquiry,
    isInWishlist,
    toggleWishlist,
    settings,
    t,
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [selectedColor, setSelectedColor] = useState<{ nameEn: string; nameAr: string; hex: string }>({
    nameEn: 'Standard',
    nameAr: 'افتراضي',
    hex: '#000000',
  });
  const [quantity, setQuantity] = useState(1);
  const [showCopied, setShowCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Synchronize modal state whenever a new product is selected
  React.useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedSize(selectedProduct.sizes[0] || 'Standard');
      setSelectedColor(
        selectedProduct.colors[0] || { nameEn: 'Standard', nameAr: 'افتراضي', hex: '#000000' }
      );
      setQuantity(1);
      setShowCopied(false);
      setIsZoomed(false);
    }
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const isAr = language === 'ar';
  const name = isAr ? selectedProduct.name.ar : selectedProduct.name.en;
  const description = isAr ? selectedProduct.description.ar : selectedProduct.description.en;

  const images = selectedProduct.images.length > 0
    ? selectedProduct.images
    : ['/src/assets/images/hero_luxury_womens_boutique_1791816085374.jpg'];

  const currentImage = images[activeImageIdx] || images[0];

  const hasDiscount = Boolean(selectedProduct.salePrice && selectedProduct.salePrice < selectedProduct.price);
  const currentPrice = hasDiscount ? selectedProduct.salePrice! : selectedProduct.price;
  const inWishlist = isInWishlist(selectedProduct.id);

  // Related products from the same category or collection
  const relatedProducts = products
    .filter((p) => p.id !== selectedProduct.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 transition-opacity">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-sm shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-30 p-2 text-stone-600 hover:text-stone-900 bg-white/90 rounded-full shadow-md backdrop-blur-sm transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Column: Media Gallery & Zoom */}
            <div className="md:col-span-6 bg-[#F3EFEA] p-4 sm:p-6 flex flex-col justify-between">
              
              {/* Main Stage with Zoom capability */}
              <div
                className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-stone-200 shadow-inner group cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={currentImage}
                  alt={name}
                  width={600}
                  height={800}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center transition-transform duration-500 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105'
                  }`}
                />

                {/* Zoom Hint Icon */}
                <div className="absolute bottom-3 right-3 p-1.5 bg-black/60 text-white rounded-full text-xs flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">{isZoomed ? 'Reset' : 'Zoom'}</span>
                </div>

                {/* Discount Tag */}
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-[#A5855A] text-white text-[11px] font-semibold px-2.5 py-1 tracking-wider uppercase">
                    {t('modal.sale', 'Special Price', 'سعر خاص')}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-16 h-20 rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIdx === idx
                          ? 'border-[#C5A880] ring-1 ring-[#C5A880]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={64}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Video Preview if available */}
              {selectedProduct.video && (
                <div className="mt-4 pt-4 border-t border-stone-300/60">
                  <p className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
                    {t('modal.video', 'Video Walkthrough', 'فيديو القطعة')}
                  </p>
                  <div className="rounded overflow-hidden bg-black aspect-video">
                    <video
                      src={selectedProduct.video}
                      controls
                      className="w-full h-full object-cover"
                      playsInline
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Kicker & Meta */}
                <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#A5855A]">{selectedProduct.collection || 'JOURI BOUTIQUE'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-stone-400">{selectedProduct.sku}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-1 hover:text-stone-900 transition-colors"
                      title="Share product link"
                    >
                      {showCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="p-1 hover:text-stone-900 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C5A880] text-[#C5A880]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Product Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 leading-tight">
                  {name}
                </h2>

                {/* Price display with Tabular Numerals */}
                <div className="flex items-baseline gap-3 py-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-950">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm font-mono tabular-nums text-stone-400 line-through">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    {selectedProduct.stock > 0
                      ? t('stock.available', 'In Stock · Ready to Deliver', 'متوفر للتسليم الفوري')
                      : t('stock.soldout', 'Custom Order', 'تفصيل عند الطلب')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {description}
                </p>

                {/* Size Selector */}
                {selectedProduct.sizes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                      <span>{t('modal.selectSize', 'Select Size', 'اختاري المقاس')}</span>
                      <span className="text-stone-500 font-normal">{t('modal.lebanonStandard', 'Standard sizing', 'مقاسات قياسية')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-xs border transition-all ${
                            selectedSize === s
                              ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-sm'
                              : 'bg-white text-stone-800 border-stone-300 hover:border-stone-900'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Swatches */}
                {selectedProduct.colors.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-stone-800">
                      <span>{t('modal.selectColor', 'Color:', 'اللون:')} </span>
                      <span className="font-normal text-stone-600">
                        {isAr ? selectedColor.nameAr : selectedColor.nameEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            selectedColor.hex === c.hex
                              ? 'ring-2 ring-[#C5A880] ring-offset-2 scale-110 border-white'
                              : 'border-stone-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={isAr ? c.nameAr : c.nameEn}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-semibold text-stone-800">
                    {t('modal.quantity', 'Quantity', 'الكمية')}:
                  </span>
                  <div className="flex items-center border border-stone-300 rounded-xs bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-sm text-stone-600 hover:text-stone-950 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-sm text-stone-600 hover:text-stone-950 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                
                {/* Instant WhatsApp Order CTA */}
                <button
                  onClick={() => {
                    sendProductWhatsAppInquiry(
                      selectedProduct,
                      selectedSize,
                      isAr ? selectedColor.nameAr : selectedColor.nameEn
                    );
                  }}
                  className="w-full py-3.5 px-4 bg-[#0B6640] hover:bg-[#084b2f] text-white rounded-xs text-xs sm:text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t('modal.orderWhatsAppNow', 'Order via WhatsApp (+961 81 522 399)', 'الطلب المباشر عبر واتساب (+961 81 522 399)')}</span>
                </button>

                {/* Add to Shopping Bag & Instant Buy */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, selectedSize, selectedColor.hex, quantity);
                    }}
                    className="py-3 px-3 bg-stone-900 hover:bg-[#A5855A] text-stone-50 rounded-xs text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('modal.addToBag', 'Add to Bag', 'إضافة للحقيبة')}</span>
                  </button>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct, selectedSize, selectedColor.hex, quantity);
                      setSelectedProduct(null);
                    }}
                    className="py-3 px-3 border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white rounded-xs text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t('modal.buyNow', 'Buy Now', 'اشتري الآن')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-stone-500 text-center border-t border-stone-200/60">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span>{t('trust.fast', 'Fast Delivery in Lebanon', 'توصيل لكافة لبنان')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                    <span>{t('trust.exchange', '3-Day Exchange', 'استبدال خلال 3 أيام')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                    <span>{t('trust.original', '100% Quality Fabric', 'أقمشة فاخرة ومضمونة')}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Related Products / Recommended Outfits Section */}
          {relatedProducts.length > 0 && (
            <div className="p-6 bg-[#FBF9F6] border-t border-stone-200/80">
              <h3 className="font-serif text-base font-bold text-stone-900 mb-3">
                {t('modal.related', 'Complete The Look & Recommended Outfits', 'نسقي إطلالتكِ وتصاميم مشابهة')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProduct(rel);
                      setActiveImageIdx(0);
                      setIsZoomed(false);
                    }}
                    className="group cursor-pointer bg-white p-2 border border-stone-200 rounded-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name.en}
                      width={200}
                      height={266}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[3/4] object-cover rounded-xs"
                    />
                    <p className="text-xs font-semibold text-stone-900 mt-2 truncate group-hover:text-[#A5855A]">
                      {isAr ? rel.name.ar : rel.name.en}
                    </p>
                    <p className="text-xs font-bold font-mono text-stone-950 mt-0.5">
                      {formatPrice(rel.salePrice || rel.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
