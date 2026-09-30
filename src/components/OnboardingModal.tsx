import React, { useState } from 'react';
import { Search, CheckCircle2, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundService } from '../services/audio';

const ONBOARDING_SLIDES = [
  {
    step: 1,
    icon: <Search className="w-16 h-16 text-amber-400" />,
    title: 'حقیقت را پیدا کن.',
    description: 'در دنیایی پر از شایعه و خبرهای زرد، مأموریت تو تفکیک واقعیت‌های مستند از ادعاهای ساختگی است.',
    badge: 'گام اول',
  },
  {
    step: 2,
    icon: (
      <div className="flex items-center gap-3">
        <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xl">
          ✓ واقعیت
        </span>
        <span className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-black text-xl">
          ✕ شایعه
        </span>
      </div>
    ),
    title: 'به ادعاها پاسخ بده.',
    description: 'در هر سؤال ۱۰ ثانیه فرصت داری تا تشخیص دهی ادعا واقعیت علمی/تاریخی است یا یک شایعه نادرست.',
    badge: 'گام دوم',
  },
  {
    step: 3,
    icon: <Trophy className="w-16 h-16 text-amber-400" />,
    title: 'امتیاز بگیر و کارآگاه حرفه‌ای شو.',
    description: 'با پاسخ‌های سریع ضریب زنجیره‌ای (Combo) فعال کن، سکه و XP جمع‌آوری کن و تا رتبه «استاد حقیقت» پیش برو.',
    badge: 'گام سوم',
  },
];

export const OnboardingModal: React.FC = () => {
  const { completeOnboarding } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLast = currentSlide === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    soundService.playClick();
    if (isLast) {
      completeOnboarding();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundService.playClick();
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const active = ONBOARDING_SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-[#070b16]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0d162f] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Step indicator */}
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
            {active.badge}
          </span>
          <button
            onClick={() => {
              soundService.playClick();
              completeOnboarding();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            رد کردن
          </button>
        </div>

        {/* Visual Slot */}
        <div className="my-6 h-32 flex items-center justify-center">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner flex items-center justify-center animate-float">
            {active.icon}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xl font-black text-slate-100">{active.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xs">{active.description}</p>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {ONBOARDING_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="w-full flex items-center gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors active:scale-95"
              title="قبلی"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLast ? 'شروع بازی' : 'مرحله بعدی'}</span>
            {!isLast && <ArrowLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
