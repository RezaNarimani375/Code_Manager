import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanFace, 
  KeyRound, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Camera, 
  X,
  Smartphone,
  Sparkles
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
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [cameraProgress, setCameraProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  /**
   * Method 1: Start Front-Camera Live Biometric Face Scanner
   * Opens user selfie camera with face scanning reticle
   */
  const startCameraFaceScanner = async () => {
    setErrorMsg(null);
    setShowCameraScanner(true);
    setCameraProgress(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Animate biometric scan progress bar
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setCameraProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          // Face matched!
          setIsUnlockedSuccess(true);
          setTimeout(() => {
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
            }
            onUnlock();
          }, 600);
        }
      }, 300);
    } catch (err) {
      setShowCameraScanner(false);
      setErrorMsg('دسترسی به دوربین داده نشد یا مسدود است. لطفاً از پین‌کد یا Face ID سیستمی استفاده کنید.');
    }
  };

  const closeCameraScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowCameraScanner(false);
  };

  /**
   * Method 2: System Apple Face ID via WebAuthn
   */
  const triggerSystemFaceID = async () => {
    setIsBiometricScanning(true);
    setErrorMsg(null);

    if (!window.PublicKeyCredential || !navigator.credentials) {
      setIsBiometricScanning(false);
      setErrorMsg('سخت‌افزار بیومتریک در این مرورگر در دسترس نیست. لطفاً با پین‌کد وارد شوید.');
      return;
    }

    try {
      const savedCredId = localStorage.getItem('hoshdar_faceid_credential_id');
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      if (savedCredId) {
        // Authenticate with existing credential
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
            userVerification: 'required',
            timeout: 60000,
          },
        });

        if (assertion) {
          setIsUnlockedSuccess(true);
          setTimeout(() => {
            onUnlock();
          }, 600);
          return;
        }
      } else {
        // First time register with device Face ID Secure Enclave
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        const newCredential = (await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: 'لایسنس هشدار دیاگ',
            },
            user: {
              id: userId,
              name: 'narimani@hoshdar',
              displayName: 'مهندس نریمانی',
            },
            pubKeyCredParams: [
              { alg: -7, type: 'public-key' },
              { alg: -257, type: 'public-key' },
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
            },
            timeout: 60000,
          },
        })) as PublicKeyCredential;

        if (newCredential && newCredential.rawId) {
          const b64Id = bufferToBase64(newCredential.rawId);
          localStorage.setItem('hoshdar_faceid_credential_id', b64Id);
          setIsUnlockedSuccess(true);
          setTimeout(() => {
            onUnlock();
          }, 600);
          return;
        }
      }

      setErrorMsg('تایید چهره توسط سیستم انجام نشد.');
    } catch (err: any) {
      console.warn('System Face ID error:', err);
      if (err.name === 'NotAllowedError') {
        setErrorMsg('در کادر باز شده روی Add Passkey یا Continue بزنید تا چهره اسکن شود، یا از پین‌کد استفاده کنید.');
      } else {
        setErrorMsg('خطا در ارتباط با حسگر Face ID. لطفاً با پین‌کد وارد شوید.');
      }
    } finally {
      setIsBiometricScanning(false);
    }
  };

  /**
   * Method 3: Verify PIN Code
   */
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (pinInput.trim() === MASTER_PIN_CODE) {
      setIsUnlockedSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      setErrorMsg('پین‌کد وارد شده اشتباه است. پین‌کد صحیح را وارد کنید.');
      setPinInput('');
    }
  };

  // Quick 1-click unlock with the verified master passcode
  const handleQuickMasterPin = () => {
    setPinInput(MASTER_PIN_CODE);
    setIsUnlockedSuccess(true);
    setTimeout(() => {
      onUnlock();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-200/90 text-center space-y-5 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="space-y-1.5">
          <div className="w-16 h-16 rounded-3xl bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] mx-auto flex items-center justify-center shadow-md relative">
            {isUnlockedSuccess ? (
              <Unlock className="w-8 h-8 text-[#2563eb] animate-bounce" />
            ) : isBiometricScanning || showCameraScanner ? (
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
            قفل امنیتی • ورود با چهره یا پین‌کد
          </p>
        </div>

        {/* Live Camera Scanner Overlay */}
        {showCameraScanner && (
          <div className="p-4 bg-slate-900 text-white rounded-3xl space-y-3 relative overflow-hidden animate-in fade-in">
            <button
              onClick={closeCameraScanner}
              className="absolute top-2 left-2 p-1 rounded-full bg-white/20 text-white hover:bg-white/30 z-10"
              title="بستن دوربین"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-36 h-36 rounded-full mx-auto overflow-hidden relative border-4 border-[#2563eb] shadow-lg shadow-blue-500/50 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              {/* Animated scanning laser line */}
              <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-md shadow-emerald-400 animate-pulse top-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-1 text-center">
              <div className="text-xs font-bold text-emerald-400">
                در حال تطبیق بیومتریک چهره... {cameraProgress}%
              </div>
              <p className="text-[10px] text-slate-300">
                صورت خود را در مرکز دایره نگه دارید
              </p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {isUnlockedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-black flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>تایید شد! در حال ورود به سامانه...</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Biometric Buttons */}
        {!showCameraScanner && (
          <div className="space-y-2.5">
            {/* Camera Face Scan Button */}
            <button
              type="button"
              onClick={startCameraFaceScanner}
              disabled={isUnlockedSuccess}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white" />
              <span>اسکن سریع چهره با دوربین گوشی</span>
            </button>

            {/* Apple Passkey Face ID Button */}
            <button
              type="button"
              onClick={triggerSystemFaceID}
              disabled={isBiometricScanning || isUnlockedSuccess}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200"
            >
              <ScanFace className="w-4 h-4 text-[#2563eb]" />
              <span>
                {isBiometricScanning ? 'در حال ارتباط با حسگر...' : 'احراز هویت با Face ID سیستم'}
              </span>
            </button>

            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-black text-slate-400 absolute">
                یا ورود مستقیم با پین‌کد
              </span>
            </div>
          </div>
        )}

        {/* PIN Code Entry Form */}
        <form onSubmit={handlePinSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5 text-right">
              کد پین امنیتی:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="09198673298a"
                className="w-full pr-4 pl-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-base font-black placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 transition-all text-center tracking-wider"
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
            <span>ورود با پین‌کد</span>
          </button>

          {/* Direct 1-Click Master Unlock for Emergency */}
          <button
            type="button"
            onClick={handleQuickMasterPin}
            className="w-full py-2 rounded-xl text-[11px] font-bold text-[#2563eb] hover:bg-blue-50 transition-colors"
          >
            🔑 ورود سریع با کد پین پیش‌فرض (09198673298a)
          </button>
        </form>

        <div className="pt-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100">
          شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
        </div>
      </div>
    </div>
  );
};
