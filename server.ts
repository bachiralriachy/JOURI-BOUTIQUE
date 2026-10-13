import express, { Request, Response } from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Support large payload for base64 image/video uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));

// Default Seed Data
const getInitialData = () => {
  return {
    settings: {
      storeName: {
        en: 'JOURI BOUTIQUE',
        ar: 'جوري بوتيك',
      },
      tagline: {
        en: 'Haute Couture & Luxury Ready-To-Wear',
        ar: 'أزياء راقية ومجموعات حصرية',
      },
      logoUrl: '/jouri-logo.png',
      logoText: 'JOURI BOUTIQUE',
      logoArabicText: 'جوري بوتيك',
      faviconUrl: '/jouri-logo.png',
      phone: '+961 81 522 399',
      whatsappNumber: '96181522399',
      instagramUrl: 'https://www.instagram.com/jouriboutiquee/',
      instagramHandle: '@jouriboutiquee',
      currency: 'USD',
      currencySymbol: '$',
      secondaryCurrency: {
        code: 'LBP',
        symbol: 'L.L',
        rate: 89500,
        enabled: true,
      },
      shippingFee: 3,
      freeShippingThreshold: 100,
      returnPolicy: {
        en: 'We accept exchanges within 3 days of delivery in pristine, unworn condition with original tags intact.',
        ar: 'نقبل الاستبدال في غضون 3 أيام من الاستلام شرط أن تكون القطعة بحالتها الأصلية مع البطاقات.',
      },
      aboutStory: {
        en: 'JOURI BOUTIQUE represents the epitome of modern Lebanese sophistication, blending artisanal craftsmanship with contemporary couture silhouettes designed for women of distinguished taste.',
        ar: 'يمثل جوري بوتيك قمة الأناقة اللبنانية المعاصرة، جامعاً بين الحرفية الدقيقة والقصات الراقية المصممة للمرأة المتميزة.',
      },
      locationAddress: {
        en: 'Beirut & South Lebanon · Fast Worldwide & Local Delivery',
        ar: 'بيروت وجنوب لبنان · توصيل سريع لجميع المناطق اللبنانية ولكافة دول العالم',
      },
      announcement: {
        enabled: true,
        text: {
          en: '✨ Exclusive New Season Arrivals · Fast Delivery All Over Lebanon · Order via WhatsApp',
          ar: '✨ تشكيلة الموسم الجديد متوفرة الآن · توصيل سريع لجميع الأراضي اللبنانية · الطلب عبر واتساب',
        },
      },
      hero: {
        title: {
          en: 'Discover Haute Couture & Timeless Grace',
          ar: 'اكتشفي أرقى تصاميم الأزياء والأناقة الخالدة',
        },
        subtitle: {
          en: 'Curated luxury evening wear, bespoke abayas, and chic modern ensembles crafted with Lebanese excellence.',
          ar: 'مجموعة مختارة من فساتين السهرة الفاخرة، العبايات الراقية، والأطقم العصرية المصممة بذوق رفيع.',
        },
        ctaText: {
          en: 'Shop Collection',
          ar: 'تسوقي المجموعة',
        },
        imageUrl: '/src/assets/images/hero_editorial_banner_1791813908419.jpg',
      },
      themeColors: {
        primary: '#141413',
        accent: '#C5A880',
        background: '#FAF8F5',
      },
    },
    categories: [
      {
        id: 'cat-evening',
        slug: 'evening-wear',
        name: { en: 'Evening Gowns', ar: 'فساتين سهرة' },
        description: { en: 'Handcrafted couture gowns and cocktail dresses', ar: 'فساتين سهرة راقية بتطريزات فخمة' },
        image: '/src/assets/images/fashion_collection_evening_1791813920709.jpg',
        order: 1,
      },
      {
        id: 'cat-abayas',
        slug: 'luxury-abayas',
        name: { en: 'Luxury Abayas', ar: 'عبايات فاخرة' },
        description: { en: 'Designer open-front and embellished kaftans', ar: 'عبايات وقفاطين بتطريز ناعم وقماش فاخر' },
        image: '/src/assets/images/fashion_collection_abaya_1791813949088.jpg',
        order: 2,
      },
      {
        id: 'cat-suits',
        slug: 'tailored-sets',
        name: { en: 'Chic Tailored Sets', ar: 'أطقم وبدلات عصرية' },
        description: { en: 'Effortless linen & silk two-piece silhouettes', ar: 'أطقم كتان وحرير راقية لإطلالة يومية مميزة' },
        image: '/src/assets/images/fashion_collection_casual_1791813931281.jpg',
        order: 3,
      },
      {
        id: 'cat-reels',
        slug: 'instagram-exclusives',
        name: { en: 'Instagram Spotlight', ar: 'مختارات إنستغرام' },
        description: { en: 'Pieces featured on our official Instagram feed & Reels', ar: 'قطع مميزة من حسابنا الرسمي وريلز' },
        image: '/src/assets/images/reels_fashion_model_1791813958864.jpg',
        order: 4,
      },
    ],
    products: [
      {
        id: 'prod-001',
        slug: 'beirut-royale-champagne-couture-gown',
        sku: 'JB-2601',
        name: {
          en: 'Beirut Royale Champagne Gown',
          ar: 'فستان بيروت الملكي باللون الشامباني',
        },
        description: {
          en: 'Bespoke hand-embroidered evening gown crafted with sheer silk tulle, delicate gold beadwork, and statement balloon sleeves. Featuring a sweeping majestic train inspired by Lebanese haute couture heritage.',
          ar: 'فستان سهرة ملكي مشغول يدوياً بالخرز والترتر الذهبي على تول الحرير الطبيعي مع أكمام منفوخة ساحرة وقصة انسيابية مستوحاة من عراقة الأزياء اللبنانية.',
        },
        price: 280,
        salePrice: 245,
        category: 'cat-evening',
        collection: 'Haute Couture 2026',
        images: [
          '/src/assets/images/hero_editorial_banner_1791813908419.jpg',
          '/src/assets/images/fashion_collection_evening_1791813920709.jpg',
        ],
        sizes: ['36 (S)', '38 (M)', '40 (L)', '42 (XL)'],
        colors: [
          { nameEn: 'Champagne Gold', nameAr: 'ذهبي شامباني', hex: '#D4AF37' },
          { nameEn: 'Soft Ivory', nameAr: 'عاجي ناعم', hex: '#FAF8F5' },
        ],
        stock: 5,
        isAvailable: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        createdAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'prod-002',
        slug: 'rose-blush-appliqued-cocktail-dress',
        sku: 'JB-2602',
        name: {
          en: 'Rose Blush 3D Floral Dress',
          ar: 'فستان وردي روز بزهور نافرة ثلاثية الأبعاد',
        },
        description: {
          en: 'Sculptural A-line silhouette in lustrous duchess satin, adorned with handcrafted 3D organza florals, crystal dewdrops, and elbow-length fitted sleeves. Ideal for engagements and gala dinners.',
          ar: 'فستان سهرة بقصة إيه لاين من قماش الستان اللامع الفاخر، مرصع بزهور ثلاثية الأبعاد وكريستالات براقة لإطلالة استثنائية في المناسبات والأعراس.',
        },
        price: 195,
        salePrice: 175,
        category: 'cat-evening',
        collection: 'Spring Gala',
        images: [
          '/src/assets/images/fashion_collection_evening_1791813920709.jpg',
        ],
        sizes: ['36 (S)', '38 (M)', '40 (L)'],
        colors: [
          { nameEn: 'Blush Rose', nameAr: 'وردي ناعم', hex: '#D8A499' },
          { nameEn: 'Pearl White', nameAr: 'أبيض لؤلؤي', hex: '#F9F6F0' },
        ],
        stock: 8,
        isAvailable: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        createdAt: '2026-03-05T12:00:00Z',
      },
      {
        id: 'prod-003',
        slug: 'byblos-linen-tailored-palazzo-set',
        sku: 'JB-2603',
        name: {
          en: 'Byblos Ivory Tailored Linen Set',
          ar: 'طقم بليزر وبنطال بيبلوس كتان عاجي',
        },
        description: {
          en: 'Luxurious two-piece modern tailored set in breathable premium Italian linen. Includes a relaxed structured single-breasted blazer and fluid wide-leg palazzo pants with tortoise-shell horn buttons.',
          ar: 'طقم قطعتين فاخر من الكتان الطبيعي المريح، يشمل بليزر أنيق بقصة كلاسيكية وبنطال بالازو عريض عالي الخصر، مثالي للإطلالات الصيفية الراقية والاجتماعات.',
        },
        price: 130,
        category: 'cat-suits',
        collection: 'Modern Muse',
        images: [
          '/src/assets/images/fashion_collection_casual_1791813931281.jpg',
        ],
        sizes: ['36 (S)', '38 (M)', '40 (L)', '42 (XL)'],
        colors: [
          { nameEn: 'Ivory Cream', nameAr: 'أوف وايت كريمي', hex: '#F5F2EB' },
          { nameEn: 'Sand Beige', nameAr: 'بيج رملي', hex: '#E2D7C5' },
        ],
        stock: 12,
        isAvailable: true,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        createdAt: '2026-02-28T09:00:00Z',
      },
      {
        id: 'prod-004',
        slug: 'sultanah-golden-embossed-luxury-abaya',
        sku: 'JB-2604',
        name: {
          en: 'Sultanah Gold Threaded Luxury Abaya',
          ar: 'عباية السلطانة الفاخرة المطرزة بالخيوط الذهبية',
        },
        description: {
          en: 'Opulent open-front abaya crafted from shimmering satin-silk weave with intricate artisanal gold zardozi embroidery along the sleeves and lapel. Comes with matching inner slip dress.',
          ar: 'عباية مفتوحة مصنوعة من قماش الحرير اللامع الفاخر مع تطريز يدوي ذهبي ناعم على الأكمام والأطراف، تأتي مع فستان داخلي متناسق.',
        },
        price: 165,
        salePrice: 149,
        category: 'cat-abayas',
        collection: 'Ramadan & Eid Couture',
        images: [
          '/src/assets/images/fashion_collection_abaya_1791813949088.jpg',
        ],
        sizes: ['52 (S)', '54 (M)', '56 (L)', '58 (XL)'],
        colors: [
          { nameEn: 'Champagne Silk', nameAr: 'شامباني حريري', hex: '#CDB18B' },
          { nameEn: 'Midnight Noir', nameAr: 'أسود ملكي', hex: '#1C1B1A' },
        ],
        stock: 9,
        isAvailable: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        createdAt: '2026-03-08T15:00:00Z',
      },
      {
        id: 'prod-005',
        slug: 'emerald-pleated-silk-twirl-maxi',
        sku: 'JB-2605',
        name: {
          en: 'Emerald Twilight Pleated Silk Gown',
          ar: 'فستان زمردي حرير بليسيه ملكي',
        },
        description: {
          en: 'As seen on our viral Instagram reel: stunning jewel-tone emerald green pleated silk maxi dress with wrap bodice, cinched waistline, and voluminous twirl skirt that floats with movement.',
          ar: 'القطعة الأكثر طلباً على إنستغرام: فستان ماكسي من الحرير الأخضر الزمردي بكسرات بليسيه انسيابية، خصر محدد، وقصة فضفاضة مريحة تمنحك إطلالة ملكية ساحرة.',
        },
        price: 155,
        salePrice: 139,
        category: 'cat-evening',
        collection: 'Instagram Viral Collection',
        images: [
          '/src/assets/images/reels_fashion_model_1791813958864.jpg',
        ],
        video: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-green-dress-walking-slowly-41019-large.mp4',
        sizes: ['36 (S)', '38 (M)', '40 (L)'],
        colors: [
          { nameEn: 'Royal Emerald', nameAr: 'أخضر زمردي', hex: '#0B6640' },
          { nameEn: 'Sapphire Blue', nameAr: 'أزرق ياقوتي', hex: '#1B3F73' },
        ],
        stock: 6,
        isAvailable: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        createdAt: '2026-03-10T16:30:00Z',
      },
    ],
    instagram: [
      {
        id: 'ig-reel-DdA88uiqa1u',
        type: 'reel',
        mediaUrl: '/src/assets/images/reel_DdA88uiqa1u.mp4',
        thumbnailUrl: '/src/assets/images/reel_DdA88uiqa1u.jpg',
        caption: {
          en: 'JOURI BOUTIQUE Official Reel ✨ Discover our latest collection on Instagram @jouriboutiquee.',
          ar: 'ريلز جوري بوتيك الرسمي ✨ شاهدي تشكيلة الموسم الجديد وتفاصيل القطع عبر حسابنا @jouriboutiquee.',
        },
        instagramUrl: 'https://www.instagram.com/reel/DdA88uiqa1u/',
        linkedProductId: 'prod-001',
        showOnHome: true,
        viewsOrLikes: '146 views · 16 likes',
        createdAt: '2026-09-07T14:00:00Z',
      },
      {
        id: 'ig-frame-01',
        type: 'image',
        mediaUrl: '/src/assets/images/reel_frame_01.jpg',
        thumbnailUrl: '/src/assets/images/reel_frame_01.jpg',
        caption: {
          en: 'Boutique lookbook spotlight from @jouriboutiquee · Tap to order via WhatsApp.',
          ar: 'لقطات حصرية من ريلز البوتيك الرسمي @jouriboutiquee · اضغطي للطلب المباشر عبر واتساب.',
        },
        instagramUrl: 'https://www.instagram.com/reel/DdA88uiqa1u/',
        linkedProductId: 'prod-001',
        showOnHome: true,
        viewsOrLikes: '16 likes',
        createdAt: '2026-09-07T14:00:00Z',
      },
      {
        id: 'ig-frame-03',
        type: 'image',
        mediaUrl: '/src/assets/images/reel_frame_03.jpg',
        thumbnailUrl: '/src/assets/images/reel_frame_03.jpg',
        caption: {
          en: 'Elegance in motion · Jouri Boutique new release on @jouriboutiquee.',
          ar: 'أناقة التفاصيل الحصرية · من ريلز جوري بوتيك على إنستغرام @jouriboutiquee.',
        },
        instagramUrl: 'https://www.instagram.com/reel/DdA88uiqa1u/',
        linkedProductId: 'prod-003',
        showOnHome: true,
        viewsOrLikes: '16 likes',
        createdAt: '2026-09-07T14:00:00Z',
      },
      {
        id: 'ig-frame-04',
        type: 'image',
        mediaUrl: '/src/assets/images/reel_frame_04.jpg',
        thumbnailUrl: '/src/assets/images/reel_frame_04.jpg',
        caption: {
          en: 'New season details from our official Instagram reel @jouriboutiquee.',
          ar: 'تفاصيل التشكيلة الجديدة من الريلز الرسمي للبوتيك @jouriboutiquee.',
        },
        instagramUrl: 'https://www.instagram.com/reel/DdA88uiqa1u/',
        linkedProductId: 'prod-004',
        showOnHome: true,
        viewsOrLikes: '16 likes',
        createdAt: '2026-09-07T14:00:00Z',
      },
    ],
    orders: [
      {
        id: 'ord-1001',
        orderNumber: 'JB-1041',
        customerName: 'Nour El-Khoury',
        customerPhone: '+961 70 891 234',
        deliveryAddress: 'Achrafieh, Sursock Street, Beirut',
        city: 'Beirut',
        items: [
          {
            productId: 'prod-001',
            productName: 'Beirut Royale Champagne Gown',
            size: '38 (M)',
            color: 'Champagne Gold',
            price: 245,
            quantity: 1,
            image: '/src/assets/images/hero_editorial_banner_1791813908419.jpg',
          },
        ],
        subtotal: 245,
        shippingFee: 0,
        total: 245,
        currency: 'USD',
        status: 'shipped',
        notes: 'Please call before arrival. Delivery in evening.',
        createdAt: '2026-03-11T14:22:00Z',
      },
      {
        id: 'ord-1002',
        orderNumber: 'JB-1042',
        customerName: 'Yara Haddad',
        customerPhone: '+961 81 234 567',
        deliveryAddress: 'Ghazieh Main Road, South Lebanon',
        city: 'Saida / Ghazieh',
        items: [
          {
            productId: 'prod-005',
            productName: 'Emerald Twilight Pleated Silk Gown',
            size: '36 (S)',
            color: 'Royal Emerald',
            price: 139,
            quantity: 1,
            image: '/src/assets/images/reels_fashion_model_1791813958864.jpg',
          },
        ],
        subtotal: 139,
        shippingFee: 0,
        total: 139,
        currency: 'USD',
        status: 'confirmed',
        notes: 'Saw this on Instagram Reel. Urgent for this Saturday!',
        createdAt: '2026-03-12T08:15:00Z',
      },
    ],
  };
};

function readDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, returning default data:', err);
    return getInitialData();
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// ---------------- REST API ROUTES ----------------

// Store Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const db = readDb();
  let list = db.products || [];

  const { category, search, featured, newArrival, bestSeller } = req.query;

  if (category && category !== 'all') {
    if (category === 'cat-new' || category === 'new-arrivals') {
      list = list.filter((p: any) => p.isNewArrival);
    } else if (category === 'cat-sale' || category === 'seasonal-sale') {
      list = list.filter((p: any) => Boolean(p.salePrice && p.salePrice < p.price));
    } else {
      list = list.filter((p: any) => p.category === category);
    }
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p: any) =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.ar.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q) ||
        p.description.ar.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  if (featured === 'true') {
    list = list.filter((p: any) => p.isFeatured);
  }
  if (newArrival === 'true') {
    list = list.filter((p: any) => p.isNewArrival);
  }
  if (bestSeller === 'true') {
    list = list.filter((p: any) => p.isBestSeller);
  }

  res.json(list);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const item = db.products.find(
    (p: any) => p.id === req.params.id || p.slug === req.params.id
  );
  if (!item) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(item);
});

app.post('/api/products', (req: Request, res: Response) => {
  const db = readDb();
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    sku: req.body.sku || `JB-${Math.floor(1000 + Math.random() * 9000)}`,
    slug:
      req.body.slug ||
      req.body.name?.en?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.products.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    id: req.params.id, // Preserve ID
  };
  writeDb(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.products = db.products.filter((p: any) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, id: req.params.id });
});

// Bulk Price Adjustments
app.post('/api/products/bulk-price', (req: Request, res: Response) => {
  const { type, amount, categoryId } = req.body;
  // type: 'fixed' | 'percent_discount' | 'percent_increase'
  const db = readDb();
  let updatedCount = 0;

  db.products = db.products.map((p: any) => {
    if (categoryId && categoryId !== 'all' && p.category !== categoryId) {
      return p;
    }

    let newPrice = p.price;
    if (type === 'percent_discount') {
      newPrice = Math.max(1, Math.round(p.price * (1 - amount / 100)));
      p.salePrice = newPrice;
    } else if (type === 'percent_increase') {
      newPrice = Math.round(p.price * (1 + amount / 100));
      p.price = newPrice;
    } else if (type === 'fixed_discount') {
      newPrice = Math.max(1, p.price - amount);
      p.salePrice = newPrice;
    } else if (type === 'reset_sale') {
      delete p.salePrice;
    }

    updatedCount++;
    return p;
  });

  writeDb(db);
  res.json({ success: true, updatedCount, products: db.products });
});

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.categories || []);
});

app.post('/api/categories', (req: Request, res: Response) => {
  const db = readDb();
  const newCat = {
    ...req.body,
    id: `cat-${Date.now()}`,
    order: (db.categories?.length || 0) + 1,
  };
  db.categories.push(newCat);
  writeDb(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.categories.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  db.categories[idx] = { ...db.categories[idx], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Instagram Media & Reels
app.get('/api/instagram', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.instagram || []);
});

app.post('/api/instagram', (req: Request, res: Response) => {
  const db = readDb();
  const newItem = {
    ...req.body,
    id: `ig-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.instagram.unshift(newItem);
  writeDb(db);
  res.status(201).json(newItem);
});

app.put('/api/instagram/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.instagram.findIndex((i: any) => i.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Media item not found' });
  }
  db.instagram[idx] = { ...db.instagram[idx], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.instagram[idx]);
});

app.delete('/api/instagram/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.instagram = db.instagram.filter((i: any) => i.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.orders || []);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const orderNum = `JB-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    ...req.body,
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    status: req.body.status || 'pending',
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(newOrder);
  writeDb(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const db = readDb();
  const order = db.orders.find((o: any) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.status = req.body.status;
  writeDb(db);
  res.json(order);
});

// File Upload endpoint for Media Library / Product Images / Logo
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { filename, base64Data, contentType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let extension = '.jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) extension = '.png';
      else if (mime.includes('svg')) extension = '.svg';
      else if (mime.includes('webp')) extension = '.webp';
      else if (mime.includes('mp4') || mime.includes('video')) extension = '.mp4';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const safeName = `${Date.now()}-${(filename || 'asset').replace(/[^a-zA-Z0-9_-]/g, '_')}${extension}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ url: publicUrl, filename: safeName });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process media upload' });
  }
});

// Admin Auth check
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const db = readDb();
  const currentPassword = db.adminPassword || 'jouri2026';
  if (password === currentPassword) {
    res.json({ success: true, token: 'jouri-admin-session-token-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Invalid password. Access denied.' });
  }
});

// Update Admin Password
app.put('/api/auth/password', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const db = readDb();
  const actualPassword = db.adminPassword || 'jouri2026';
  if (currentPassword !== actualPassword) {
    return res.status(401).json({ error: 'Incorrect current password' });
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters long' });
  }
  db.adminPassword = newPassword.trim();
  writeDb(db);
  res.json({ success: true, message: 'Admin access password updated successfully' });
});

// Reset seed data
app.post('/api/reset-data', (req: Request, res: Response) => {
  const fresh = getInitialData();
  writeDb(fresh);
  res.json({ success: true, message: 'Store reset to luxury default catalog' });
});

// Process unhandled errors guards
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Vite Middleware for Development / Dist in Production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Jouri Boutique server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
