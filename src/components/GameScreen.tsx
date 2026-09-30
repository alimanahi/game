import React from 'react';
import { Timer, Zap, CheckCircle2, XCircle, AlertTriangle, HelpCircle, Flame, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits } from '../utils/persian';

export const GameScreen: React.FC = () => {
  const {
    currentQuestion,
    currentQuestionIndex,
    matchQuestions,
    questionTimer,
    consecutiveStreak,
    matchScore,
    isAnswerSubmitted,
    lastAnswerResult,
    submitAnswer,
    proceedToNextQuestion,
    useHintEliminate,
    useHintExtraTime,
    useHintClue,
    eliminatedOption,
    revealedClue,
    userProfile,
    openReportModal,
    setScreenState,
  } = useGame();

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-slate-300">در حال آماده‌سازی پرونده...</p>
        <button
          onClick={() => setScreenState('home')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm"
        >
          بازگشت به خانه
        </button>
      </div>
    );
  }

  const timerPercent = Math.max(0, Math.min(100, (questionTimer / 10) * 100));
  const isTimerCritical = questionTimer <= 3;

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-2 flex flex-col justify-between space-y-3">
      {/* Top Match HUD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          {/* Question counter */}
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            سؤال {toPersianDigits(currentQuestionIndex + 1)} از {toPersianDigits(matchQuestions.length)}
          </span>

          {/* Combo Multiplier */}
          {consecutiveStreak >= 2 && (
            <div className="flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>ضریب ×{toPersianDigits(
                consecutiveStreak >= 10 ? '۳' : consecutiveStreak >= 5 ? '۲' : consecutiveStreak >= 3 ? '۱.۵' : '۱.۲'
              )}</span>
            </div>
          )}

          {/* Match Score */}
          <span className="text-amber-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            {toPersianDigits(matchScore)} امتیاز
          </span>
        </div>

        {/* 10-Second Timer Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1 text-slate-400">
              <Timer className={`w-3.5 h-3.5 ${isTimerCritical ? 'text-rose-500 animate-spin' : 'text-slate-400'}`} />
              زمان باقی‌مانده:
            </span>
            <span
              className={`font-mono text-sm font-black ${
                isTimerCritical ? 'text-rose-500 scale-110' : 'text-amber-400'
              } transition-transform`}
            >
              {toPersianDigits(questionTimer)} ثانیه
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isTimerCritical
                  ? 'bg-rose-500'
                  : questionTimer <= 6
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Dossier Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#111936] to-[#0c1328] border border-amber-500/25 p-5 shadow-2xl space-y-4">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
          <span className="font-bold text-amber-300/90">{currentQuestion.category}</span>
          <span className="text-slate-400 text-[11px]">
            درجه: {currentQuestion.difficulty === 'easy' ? 'آسان' : currentQuestion.difficulty === 'medium' ? 'متوسط' : 'سخت'}
          </span>
        </div>

        {/* Claim Text */}
        <div className="py-2 text-right min-h-[90px] flex items-center">
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed text-right w-full">
            «{currentQuestion.question}»
          </h2>
        </div>

        {/* Clue if revealed */}
        {revealedClue && currentQuestion.clue && (
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 text-right animate-fadeIn">
            <span className="font-bold block mb-0.5 text-amber-300">💡 سرنخ کارآگاه:</span>
            {currentQuestion.clue}
          </div>
        )}

        {/* Hints Toolbar (Only before answer submitted) */}
        {!isAnswerSubmitted && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 text-[11px]">
            {/* 50/50 eliminate */}
            <button
              onClick={useHintEliminate}
              disabled={!!eliminatedOption}
              className={`flex-1 py-1.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                eliminatedOption
                  ? 'opacity-40 border-slate-800 bg-slate-900 text-slate-500'
                  : 'border-slate-700 bg-slate-800/70 hover:border-amber-400 text-slate-300 active:scale-95'
              }`}
            >
              <span className="font-bold">حذف گزینه</span>
              <span className="text-[10px] text-amber-400">
                {userProfile.coins >= 50 ? '۵۰ سکه' : 'تبلیغ 🎁'}
              </span>
            </button>

            {/* Extra Time */}
            <button
              onClick={useHintExtraTime}
              className="flex-1 py-1.5 px-2 rounded-xl border border-slate-700 bg-slate-800/70 hover:border-amber-400 text-slate-300 active:scale-95 flex flex-col items-center justify-center transition-all"
            >
              <span className="font-bold">+۵ ثانیه</span>
              <span className="text-[10px] text-amber-400">
                {userProfile.coins >= 30 ? '۳۰ سکه' : 'تبلیغ 🎁'}
              </span>
            </button>

            {/* Clue */}
            <button
              onClick={useHintClue}
              disabled={revealedClue || !currentQuestion.clue}
              className={`flex-1 py-1.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                revealedClue
                  ? 'opacity-40 border-slate-800 bg-slate-900 text-slate-500'
                  : 'border-slate-700 bg-slate-800/70 hover:border-amber-400 text-slate-300 active:scale-95'
              }`}
            >
              <span className="font-bold">سرنخ</span>
              <span className="text-[10px] text-amber-400">
                {userProfile.coins >= 40 ? '۴۰ سکه' : 'تبلیغ 🎁'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Answer Buttons or Explanation Card */}
      {!isAnswerSubmitted ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Truth Button */}
          <button
            onClick={() => submitAnswer('true')}
            disabled={eliminatedOption === 'true'}
            className={`py-4 px-4 rounded-2xl border-2 font-black text-lg shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2 ${
              eliminatedOption === 'true'
                ? 'opacity-30 line-through border-slate-800 bg-slate-900 text-slate-600'
                : 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-900/30'
            }`}
          >
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            <span>واقعیت</span>
          </button>

          {/* Rumor Button */}
          <button
            onClick={() => submitAnswer('false')}
            disabled={eliminatedOption === 'false'}
            className={`py-4 px-4 rounded-2xl border-2 font-black text-lg shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2 ${
              eliminatedOption === 'false'
                ? 'opacity-30 line-through border-slate-800 bg-slate-900 text-slate-600'
                : 'bg-rose-600/90 hover:bg-rose-500 border-rose-400 text-white shadow-rose-900/30'
            }`}
          >
            <XCircle className="w-6 h-6 stroke-[2.5]" />
            <span>شایعه</span>
          </button>
        </div>
      ) : (
        /* Explanation Card */
        <div className="rounded-3xl bg-[#0f1733] border border-slate-700/80 p-4 shadow-2xl space-y-3 animate-fadeIn text-right">
          {/* Header result */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {lastAnswerResult?.isCorrect ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                  <span>درست! 🔎</span>
                </div>
              ) : lastAnswerResult?.selectedAnswer === 'timeout' ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-black text-base">
                  <Timer className="w-5 h-5 text-amber-400" />
                  <span>زمان تمام شد! ⌛</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-400 font-black text-base">
                  <XCircle className="w-5 h-5 text-rose-400 stroke-[2.5]" />
                  <span>اشتباه! ❌</span>
                </div>
              )}
            </div>

            {/* Score pill or Heart lost indicator */}
            {lastAnswerResult?.isCorrect ? (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                +{toPersianDigits(lastAnswerResult.ptsEarned)} امتیاز
                {lastAnswerResult.speedBonus > 0 && ` (سرعت +${toPersianDigits(lastAnswerResult.speedBonus)})`}
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                -۱ جان ❤️
              </span>
            )}
          </div>

          {/* Correct Answer Status */}
          <div className="text-xs text-slate-300">
            <span className="text-slate-400">پاسخ صحیح: </span>
            <span className={`font-black ${currentQuestion.correctAnswer === 'true' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentQuestion.correctAnswer === 'true' ? '«واقعیت»' : '«شایعه»'}
            </span>
          </div>

          {/* Explanation Body */}
          <div className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
            <span className="font-bold text-amber-300 block mb-1">چرا؟</span>
            {currentQuestion.explanation}
          </div>

          {/* Source & Report */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              <span>منبع معتبر: </span>
              <span className="text-slate-300 font-semibold">{currentQuestion.source}</span>
            </div>

            <button
              onClick={() => openReportModal(currentQuestion)}
              className="text-slate-400 hover:text-amber-400 text-[11px] flex items-center gap-1 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>گزارش سؤال</span>
            </button>
          </div>

          {/* Next Question CTA */}
          <div className="pt-2">
            <button
              onClick={proceedToNextQuestion}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>
                {currentQuestionIndex + 1 < matchQuestions.length ? 'ادامه (سؤال بعدی)' : 'مشاهده نتیجه نهایی مسابقه'}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
