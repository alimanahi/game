import React from 'react';
import { adManager } from '../services/ads';

export const AdBanner: React.FC = () => {
  const config = adManager.getBannerConfig();

  return (
    <div className="w-full bg-[#0a0f20] border border-dashed border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-400 select-none">
      <div className="flex items-center gap-2">
        <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] border border-amber-500/30">
          تبلیغ AdMob
        </span>
        <span className="truncate max-w-[190px] text-slate-300 text-[11px]">
          حامی برنامه حقیقت‌یابی و راستی‌آزمایی
        </span>
      </div>

      <span className="text-[10px] text-slate-400 font-mono">
        {config.isTest ? 'Test Mode' : 'Live'}
      </span>
    </div>
  );
};
