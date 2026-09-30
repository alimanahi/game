import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundService } from '../services/audio';

export const SplashScreen: React.FC = () => {
  const { setScreenState, userProfile } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      soundService.playClick();
      if (!userProfile.hasSeenOnboarding) {
        // Will show onboarding on Home or trigger it
        setScreenState('home');
      } else {
        setScreenState('home');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [setScreenState, userProfile.hasSeenOnboarding]);

  const handleTap = () => {
    soundService.playClick();
    setScreenState('home');
  };

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-50 bg-[#070b16] flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none -top-10" />

      {/* Detective Icon */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400/20 via-slate-800 to-indigo-950 border border-amber-500/40 p-4 shadow-2xl flex items-center justify-center animate-detective">
          <div className="relative">
            <span className="text-6xl block transform -scale-x-100">🕵️</span>
            <div className="absolute -bottom-2 -left-2 bg-amber-500 text-slate-950 p-2 rounded-xl shadow-lg border border-amber-300">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding */}
      <h1 className="text-3xl font-black text-slate-100 tracking-tight mb-2 flex items-center justify-center gap-2">
        <span>کارآگاه شایعه</span>
      </h1>

      <p className="text-amber-400 font-bold text-base tracking-wide mb-6">
        «حقیقت را پیدا کن.»
      </p>

      {/* Loading Pulse */}
      <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full animate-pulse w-full" />
      </div>

      <p className="text-xs text-slate-500 animate-pulse">
        برای ورود سریع لمس کنید...
      </p>
    </div>
  );
};
