import React from 'react';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const TermsModal: React.FC = () => {
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

        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          <span>شرایط استفاده</span>
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[72vh] pr-0.5 text-xs text-slate-300 leading-relaxed">
        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            ۱. هدف برنامه
          </h2>
          <p>
            «کارآگاه شایعه» با هدف سرگرمی هوشمندانه، تقویت تفکر نقادانه و گسترش اطلاعات عمومی طراحی شده است. هیچ‌یک از محتویات بازی جایگزین مشاوره پزشکی، حقوقی یا رسمی دانشگاهی محسوب نمی‌شود.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            ۲. راستی‌آزمایی و منابع
          </h2>
          <p>
            تمام ادعاهای مطرح‌شده در بازی بر پایه مراجع علمی، پژوهش‌های مستند و منابع معتبر بین‌المللی (نظیر Britannica، NASA، Smithsonian، National Geographic و دانشنامه‌های تاریخی) گردآوری و بررسی شده‌اند. در موارد مورد اختلاف علمی، توضیحات لازم جهت جامع‌نگری در کارت پاسخ درج شده است.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1733] border border-slate-800 space-y-2">
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            ۳. سکه‌ها و جوایز درون بازی
          </h2>
          <p>
            سکه‌ها، جان‌ها و امتیازات کاملاً مجازی بوده و هیچ ارزش مالی نقدی یا امکان معامله واقعی ندارند. همچنین در بازی هیچ پرداخت درون‌برنامه‌ای با پول واقعی اجباری نیست.
          </p>
        </div>
      </div>
    </div>
  );
};
