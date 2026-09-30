import React from 'react';
import { Award, Zap, Coins, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits } from '../utils/persian';

export const CelebrationModals: React.FC = () => {
  const {
    newAchievementUnlocked,
    dismissAchievementModal,
    newLevelReached,
    dismissLevelUpModal,
  } = useGame();

  if (!newAchievementUnlocked && !newLevelReached) return null;

  return (
    <>
      {/* Level Up Modal */}
      {newLevelReached && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c142c] border border-amber-400 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400 flex items-center justify-center text-5xl shadow-xl">
              {newLevelReached.badge}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 inline-block">
                ارتقای سطح کارآگاه!
              </span>
              <h2 className="text-2xl font-black text-slate-100">
                {newLevelReached.title}
              </h2>
              <p className="text-xs text-slate-300">
                تبریک! به سطح {toPersianDigits(newLevelReached.level)} صعود کردی و پرونده‌های پیشرفته‌تری در دسترست قرار گرفت.
              </p>
            </div>

            <button
              onClick={dismissLevelUpModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              ادامه مأموریت
            </button>
          </div>
        </div>
      )}

      {/* Achievement Unlocked Modal */}
      {newAchievementUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c142c] border border-amber-400/60 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-4xl shadow-xl">
              {newAchievementUnlocked.icon}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                دستاورد جدید آزاد شد!
              </span>
              <h2 className="text-xl font-black text-slate-100">
                {newAchievementUnlocked.title}
              </h2>
              <p className="text-xs text-slate-300">
                {newAchievementUnlocked.description}
              </p>
            </div>

            {/* Reward badges */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold py-2 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="flex items-center gap-1 text-amber-300">
                <Coins className="w-4 h-4 text-amber-400" />
                +{toPersianDigits(newAchievementUnlocked.rewardCoins)} سکه
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Zap className="w-4 h-4 text-cyan-400" />
                +{toPersianDigits(newAchievementUnlocked.rewardXP)} XP
              </span>
            </div>

            <button
              onClick={dismissAchievementModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              عالیه!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
