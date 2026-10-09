import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  WifiOff, 
  Key, 
  Activity, 
  Check 
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cccccc] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black">
              شبیه‌ساز محیط فعالسازی کلاینت (Hoshdar Diag Client Simulator)
            </h2>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            شبیه‌سازی دقیق صفحه ورود لایسنس در نرم‌افزار اندروید دیاگ هوشدار نصب شده روی گوشی یا تبلت مکانیک
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-white border border-[#cccccc] text-[11px] text-black flex items-center gap-1.5 self-end sm:self-auto font-bold shadow-sm">
          <WifiOff className="w-3.5 h-3.5 text-black" />
          <span>تست ۱۰۰٪ آفلاین و محلی (بدون نیاز به اینترنت)</span>
        </div>
      </div>

      {/* Simulator Device Frame */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-md max-w-lg mx-auto relative overflow-hidden">
        {/* Device Notch / Camera indicator */}
        <div className="w-24 h-4 bg-[#e6e6e6] rounded-b-xl mx-auto -mt-6 sm:-mt-8 mb-6 border-b border-x border-[#cccccc] flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-black/40" />
        </div>

        {/* Diag App Header inside simulator */}
        <div className="border-b border-[#cccccc] pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-black text-xs">
              HD
            </div>
            <div>
              <div className="text-xs font-black text-black">نرم‌افزار دیاگ تخصصی هوشدار</div>
              <div className="text-[10px] text-black font-medium">نسخه اندروید v4.8.2 • رابط OBD2</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-black border border-[#cccccc]">
            OBD Connected
          </span>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1">
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
                className="w-full px-4 py-2.5 bg-white border border-[#cccccc] rounded-xl text-black font-mono text-center font-black tracking-widest text-sm focus:outline-none focus:border-black"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-black font-semibold">سخت‌افزار</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
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
                className="w-full px-4 py-3 bg-white border-2 border-[#cccccc] rounded-xl text-black font-mono text-center text-sm font-black tracking-wider focus:outline-none focus:border-black"
              />
              <Key className="w-4 h-4 absolute left-3 top-3.5 text-black" />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-white hover:bg-[#e6e6e6] text-black font-black text-xs border-2 border-black shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
              <span>بررسی و فعالسازی لایسنس</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-3 rounded-xl bg-white hover:bg-[#e6e6e6] text-black font-bold text-xs border border-[#cccccc] transition-colors"
            >
              پاکسازی
            </button>
          </div>
        </form>

        {/* Live Visual Verification Feedback */}
        {verificationResult && verificationResult.tested && (
          <div className="mt-6 pt-5 border-t border-[#cccccc]">
            {verificationResult.valid && verificationResult.matchedTier ? (
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
                  <div>
                    <h4 className="font-black text-black text-xs">
                      لایسنس با موفقیت تایید و نرم‌افزار فعال شد!
                    </h4>
                    <p className="text-[11px] text-black font-semibold mt-0.5">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>

                {/* Unlocked Modules Badges */}
                <div className="bg-[#e6e6e6] p-3 rounded-xl border border-[#cccccc] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-black font-bold">پکیج دسترسی:</span>
                    <span className="px-2 py-0.5 rounded-full font-black text-[10px] bg-white text-black border border-black">
                      {TIERS[verificationResult.matchedTier].titleFa} ({verificationResult.matchedTier})
                    </span>
                  </div>

                  <div className="text-[11px] text-black pt-1 border-t border-[#cccccc]">
                    <span className="text-black font-bold block mb-1">
                      دسترسی‌های فعال شده در ECU:
                    </span>
                    <div className="space-y-1">
                      {TIERS[verificationResult.matchedTier].permissions.map((perm, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-black font-medium">
                          <Check className="w-3 h-3 text-black stroke-[2.5]" />
                          <span>{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated live ECU action button */}
                <div className="pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-[#cccccc] flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-black font-bold text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-black" />
                      آماده اسکن خودکار خطاها (DTC) و عیب‌یابی خودرو
                    </span>
                    <span className="text-[10px] font-mono font-bold text-black bg-[#e6e6e6] px-2 py-0.5 rounded border border-[#cccccc]">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-md space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
                  <div>
                    <h4 className="font-black text-black text-xs">خطای اعتبارسنجی لایسنس</h4>
                    <p className="text-[11px] text-black font-bold mt-0.5">{verificationResult.message}</p>
                  </div>
                </div>
                <div className="text-[10px] text-black bg-[#e6e6e6] p-2.5 rounded-xl border border-[#cccccc] leading-relaxed font-medium">
                  کد فعالسازی وارد شده با شناسه دستگاه <strong className="text-black font-mono font-bold">{deviceCode}</strong> همخوانی ندارد. اطمینان حاصل کنید که کد را بدون اشتباه وارد کرده‌اید یا از تب «تولید لایسنس» کد متناسب با این دیوایس را ایجاد کنید.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
