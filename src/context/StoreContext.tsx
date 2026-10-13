import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  StoreSettings,
  InstagramMedia,
  Order,
  CartItem,
  Language,
  ActiveCurrency,
} from '../types';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: ActiveCurrency;
  setCurrency: (c: ActiveCurrency) => void;
  toggleCurrency: () => void;
  exchangeRate: number;
  t: (key: string, enDefault: string, arDefault?: string) => string;
  settings: StoreSettings | null;
  products: Product[];
  categories: Category[];
  instagramMedia: InstagramMedia[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedReel: InstagramMedia | null;
  setSelectedReel: (reel: InstagramMedia | null) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product, size?: string, colorHex?: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, colorHex: string) => void;
  updateCartQuantity: (productId: string, size: string, colorHex: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  formatPrice: (usdAmount: number, options?: { showBoth?: boolean; compact?: boolean }) => string;
  sendWhatsAppOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    notes?: string;
  }) => Promise<void>;
  sendProductWhatsAppInquiry: (product: Product, size?: string, colorName?: string) => void;
  refreshData: () => Promise<void>;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('jouri_lang') as Language) || 'en';
  });

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instagramMedia, setInstagramMedia] = useState<InstagramMedia[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jouri_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jouri_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedReel, setSelectedReel] = useState<InstagramMedia | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.startsWith('/admin');
  });

  // Sync RTL / LTR
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jouri_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Save Cart & Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('jouri_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jouri_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Dynamic theme colors sync
  useEffect(() => {
    if (settings?.themeColors) {
      if (settings.themeColors.primary) {
        document.documentElement.style.setProperty('--color-primary', settings.themeColors.primary);
      }
      if (settings.themeColors.accent) {
        document.documentElement.style.setProperty('--color-accent', settings.themeColors.accent);
      }
      if (settings.themeColors.background) {
        document.documentElement.style.setProperty('--color-bg', settings.themeColors.background);
      }
    }
  }, [settings?.themeColors]);

  // Fetch initial data from Express backend
  const refreshData = async () => {
    try {
      setLoading(true);
      const [settRes, prodRes, catRes, igRes, ordRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/instagram'),
        fetch('/api/orders'),
      ]);

      if (settRes.ok) setSettings(await settRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (igRes.ok) setInstagramMedia(await igRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (err) {
      console.error('Failed to fetch data from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Translation helper
  const t = (key: string, enDefault: string, arDefault?: string) => {
    if (language === 'ar') {
      return arDefault || enDefault;
    }
    return enDefault;
  };

  const [currency, setCurrencyState] = useState<ActiveCurrency>(() => {
    return (localStorage.getItem('jouri_currency') as ActiveCurrency) || 'USD';
  });

  const setCurrency = (c: ActiveCurrency) => {
    setCurrencyState(c);
    localStorage.setItem('jouri_currency', c);
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'LBP' : 'USD');
  };

  const exchangeRate = settings?.secondaryCurrency?.rate || 89500;

  // Price formatting according to chosen currency (USD / LBP)
  const formatPrice = (
    usdAmount: number,
    options?: { showBoth?: boolean; compact?: boolean }
  ) => {
    if (usdAmount === undefined || usdAmount === null || isNaN(usdAmount)) {
      return currency === 'LBP' ? '0 LBP' : '$0';
    }

    const isAr = language === 'ar';
    const rate = settings?.secondaryCurrency?.rate || 89500;

    if (currency === 'LBP') {
      const lbpAmount = Math.round(usdAmount * rate);
      const formattedLbp = lbpAmount.toLocaleString();
      const symbol = isAr ? 'ل.ل' : 'LBP';
      if (options?.showBoth) {
        return `${formattedLbp} ${symbol} ($${usdAmount.toLocaleString()})`;
      }
      return `${formattedLbp} ${symbol}`;
    }

    const symbol = settings?.currencySymbol || '$';
    const formattedUsd = `${symbol}${usdAmount.toLocaleString()}`;

    if (options?.showBoth) {
      const lbpAmount = Math.round(usdAmount * rate);
      const lbpSymbol = isAr ? 'ل.ل' : 'LBP';
      return `${formattedUsd} (${lbpAmount.toLocaleString()} ${lbpSymbol})`;
    }

    return formattedUsd;
  };

  // Cart operations
  const addToCart = (
    product: Product,
    size?: string,
    colorHex?: string,
    qty: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor =
      product.colors.find((c) => c.hex === colorHex) ||
      product.colors[0] || {
        nameEn: 'Original',
        nameAr: 'الأصلي',
        hex: '#000000',
      };

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.hex === chosenColor.hex
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity: qty,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (
    productId: string,
    size: string,
    colorHex: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          )
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    colorHex: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Instant WhatsApp ordering from Cart
  const sendWhatsAppOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    notes?: string;
  }) => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const shippingFee =
      subtotal >= (settings?.freeShippingThreshold ?? 100)
        ? 0
        : (settings?.shippingFee ?? 3);
    const total = subtotal + shippingFee;

    const orderPayload = {
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name.en,
        size: item.selectedSize,
        color: item.selectedColor.nameEn,
        price: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
      })),
      subtotal,
      shippingFee,
      total,
      currency: settings?.currency || 'USD',
    };

    let generatedOrderNum = `JB-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const created = await res.json();
        generatedOrderNum = created.orderNumber;
        setOrders((prev) => [created, ...prev]);
      }
    } catch (e) {
      console.error('Failed to save order to database:', e);
    }

    // Compose rich WhatsApp message
    const isAr = language === 'ar';
    const boutiqueName = settings?.storeName?.[isAr ? 'ar' : 'en'] || 'JOURI BOUTIQUE';
    const whatsappNum = settings?.whatsappNumber || '96181522399';

    let message = isAr
      ? `مرحباً ${boutiqueName}! ✨\nأود تأكيد طلب جديد [${generatedOrderNum}]:\n\n`
      : `Hello ${boutiqueName}! ✨\nI would like to place an order [${generatedOrderNum}]:\n\n`;

    cart.forEach((item, index) => {
      const prodName = isAr ? item.product.name.ar : item.product.name.en;
      const color = isAr ? item.selectedColor.nameAr : item.selectedColor.nameEn;
      const price = item.product.salePrice ?? item.product.price;

      message += `${index + 1}. ${prodName}\n`;
      message += `   • ${isAr ? 'المقاس' : 'Size'}: ${item.selectedSize}\n`;
      message += `   • ${isAr ? 'اللون' : 'Color'}: ${color}\n`;
      message += `   • ${isAr ? 'الكمية' : 'Qty'}: ${item.quantity}\n`;
      message += `   • ${isAr ? 'السعر' : 'Price'}: ${formatPrice(price * item.quantity, { showBoth: true })}\n\n`;
    });

    message += `💰 ${isAr ? 'المجموع' : 'Subtotal'}: ${formatPrice(subtotal, { showBoth: true })}\n`;
    message += `🚚 ${isAr ? 'التوصيل' : 'Delivery'}: ${shippingFee === 0 ? (isAr ? 'مجاني' : 'FREE') : formatPrice(shippingFee, { showBoth: true })}\n`;
    message += `💎 ${isAr ? 'الإجمالي' : 'Total'}: ${formatPrice(total, { showBoth: true })}\n\n`;
    message += `👤 ${isAr ? 'الاسم' : 'Customer'}: ${orderData.customerName}\n`;
    message += `📞 ${isAr ? 'الهاتف' : 'Phone'}: ${orderData.customerPhone}\n`;
    message += `📍 ${isAr ? 'العنوان' : 'Address'}: ${orderData.deliveryAddress}\n`;

    if (orderData.notes) {
      message += `📝 ${isAr ? 'ملاحظات' : 'Notes'}: ${orderData.notes}\n`;
    }

    message += isAr
      ? `\nيرجى تأكيد توفر القطع وتفاصيل التوصيل. شكراً!`
      : `\nPlease confirm item availability and delivery schedule. Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsappNum}?text=${encoded}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    clearCart();
    setIsCartOpen(false);
  };

  // Direct 1-Product WhatsApp inquiry
  const sendProductWhatsAppInquiry = (
    product: Product,
    size?: string,
    colorName?: string
  ) => {
    const isAr = language === 'ar';
    const boutiqueName = settings?.storeName?.[isAr ? 'ar' : 'en'] || 'JOURI BOUTIQUE';
    const whatsappNum = settings?.whatsappNumber || '96181522399';
    const prodName = isAr ? product.name.ar : product.name.en;
    const price = product.salePrice ?? product.price;
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = colorName || product.colors[0]?.nameEn || 'Default';
    const currentUrl = window.location.href;

    const message = isAr
      ? `مرحباً ${boutiqueName}! ✨\nأود الاستفسار وطلب القطعة التالية:\n\n` +
        `• المنتج: ${prodName} (${product.sku})\n` +
        `• المقاس: ${chosenSize}\n` +
        `• اللون: ${chosenColor}\n` +
        `• السعر: $${price}\n` +
        `• رابط القطعة: ${currentUrl}\n\n` +
        `يرجى تأكيد التوفر وموعد التوصيل في لبنان. شكراً!`
      : `Hello ${boutiqueName}! ✨\nI would like to order this piece:\n\n` +
        `• Product: ${prodName} (${product.sku})\n` +
        `• Size: ${chosenSize}\n` +
        `• Color: ${chosenColor}\n` +
        `• Price: $${price}\n` +
        `• Product link: ${currentUrl}\n\n` +
        `Please confirm availability and delivery details in Lebanon. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNum}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        t,
        settings,
        products,
        categories,
        instagramMedia,
        orders,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        selectedProduct,
        setSelectedProduct,
        selectedReel,
        setSelectedReel,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        formatPrice,
        sendWhatsAppOrder,
        sendProductWhatsAppInquiry,
        refreshData,
        isAdminView,
        setIsAdminView,
        loading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
