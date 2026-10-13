import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, MessageCircle, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    formatPrice,
    setSelectedProduct,
    isInWishlist,
    toggleWishlist,
    sendProductWhatsAppInquiry,
    addToCart,
    t,
  } = useStore();

  const isAr = language === 'ar';
  const name = isAr ? product.name.ar : product.name.en;
  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images[0] || '/src/assets/images/hero_luxury_womens_boutique_1791816085374.jpg';
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);
  const currentPrice = hasDiscount ? product.salePrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenColor = product.colors[selectedColorIdx] || product.colors[0];
    addToCart(product, product.sizes[0], chosenColor?.hex, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="group relative flex flex-col bg-[#FAF8F5] border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full max-w-full min-w-0">
      
      {/* Product Image Slot */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EFEA] cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={mainImage}
          alt={name}
          width={400}
          height={533}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 max-w-[calc(100%-48px)]">
          {hasDiscount && (
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-white bg-[#A5855A] px-1.5 sm:px-2 py-0.5 rounded-xs shadow-xs whitespace-nowrap">
              {discountPercent}% {t('badge.off', 'OFF', 'خصم')}
            </div>
          )}
          {product.isNewArrival && !hasDiscount && (
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-stone-900 bg-white/95 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 border border-stone-200/80 shadow-xs whitespace-nowrap">
              {t('badge.new', 'New Arrival', 'وصل حديثاً')}
            </div>
          )}
          {!product.isNewArrival && product.isBestSeller && !hasDiscount && (
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#A5855A] bg-white/95 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 border border-stone-200/80 shadow-xs whitespace-nowrap">
              {t('badge.bestseller', 'Best Seller', 'الأكثر طلباً')}
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs ${
            inWishlist
              ? 'bg-[#C5A880] text-white scale-105'
              : 'bg-white/85 text-stone-700 hover:text-stone-950 hover:bg-white'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Action Overlay (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-stone-900/90 hover:bg-stone-900 text-stone-50 text-xs font-medium tracking-wide rounded-xs backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('card.quickview', 'Quick View', 'معاينة سريعة')}</span>
          </button>
          
          <button
            onClick={handleQuickAdd}
            className={`p-2 rounded-xs backdrop-blur-sm transition-colors text-white ${
              justAdded ? 'bg-emerald-700' : 'bg-stone-900/90 hover:bg-[#A5855A]'
            }`}
            title={t('card.add', 'Add to Bag', 'إضافة للحقيبة')}
          >
            {justAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2 min-w-0">
        <div className="space-y-1 sm:space-y-1.5 min-w-0">
          {/* Collection & SKU Kicker */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-widest font-medium min-w-0 gap-1">
            <span className="truncate min-w-0">{product.collection || 'JOURI BOUTIQUE'}</span>
            <span className="font-mono text-stone-400 text-[9px] sm:text-[10px] shrink-0">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-xs sm:text-base font-semibold text-stone-900 group-hover:text-[#A5855A] transition-colors cursor-pointer line-clamp-1 min-w-0 break-words"
          >
            {name}
          </h3>

          {/* Color Swatches and Available Sizes */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5 min-w-0">
            {/* Color preview dots */}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-hidden">
                {product.colors.slice(0, 4).map((c, i) => (
                  <button
                    key={c.hex + i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIdx(i);
                    }}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-transform shrink-0 ${
                      selectedColorIdx === i
                        ? 'ring-1 sm:ring-1.5 ring-[#A5855A] scale-110 border-white'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={isAr ? c.nameAr : c.nameEn}
                  />
                ))}
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <span className="text-[10px] sm:text-[11px] text-stone-500 truncate min-w-0 text-right">
                {product.sizes.slice(0, 2).join(', ')}
                {product.sizes.length > 2 ? '...' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Strip: Price & Quick Actions */}
        <div className="pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
          {/* Price with Tabular Numerals */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
            <span className="text-xs sm:text-base font-bold text-stone-950 font-mono tabular-nums whitespace-nowrap">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through font-mono tabular-nums whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Action buttons: WhatsApp & Quick Bag */}
          <div className="flex items-center gap-1 sm:gap-1.5 self-end sm:self-auto shrink-0">
            <button
              onClick={handleQuickAdd}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-xs text-[11px] font-medium transition-all flex items-center gap-1 border shrink-0 ${
                justAdded
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 border-stone-200'
              }`}
              title={t('card.add', 'Add to Bag', 'إضافة للحقيبة')}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">{t('card.added', 'Added', 'تم')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">{t('card.bag', 'Bag', 'حقيبة')}</span>
                </>
              )}
            </button>

            {/* WhatsApp Direct Order Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendProductWhatsAppInquiry(
                  product,
                  product.sizes[0],
                  product.colors[selectedColorIdx]?.nameEn
                );
              }}
              className="p-1.5 sm:px-2 sm:py-1 rounded-xs bg-[#EAF5EF] hover:bg-[#0B6640] text-[#0B6640] hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1 shrink-0"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline text-[10px]">{t('card.orderWa', 'WhatsApp', 'واتساب')}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
