import React from 'react';
import { BarChart3, ArrowRight, CheckCircle2, XCircle, Flame, Trophy, Zap, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits } from '../utils/persian';
import { getRankForXP, getNextRank } from '../data/levels';

export const StatsScreen: React.FC = () => {
  const { setScreenState, userProfile } = useGame();
  const currentRank = getRankForXP(userProfile.xp);
  const nextRank = getNextRank(currentRank.level);

  const totalAnswered = userProfile.stats.totalQuestionsAnswered;
  const correctCount = userProfile.stats.totalCorrect;
  const wrongCount = userProfile.stats.totalWrong;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // Next level progress
  const xpInCurrentLevel = userProfile.xp - currentRank.minXP;
  const xpNeededForNext = nextRank ? nextRank.minXP - currentRank.minXP : 1;
  const levelProgressPercent = nextRank ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)) : 100;

  // Favorite Category
  let favoriteCat = 'در حال ارزیابی...';
  let maxCatCount = 0;
  Object.entries(userProfile.stats.categoryStats).forEach(([cat, data]) => {
    if (data.total > maxCatCount) {
      maxCatCount = data.total;
      favoriteCat = cat;
    }
  });

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreenState('home')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به خانه</span>
        </button>

        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>کارنامه کارآگاه</span>
        </span>
      </div>

      {/* Rank Progress Card */}
      <div className="p-4 rounded-3xl bg-[#0f1733] border border-amber-500/30 text-right space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">رتبه کنونی:</span>
            <h2 className="text-base font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
              <span>{currentRank.badge}</span>
              <span>{currentRank.title} (سطح {toPersianDigits(currentRank.level)})</span>
            </h2>
          </div>

          <div className="text-left">
            <span className="text-xs text-slate-400 block">تجربه کل:</span>
            <span className="text-sm font-black text-cyan-400">
              {toPersianDigits(userProfile.xp)} XP
            </span>
          </div>
        </div>

        {/* Progress Bar to next level */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>
              {nextRank ? `پیشرفت تا ${nextRank.title}` : 'بالاترین رتبه کسب شده است'}
            </span>
            <span>{toPersianDigits(levelProgressPercent)}٪</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Games */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>تعداد بازی‌ها:</span>
          </div>
          <span className="text-xl font-black text-slate-100">
            {toPersianDigits(userProfile.stats.totalGames)}
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>درصد موفقیت:</span>
          </div>
          <span className="text-xl font-black text-emerald-400">
            {toPersianDigits(accuracy)}٪
          </span>
        </div>

        {/* Correct Answers */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>پاسخ‌های صحیح:</span>
          </div>
          <span className="text-xl font-black text-emerald-400">
            {toPersianDigits(correctCount)}
          </span>
        </div>

        {/* Wrong Answers */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>پاسخ‌های اشتباه:</span>
          </div>
          <span className="text-xl font-black text-rose-400">
            {toPersianDigits(wrongCount)}
          </span>
        </div>

        {/* Best Streak */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>بهترین استریک:</span>
          </div>
          <span className="text-xl font-black text-orange-400">
            {toPersianDigits(userProfile.stats.bestStreak)} روز
          </span>
        </div>

        {/* Fastest Answer */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>سریع‌ترین پاسخ:</span>
          </div>
          <span className="text-xl font-black text-cyan-300">
            {toPersianDigits(userProfile.stats.fastestAnswerSec === 10 ? '-' : userProfile.stats.fastestAnswerSec)} ثانیه
          </span>
        </div>
      </div>

      {/* Favorite Category Box */}
      <div className="p-3.5 rounded-2xl bg-[#0f1733] border border-slate-800 text-right flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">دسته مورد علاقه و بیشترین بررسی:</span>
          <h4 className="text-sm font-bold text-amber-300 mt-0.5">{favoriteCat}</h4>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          {toPersianDigits(maxCatCount)} سؤال
        </div>
      </div>
    </div>
  );
};
