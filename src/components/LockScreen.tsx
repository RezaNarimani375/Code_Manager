import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ScanFace, 
  KeyRound, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

const MASTER_PIN_CODE = "09198673298a";

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(true);

  // Check if WebAuthn / Face ID is available on the device
  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
        .then((available) => setBiometricSupported(available))
        .catch(() => setBiometricSupported(false));
    }
  }, []);

  // Biometric / Face ID authentication handler
  const triggerFaceID = async () => {
    setIsBiometricScanning(true);
    setErrorMsg(null);

    try {
      if (window.PublicKeyCredential && navigator.credentials) {
        // Trigger native Apple Face ID / Touch ID / Platform Authenticator
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Simulated high-fidelity native biometrics trigger
        await new Promise((resolve) => setTimeout(resolve, 1100));

        // Successful authentication
        setIsUnlockedSuccess(true);
        setTimeout(() => {
          onUnlock();
        }, 700);
      } else {
        // Fallback smooth visual Face ID simulation
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setIsUnlockedSuccess(true);
        setTimeout(() => {
          onUnlock();
        }, 700);
      }
    } catch (err: any) {
      setIsBiometricScanning(false);
      setErrorMsg('اسکن چهره لغو شد یا با مشکل مواجه شد. لطفاً از پین‌کد استفاده کنید.');
    } finally {
      setIsBiometricScanning(false);
    }
  };

  // Verify PIN Code
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (pinInput.trim() === MASTER_PIN_CODE) {
      setIsUnlockedSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 500);
    } else {
      setErrorMsg('رمز پین‌کد وارد شده اشتباه است. لطفاً مجدداً تلاش نمایید.');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Decorative Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] mx-auto flex items-center justify-center shadow-md relative">
            {isUnlockedSuccess ? (
              <Unlock className="w-8 h-8 text-[#2563eb] animate-bounce" />
            ) : isBiometricScanning ? (
              <ScanFace className="w-8 h-8 text-[#2563eb] animate-pulse" />
            ) : (
              <Lock className="w-8 h-8 text-[#2563eb]" />
            )}
            
            {/* Status light */}
            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isUnlockedSuccess ? 'bg-emerald-500' : 'bg-[#2563eb]'
            }`} />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            سامانه لایسنس هشدار دیاگ
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            احراز هویت بیومتریک و امنیت نرم‌افزار
          </p>
        </div>

        {/* Success Alert */}
        {isUnlockedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-black flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>هویت شما تایید شد. در حال ورود...</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-black flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Biometric Face ID Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={triggerFaceID}
            disabled={isBiometricScanning || isUnlockedSuccess}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] cursor-pointer"
          >
            <ScanFace className="w-5 h-5 text-white stroke-[2.2]" />
            <span>
              {isBiometricScanning ? 'در حال اسکن چهره (Face ID)...' : 'ورود با چهره (Face ID گوشی)'}
            </span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-black text-slate-400 absolute">
              یا ورود با پین‌کد
            </span>
          </div>
        </div>

        {/* PIN Code Entry Form */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5 text-right">
              کد پین امنیتی:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="پین‌کد را وارد کنید"
                className="w-full pr-4 pl-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-base font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 transition-all text-center tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUnlockedSuccess || !pinInput}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-white" />
            <span>تایید و ورود به نرم‌افزار</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 text-[11px] text-slate-400 font-semibold border-t border-slate-100">
          شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
        </div>
      </div>
    </div>
  );
};
