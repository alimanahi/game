import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { QuestionReport } from '../types';

export const ReportQuestionModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, reportingQuestion, submitQuestionReport } = useGame();
  const [selectedReason, setSelectedReason] = useState<QuestionReport['reason']>('wrong_answer');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReportModalOpen || !reportingQuestion) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestionReport(selectedReason, description);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsReportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0d162f] border border-slate-700 rounded-3xl p-5 shadow-2xl text-right space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <span>گزارش و اصلاح سؤال</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </h3>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <span className="text-4xl block">🔍</span>
            <p className="text-emerald-400 font-bold text-sm">گزارش شما با موفقیت ثبت شد!</p>
            <p className="text-xs text-slate-400">تیم راستی‌آزمایی کارآگاه شایعه این پرونده را مجدداً بررسی خواهد کرد.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-semibold block mb-0.5">متن ادعا:</span>
              «{reportingQuestion.question}»
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">علت گزارش:</label>
              {[
                { id: 'wrong_answer', label: 'پاسخ صحیح اعلام‌شده اشتباه است' },
                { id: 'invalid_source', label: 'منبع ذکرشده نامعتبر یا قدیمی است' },
                { id: 'unclear', label: 'سؤال گنگ یا دارای ابهام نگارشی است' },
                { id: 'other', label: 'مشکل دیگر' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedReason === opt.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === opt.id}
                    onChange={() => setSelectedReason(opt.id as QuestionReport['reason'])}
                    className="accent-amber-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">توضیحات تکمیلی یا منبع پیشنهادی (اختیاری):</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                maxLength={200}
                placeholder="توضیح دهید چرا فکر می‌کنید این ادعا نیاز به اصلاح دارد..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 resize-none text-right"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              ثبت گزارش کارآگاهی
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
