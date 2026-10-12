import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  AlertCircle, 
  CheckCircle2, 
  Delete 
} from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

const REQUIRED_PASSCODE = "1405";

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [enteredDigits, setEnteredDigits] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleDigitPress = (digit: string) => {
    if (isUnlockedSuccess) return;
    setErrorMsg(null);

    if (enteredDigits.length >= 4) return;

    const nextDigits = enteredDigits + digit;
    setEnteredDigits(nextDigits);

    // Auto-verify when 4 digits are entered
    if (nextDigits.length === 4) {
      verifyCode(nextDigits);
    }
  };

  const handleBackspace = () => {
    if (isUnlockedSuccess) return;
    setErrorMsg(null);
    setEnteredDigits((prev) => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    if (isUnlockedSuccess) return;
    setErrorMsg(null);
    setEnteredDigits('');
  };

  const verifyCode = (code: string) => {
    if (code === REQUIRED_PASSCODE) {
      setIsUnlockedSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 450);
    } else {
      // Wrong passcode: shake effect and clear
      setIsShaking(true);
      setErrorMsg('رمز وارد شده اشتباه است. لطفاً مجدداً تلاش کنید.');
      setTimeout(() => {
        setIsShaking(false);
        setEnteredDigits('');
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto select-none [-webkit-touch-callout:none] [-webkit-user-select:none]">
      <div 
        className={`bg-white rounded-3xl max-w-xs w-full p-6 sm:p-7 shadow-2xl border border-slate-200/90 text-center space-y-4 my-auto select-none [-webkit-touch-callout:none] [-webkit-user-select:none] animate-in fade-in zoom-in-95 duration-200 transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Top Header */}
        <div className="space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] mx-auto flex items-center justify-center shadow-md relative">
            {isUnlockedSuccess ? (
              <Unlock className="w-7 h-7 text-[#2563eb] animate-bounce" />
            ) : (
              <Lock className="w-7 h-7 text-[#2563eb]" />
            )}
            
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
              isUnlockedSuccess ? 'bg-emerald-500' : 'bg-[#2563eb]'
            }`} />
          </div>

          <h2 className="text-lg font-black text-slate-900 tracking-tight pt-1">
            سامانه لایسنس هشدار دیاگ
          </h2>
          <p className="text-[11px] text-slate-500 font-bold">
            رمز امنیتی ۴ رقمی را وارد کنید
          </p>
        </div>

        {/* Visual 4-Dot Passcode Display (Left-to-Right) */}
        <div className="py-2">
          <div dir="ltr" className="flex items-center justify-center gap-3.5">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = enteredDigits.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all transform ${
                    isUnlockedSuccess
                      ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm shadow-emerald-400'
                      : isFilled
                      ? 'bg-[#2563eb] border-[#2563eb] scale-110 shadow-sm shadow-blue-400'
                      : 'bg-slate-100 border-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Error / Success Feedback */}
        {isUnlockedSuccess ? (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>رمز تایید شد. در حال ورود...</span>
          </div>
        ) : errorMsg ? (
          <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-[11px] leading-tight">{errorMsg}</span>
          </div>
        ) : null}

        {/* Standard Calculator Keypad: STRICT LTR Layout (1 on top-left, 2 center, 3 top-right) */}
        <div 
          dir="ltr" 
          className="grid grid-cols-3 gap-2.5 pt-1 max-w-[240px] mx-auto select-none [-webkit-touch-callout:none] [-webkit-user-select:none] [touch-action:manipulation]"
        >
          {/* Row 1: 1, 2, 3 */}
          {['1', '2', '3'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              disabled={isUnlockedSuccess}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-blue-100 active:text-[#2563eb] border border-slate-200/90 text-slate-900 font-mono text-xl font-black shadow-sm transition-all transform active:scale-95 flex items-center justify-center cursor-pointer select-none [-webkit-user-select:none] [-webkit-touch-callout:none] [touch-action:manipulation] focus:outline-none [-webkit-tap-highlight-color:transparent]"
            >
              {num}
            </button>
          ))}

          {/* Row 2: 4, 5, 6 */}
          {['4', '5', '6'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              disabled={isUnlockedSuccess}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-blue-100 active:text-[#2563eb] border border-slate-200/90 text-slate-900 font-mono text-xl font-black shadow-sm transition-all transform active:scale-95 flex items-center justify-center cursor-pointer select-none [-webkit-user-select:none] [-webkit-touch-callout:none] [touch-action:manipulation] focus:outline-none [-webkit-tap-highlight-color:transparent]"
            >
              {num}
            </button>
          ))}

          {/* Row 3: 7, 8, 9 */}
          {['7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              disabled={isUnlockedSuccess}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-blue-100 active:text-[#2563eb] border border-slate-200/90 text-slate-900 font-mono text-xl font-black shadow-sm transition-all transform active:scale-95 flex items-center justify-center cursor-pointer select-none [-webkit-user-select:none] [-webkit-touch-callout:none] [touch-action:manipulation] focus:outline-none [-webkit-tap-highlight-color:transparent]"
            >
              {num}
            </button>
          ))}

          {/* Row 4: Clear (C), 0, Backspace (⌫) */}
          <button
            type="button"
            onClick={handleClearAll}
            disabled={isUnlockedSuccess || enteredDigits.length === 0}
            className="h-14 rounded-2xl bg-slate-100 hover:bg-red-50 active:bg-red-100 text-slate-600 hover:text-red-600 border border-slate-200/90 text-sm font-black shadow-sm transition-all transform active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-40 select-none [-webkit-user-select:none] [-webkit-touch-callout:none] [touch-action:manipulation] focus:outline-none [-webkit-tap-highlight-color:transparent]"
            title="پاک کردن کل"
          >
            C
          </button>

          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            disabled={isUnlockedSuccess}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-blue-100 active:text-[#2563eb] border border-slate-200/90 text-slate-900 font-mono text-xl font-black shadow-sm transition-all transform active:scale-95 flex items-center justify-center cursor-pointer select-none [-webkit-user-select:none] [-webkit-touch-callout:none] [touch-action:manipulation] focus:outline-none [-webkit-tap-highlight-color:transparent]"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            disabled={isUnlockedSuccess || enteredDigits.length === 0}
            className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200/90 text-sm font-black shadow-sm transition-all transform active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-40 select-none [-webkit-user-select:none] [-webkit-touch-callout:none] [touch-action:manipulation] focus:outline-none [-webkit-tap-highlight-color:transparent]"
            title="حذف رقم آخر"
          >
            <Delete className="w-5 h-5 text-slate-700 stroke-[2.2]" />
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100">
          شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
        </div>
      </div>
    </div>
  );
};
