import React from 'react';
import { Heart, Play, Coins, X, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits, formatDurationPersian } from '../utils/persian';

export const HeartsModal: React.FC = () => {
  const {
    isHeartsModalOpen,
    setIsHeartsModalOpen,
    userProfile,
    rechargeLifeViaAd,
    rechargeLifeViaCoins,
    nextHeartCountdownSeconds,
  } = useGame();

  if (!isHeartsModalOpen) return null;

  const canAffordCoins = userProfile.coins >= 100;
  const isFull = userProfile.lives >= 5;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0d162f] border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 relative">
        <button
          onClick={() => setIsHeartsModalOpen(false)}
          className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heart Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center animate-pulse">
          <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-100">
            {isFull ? 'جان‌های شما پر است!' : 'شارژ فوری جان کارآگاه'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            موجودی فعلی: {toPersianDigits(userProfile.lives)} از ۵ جان
          </p>
        </div>

        {/* Countdown */}
        {!isFull && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              شارژ خودکار جان بعدی:
            </span>
            <span className="font-mono font-bold text-amber-300">
              {formatDurationPersian(nextHeartCountdownSeconds)}
            </span>
          </div>
        )}

        {/* Options */}
        {!isFull && (
          <div className="space-y-2.5 pt-2">
            {/* Rewarded Ad Option */}
            <button
              onClick={rechargeLifeViaAd}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>دریافت ۱ جان رایگان (تماشای تبلیغ ویدیویی)</span>
            </button>

            {/* Coins Option */}
            <button
              onClick={() => rechargeLifeViaCoins()}
              disabled={!canAffordCoins}
              className={`w-full py-3.5 px-4 rounded-2xl border font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                canAffordCoins
                  ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 text-amber-300'
                  : 'opacity-40 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>خرید ۱ جان با ۱۰۰ سکه (موجودی: {toPersianDigits(userProfile.coins)})</span>
            </button>
          </div>
        )}

        {isFull && (
          <button
            onClick={() => setIsHeartsModalOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            ادامه بازی
          </button>
        )}
      </div>
    </div>
  );
};
