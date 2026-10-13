import React from 'react';
import { useStore } from '../context/StoreContext';
import defaultLogoSvg from '../assets/images/jouri_boutique_logo.svg';
import {
  Instagram,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  SlidersHorizontal,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, settings, setIsAdminView, t } = useStore();

  const isAr = language === 'ar';
  const whatsappNum = settings?.whatsappNumber || '96181522399';
  const phoneDisplay = settings?.phone || '+961 81 522 399';
  const igUrl = settings?.instagramUrl || 'https://www.instagram.com/jouriboutiquee/';
  const igHandle = settings?.instagramHandle || '@jouriboutiquee';
  const footerLogo = settings?.logoUrl && !settings.logoUrl.includes('jouriboutiquee_profile.jpg') && !settings.logoUrl.includes('jouri_boutique_logo.svg')
    ? settings.logoUrl
    : '/jouri-logo.png';

  return (
    <footer className="bg-[#141413] text-stone-300 pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-stone-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-stone-800 w-full">
          
          {/* Brand & Story Column */}
          <div className="lg:col-span-4 space-y-4 min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-[#F4ECE1] border border-[#e8ded1] shadow-xs flex items-center justify-center shrink-0">
                <img
                  src={footerLogo}
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
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.15em] sm:tracking-[0.18em] font-medium text-white uppercase truncate">
                  {settings?.logoText || 'JOURI BOUTIQUE'}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase truncate">
                  {igHandle}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm break-words">
              {isAr
                ? settings?.aboutStory?.ar ||
                  'يمثل جوري بوتيك قمة الأناقة اللبنانية المعاصرة، جامعاً بين الحرفية الدقيقة والقصات الراقية المصممة للمرأة المتميزة.'
                : settings?.aboutStory?.en ||
                  'JOURI BOUTIQUE represents the epitome of modern Lebanese sophistication, blending artisanal craftsmanship with contemporary couture silhouettes.'}
            </p>

            <div className="pt-1 sm:pt-2 flex items-center gap-3 sm:gap-4">
              <a
                href={igUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-800 hover:bg-[#C5A880] text-stone-300 hover:text-stone-900 flex items-center justify-center transition-colors shrink-0"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-800 hover:bg-[#0B6640] text-stone-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div className="lg:col-span-3 space-y-3 min-w-0">
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-semibold">
              {t('footer.contact', 'Direct Contact & WhatsApp', 'التواصل المباشر والطلب')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white hover:text-[#C5A880] transition-colors truncate"
                >
                  <MessageCircle className="w-4 h-4 text-[#0B6640] shrink-0" />
                  <span className="font-mono text-xs sm:text-sm">{phoneDisplay}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span className="break-words">
                  {isAr
                    ? settings?.locationAddress?.ar || 'بيروت وجنوب لبنان · توصيل لكافة الأراضي اللبنانية'
                    : settings?.locationAddress?.en || 'Beirut & South Lebanon · Fast Nationwide Delivery'}
                </span>
              </li>
              <li className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">{t('footer.hours', 'Mon - Sat: 10:00 AM – 8:00 PM', 'الإثنين - السبت: 10:00 صباحاً – 8:00 مساءً')}</span>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="lg:col-span-3 space-y-3 min-w-0">
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-semibold">
              {t('footer.policies', 'Boutique Policies', 'سياسات المتجر')}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed break-words">
              {isAr
                ? settings?.returnPolicy?.ar ||
                  'نقبل الاستبدال في غضون 3 أيام من الاستلام في حال كانت القطعة بحالتها الأصلية.'
                : settings?.returnPolicy?.en ||
                  'We accept exchanges within 3 days in pristine condition with original tags intact.'}
            </p>
            <div className="pt-1 text-xs text-stone-400 flex items-center gap-1.5 min-w-0">
              <Shield className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span className="break-words">{t('footer.cod', 'Payment in Cash on Delivery (USD / LBP)', 'الدفع نقداً عند الاستلام (بالدولار أو الليرة)')}</span>
            </div>
          </div>

          {/* Quick Links & Admin */}
          <div className="lg:col-span-2 space-y-3 min-w-0">
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-semibold">
              {t('footer.store', 'Management', 'إدارة المتجر')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setIsAdminView(true)}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-[#C5A880] transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('footer.admin', 'Admin Dashboard', 'لوحة تحكم الإدارة')}</span>
                </button>
              </li>
              <li>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors truncate block"
                >
                  Instagram ({igHandle})
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-center sm:text-left w-full">
          <p>
            © {new Date().getFullYear()} JOURI BOUTIQUE. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>{isAr ? 'تصميم حصري · لبنان' : 'Haute Couture · Lebanon'}</span>
            <span aria-hidden="true">·</span>
            <span>+961 81 522 399</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
