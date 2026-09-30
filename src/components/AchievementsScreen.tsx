import React, { useState } from 'react';
import { Award, ArrowRight, CheckCircle2, Lock, Coins, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { toPersianDigits } from '../utils/persian';

export const AchievementsScreen: React.FC = () => {
  const { setScreenState, userProfile } = useGame();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedSet = new Set(userProfile.unlockedAchievements);

  const filteredAchievements = INITIAL_ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = unlockedSet.has(ach.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 flex flex-col justify-between space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreenState('home')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به خانه</span>
        </button>

        <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>دستاوردها</span>
        </span>
      </div>

      {/* Header Stat */}
      <div className="p-4 rounded-2xl bg-[#0f1733] border border-amber-500/30 flex items-center justify-between text-right">
        <div>
          <h2 className="text-sm font-black text-slate-100">نشان‌های کسب‌شده</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {toPersianDigits(userProfile.unlockedAchievements.length)} از {toPersianDigits(INITIAL_ACHIEVEMENTS.length)} نشان آزاد شده است
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-lg">
          {toPersianDigits(Math.round((userProfile.unlockedAchievements.length / INITIAL_ACHIEVEMENTS.length) * 100))}٪
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
            filter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          همه ({toPersianDigits(INITIAL_ACHIEVEMENTS.length)})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
            filter === 'unlocked' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          آزادشده ({toPersianDigits(userProfile.unlockedAchievements.length)})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
            filter === 'locked' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          قفل ({toPersianDigits(INITIAL_ACHIEVEMENTS.length - userProfile.unlockedAchievements.length)})
        </button>
      </div>

      {/* Achievements List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[58vh] pr-0.5">
        {filteredAchievements.map((ach) => {
          const isUnlocked = unlockedSet.has(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all text-right flex items-start gap-3 ${
                isUnlocked
                  ? 'bg-[#0f1733] border-amber-500/30'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-70'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                    {ach.title}
                  </h3>
                  {isUnlocked && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      کسب شد
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>

                {/* Rewards */}
                <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    +{toPersianDigits(ach.rewardCoins)} سکه
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    +{toPersianDigits(ach.rewardXP)} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
