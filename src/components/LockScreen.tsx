import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  ShieldCheck 
} from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

const REQUIRED_USERNAME = "f.nrimany";
const REQUIRED_PIN_CODE = "09198673298a";

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  // Read remembered username from localStorage
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('hoshdar_remembered_username') || '';
  });

  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);

  // Critical fix for iOS: When keyboard is dismissed, reset window scroll to 0
  const handleInputBlur = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Dismiss virtual keyboard and force window scroll to 0
    handleInputBlur();
    setTimeout(handleInputBlur, 80);
    setTimeout(handleInputBlur, 250);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPin = pinInput.trim();

    // Secure validation
    if (cleanUsername !== REQUIRED_USERNAME.toLowerCase() || cleanPin !== REQUIRED_PIN_CODE) {
      setErrorMsg('نام کاربری یا رمز عبور اشتباه است.');
      setPinInput('');
      return;
    }

    // Remember username in localStorage so they never have to enter it again
    localStorage.setItem('hoshdar_remembered_username', REQUIRED_USERNAME);

    setIsUnlockedSuccess(true);
    setTimeout(() => {
      handleInputBlur();
      onUnlock();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto overscroll-none">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 text-center space-y-5 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="space-y-1.5">
          <div className="w-16 h-16 rounded-3xl bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] mx-auto flex items-center justify-center shadow-md relative">
            {isUnlockedSuccess ? (
              <Unlock className="w-8 h-8 text-[#2563eb] animate-bounce" />
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
            ورود امن به پنل مدیریت
          </p>
        </div>

        {/* Success Alert */}
        {isUnlockedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-black flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>اطلاعات تایید شد. در حال ورود...</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#2563eb]" />
              <span>نام کاربری:</span>
            </label>
            <input
              type="text"
              dir="ltr"
              required
              value={username}
              onBlur={handleInputBlur}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام کاربری را وارد کنید"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-base font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 transition-all text-center tracking-wider"
            />
            {localStorage.getItem('hoshdar_remembered_username') && (
              <span className="block text-[10px] text-slate-400 font-bold mt-1 text-center">
                ✓ حساب کاربری ذخیره شده است
              </span>
            )}
          </div>

          {/* PIN Code Field */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#2563eb]" />
              <span>کد پین امنیتی:</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                required
                value={pinInput}
                onBlur={handleInputBlur}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="کد پین امنیتی را وارد کنید"
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUnlockedSuccess || !pinInput || !username}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              className="w-full py-3.5 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-white stroke-[2.5]" />
              <span className="text-white font-black">ورود به سامانه</span>
            </button>
          </div>
        </form>

        <div className="pt-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100">
          شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
        </div>
      </div>
    </div>
  );
};
