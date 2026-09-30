import React, { useState } from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Smartphone, Bell, Moon, Shield, FileText, Info, RotateCcw, ArrowRight, Download } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundService } from '../services/audio';
import { AndroidInstallModal } from './AndroidInstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const SettingsScreen: React.FC = () => {
  const {
    userProfile,
    toggleSound,
    toggleVibration,
    toggleDarkMode,
    toggleNotifications,
    resetProgress,
    setScreenState,
  } = useGame();

  const { isInstalled } = usePWAInstall();
  const [confirmReset, setConfirmReset] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleReset = () => {
    soundService.playWrong();
    resetProgress();
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

        <span className="text-xs font-bold text-slate-300 bg-slate-850 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
          <SettingsIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>تنظیمات بازی</span>
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-0.5">
        {/* Audio & Haptics Group */}
        <div className="rounded-2xl bg-[#0f1733] border border-slate-800 p-4 space-y-3 text-right">
          <h3 className="text-xs font-bold text-amber-400 mb-2">صدا و بازخورد لمسی</h3>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {userProfile.settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <span className="text-sm font-bold text-slate-200 block">افکت‌های صوتی</span>
                <span className="text-[11px] text-slate-400">صدای پاسخ درست، اشتباه و پیروزی</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                toggleSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                userProfile.settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  userProfile.settings.soundEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* Vibration / Haptic */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-sm font-bold text-slate-200 block">لرزش و هپتیک</span>
                <span className="text-[11px] text-slate-400">لرزش خفیف هنگام پاسخ‌دهی و زمان بحرانی</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                toggleVibration();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                userProfile.settings.vibrationEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  userProfile.settings.vibrationEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-sm font-bold text-slate-200 block">یادآور چالش روزانه</span>
                <span className="text-[11px] text-slate-400">یادآوری پرونده جدید و شارژ جان</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                toggleNotifications();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                userProfile.settings.notificationsEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  userProfile.settings.notificationsEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Legal & Info Group */}
        <div className="rounded-2xl bg-[#0f1733] border border-slate-800 p-2 text-right space-y-1">
          {/* Install Option */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="w-full p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-200 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>نصب برنامه روی گوشی (Android)</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {isInstalled ? 'نصب شده ✓' : 'نصب رایگان'}
            </span>
          </button>

          <button
            onClick={() => setScreenState('privacy')}
            className="w-full p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-200 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>حریم خصوصی و نحوه پردازش داده‌ها</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-180" />
          </button>

          <button
            onClick={() => setScreenState('terms')}
            className="w-full p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-200 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>شرایط استفاده از برنامه</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-180" />
          </button>
        </div>

        {/* About App */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-right space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <Info className="w-4 h-4 text-amber-400" />
            <span>درباره «کارآگاه شایعه» (نسخه ۱.۰.۰)</span>
          </div>
          <p className="leading-relaxed">
            طراحی شده با هدف ترویج سواد رسانه‌ای، تفکر نقادانه و راستی‌آزمایی علمی و تاریخی. تمامی سؤالات با منابع مرجع جهانی تطبیق داده شده‌اند.
          </p>
        </div>

        {/* Reset Progress */}
        <div className="pt-2">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-3 rounded-xl border border-rose-900/50 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازنشانی کل داده‌ها و شروع مجدد</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/50 text-center space-y-2.5">
              <p className="text-xs text-rose-200 font-bold">
                آیا مطمئن هستید؟ تمامی امتیازات، سکه‌ها، رتبه‌ها و دستاوردها پاک خواهد شد.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  انصراف
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  بله، بازنشانی کن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Android Install Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
};
