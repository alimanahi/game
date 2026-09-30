import React, { useState } from 'react';
import { Trophy, Coins, Zap, CheckCircle2, XCircle, RotateCcw, Home, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits } from '../utils/persian';

export const GameOverScreen: React.FC = () => {
  const {
    matchScore,
    matchCoinsEarned,
    matchXpEarned,
    userAnswersHistory,
    startQuickGame,
    setScreenState,
    watchDoubleRewardAd,
  } = useGame();

  const [hasDoubled, setHasDoubled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const totalQuestions = userAnswersHistory.length;
  const correctCount = userAnswersHistory.filter((a) => a.isCorrect).length;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleDoubleReward = () => {
    watchDoubleRewardAd();
    setHasDoubled(true);
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-4 flex flex-col justify-between space-y-4 text-center">
      {/* Trophy & Verdict Header */}
      <div className="space-y-2 pt-2">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400/20 via-slate-800 to-indigo-950 border border-amber-500/40 p-4 shadow-xl flex items-center justify-center animate-bounce">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>

        <h1 className="text-2xl font-black text-slate-100">
          {accuracyPercent >= 80 ? 'شاهکار کارآگاهی! 🔎' : accuracyPercent >= 50 ? 'پرونده مختومه شد!' : 'نیاز به تحقیق بیشتر!'}
        </h1>
        <p className="text-xs text-slate-400">
          {accuracyPercent >= 80
            ? 'دقت شما در تفکیک شایعه از واقعیت ستودنی است.'
            : 'شایعات زیرکانه‌تر از حد انتظار بودند؛ دوباره تلاش کن!'}
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Score */}
        <div className="p-3.5 rounded-2xl bg-[#0f1733] border border-amber-500/30 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>امتیاز کسب‌شده:</span>
          </div>
          <span className="text-xl font-black text-amber-300">
            {toPersianDigits(matchScore)}
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-3.5 rounded-2xl bg-[#0f1733] border border-emerald-500/30 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>درصد درستی:</span>
          </div>
          <span className="text-xl font-black text-emerald-400">
            {toPersianDigits(accuracyPercent)}٪
            <span className="text-xs text-slate-400 font-normal mr-1">
              ({toPersianDigits(correctCount)} از {toPersianDigits(totalQuestions)})
            </span>
          </span>
        </div>

        {/* Coins Earned */}
        <div className="p-3.5 rounded-2xl bg-[#0f1733] border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>سکه پاداش:</span>
          </div>
          <span className="text-lg font-bold text-amber-300">
            +{toPersianDigits(matchCoinsEarned)}
          </span>
        </div>

        {/* XP Earned */}
        <div className="p-3.5 rounded-2xl bg-[#0f1733] border border-slate-800 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>تجربه (XP):</span>
          </div>
          <span className="text-lg font-bold text-cyan-300">
            +{toPersianDigits(matchXpEarned)}
          </span>
        </div>
      </div>

      {/* Rewarded Ad Double Reward Button */}
      {!hasDoubled && (
        <button
          onClick={handleDoubleReward}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-600 hover:to-indigo-500 border border-purple-400/40 text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <Gift className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>۲ برابر کردن پاداش این بازی (تماشای تبلیغ 🎁)</span>
        </button>
      )}

      {/* Expandable Review of Answers */}
      <div className="rounded-2xl bg-[#0c1328] border border-slate-800 overflow-hidden text-right">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:bg-slate-800/40 transition-colors"
        >
          <span>مرور ادعاها و پاسخ‌ها ({toPersianDigits(totalQuestions)} سؤال)</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="p-3 pt-0 max-h-56 overflow-y-auto space-y-2 border-t border-slate-800/80">
            {userAnswersHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">سؤال {toPersianDigits(idx + 1)}:</span>
                  <span
                    className={`font-black flex items-center gap-1 ${
                      item.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> درست
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> نادرست
                      </>
                    )}
                  </span>
                </div>
                <p className="text-slate-200">{item.question.question}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  پاسخ صحیح:{' '}
                  <strong className="text-amber-400">
                    {item.question.correctAnswer === 'true' ? 'واقعیت' : 'شایعه'}
                  </strong>{' '}
                  · منبع: {item.question.source}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setScreenState('home')}
          className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>صفحه اصلی</span>
        </button>

        <button
          onClick={startQuickGame}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>بازی مجدد</span>
        </button>
      </div>
    </div>
  );
};
