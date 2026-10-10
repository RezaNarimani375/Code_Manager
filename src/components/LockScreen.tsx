import React, { useState, useEffect } from 'react';
import { 
  ScanFace, 
  KeyRound, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

const MASTER_PIN_CODE = "09198673298a";

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);
  const [hasRegisteredFace, setHasRegisteredFace] = useState(false);

  useEffect(() => {
    const savedCred = localStorage.getItem('hoshdar_faceid_credential_id');
    if (savedCred) {
      setHasRegisteredFace(true);
    }
  }, []);

  /**
   * Genuine Hardware Apple Face ID Authentication via WebAuthn API
   */
  const triggerFaceID = async () => {
    setIsBiometricScanning(true);
    setErrorMsg(null);

    // Verify browser support for Web Authentication (WebAuthn)
    if (!window.PublicKeyCredential || !navigator.credentials) {
      setIsBiometricScanning(false);
      setErrorMsg('سخت‌افزار Face ID یا بیومتریک در این مرورگر پشتیبانی نمی‌شود. لطفاً از پین‌کد استفاده کنید.');
      return;
    }

    try {
      const savedCredId = localStorage.getItem('hoshdar_faceid_credential_id');
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      if (savedCredId) {
        // Authenticate using existing registered Face ID credential
        const credIdBuffer = base64ToBuffer(savedCredId);

        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge,
            allowCredentials: [
              {
                id: credIdBuffer,
                type: 'public-key',
                transports: ['internal'],
              },
            ],
            userVerification: 'required', // Strictly enforces device Face ID hardware check
            timeout: 60000,
          },
        });

        if (assertion) {
          // Hardware Face ID successfully matched the registered face on the iPhone!
          setIsUnlockedSuccess(true);
          setTimeout(() => {
            onUnlock();
          }, 600);
          return;
        }
      } else {
        // First-time enrollment: Register iPhone hardware Face ID with Apple Secure Enclave
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        const newCredential = (await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: 'لایسنس هشدار دیاگ',
              id: window.location.hostname || undefined,
            },
            user: {
              id: userId,
              name: 'narimani@hoshdar',
              displayName: 'مهندس نریمانی',
            },
            pubKeyCredParams: [
              { alg: -7, type: 'public-key' },   // ES256 (Apple Secure Enclave standard)
              { alg: -257, type: 'public-key' }, // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform', // Strictly binds to device hardware (Face ID on iPhone)
              userVerification: 'required',        // Strictly requires Face ID biometric scan
              residentKey: 'preferred',
            },
            timeout: 60000,
          },
        })) as PublicKeyCredential;

        if (newCredential && newCredential.rawId) {
          const b64Id = bufferToBase64(newCredential.rawId);
          localStorage.setItem('hoshdar_faceid_credential_id', b64Id);
          setHasRegisteredFace(true);

          // Real Face ID passed on the iPhone hardware!
          setIsUnlockedSuccess(true);
          setTimeout(() => {
            onUnlock();
          }, 600);
          return;
        }
      }

      // If we reached here without returning, authentication did NOT succeed
      setErrorMsg('چهره شما توسط حسگر Face ID تایید نشد یا چهره مطابقت نداشت.');
    } catch (err: any) {
      console.warn('Face ID Authentication error:', err);

      if (err.name === 'NotAllowedError') {
        setErrorMsg('احراز هویت با چهره ناموفق بود (چهره مطابقت نداشت یا عملیات توسط کاربر لغو شد).');
      } else if (err.name === 'SecurityError') {
        setErrorMsg('تنظیمات امنیتی دستگاه اجازه دسترسی نداد. لطفاً با پین‌کد وارد شوید.');
      } else {
        setErrorMsg('خطا در دسترسی به حسگر Face ID آیفون. لطفاً با پین‌کد وارد شوید.');
      }
    } finally {
      setIsBiometricScanning(false);
    }
  };

  const handleResetFaceRegistration = () => {
    localStorage.removeItem('hoshdar_faceid_credential_id');
    setHasRegisteredFace(false);
    setErrorMsg('اطلاعات چهره بازنشانی شد. با کلیک بر روی دکمه چهره، می‌توانید مجدداً Face ID را ثبت و تست نمایید.');
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
      setErrorMsg('رمز پین‌کد اشتباه است. لطفاً مجدداً تلاش نمایید.');
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
            
            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isUnlockedSuccess ? 'bg-emerald-500' : 'bg-[#2563eb]'
            }`} />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            سامانه لایسنس هشدار دیاگ
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            احراز هویت سخت‌افزاری Face ID و امنیت برنامه
          </p>
        </div>

        {/* Success Alert */}
        {isUnlockedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-black flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>چهره تایید شد. ورود موفق!</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-black flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Real Biometric Face ID Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={triggerFaceID}
            disabled={isBiometricScanning || isUnlockedSuccess}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] cursor-pointer"
          >
            <ScanFace className="w-5 h-5 text-white stroke-[2.2]" />
            <span className="text-white font-black">
              {isBiometricScanning
                ? 'در حال اسکن با سنسور Face ID...'
                : hasRegisteredFace
                ? 'اسکن و بازگشایی با Face ID آیفون'
                : 'اتصال و ورود با Face ID گوشی'}
            </span>
          </button>

          {hasRegisteredFace && (
            <button
              type="button"
              onClick={handleResetFaceRegistration}
              className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>بازنشانی اتصال Face ID</span>
            </button>
          )}

          <div className="relative flex items-center justify-center pt-1">
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
            <span>تایید پین‌کد و ورود</span>
          </button>
        </form>

        <div className="pt-2 text-[11px] text-slate-400 font-semibold border-t border-slate-100">
          شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
        </div>
      </div>
    </div>
  );
};
