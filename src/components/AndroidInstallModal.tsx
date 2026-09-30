import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, X, Share2, MoreVertical, Terminal, ExternalLink, ShieldCheck, Copy, Check, QrCode, AlertTriangle, Key } from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundService } from '../services/audio';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'apk' | 'troubleshoot'>('direct');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<'main' | 'shared' | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const sharedAppUrl = 'https://ais-pre-3rlxgbtcwbyyqajllbjlgc-222106398738.europe-west2.run.app';
  const devAppUrl = 'https://ais-dev-3rlxgbtcwbyyqajllbjlgc-222106398738.europe-west2.run.app';
  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : sharedAppUrl;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(sharedAppUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#070b16',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [isOpen, sharedAppUrl]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, type: 'main' | 'shared') => {
    soundService.playClick();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(type);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleInstallClick = async () => {
    soundService.playClick();
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0c142c] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-right space-y-3.5 relative overflow-hidden max-h-[92vh] flex flex-col justify-between">
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-100">نصب روی اندروید و رفع خطا</h3>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tab switchers: Direct Install vs Troubleshooting 403 vs APK */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'direct' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نصب و QR
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'troubleshoot' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            رفع خطای ۴۰۳ ⚠️
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'apk' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            خروجی APK
          </button>
        </div>

        {/* Tab 1: Direct Install & QR Code */}
        {activeTab === 'direct' && (
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-0.5 text-xs text-slate-300">
            {/* QR Code Card */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-32 h-32" />
                ) : (
                  <div className="w-32 h-32 bg-slate-200 animate-pulse rounded" />
                )}
              </div>
              <p className="text-[11px] text-amber-300 font-semibold">
                با دوربین گوشی اندروید این بارکد را اسکن کنید تا مستقیماً باز شود.
              </p>
            </div>

            {/* Direct URL copy */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>لینک عمومی جهت نصب روی گوشی:</span>
                {copiedUrl === 'shared' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                    <Check className="w-3 h-3" /> کپی شد!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800/80">
                <button
                  onClick={() => handleCopy(sharedAppUrl, 'shared')}
                  className="py-1 px-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>کپی</span>
                </button>
                <span className="text-slate-300 font-mono text-[10px] truncate select-all" dir="ltr">
                  {sharedAppUrl}
                </span>
              </div>
            </div>

            {/* Install Button if browser supports it */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>نصب فوری روی صفحه اصلی (Android)</span>
              </button>
            )}

            {/* Step-by-Step for Chrome on Mobile */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-right">
              <span className="text-amber-400 font-bold block mb-1">راهنمای باز کردن روی گوشی:</span>
              <p className="text-[11px] text-slate-300">
                ۱. لینک بالا را در مرورگر <strong>Google Chrome</strong> گوشی باز کنید.
              </p>
              <p className="text-[11px] text-slate-300">
                ۲. روی علامت ۳ نقطه بالای مرورگر بزنید و گزینه <strong>«افزودن به صفحه اصلی / Install app»</strong> را لمس کنید.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: 403 Forbidden Troubleshooting */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-2.5 overflow-y-auto max-h-[60vh] pr-0.5 text-xs text-slate-300 text-right">
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>علت خطای ۴۰۳ (Forbidden):</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-200">
                سرورهای توسعه گوگل برای امنیت، به طور پیش‌فرض روی حالت «خصوصی» هستند و دسترسی ناشناس را مسدود می‌کنند.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-xs block">
                روش ۱: عمومی کردن لینک (حل دائمی با ۱ کلیک):
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ۱. در بالای پنجره Google AI Studio در کامپیوتر، روی دکمه <strong>Share (اشتراک‌گذاری)</strong> بزنید.
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ۲. در پنجره باز شده، دسترسی را از Restricted به <strong>Anyone with link (عمومی)</strong> تغییر دهید.
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ۳. دکمه Save / Copy Link را بزنید. اکنون لینک بدون خطای ۴۰۳ روی هر گوشی باز می‌شود!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 text-xs block">
                روش ۲: ورود با اکانت جیمیل در مرورگر گوشی:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                در مرورگر کروم گوشی‌تان با همان جیمیل سازنده پروژه (<span className="font-mono text-amber-300 text-[10px]">ecole.saadi.paris@gmail.com</span>) وارد (Sign In) شوید تا مجوز مشاهده فعال شود.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: APK Generation Details */}
        {activeTab === 'apk' && (
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-0.5 text-xs text-slate-300 text-right">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-300 text-xs block">ساخت فایل APK با PWABuilder:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                آدرس اینترنتی برنامه را در سایت رسمی مایکروسافت <span className="font-mono text-white">pwabuilder.com</span> وارد کنید تا مستقیماً فایل APK را دانلود نمایید.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-300 text-xs block">کامپایل در اندروید استودیو:</span>
              <pre className="p-2 rounded-xl bg-slate-950 font-mono text-[10px] text-slate-300 text-left overflow-x-auto" dir="ltr">
{`npm run build
npx cap add android
npx cap open android`}
              </pre>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
