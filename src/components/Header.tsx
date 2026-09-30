import React, { useState } from 'react';
import { Sparkles, Flame, Trophy, Coins, Heart, Settings, ShieldCheck, User, Smartphone } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toPersianDigits, formatDurationPersian } from '../utils/persian';
import { getRankForXP } from '../data/levels';
import { AVATAR_OPTIONS } from '../data/avatars';
import { AndroidInstallModal } from './AndroidInstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const Header: React.FC = () => {
  const { userProfile, setScreenState, screenState, setIsHeartsModalOpen, nextHeartCountdownSeconds, updateProfileName, updateAvatar } = useGame();
  const { isInstalled } = usePWAInstall();
  const currentRank = getRankForXP(userProfile.xp);
  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === userProfile.avatarId) || AVATAR_OPTIONS[0];

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [editingName, setEditingName] = useState(userProfile.name);

  const handleSaveProfile = () => {
    updateProfileName(editingName);
    setIsProfileModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a1024]/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 transition-all">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Brand & Rank */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="relative p-1 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 hover:border-amber-400 active:scale-95 transition-all"
              title="پروفایل کارآگاه"
            >
              <span className="text-xl leading-none">{currentAvatar.emoji}</span>
              <span className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {toPersianDigits(currentRank.level)}
              </span>
            </button>

            <div className="text-right">
              <button
                onClick={() => setScreenState('home')}
                className="font-black text-sm text-slate-100 hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <span>کارآگاه شایعه</span>
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                <span>{currentRank.title}</span>
              </div>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Streak */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-950/40 border border-orange-600/30 text-orange-400 text-xs font-bold"
              title="تعداد روزهای متوالی بازی"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{toPersianDigits(userProfile.streakDays)}</span>
            </div>

            {/* Coins */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-300 text-xs font-bold"
              title="سکه کارآگاهی"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{toPersianDigits(userProfile.coins)}</span>
            </div>

            {/* Lives / Hearts */}
            <button
              onClick={() => setIsHeartsModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/40 border border-rose-600/30 text-rose-400 text-xs font-bold active:scale-95 transition-all"
              title={
                userProfile.lives < 5
                  ? `شارژ جان بعدی: ${formatDurationPersian(nextHeartCountdownSeconds)}`
                  : 'جان پر است (۵/۵)'
              }
            >
              <Heart
                className={`w-3.5 h-3.5 ${userProfile.lives > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}
              />
              <span>{toPersianDigits(userProfile.lives)}</span>
              {userProfile.lives < 5 && nextHeartCountdownSeconds > 0 && (
                <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
                  ({formatDurationPersian(nextHeartCountdownSeconds)})
                </span>
              )}
            </button>

            {/* Android Install Button if not already installed */}
            {!isInstalled && (
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400 active:scale-95 transition-all text-xs font-bold"
                title="نصب نسخه اندروید"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">نصب</span>
              </button>
            )}

            {/* Settings button if not on settings */}
            {screenState !== 'settings' && (
              <button
                onClick={() => setScreenState('settings')}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 active:scale-95 transition-all"
                title="تنظیمات"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Android Install Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d162f] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                پروفایل کارآگاه
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">نام مستعار کارآگاه:</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  maxLength={25}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400 text-right"
                  placeholder="نام خود را وارد کنید..."
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">انتخاب نشان کارآگاهی (آواتار):</label>
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = avatar.id === userProfile.avatarId;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => updateAvatar(avatar.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{avatar.emoji}</span>
                        <span className="text-[11px] truncate w-full text-center">{avatar.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
