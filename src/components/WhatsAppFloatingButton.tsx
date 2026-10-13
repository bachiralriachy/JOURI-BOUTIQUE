import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings, language, t } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappNum = settings?.whatsappNumber || '96181522399';
  const isAr = language === 'ar';

  const defaultMsg = isAr
    ? 'مرحباً جوري بوتيك! ✨ أود الاستفسار عن التصاميم المتوفرة والتوصيل.'
    : 'Hello Jouri Boutique! ✨ I would like to inquire about available pieces and delivery in Lebanon.';

  const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2">
      {/* Optional Help Bubble */}
      {showTooltip && (
        <div className="bg-stone-900 text-stone-100 p-3 rounded shadow-xl text-xs max-w-xs border border-stone-800 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-semibold text-[#C5A880]">
              {isAr ? 'خدمة الزبائن جوري بوتيك' : 'Jouri Boutique Concierge'}
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-stone-300">
            {isAr
              ? 'تحدثي مباشرة مع مستشارة الموضة للطلب أو الاستفسار عن المقاسات'
              : 'Chat directly with our fashion stylist to order or ask about sizing (+961 81 522 399)'}
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#0B6640] hover:bg-[#084b2f] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          {t('wa.float', 'Order via WhatsApp', 'طلب فوري عبر واتساب')}
        </span>
      </a>
    </div>
  );
};
