import React from 'react';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const PrivacyPolicyModal: React.FC = () => {
  const { setScreenState } = useGame();

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 flex flex-col justify-between space-y-4 text-right">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreenState('settings')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>

        <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" />
          <span>سیاست حریم خصوصی</span>
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[72vh] pr-0.5 text-xs text-slate-300 leading-relaxed">
        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            ۱. اطلاعاتی که ذخیره می‌کنیم
          </h2>
          <p>
            بازی «کارآگاه شایعه» به حریم خصوصی کاربران احترام کامل می‌گذارد. در نسخه اول هیچ ثبت‌نام اجباری، شماره تلفن، یا ایمیلی دریافت نمی‌شود. تمامی پیشرفت‌ها (شامل امتیاز، سطح، تعداد جان‌ها، سکه‌ها و آمار پاسخ‌ها) منحصراً روی حافظه محلی دستگاه شما (Local Storage) ذخیره می‌شوند.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            ۲. شبکه تبلیغاتی Google AdMob
          </h2>
          <p>
            این بازی کاملاً رایگان است و هزینه نگهداری و توسعه آن از طریق تبلیغات Google AdMob تامین می‌شود. سرویس‌های گوگل ممکن است از شناسه‌های ناشناس دستگاه (مانند Google Advertising ID) برای ارائه تبلیغات مناسب یا سنجش اثربخشی استفاده کنند.
          </p>
          <p className="text-slate-400 text-[11px]">
            ما هیچ‌گونه تبلیغ اجباری پس از هر سؤال نمایش نمی‌دهیم؛ تبلیغات تمام‌صفحه تنها در انتهای یک مسابقه کامل ۱۰ سؤالی و تبلیغات جایزه‌دار تنها با انتخاب داوطلبانه شما برای دریافت سکه یا جان رایگان فعال می‌شوند.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            ۳. مدیریت تنظیمات حریم خصوصی
          </h2>
          <p>
            کاربران اندروید می‌توانند در بخش تنظیمات گوشی خود (Settings &gt; Google &gt; Ads) شخصی‌سازی تبلیغات را فعال یا غیرفعال کنند و شناسه تبلیغاتی خود را ریست نمایند.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            ۴. تماس با تیم توسعه
          </h2>
          <p>
            برای ارسال نظرات، گزارش خطا در محتوا، یا سوالات مربوط به حریم خصوصی، می‌توانید از بخش «گزارش سؤال» یا پشتیبانی پروژه اقدام فرمایید.
          </p>
        </div>
      </div>
    </div>
  );
};
