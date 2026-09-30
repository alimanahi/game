import React, { useState } from 'react';
import { Play, Calendar, FolderLock, Award, BarChart3, HelpCircle, Settings, ShieldCheck, Flame, Zap, ArrowLeft, Smartphone, Download } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits } from '../utils/persian';
import { AdBanner } from './AdBanner';
import { AndroidInstallModal } from './AndroidInstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';
import detectiveBanner from '../assets/images/detective_badge_banner_1790664831372.jpg';
import detectiveMascot from '../assets/images/detective_mascot_logo_1790664816726.jpg';

export const HomeScreen: React.FC = () => {
  const { startQuickGame, setScreenState, userProfile, startDailyChallenge } = useGame();
  const { isInstalled } = usePWAInstall();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const isDailyCompleted = userProfile.dailyCompletedDates.includes(new Date().toISOString().split('T')[0]);

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 flex flex-col justify-between space-y-4">
      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-[#111936] to-[#0c1328] shadow-2xl">
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src={detectiveBanner}
            alt="میز کارآگاه حقیقت"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111936] via-[#111936]/60 to-transparent" />

          {/* Quick Stats Pill inside banner */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 text-xs font-bold text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>امتیاز کل: {toPersianDigits(userProfile.score)}</span>
          </div>
        </div>

        {/* Mascot & Welcome text */}
        <div className="px-5 pb-5 pt-1 relative">
          <div className="flex items-center gap-3.5">
            <img
              src={detectiveMascot}
              alt="نشان کارآگاه"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl border-2 border-amber-400/50 shadow-lg object-cover -mt-7 bg-slate-900"
            />
            <div className="text-right">
              <h1 className="text-lg font-black text-slate-100 flex items-center gap-1.5">
                <span>سلام، {userProfile.name}</span>
                <span className="text-amber-400 text-xs font-bold">🔎</span>
              </h1>
              <p className="text-xs text-slate-300">
                آماده‌ای شایعات را رسوا کنی و حقیقت را بیابی؟
              </p>
            </div>
          </div>

          {/* Quick Play Major Button */}
          <div className="mt-4">
            <button
              onClick={startQuickGame}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950/15 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-slate-950 text-slate-950 ml-0.5" />
                </div>
                <div className="text-right">
                  <span className="block leading-tight text-base font-black">بازی سریع (۱۰ سؤال)</span>
                  <span className="block text-[11px] font-semibold text-slate-900/80">۱۰ ثانیه برای هر ادعا</span>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Daily Challenge */}
        <button
          onClick={() => {
            if (isDailyCompleted) {
              setScreenState('daily_challenge');
            } else {
              setScreenState('daily_challenge');
            }
          }}
          className="relative p-3.5 rounded-2xl bg-[#0f1733] border border-blue-500/30 hover:border-blue-400/60 active:scale-[0.97] transition-all text-right flex flex-col justify-between min-h-[105px] overflow-hidden group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            {isDailyCompleted ? (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                تکمیل شد ✓
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30">
                پاداش ویژه
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">چالش روزانه</h3>
            <p className="text-[11px] text-slate-400">۱۰ ادعای دستچین شده امروز</p>
          </div>
        </button>

        {/* Special Cases */}
        <button
          onClick={() => setScreenState('special_cases')}
          className="p-3.5 rounded-2xl bg-[#0f1733] border border-indigo-500/30 hover:border-indigo-400/60 active:scale-[0.97] transition-all text-right flex flex-col justify-between min-h-[105px] group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FolderLock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-500/30">
              موضوعی
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">پرونده‌های ویژه</h3>
            <p className="text-[11px] text-slate-400">تاریخ، نجوم، شاهنامه و علم</p>
          </div>
        </button>

        {/* Achievements */}
        <button
          onClick={() => setScreenState('achievements')}
          className="p-3.5 rounded-2xl bg-[#0f1733] border border-amber-500/30 hover:border-amber-400/60 active:scale-[0.97] transition-all text-right flex flex-col justify-between min-h-[105px] group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30">
              {toPersianDigits(userProfile.unlockedAchievements.length)} نشان
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">مجموعه دستاوردها</h3>
            <p className="text-[11px] text-slate-400">نشان‌ها و جوایز کارآگاهی</p>
          </div>
        </button>

        {/* Leaderboard */}
        <button
          onClick={() => setScreenState('leaderboard')}
          className="p-3.5 rounded-2xl bg-[#0f1733] border border-emerald-500/30 hover:border-emerald-400/60 active:scale-[0.97] transition-all text-right flex flex-col justify-between min-h-[105px] group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
              برترین‌ها
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">رتبه‌بندی</h3>
            <p className="text-[11px] text-slate-400">جدول کارآگاهان برتر</p>
          </div>
        </button>
      </div>

      {/* Android Install Banner (if not installed) */}
      {!isInstalled && (
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0f2324] to-emerald-950/60 border border-emerald-500/40 hover:border-emerald-400 active:scale-[0.98] transition-all text-right flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-emerald-300">نسخه اندروید (Android)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                  نصب رایگان
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                اجرای تمام‌صفحه و آفلاین بدون نیاز به مرورگر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold pl-1">
            <Download className="w-4 h-4" />
          </div>
        </button>
      )}

      {/* Secondary Row: My Stats, Help, Settings */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setScreenState('stats')}
          className="py-2.5 px-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>آمار من</span>
        </button>

        <button
          onClick={() => setScreenState('settings')}
          className="py-2.5 px-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>تنظیمات</span>
        </button>

        <button
          onClick={() => setScreenState('privacy')}
          className="py-2.5 px-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>حریم خصوصی</span>
        </button>
      </div>

      {/* AdMob Banner Slot */}
      <div className="pt-1">
        <AdBanner />
      </div>

      {/* Android Install Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
};
