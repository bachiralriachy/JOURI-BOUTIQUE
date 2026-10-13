export type Language = 'en' | 'ar';
export type ActiveCurrency = 'USD' | 'LBP';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface ColorVariant {
  nameEn: string;
  nameAr: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  salePrice?: number;
  category: string;
  collection?: string;
  images: string[];
  video?: string;
  sizes: string[];
  colors: ColorVariant[];
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  image?: string;
  order: number;
}

export interface InstagramMedia {
  id: string;
  type: 'image' | 'reel';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: LocalizedString;
  instagramUrl?: string;
  linkedProductId?: string;
  showOnHome: boolean;
  viewsOrLikes?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: LocalizedString;
  tagline: LocalizedString;
  logoUrl?: string;
  logoText: string;
  logoArabicText: string;
  faviconUrl?: string;
  phone: string;
  whatsappNumber: string; // international without '+' or spaces, e.g. "96181522399"
  instagramUrl: string;
  instagramHandle: string;
  currency: string;
  currencySymbol: string;
  secondaryCurrency?: {
    code: string;
    symbol: string;
    rate: number; // e.g. 89500 for LBP
    enabled: boolean;
  };
  shippingFee: number;
  freeShippingThreshold: number;
  returnPolicy: LocalizedString;
  aboutStory: LocalizedString;
  locationAddress: LocalizedString;
  announcement: {
    enabled: boolean;
    text: LocalizedString;
  };
  hero: {
    title: LocalizedString;
    subtitle: LocalizedString;
    ctaText: LocalizedString;
    imageUrl: string;
  };
  themeColors: {
    primary: string;
    accent: string;
    background: string;
  };
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ColorVariant;
  quantity: number;
}
