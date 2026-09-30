import React from 'react';
import { Calendar, Play, CheckCircle2, Award, Zap, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits, getTodayDateString } from '../utils/persian';
import dailyBanner from '../assets/images/daily_challenge_banner_1790664845040.jpg';

export const DailyChallengeScreen: React.FC = () => {
  const { startDailyChallenge, setScreenState, userProfile } = useGame();

  const todayStr = getTodayDateString();
  const isCompletedToday = userProfile.dailyCompletedDates.includes(todayStr);

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 flex flex-col justify-between space-y-4">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreenState('home')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به خانه</span>
        </button>

        <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>چالش روزانه</span>
        </span>
      </div>

      {/* Main Dossier Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 bg-[#0d162f] shadow-2xl">
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={dailyBanner}
            alt="چالش روزانه"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d162f] via-[#0d162f]/60 to-transparent" />
        </div>

        <div className="p-5 text-right space-y-3 -mt-6 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>پرونده محرمانه امروز</span>
          </div>

          <h1 className="text-xl font-black text-slate-100">
            ۱۰ ادعای دستچین شده برای راستی‌آزمایی
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            هر روز فقط یک فرصت داری تا ادعاهای مهم روز را بررسی کنی. امتیاز این مسابقه در رتبه‌بندی عمومی ثبت می‌شود و به حفظ استریک روزانه کمک می‌کند!
          </p>

          {/* Reward Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-black text-amber-300">+۱۵۰</span>
              <span className="text-[10px] text-slate-400">سکه جایزه</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-black text-cyan-300">+۴۰۰</span>
              <span className="text-[10px] text-slate-400">امتیاز تجربه</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-black text-emerald-400">نشان ویژه</span>
              <span className="text-[10px] text-slate-400">کارآگاه روز</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        {isCompletedToday ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>چالش امروز را با موفقیت تمام کردی!</span>
            </div>
            <p className="text-xs text-slate-300">
              فردا چالش جدید با ادعاهای تازه در دسترس خواهد بود. هم‌اکنون می‌توانی «بازی سریع» یا «پرونده‌های ویژه» را بازی کنی.
            </p>
            <button
              onClick={() => setScreenState('home')}
              className="mt-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              بازگشت به خانه
            </button>
          </div>
        ) : (
          <button
            onClick={startDailyChallenge}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>شروع چالش امروز (۱۰ سؤال)</span>
          </button>
        )}
      </div>
    </div>
  );
};
