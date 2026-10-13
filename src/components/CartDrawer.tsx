import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    sendWhatsAppOrder,
    formatPrice,
    language,
    settings,
    t,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartOpen) return null;

  const isAr = language === 'ar';

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingFee =
    subtotal >= (settings?.freeShippingThreshold ?? 100)
      ? 0
      : (settings?.shippingFee ?? 3);
  const total = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة الاسم الكريم' : 'Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 7) {
      setErrorMsg(
        isAr
          ? 'يرجى إدخال رقم هاتف صالح للتواصل عبر واتساب'
          : 'Please provide a valid phone number for WhatsApp'
      );
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMsg(
        isAr ? 'يرجى إدخال عنوان التوصيل في لبنان' : 'Please provide your delivery address in Lebanon'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await sendWhatsAppOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        notes,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-serif font-medium text-stone-900">
                {t('cart.title', 'Your Shopping Bag', 'حقيبة التسوق')} ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-stone-800">
                {t('cart.empty', 'Your shopping bag is empty', 'حقيبة التسوق فارغة')}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                {t(
                  'cart.emptyDesc',
                  'Explore our latest Lebanese haute couture pieces and find your dream design.',
                  'تصفحي أحدث فساتين السهرة والعبايات الراقية واختاري إطلالتك.'
                )}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 bg-stone-900 text-stone-50 rounded text-xs uppercase tracking-wider font-semibold hover:bg-[#A5855A] transition-colors"
              >
                {t('cart.continue', 'Browse Creations', 'تصفح التشكيلة')}
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Items List */}
              <div className="space-y-4">
                {cart.map((item, idx) => {
                  const prodName = isAr ? item.product.name.ar : item.product.name.en;
                  const itemPrice = item.product.salePrice ?? item.product.price;
                  const colorName = isAr ? item.selectedColor.nameAr : item.selectedColor.nameEn;

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}-${idx}`}
                      className="flex gap-3.5 p-3 bg-white rounded border border-stone-200/80 shadow-xs"
                    >
                      <img
                        src={item.product.images[0] || '/src/assets/images/hero_editorial_banner_1791813908419.jpg'}
                        alt={prodName}
                        width={64}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-16 h-20 object-cover rounded-sm border border-stone-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                              {prodName}
                            </h4>
                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.hex
                                )
                              }
                              className="text-stone-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                            <span>{item.selectedSize}</span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              {colorName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                          {/* Qty Stepper */}
                          <div className="flex items-center border border-stone-300 rounded bg-stone-50">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.hex,
                                  -1
                                )
                              }
                              className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.hex,
                                  1
                                )
                              }
                              className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold font-mono tabular-nums text-stone-900">
                            {formatPrice(itemPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lebanese Checkout Form */}
              <form onSubmit={handleSubmitOrder} className="pt-2 space-y-3.5 bg-stone-50 p-4 rounded border border-stone-200">
                <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    {t('checkout.details', 'Delivery Details (Lebanon)', 'معلومات التوصيل (لبنان)')}
                  </h4>
                  <span className="text-[10px] text-stone-500">
                    {t('checkout.cod', 'Cash on Delivery', 'الدفع عند الاستلام')}
                  </span>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200">
                    {errorMsg}
                  </p>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    {t('checkout.name', 'Full Name', 'الاسم الكامل')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: ريما خوري' : 'e.g. Rima Khoury'}
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    {t('checkout.phone', 'WhatsApp / Phone Number', 'رقم الهاتف / واتساب')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+961 70 123 456"
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    {t('checkout.address', 'Delivery Address (City, Street, Building)', 'عنوان التوصيل (المدينة، الشارع، البناية)')} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={isAr ? 'بيروت، الأشرفية، شارع سورسق، بناية السلام' : 'Beirut, Achrafieh, Sursock St, Bldg 4'}
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    {t('checkout.notes', 'Special Notes (Optional)', 'ملاحظات إضافية (اختياري)')}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'تفضيل وقت التسليم أو أي تعديل خاص...' : 'Preferred delivery time or sizing note...'}
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Subtotals & Total Summary */}
                <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal', 'Subtotal', 'المجموع الفرعي')}</span>
                    <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.delivery', 'Delivery across Lebanon', 'التوصيل لكافة مناطق لبنان')}</span>
                    <span className="font-mono tabular-nums">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold">{t('cart.free', 'FREE', 'مجاني')}</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>{t('cart.total', 'Estimated Total', 'الإجمالي التقديري')}</span>
                    <span className="font-mono tabular-nums text-base text-[#141413]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Submit to WhatsApp Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 px-4 bg-[#0B6640] hover:bg-[#084b2f] text-white rounded text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>
                    {isSubmitting
                      ? (isAr ? 'جاري التحضير...' : 'Processing...')
                      : (isAr
                          ? 'إرسال الطلب عبر واتساب (+961 81 522 399)'
                          : 'Complete Order via WhatsApp (+961 81 522 399)')}
                  </span>
                </button>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
