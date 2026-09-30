import React from 'react';
import { X, Play, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits } from '../utils/persian';

export const AdModal: React.FC = () => {
  const { adModalState } = useGame();

  if (!adModalState || !adModalState.isOpen) return null;

  const isRewarded = adModalState.type === 'rewarded';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0c142c] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* AdMob Test Header */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
            تبلیغ آزمایشی Google AdMob
          </span>

          {adModalState.canSkip ? (
            <button
              onClick={isRewarded ? adModalState.onReward : adModalState.onClose}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
            >
              <span>بستن تبلیغ</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded">
              امکان بستن تا {toPersianDigits(adModalState.countdown)} ثانیه دیگر
            </span>
          )}
        </div>

        {/* Ad Video Simulation Frame */}
        <div className="h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4 relative group">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-2 animate-pulse">
            <Play className="w-7 h-7 fill-amber-400" />
          </div>

          <span className="font-black text-sm text-slate-100 block">{adModalState.sponsorName}</span>
          <span className="text-xs text-slate-400 mt-1">«حامی مبارزه با اخبار کذب و شایعات جعلی»</span>

          {/* Progress bar inside simulated video */}
          <div className="absolute bottom-2 left-2 right-2 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-1000"
              style={{
                width: `${Math.min(100, Math.round(((5 - adModalState.countdown) / 5) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Reward or Interstitial Message */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-200">{adModalState.title}</h3>
          {adModalState.rewardDescription && (
            <p className="text-xs text-amber-300 font-semibold">
              پاداش شما: {adModalState.rewardDescription}
            </p>
          )}
        </div>

        {/* Action Button */}
        {adModalState.canSkip && (
          <div className="pt-2">
            <button
              onClick={isRewarded ? adModalState.onReward : adModalState.onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRewarded ? 'تکمیل شد! دریافت پاداش' : 'ادامه بازی'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
