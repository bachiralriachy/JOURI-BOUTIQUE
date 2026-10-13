import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { language, t } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const isAr = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError(
        isAr
          ? 'يرجى إدخال بريد إلكتروني صحيح'
          : 'Please enter a valid email address'
      );
      return;
    }

    setError('');
    setIsSubscribed(true);
  };

  return (
    <section className="bg-[#141413] text-stone-100 py-12 sm:py-20 border-t border-stone-800 relative overflow-hidden w-full max-w-full">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center relative z-10 space-y-4 sm:space-y-6 w-full max-w-full">
        
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#C5A880] font-semibold">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{isAr ? 'عضوية جوري الحصرية' : 'The Jouri Circle'}</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white break-words">
          {isAr
            ? 'انضمي إلى مجتمع جوري بوتيك الراقي'
            : 'Join The Jouri Boutique Circle'}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-stone-400 max-w-xl mx-auto leading-relaxed break-words px-2">
          {isAr
            ? 'احصلي على أسبقية الاطلاع على التشكيلات الموسمية الجديدة، واستمتعي بخصم ترحيبي 10% على أول طلب لكِ.'
            : 'Be the first to preview new collections, receive private runway edits, and enjoy an exclusive 10% welcome privilege on your first order.'}
        </p>

        {/* Subscription Form / Confirmation State */}
        {isSubscribed ? (
          <div className="bg-stone-900/90 border border-[#C5A880]/50 p-5 sm:p-6 rounded-xs max-w-md mx-auto space-y-2 backdrop-blur-sm shadow-xl w-full">
            <CheckCircle2 className="w-8 h-8 text-[#C5A880] mx-auto" />
            <h3 className="font-serif text-base sm:text-lg font-medium text-white">
              {isAr ? 'أهلاً بكِ في عالم جوري!' : 'Welcome to Jouri Circle!'}
            </h3>
            <p className="text-xs text-stone-300">
              {isAr
                ? 'تم تسجيل بريدكِ بنجاح. استخدمي الرمز JOURI10 للحصول على خصم 10% عند طلبك عبر واتساب.'
                : 'Your email has been registered. Use code JOURI10 to claim your 10% welcome privilege on WhatsApp.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 w-full">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="relative flex-1 w-full min-w-0">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={
                    isAr
                      ? 'أدخلي بريدكِ الإلكتروني...'
                      : 'Enter your email address...'
                  }
                  className="w-full bg-stone-900/80 border border-stone-700 focus:border-[#C5A880] rounded-xs pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#C5A880] hover:bg-[#d4b993] text-stone-950 rounded-xs text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2 shadow-md whitespace-nowrap"
              >
                <span>{isAr ? 'اشتراك' : 'Subscribe'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 text-left sm:text-center">
                {error}
              </p>
            )}

            <p className="text-[10px] sm:text-[11px] text-stone-500">
              {isAr
                ? 'نحترم خصوصيتكِ تماماً. يمكنكِ إلغاء الاشتراك في أي وقت بنقرة واحدة.'
                : 'We respect your privacy. You may unsubscribe at any time with a single click.'}
            </p>
          </form>
        )}

      </div>
    </section>
  );
};
