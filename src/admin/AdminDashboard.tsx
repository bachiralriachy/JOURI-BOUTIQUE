import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Image as ImageIcon,
  Instagram,
  ShoppingBag,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  MessageCircle,
  Save,
  RefreshCw,
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
  Percent,
  Palette,
  KeyRound,
  Lock,
} from 'lucide-react';
import { Product, Order, InstagramMedia, StoreSettings } from '../types';

const THEME_PRESETS = [
  {
    id: 'luxury-gold',
    name: 'Luxury Gold (Signature)',
    nameAr: 'الذهبي الملكي (الأساسي)',
    primary: '#141413',
    accent: '#C5A880',
    background: '#FAF8F5',
  },
  {
    id: 'elegant-rose',
    name: 'Elegant Rose & Blush',
    nameAr: 'الوردي المخملي والأنثوي',
    primary: '#2A1B1F',
    accent: '#D8A499',
    background: '#FDF8F7',
  },
  {
    id: 'royal-emerald',
    name: 'Royal Emerald & Silk',
    nameAr: 'الزمردي الملكي والحرير',
    primary: '#0F241D',
    accent: '#348B69',
    background: '#F5F9F7',
  },
  {
    id: 'midnight-luxe',
    name: 'Midnight Noir & Gold',
    nameAr: 'الأسود الليلي والذهبي',
    primary: '#0E131F',
    accent: '#D4AF37',
    background: '#F7F9FC',
  },
  {
    id: 'pearl-minimalist',
    name: 'Pearl Minimalist',
    nameAr: 'البساطة واللؤلؤ النقي',
    primary: '#18181B',
    accent: '#8A7B68',
    background: '#FFFFFF',
  },
];

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    products,
    categories,
    orders,
    instagramMedia,
    refreshData,
    setIsAdminView,
    formatPrice,
    language,
  } = useStore();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('jouri_admin_auth'));
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password Management state
  const [pwdChange, setPwdChange] = useState({ current: '', newPwd: '', confirm: '' });
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'pricing' | 'orders' | 'instagram' | 'theme' | 'homepage' | 'settings'
  >('overview');

  // Confirmation modals state (avoids window.confirm in iframe)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'reel'; id: string; name: string } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Product Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Bulk Price Adjustments
  const [bulkType, setBulkType] = useState<'percent_discount' | 'percent_increase' | 'fixed_discount' | 'reset_sale'>('percent_discount');
  const [bulkAmount, setBulkAmount] = useState<number>(10);
  const [bulkCategory, setBulkCategory] = useState<string>('all');

  // Instagram Media Editor
  const [editingIgItem, setEditingIgItem] = useState<Partial<InstagramMedia> | null>(null);

  // Settings Editor State
  const [settingsForm, setSettingsForm] = useState<StoreSettings | null>(settings);

  // Sync settingsForm when settings load
  React.useEffect(() => {
    if (settings && !settingsForm) {
      setSettingsForm(settings);
    }
  }, [settings]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      if (res.ok) {
        localStorage.setItem('jouri_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Invalid admin password');
      }
    } catch {
      const customPwd = localStorage.getItem('jouri_admin_custom_pwd') || 'jouri2026';
      if (passwordInput === customPwd) {
        localStorage.setItem('jouri_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid admin password');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jouri_admin_auth');
    setIsAuthenticated(false);
  };

  // Upload helper: converts file to Base64 and uploads to /api/upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              base64Data: reader.result,
              contentType: file.type,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            resolve(data.url);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = isCreatingProduct || !editingProduct?.id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...editingProduct,
        ...productForm,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification(isNew ? 'Product created successfully!' : 'Product updated!');
        setEditingProduct(null);
        setIsCreatingProduct(false);
        setProductForm({});
        await refreshData();
      } else {
        showNotification('Failed to save product', 'error');
      }
    } catch {
      showNotification('Error saving product', 'error');
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification(`Product "${name}" deleted`);
        setItemToDelete(null);
        await refreshData();
      } else {
        showNotification('Failed to delete product', 'error');
      }
    } catch {
      showNotification('Failed to delete product', 'error');
    }
  };

  // Product Duplicate
  const handleDuplicateProduct = async (prod: Product) => {
    const copy = {
      ...prod,
      name: {
        en: `${prod.name.en} (Copy)`,
        ar: `${prod.name.ar} (نسخة)`,
      },
      sku: `JB-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: `${prod.slug}-copy-${Date.now()}`,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });
      if (res.ok) {
        showNotification('Product duplicated successfully');
        await refreshData();
      }
    } catch {
      showNotification('Error duplicating product', 'error');
    }
  };

  // Bulk Price Application
  const handleApplyBulkPricing = async () => {
    try {
      const res = await fetch('/api/products/bulk-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: bulkType,
          amount: bulkAmount,
          categoryId: bulkCategory,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(`Applied pricing adjustment to ${data.updatedCount} products!`);
        await refreshData();
      }
    } catch {
      showNotification('Failed to apply bulk pricing', 'error');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        showNotification('Store settings and branding updated!');
        await refreshData();
      }
    } catch {
      showNotification('Failed to save settings', 'error');
    }
  };

  // Instagram Media Save
  const handleSaveIgMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIgItem) return;

    try {
      const isNew = !editingIgItem.id;
      const url = isNew ? '/api/instagram' : `/api/instagram/${editingIgItem.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingIgItem),
      });

      if (res.ok) {
        showNotification(isNew ? 'Reel added to showcase!' : 'Reel updated successfully!');
        setEditingIgItem(null);
        await refreshData();
      }
    } catch {
      showNotification('Failed to save Reel media', 'error');
    }
  };

  const handleDeleteIgMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/instagram/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Instagram media item deleted');
        setItemToDelete(null);
        await refreshData();
      }
    } catch {
      showNotification('Failed to delete media item', 'error');
    }
  };

  // Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showNotification(`Order status updated to ${status}`);
        await refreshData();
      }
    } catch {
      showNotification('Failed to update status', 'error');
    }
  };

  // Change Admin Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus(null);
    if (!pwdChange.current) {
      setPwdStatus({ type: 'error', text: 'Please enter your current admin password' });
      return;
    }
    if (pwdChange.newPwd !== pwdChange.confirm) {
      setPwdStatus({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (pwdChange.newPwd.length < 4) {
      setPwdStatus({ type: 'error', text: 'New password must be at least 4 characters long' });
      return;
    }
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwdChange.current,
          newPassword: pwdChange.newPwd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('jouri_admin_custom_pwd', pwdChange.newPwd);
        setPwdStatus({ type: 'success', text: 'Admin access password changed successfully!' });
        setPwdChange({ current: '', newPwd: '', confirm: '' });
        showNotification('Admin password changed successfully');
      } else {
        setPwdStatus({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      // Local fallback
      const storedPwd = localStorage.getItem('jouri_admin_custom_pwd') || 'jouri2026';
      if (pwdChange.current === storedPwd) {
        localStorage.setItem('jouri_admin_custom_pwd', pwdChange.newPwd);
        setPwdStatus({ type: 'success', text: 'Admin access password updated successfully!' });
        setPwdChange({ current: '', newPwd: '', confirm: '' });
        showNotification('Admin password changed successfully');
      } else {
        setPwdStatus({ type: 'error', text: 'Current password is incorrect' });
      }
    }
  };

  // Reset to default sample catalog
  const handleResetCatalog = async () => {
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        showNotification('Store catalog reset to luxury defaults');
        setShowResetModal(false);
        await refreshData();
      }
    } catch {
      showNotification('Failed to reset store catalog', 'error');
    }
  };

  // If Not Authenticated -> Show Secure Admin Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-sm border border-stone-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-100 rounded-full text-stone-900 mb-3 border border-stone-200">
              <Lock className="w-5 h-5 text-[#A5855A]" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-wider text-stone-900 uppercase">
              JOURI BOUTIQUE
            </h1>
            <p className="text-xs tracking-widest text-[#A5855A] uppercase mt-1">
              Store Owner Portal · Lebanon
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Admin Access Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-[#C5A880] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-[#A5855A] text-white rounded text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <button
              onClick={() => setIsAdminView(false)}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Overview Metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isAvailable).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-stone-900 flex flex-col font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminView(false)}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-950 px-2.5 py-1.5 rounded hover:bg-stone-100 transition-colors"
            title="Return to store preview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">View Live Store</span>
          </button>
          <div className="h-4 w-px bg-stone-300" />
          <h1 className="font-serif text-lg font-bold tracking-wider text-stone-900 uppercase">
            JOURI BOUTIQUE ADMIN
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {statusMessage && (
            <div
              className={`px-3 py-1 text-xs rounded font-medium flex items-center gap-1.5 animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-xs text-stone-500 hover:text-red-700 font-medium px-2 py-1 rounded"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar Navigation */}
        <nav className="md:col-span-3 space-y-1 bg-white p-3 rounded border border-stone-200 h-fit">
          <button
            onClick={() => { setActiveTab('overview'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'products' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({totalProducts})</span>
          </button>

          <button
            onClick={() => { setActiveTab('pricing'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'pricing' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pricing & Discounts</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({totalOrders})</span>
          </button>

          <button
            onClick={() => { setActiveTab('instagram'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'instagram' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Reels & Videos ({instagramMedia.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('theme'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'theme' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Colors</span>
          </button>

          <button
            onClick={() => { setActiveTab('homepage'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'homepage' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Homepage & Hero Editor</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
              activeTab === 'settings' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings & Password</span>
          </button>

          <div className="pt-4 mt-4 border-t border-stone-200">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-stone-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Luxury Defaults</span>
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <main className="md:col-span-9 bg-white p-6 rounded border border-stone-200 shadow-xs min-h-[500px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Store Performance</h2>
                <p className="text-xs text-stone-500">Live analytics for Jouri Boutique Lebanon storefront.</p>
              </div>

              {/* Metric KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#FAF8F5] rounded border border-stone-200">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase">Total Catalog</p>
                  <p className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">{totalProducts}</p>
                  <p className="text-[10px] text-stone-400 mt-1">{activeProducts} active online</p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded border border-stone-200">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase">Total Orders</p>
                  <p className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">{totalOrders}</p>
                  <p className="text-[10px] text-emerald-600 mt-1">Processed via WhatsApp</p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded border border-stone-200">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase">Total Volume</p>
                  <p className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">${totalRevenue}</p>
                  <p className="text-[10px] text-stone-400 mt-1">USD equivalent</p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded border border-stone-200">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase">Stock Status</p>
                  <p className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">{outOfStockProducts}</p>
                  <p className="text-[10px] text-stone-400 mt-1">Out of stock items</p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-4 bg-stone-50 rounded border border-stone-200 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Quick Actions:</span>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(true);
                    setProductForm({
                      name: { en: '', ar: '' },
                      description: { en: '', ar: '' },
                      price: 150,
                      stock: 10,
                      category: categories[0]?.id || 'cat-evening',
                      sizes: ['38 (M)', '40 (L)'],
                      colors: [{ nameEn: 'Champagne Gold', nameAr: 'ذهبي شامباني', hex: '#D4AF37' }],
                      images: ['/src/assets/images/hero_editorial_banner_1791813908419.jpg'],
                      isAvailable: true,
                      isNewArrival: true,
                      isFeatured: true,
                      isBestSeller: false,
                    });
                    setActiveTab('products');
                  }}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Adjust Prices</span>
                </button>
                <button
                  onClick={() => setActiveTab('instagram')}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Add Instagram Reel</span>
                </button>
              </div>

              {/* Recent Orders Overview */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-3">Recent Customer Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto border border-stone-200 rounded">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Order #</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50">
                            <td className="p-3 font-mono font-bold">{ord.orderNumber}</td>
                            <td className="p-3">{ord.customerName}</td>
                            <td className="p-3 font-mono">{ord.customerPhone}</td>
                            <td className="p-3">{ord.items.length} items</td>
                            <td className="p-3 font-mono font-bold">${ord.total}</td>
                            <td className="p-3 capitalize">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800">
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product List or Product Form */}
              {!isCreatingProduct && !editingProduct ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-stone-900">Product Management</h2>
                      <p className="text-xs text-stone-500">Add, edit, duplicate, or delete couture pieces.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCreatingProduct(true);
                        setProductForm({
                          name: { en: '', ar: '' },
                          description: { en: '', ar: '' },
                          price: 180,
                          stock: 5,
                          category: categories[0]?.id || 'cat-evening',
                          sizes: ['36 (S)', '38 (M)', '40 (L)'],
                          colors: [{ nameEn: 'Emerald Green', nameAr: 'أخضر زمردي', hex: '#0B6640' }],
                          images: ['/src/assets/images/reels_fashion_model_1791813958864.jpg'],
                          isAvailable: true,
                          isNewArrival: true,
                          isFeatured: true,
                          isBestSeller: false,
                        });
                      }}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Product</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-stone-200 rounded">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Photo</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Product Name (EN / AR)</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-stone-50">
                            <td className="p-3">
                              <img
                                src={p.images[0] || '/src/assets/images/hero_editorial_banner_1791813908419.jpg'}
                                alt={p.name.en}
                                className="w-10 h-12 object-cover rounded-sm border border-stone-200"
                              />
                            </td>
                            <td className="p-3 font-mono text-stone-500">{p.sku}</td>
                            <td className="p-3">
                              <p className="font-semibold text-stone-900">{p.name.en}</p>
                              <p className="text-stone-500 font-sans">{p.name.ar}</p>
                            </td>
                            <td className="p-3 text-stone-600">
                              {categories.find((c) => c.id === p.category)?.name.en || p.category}
                            </td>
                            <td className="p-3 font-mono font-bold">
                              ${p.salePrice || p.price}
                              {p.salePrice && <span className="text-[10px] text-red-600 ml-1">Sale</span>}
                            </td>
                            <td className="p-3 font-mono">{p.stock}</td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm(p);
                                }}
                                className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                                title="Edit product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                                title="Duplicate product"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setItemToDelete({ type: 'product', id: p.id, name: p.name.en })}
                                className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* EDIT / CREATE PRODUCT FORM */
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <div>
                      <h3 className="text-base font-serif font-bold text-stone-900">
                        {isCreatingProduct ? 'Create New Creation' : `Edit: ${editingProduct?.name.en}`}
                      </h3>
                      <p className="text-xs text-stone-500">Provide bilingual details, imagery, pricing and variants.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* English Name */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name?.en || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: { ...productForm.name!, en: e.target.value },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>

                    {/* Arabic Name */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name (Arabic) *</label>
                      <input
                        type="text"
                        required
                        dir="rtl"
                        value={productForm.name?.ar || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: { ...productForm.name!, ar: e.target.value },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>

                    {/* English Description */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Description (English)</label>
                      <textarea
                        rows={3}
                        value={productForm.description?.en || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: { ...productForm.description!, en: e.target.value },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>

                    {/* Arabic Description */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Description (Arabic)</label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={productForm.description?.ar || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: { ...productForm.description!, ar: e.target.value },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>

                    {/* Price USD */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Regular Price ($ USD) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={productForm.price || ''}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono"
                      />
                    </div>

                    {/* Sale Price USD */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Sale Price ($ USD, optional)</label>
                      <input
                        type="number"
                        min="1"
                        value={productForm.salePrice || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            salePrice: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        placeholder="Leave blank for regular price"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                      <select
                        value={productForm.category || categories[0]?.id}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name.en} ({c.name.ar})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={productForm.stock ?? 5}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono"
                      />
                    </div>
                  </div>

                  {/* Image Manager & Uploader */}
                  <div className="space-y-3 pt-3 border-t border-stone-200">
                    <label className="block text-xs font-semibold text-stone-700">Product Images</label>
                    <div className="flex flex-wrap gap-3">
                      {(productForm.images || []).map((img, idx) => (
                        <div key={idx} className="relative group w-20 h-24 border rounded overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(productForm.images || [])];
                              next.splice(idx, 1);
                              setProductForm({ ...productForm, images: next });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Upload Button */}
                      <label className="w-20 h-24 border-2 border-dashed border-stone-300 hover:border-stone-800 rounded flex flex-col items-center justify-center cursor-pointer transition-colors text-stone-500 hover:text-stone-900">
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-[10px] text-center px-1">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) {
                                setProductForm({
                                  ...productForm,
                                  images: [...(productForm.images || []), url],
                                });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Manual Image URL Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Or enter image URL..."
                        id="manual-img-url"
                        className="text-xs px-3 py-1.5 border border-stone-300 rounded flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('manual-img-url') as HTMLInputElement;
                          if (el && el.value.trim()) {
                            setProductForm({
                              ...productForm,
                              images: [...(productForm.images || []), el.value.trim()],
                            });
                            el.value = '';
                          }
                        }}
                        className="px-3 py-1.5 bg-stone-200 text-stone-800 text-xs rounded hover:bg-stone-300"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Badges / Visibility Toggles */}
                  <div className="pt-3 border-t border-stone-200 flex flex-wrap gap-6 text-xs text-stone-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isAvailable ?? true}
                        onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                      />
                      <span>Available for Purchase</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured ?? true}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      />
                      <span>Featured on Homepage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isNewArrival ?? false}
                        onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                      />
                      <span>New Arrival Tag</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isBestSeller ?? false}
                        onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      />
                      <span>Best Seller Tag</span>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="px-4 py-2 border border-stone-300 rounded text-xs text-stone-700 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Product</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 3: PRICING & DISCOUNTS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Pricing & Bulk Discount Manager</h2>
                <p className="text-xs text-stone-500">
                  Update any product price in real time or apply store-wide seasonal discounts.
                </p>
              </div>

              {/* Bulk Adjuster Module */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
                  <Percent className="w-4 h-4 text-[#A5855A]" />
                  <span>Bulk Price Adjustments</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Adjustment Type</label>
                    <select
                      value={bulkType}
                      onChange={(e: any) => setBulkType(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    >
                      <option value="percent_discount">Apply % Discount (Sale)</option>
                      <option value="fixed_discount">Apply Fixed $ Off</option>
                      <option value="percent_increase">Increase Prices by %</option>
                      <option value="reset_sale">Clear All Sale Prices</option>
                    </select>
                  </div>

                  {bulkType !== 'reset_sale' && (
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Amount ({bulkType.includes('percent') ? '%' : '$'})
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={bulkAmount}
                        onChange={(e) => setBulkAmount(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Target Category</label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    >
                      <option value="all">All Products in Store</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name.en}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyBulkPricing}
                  className="px-4 py-2 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded transition-colors"
                >
                  Execute Bulk Price Update
                </button>
              </div>

              {/* Fast Inline Price Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-900">Individual Product Prices</h3>
                <div className="overflow-x-auto border border-stone-200 rounded">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Regular Price ($)</th>
                        <th className="p-3">Sale Price ($)</th>
                        <th className="p-3 text-right">Quick Save</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-3 font-semibold text-stone-900">{p.name.en}</td>
                          <td className="p-3 font-mono text-stone-500">{p.sku}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              defaultValue={p.price}
                              id={`reg-price-${p.id}`}
                              className="w-24 px-2 py-1 border border-stone-300 rounded font-mono"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              defaultValue={p.salePrice || ''}
                              placeholder="None"
                              id={`sale-price-${p.id}`}
                              className="w-24 px-2 py-1 border border-stone-300 rounded font-mono"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={async () => {
                                const regInput = document.getElementById(`reg-price-${p.id}`) as HTMLInputElement;
                                const saleInput = document.getElementById(`sale-price-${p.id}`) as HTMLInputElement;
                                const newReg = parseFloat(regInput?.value) || p.price;
                                const newSale = saleInput?.value ? parseFloat(saleInput.value) : undefined;

                                const res = await fetch(`/api/products/${p.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    ...p,
                                    price: newReg,
                                    salePrice: newSale,
                                  }),
                                });
                                if (res.ok) {
                                  showNotification(`Price updated for ${p.name.en}`);
                                  refreshData();
                                }
                              }}
                              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-950 text-white text-[11px] font-semibold rounded"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Order Management</h2>
                <p className="text-xs text-stone-500">Track and fulfill customer orders sent via WhatsApp.</p>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-stone-500">No orders received yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-stone-900">{ord.orderNumber}</span>
                          <span className="text-xs text-stone-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-600">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="text-xs px-2.5 py-1 border border-stone-300 rounded bg-white font-medium capitalize"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
                        <div>
                          <p className="font-semibold text-stone-900">Customer</p>
                          <p>{ord.customerName}</p>
                          <p className="font-mono text-stone-500">{ord.customerPhone}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">Delivery Address</p>
                          <p>{ord.deliveryAddress}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">Order Total</p>
                          <p className="font-mono font-bold text-base text-stone-900">${ord.total}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="pt-2 border-t border-stone-200 space-y-1">
                        <p className="text-[11px] font-semibold text-stone-600 uppercase">Items:</p>
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between text-xs text-stone-700">
                            <span>{it.quantity}x {it.productName} ({it.size}, {it.color})</span>
                            <span className="font-mono">${it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Contact on WhatsApp Action */}
                      <div className="pt-2 flex justify-end">
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${ord.customerName}! ✨ This is JOURI BOUTIQUE regarding your order ${ord.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#0B6640] hover:bg-[#084b2f] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contact Customer on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INSTAGRAM & REELS */}
          {activeTab === 'instagram' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold text-stone-900">Instagram & Reels Integration</h2>
                  <p className="text-xs text-stone-500">
                    Import authorized media, manage runway reels, captions, and links to products.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingIgItem({
                      type: 'reel',
                      mediaUrl: '/src/assets/images/reel_DdA88uiqa1u.mp4',
                      thumbnailUrl: '/src/assets/images/reel_DdA88uiqa1u.jpg',
                      caption: { en: 'New Season Reel @jouriboutiquee ✨', ar: 'ريلز الموسم الجديد @jouriboutiquee ✨' },
                      showOnHome: true,
                      viewsOrLikes: '146 views · 16 likes',
                      instagramUrl: 'https://www.instagram.com/reel/DdA88uiqa1u/',
                    })
                  }
                  className="px-3 py-1.5 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reel / Post</span>
                </button>
              </div>

              {/* Ig Item Editor Form */}
              {editingIgItem && (
                <form onSubmit={handleSaveIgMedia} className="p-4 bg-stone-50 border border-stone-200 rounded space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {editingIgItem.id ? 'Edit Media Post' : 'Add New Instagram Content'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Media Type</label>
                      <select
                        value={editingIgItem.type || 'reel'}
                        onChange={(e: any) => setEditingIgItem({ ...editingIgItem, type: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                      >
                        <option value="reel">Vertical Video Reel</option>
                        <option value="image">Editorial Photo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Views / Likes Count</label>
                      <input
                        type="text"
                        value={editingIgItem.viewsOrLikes || ''}
                        onChange={(e) => setEditingIgItem({ ...editingIgItem, viewsOrLikes: e.target.value })}
                        placeholder="e.g. 15.4K views"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Caption (English)</label>
                      <input
                        type="text"
                        value={editingIgItem.caption?.en || ''}
                        onChange={(e) =>
                          setEditingIgItem({
                            ...editingIgItem,
                            caption: { ...editingIgItem.caption!, en: e.target.value },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Caption (Arabic)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={editingIgItem.caption?.ar || ''}
                        onChange={(e) =>
                          setEditingIgItem({
                            ...editingIgItem,
                            caption: { ...editingIgItem.caption!, ar: e.target.value },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Media Image/Video URL or File</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingIgItem.mediaUrl || ''}
                          onChange={(e) => setEditingIgItem({ ...editingIgItem, mediaUrl: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                        />
                        <label className="px-3 py-2 bg-stone-200 text-stone-800 text-xs rounded cursor-pointer shrink-0">
                          Upload
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) setEditingIgItem({ ...editingIgItem, mediaUrl: url });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Link to Boutique Product</label>
                      <select
                        value={editingIgItem.linkedProductId || ''}
                        onChange={(e) => setEditingIgItem({ ...editingIgItem, linkedProductId: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                      >
                        <option value="">None (General Brand Post)</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name.en} (${p.salePrice || p.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingIgItem.showOnHome ?? true}
                        onChange={(e) => setEditingIgItem({ ...editingIgItem, showOnHome: e.target.checked })}
                      />
                      <span>Show on Homepage Reel Carousel</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingIgItem(null)}
                        className="px-3 py-1.5 border border-stone-300 rounded text-xs text-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Grid of Instagram items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {instagramMedia.map((it) => (
                  <div key={it.id} className="border border-stone-200 rounded p-2 bg-stone-50 space-y-2">
                    <img
                      src={it.mediaUrl}
                      alt=""
                      className="w-full aspect-[9/16] object-cover rounded-sm"
                    />
                    <p className="text-xs line-clamp-1 font-medium">{it.caption.en}</p>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>{it.viewsOrLikes}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingIgItem(it)}
                          className="p-1 hover:text-stone-900"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete({ type: 'reel', id: it.id, name: it.caption?.en || 'Instagram Reel' })}
                          className="p-1 hover:text-red-700"
                          title="Delete Reel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: HOMEPAGE & HERO */}
          {activeTab === 'homepage' && settingsForm && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Homepage & Hero Campaign Editor</h2>
                <p className="text-xs text-stone-500">Customize main headline, editorial campaign banner, and announcement text.</p>
              </div>

              {/* Announcement Bar */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Top Announcement Bar
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcement.enabled}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcement: { ...settingsForm.announcement, enabled: e.target.checked },
                        })
                      }
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Text (English)</label>
                    <input
                      type="text"
                      value={settingsForm.announcement.text.en}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcement: {
                            ...settingsForm.announcement,
                            text: { ...settingsForm.announcement.text, en: e.target.value },
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Text (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={settingsForm.announcement.text.ar}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcement: {
                            ...settingsForm.announcement,
                            text: { ...settingsForm.announcement.text, ar: e.target.value },
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Banner Details */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Hero Campaign Section
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Main Headline (English)</label>
                    <input
                      type="text"
                      value={settingsForm.hero.title.en}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: {
                            ...settingsForm.hero,
                            title: { ...settingsForm.hero.title, en: e.target.value },
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Main Headline (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={settingsForm.hero.title.ar}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: {
                            ...settingsForm.hero,
                            title: { ...settingsForm.hero.title, ar: e.target.value },
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Subtitle (English)</label>
                    <textarea
                      rows={2}
                      value={settingsForm.hero.subtitle.en}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: {
                            ...settingsForm.hero,
                            subtitle: { ...settingsForm.hero.subtitle, en: e.target.value },
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Subtitle (Arabic)</label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={settingsForm.hero.subtitle.ar}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: {
                            ...settingsForm.hero,
                            subtitle: { ...settingsForm.hero.subtitle, ar: e.target.value },
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">Hero Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settingsForm.hero.imageUrl}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, imageUrl: e.target.value },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                    <label className="px-3 py-2 bg-stone-200 text-stone-800 text-xs rounded cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleFileUpload(e.target.files[0]);
                            if (url) {
                              setSettingsForm({
                                ...settingsForm,
                                hero: { ...settingsForm.hero, imageUrl: url },
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded"
              >
                Save Homepage Settings
              </button>
            </form>
          )}

          {/* TAB 7: SETTINGS & LOGO */}
          {activeTab === 'settings' && settingsForm && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Boutique Identity & Brand Settings</h2>
                <p className="text-xs text-stone-500">
                  Update official logo, WhatsApp contact (+961 81 522 399), Lebanese currency, and store policies.
                </p>
              </div>

              {/* Logo Management */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Official Logo & Wordmark
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Logo Text Wordmark</label>
                    <input
                      type="text"
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Logo Image (Optional PNG/SVG)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settingsForm.logoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        placeholder="Leave empty to use elegant typography wordmark"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                      />
                      <label className="px-3 py-2 bg-stone-200 text-stone-800 text-xs rounded cursor-pointer shrink-0">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setSettingsForm({ ...settingsForm, logoUrl: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                    {settingsForm.logoUrl && (
                      <div className="mt-2 flex items-center gap-3 p-2 bg-stone-100 rounded border border-stone-200">
                        <div className="w-10 h-10 rounded-full bg-[#161513] border border-[#C5A880]/80 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={settingsForm.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                            style={{ imageRendering: '-webkit-optimize-contrast' }}
                          />
                        </div>
                        <div className="flex-1 text-[11px] text-stone-600 truncate">
                          {settingsForm.logoUrl}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '/jouri-logo.png' })}
                          className="text-[10px] text-[#A5855A] font-semibold hover:underline shrink-0"
                        >
                          Use Instagram Logo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact & WhatsApp */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Contact & WhatsApp Concierge
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      WhatsApp Number (Format: 96181522399) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Display Phone (+961 81 522 399)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={settingsForm.instagramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={settingsForm.instagramHandle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Currency & Delivery */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Currencies & Delivery in Lebanon
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Primary Currency</label>
                    <input
                      type="text"
                      value={settingsForm.currency}
                      onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={settingsForm.currencySymbol}
                      onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">LBP Exchange Rate</label>
                    <input
                      type="number"
                      value={settingsForm.secondaryCurrency?.rate || 89500}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          secondaryCurrency: {
                            code: 'LBP',
                            symbol: 'L.L',
                            enabled: true,
                            ...(settingsForm.secondaryCurrency || {}),
                            rate: parseFloat(e.target.value) || 89500,
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Admin Password Section */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#A5855A]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Security & Change Admin Password
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Update your admin access password to protect your boutique management portal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={pwdChange.current}
                      onChange={(e) => setPwdChange({ ...pwdChange, current: e.target.value })}
                      placeholder="Current password"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      value={pwdChange.newPwd}
                      onChange={(e) => setPwdChange({ ...pwdChange, newPwd: e.target.value })}
                      placeholder="Min 4 characters"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      value={pwdChange.confirm}
                      onChange={(e) => setPwdChange({ ...pwdChange, confirm: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                    />
                  </div>
                </div>

                {pwdStatus && (
                  <div
                    className={`text-xs p-2.5 rounded font-medium ${
                      pwdStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {pwdStatus.text}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNewPwd}
                      onChange={(e) => setShowNewPwd(e.target.checked)}
                      className="rounded"
                    />
                    <span>Show new password</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded"
              >
                Save All Settings
              </button>
            </form>
          )}

          {/* TAB: THEME & APPEARANCE */}
          {activeTab === 'theme' && settingsForm && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Website Theme & Color Palette</h2>
                <p className="text-xs text-stone-500">
                  Select curated luxury color schemes or customize individual primary, accent, and background tones.
                </p>
              </div>

              {/* Theme Presets */}
              <div className="p-5 bg-white border border-stone-200 rounded space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A5855A]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Boutique Haute Couture Presets
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Click any preset to instantly apply luxury aesthetic palettes inspired by Beirut fashion houses:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected =
                      settingsForm.themeColors?.primary === preset.primary &&
                      settingsForm.themeColors?.accent === preset.accent;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              primary: preset.primary,
                              accent: preset.accent,
                              background: preset.background,
                            },
                          });
                          showNotification(`Applied "${preset.name}". Click Save below to publish.`);
                        }}
                        className={`p-3 rounded border text-left transition-all ${
                          isSelected
                            ? 'border-stone-900 ring-2 ring-stone-900/10 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-stone-900">{preset.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-stone-900" />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                            style={{ backgroundColor: preset.primary }}
                            title="Primary"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                            style={{ backgroundColor: preset.accent }}
                            title="Accent"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                            style={{ backgroundColor: preset.background }}
                            title="Background"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="p-5 bg-white border border-stone-200 rounded space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#A5855A]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Custom Color Fine-Tuning
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Primary / Buttons Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsForm.themeColors?.primary || '#141413'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              ...settingsForm.themeColors,
                              primary: e.target.value,
                            },
                          })
                        }
                        className="w-9 h-9 p-0.5 rounded border border-stone-300 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColors?.primary || '#141413'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              ...settingsForm.themeColors,
                              primary: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Accent / Gold Highlight
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsForm.themeColors?.accent || '#C5A880'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              ...settingsForm.themeColors,
                              accent: e.target.value,
                            },
                          })
                        }
                        className="w-9 h-9 p-0.5 rounded border border-stone-300 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColors?.accent || '#C5A880'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              ...settingsForm.themeColors,
                              accent: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Page Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsForm.themeColors?.background || '#FAF8F5'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              ...settingsForm.themeColors,
                              background: e.target.value,
                            },
                          })
                        }
                        className="w-9 h-9 p-0.5 rounded border border-stone-300 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColors?.background || '#FAF8F5'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColors: {
                              ...settingsForm.themeColors,
                              background: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono uppercase bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Live Component Preview
                  </p>
                  <div
                    className="p-4 rounded border flex items-center justify-between gap-4"
                    style={{
                      backgroundColor: settingsForm.themeColors?.background || '#FAF8F5',
                      borderColor: '#E7E5E4',
                    }}
                  >
                    <div>
                      <h4 className="font-serif text-sm font-semibold" style={{ color: settingsForm.themeColors?.primary || '#141413' }}>
                        JOURI BOUTIQUE
                      </h4>
                      <p className="text-xs" style={{ color: settingsForm.themeColors?.accent || '#C5A880' }}>
                        Haute Couture 2026 Edition
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 text-xs font-semibold rounded text-white"
                      style={{ backgroundColor: settingsForm.themeColors?.primary || '#141413' }}
                    >
                      Sample CTA
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#A5855A] text-white text-xs font-semibold rounded transition-colors"
                  >
                    Save & Publish Theme
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* IN-APP CONFIRMATION MODALS (Safe for iFrame environments) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-stone-900">"{itemToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (itemToDelete.type === 'product') {
                    handleDeleteProduct(itemToDelete.id, itemToDelete.name);
                  } else {
                    handleDeleteIgMedia(itemToDelete.id);
                  }
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-amber-600">
              <RefreshCw className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Reset Catalog to Defaults?
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              This will restore all products, prices, and media to the original luxury boutique catalog. Custom products will be replaced with defaults.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetCatalog}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-[#A5855A] text-white rounded text-xs font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
