import React, { useState } from 'react';
import { FolderLock, Play, Lock, ArrowRight, Coins, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SPECIAL_CASES, SpecialCase } from '../data/specialCases';
import { toPersianDigits } from '../utils/persian';
import { soundService } from '../services/audio';

export const SpecialCasesScreen: React.FC = () => {
  const { startSpecialCaseGame, setScreenState, userProfile } = useGame();
  const [unlockedCases, setUnlockedCases] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fake_news_unlocked_cases');
      return stored ? JSON.parse(stored) : ['case_science_myths', 'case_persia_history'];
    } catch {
      return ['case_science_myths', 'case_persia_history'];
    }
  });

  const handleUnlockCase = (c: SpecialCase) => {
    if (userProfile.coins < c.coinUnlockCost) {
      soundService.playWrong();
      return;
    }
    soundService.playCoin();
    const updated = [...unlockedCases, c.id];
    setUnlockedCases(updated);
    try {
      localStorage.setItem('fake_news_unlocked_cases', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

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

        <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
          <FolderLock className="w-3.5 h-3.5" />
          <span>پرونده‌های ویژه</span>
        </span>
      </div>

      <div className="text-right space-y-1">
        <h1 className="text-lg font-black text-slate-100">
          تحقیقات موضوعی و تخصصی
        </h1>
        <p className="text-xs text-slate-400">
          پرونده‌های تخصصی را بازگشایی کن و در حوزه مورد علاقه‌ات به استادی برس.
        </p>
      </div>

      {/* List of Cases */}
      <div className="space-y-2.5 overflow-y-auto max-h-[62vh] pr-0.5">
        {SPECIAL_CASES.map((c) => {
          const isUnlocked = unlockedCases.includes(c.id) || c.coinUnlockCost === 0;
          const isLevelSatisfied = userProfile.level >= c.requiredLevel;

          return (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all text-right relative overflow-hidden ${
                isUnlocked
                  ? 'bg-[#0f1733] border-indigo-500/30 hover:border-indigo-400/60'
                  : 'bg-slate-900/60 border-slate-800 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <h3 className="font-bold text-sm text-slate-100">{c.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                </div>
              </div>

              {/* Status and Action bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-amber-400 font-medium">
                  نشان: {c.badgeTitle}
                </span>

                {isUnlocked ? (
                  <button
                    onClick={() => startSpecialCaseGame(c.category)}
                    className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>بررسی پرونده</span>
                  </button>
                ) : !isLevelSatisfied ? (
                  <div className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/30">
                    <Lock className="w-3 h-3" />
                    <span>نیاز به سطح {toPersianDigits(c.requiredLevel)}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUnlockCase(c)}
                    className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-300" />
                    <span>باز کردن با {toPersianDigits(c.coinUnlockCost)} سکه</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
