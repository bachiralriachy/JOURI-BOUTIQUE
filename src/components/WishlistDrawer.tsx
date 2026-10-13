import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
    formatPrice,
    language,
    t,
  } = useStore();

  if (!isWishlistOpen) return null;

  const isAr = language === 'ar';
  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200">
          
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C5A880] fill-current" />
              <h2 className="text-base font-serif font-medium text-stone-900">
                {t('wishlist.title', 'Saved Creations', 'المفضلة')} ({savedProducts.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {savedProducts.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-stone-800">
                {t('wishlist.empty', 'No pieces saved yet', 'لا توجد قطع مفضلة بعد')}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                {t(
                  'wishlist.emptyDesc',
                  'Tap the heart icon on any design to save it for your next occasion.',
                  'اضغطي على علامة القلب على أي تصميم لحفظه والعودة إليه لاحقاً.'
                )}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {savedProducts.map((p) => {
                const prodName = isAr ? p.name.ar : p.name.en;
                const price = p.salePrice ?? p.price;

                return (
                  <div
                    key={p.id}
                    className="flex gap-3.5 p-3 bg-white rounded border border-stone-200/80 shadow-xs"
                  >
                    <img
                      src={p.images[0] || '/src/assets/images/hero_editorial_banner_1791813908419.jpg'}
                      alt={prodName}
                      width={64}
                      height={80}
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-20 object-cover rounded-sm border border-stone-200 shrink-0 cursor-pointer"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setSelectedProduct(p);
                      }}
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => {
                              setIsWishlistOpen(false);
                              setSelectedProduct(p);
                            }}
                            className="text-xs font-semibold text-stone-900 hover:text-[#A5855A] cursor-pointer truncate"
                          >
                            {prodName}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="text-stone-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold font-mono text-stone-900 mt-1">
                          {formatPrice(price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            addToCart(p);
                            setIsWishlistOpen(false);
                          }}
                          className="flex-1 py-1.5 px-3 bg-stone-900 hover:bg-[#A5855A] text-white text-[11px] font-medium rounded transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>{t('card.add', 'Add to Bag', 'إضافة للحقيبة')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
