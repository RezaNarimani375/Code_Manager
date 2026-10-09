import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  RotateCcw, 
  Save, 
  Code2, 
  Check, 
  Terminal 
} from 'lucide-react';
import { DEFAULT_MASTER_SECRET_KEY } from '../utils/crypto';

interface SettingsScreenProps {
  masterSecret: string;
  onUpdateMasterSecret: (newKey: string) => void;
  onOpenClientCodeModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  masterSecret,
  onUpdateMasterSecret,
  onOpenClientCodeModal,
}) => {
  const [keyInput, setKeyInput] = useState(masterSecret);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMasterSecret(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefault = () => {
    setKeyInput(DEFAULT_MASTER_SECRET_KEY);
    onUpdateMasterSecret(DEFAULT_MASTER_SECRET_KEY);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cccccc] shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black">
              تنظیمات هسته رمزنگاری و امنیت لایسنس دیاگ
            </h2>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            پیکربندی کلید اختصاصی مادر، مشاهده فرمول ریاضی هش و دریافت سورس‌کدهای کلاینت
          </p>
        </div>
      </div>

      {/* Master Secret Key Form */}
      <div className="bg-white rounded-2xl border border-[#cccccc] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#cccccc] pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-black" />
            <h3 className="font-bold text-black text-sm">کلید مادر لایسنس (Master Secret Key)</h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#e6e6e6] text-black border border-[#cccccc]">
            HMAC-SHA256 Salt
          </span>
        </div>

        <p className="text-xs text-black/90 font-medium leading-relaxed">
          این کلید امنیتی پایه، در هسته رمزنگاری نرم‌افزار سرور و اپلیکیشن کلاینت به کار می‌رود. هرگونه تغییر در این کلید، خروجی تمامی کدهای تولید شده را تغییر خواهد داد؛ بنابراین کلید انتخابی باید دقیقاً با کلید قرار داده شده در کد کلاینت اندروید یکسان باشد.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1.5">
              مقدار کلید مادر اختصاصی:
            </label>
            <input
              type="text"
              dir="ltr"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#cccccc] rounded-xl text-black font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-black shadow-inner"
            />
          </div>

          {savedSuccess && (
            <div className="p-3 bg-white border-2 border-black text-black rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
              <Check className="w-4 h-4 text-black stroke-[2.5]" />
              <span>کلید مادر با موفقیت ذخیره شد و اعمال گردید.</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
              <span>بازنشانی به کلید پیش‌فرض مادر</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-black rounded-xl bg-white hover:bg-[#e6e6e6] text-black border-2 border-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-black" />
              <span>ذخیره کلید مادر</span>
            </button>
          </div>
        </form>
      </div>

      {/* Integration Code Card */}
      <div className="bg-white rounded-2xl border border-[#cccccc] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#cccccc] pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-black" />
            <h3 className="font-bold text-black text-sm">یکپارچه‌سازی با نرم‌افزار دیاگ اندروید (Client SDK)</h3>
          </div>
        </div>

        <p className="text-xs text-black font-medium leading-relaxed">
          برای اینکه برنامه اندروید دیاگ شما بتواند کدهای تولید شده توسط این سامانه را به صورت آفلاین اعتبارسنجی کند، سورس‌کد آماده کلاس اعتبارسنجی را کپی و در پروژه اندروید خود قرار دهید.
        </p>

        <button
          onClick={onOpenClientCodeModal}
          className="w-full py-3 rounded-xl bg-white hover:bg-[#e6e6e6] text-black border-2 border-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Code2 className="w-4 h-4 text-black" />
          <span>مشاهده و کپی سورس‌کد اعتبارسنجی (Kotlin & Java)</span>
        </button>
      </div>

      {/* Crypto Formula Specs */}
      <div className="bg-white rounded-2xl border border-[#cccccc] p-5 sm:p-6 space-y-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 text-black font-bold">
          <Terminal className="w-4 h-4 text-black" />
          <span>مستندات ساختار فرمول ریاضی تولید کد:</span>
        </div>

        <div className="bg-[#e6e6e6] p-4 rounded-xl border border-[#cccccc] space-y-2 font-mono text-[11px] text-black leading-relaxed" dir="ltr">
          <p className="text-black font-semibold">// ۱. ساخت رشته پیلود</p>
          <p className="text-black font-bold">{'payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:{cleanDevice8}:{tierCode}:HMAC_SHA256"'}</p>
          
          <p className="text-black font-semibold pt-2">// ۲. محاسبه هش استاندارد با کلید مادر</p>
          <p className="text-black font-bold">hexHash = hmacSha256(MASTER_SECRET, payload)</p>
          
          <p className="text-black font-semibold pt-2">// ۳. تبدیل ۱۲ کاراکتر اول هگز به عدد بزرگ</p>
          <p className="text-black font-bold">parsedVal = BigInt("0x" + hexHash.slice(0, 12))</p>
          
          <p className="text-black font-semibold pt-2">// ۴. محاسبه کد ۸ رقمی قطعی و یکتا</p>
          <p className="text-black font-black">eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)</p>
        </div>

        <div className="text-[11px] text-black font-bold pt-2 flex items-center justify-between">
          <span>سامانه نرم‌افزاری دیاگ خودرویی هوشدار (Hoshdar Diag)</span>
          <span className="font-black text-black">مهندس نریمانی</span>
        </div>
      </div>
    </div>
  );
};
