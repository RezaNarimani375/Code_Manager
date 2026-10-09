import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  WifiOff, 
  Key, 
  Sparkles, 
  Activity, 
  Gauge, 
  Wrench, 
  Check, 
  Radio 
} from 'lucide-react';
import { verifyActivationCode, TIERS, TierCode } from '../utils/crypto';

interface SimulatorScreenProps {
  initialDeviceCode?: string;
  initialActivationCode?: string;
  masterSecret: string;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({
  initialDeviceCode,
  initialActivationCode,
  masterSecret,
}) => {
  const [deviceCode, setDeviceCode] = useState(initialDeviceCode || '84920173');
  const [activationCode, setActivationCode] = useState(initialActivationCode || '');
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid: boolean;
    matchedTier?: TierCode;
    message: string;
  } | null>(null);

  // Sync if props change
  useEffect(() => {
    if (initialDeviceCode) setDeviceCode(initialDeviceCode);
    if (initialActivationCode) setActivationCode(initialActivationCode);
  }, [initialDeviceCode, initialActivationCode]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceCode || !activationCode) return;

    const res = verifyActivationCode(deviceCode, activationCode, masterSecret);
    setVerificationResult({
      tested: true,
      valid: res.valid,
      matchedTier: res.matchedTier,
      message: res.message,
    });
  };

  const handleReset = () => {
    setActivationCode('');
    setVerificationResult(null);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              شبیه‌ساز محیط فعالسازی کلاینت (Hoshdar Diag Client Simulator)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            شبیه‌سازی دقیق صفحه ورود لایسنس در نرم‌افزار اندروید دیاگ هوشدار نصب شده روی گوشی یا تبلت مکانیک
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5 self-end sm:self-auto font-medium">
          <WifiOff className="w-3.5 h-3.5" />
          <span>تست ۱۰۰٪ آفلاین و محلی (بدون نیاز به اینترنت)</span>
        </div>
      </div>

      {/* Simulator Device Frame */}
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-w-lg mx-auto relative overflow-hidden">
        {/* Device Notch / Camera indicator */}
        <div className="w-24 h-4 bg-slate-950 rounded-b-xl mx-auto -mt-6 sm:-mt-8 mb-6 border-b border-x border-slate-800 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Diag App Header inside simulator */}
        <div className="border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
              HD
            </div>
            <div>
              <div className="text-xs font-black text-white">نرم‌افزار دیاگ تخصصی هوشدار</div>
              <div className="text-[10px] text-slate-400">نسخه اندروید v4.8.2 • رابط OBD2</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
            OBD Connected
          </span>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              شناسه سخت‌افزاری تبلت/دیاگ (Hardware Code):
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                required
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="84920173"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono text-center font-bold tracking-widest text-sm focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-500">سخت‌افزار</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              کد فعالسازی دریافتی از پشتیبانی (۸ رقمی یا ۱۶ کاراکتری):
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                required
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="کد فعالسازی را وارد یا پیست کنید"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center text-sm font-bold tracking-wider focus:outline-none focus:border-amber-500 shadow-inner"
              />
              <Key className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>بررسی و فعالسازی لایسنس</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
            >
              پاکسازی
            </button>
          </div>
        </form>

        {/* Live Visual Verification Feedback */}
        {verificationResult && verificationResult.tested && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            {verificationResult.valid && verificationResult.matchedTier ? (
              <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-4 shadow-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-white text-xs">
                      لایسنس با موفقیت تایید و نرم‌افزار فعال شد!
                    </h4>
                    <p className="text-[11px] text-emerald-300 mt-0.5">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>

                {/* Unlocked Modules Badges */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">پکیج دسترسی:</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-900 text-emerald-300 border border-emerald-600">
                      {TIERS[verificationResult.matchedTier].titleFa} ({verificationResult.matchedTier})
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                    <span className="text-emerald-400 font-semibold block mb-1">
                      دسترسی‌های فعال شده در ECU:
                    </span>
                    <div className="space-y-1">
                      {TIERS[verificationResult.matchedTier].permissions.map((perm, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated live ECU action button */}
                <div className="pt-1">
                  <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-200 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      آماده اسکن خودکار خطاها (DTC) و عیب‌یابی خودرو
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-950/80 border-2 border-red-500 rounded-2xl p-4 shadow-xl space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-white text-xs">خطای اعتبارسنجی لایسنس</h4>
                    <p className="text-[11px] text-red-300 mt-0.5">{verificationResult.message}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-red-900/60 leading-relaxed">
                  کد فعالسازی وارد شده با شناسه دستگاه <strong className="text-white font-mono">{deviceCode}</strong> همخوانی ندارد. اطمینان حاصل کنید که کد را بدون اشتباه وارد کرده‌اید یا از تب «تولید لایسنس» کد متناسب با این دیوایس را ایجاد کنید.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
