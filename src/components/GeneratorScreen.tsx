import React, { useState } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  Share2, 
  CheckCircle2, 
  Send, 
  Smartphone,
  User,
  Phone,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { generateActivationCode } from '../utils/crypto';
import { DiagLicenseRecord } from '../types';
import { formatJalaliDate } from '../utils/jalali';

interface GeneratorScreenProps {
  onSaveLicense: (license: DiagLicenseRecord) => void;
  masterSecret: string;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({
  onSaveLicense,
  masterSecret,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceCode, setDeviceCode] = useState('84920173');

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [lastGeneratedRecord, setLastGeneratedRecord] = useState<DiagLicenseRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setDeviceCode(val);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceCode || deviceCode.length < 8) {
      alert('لطفاً شناسه دستگاه را به صورت یک کد دقیقاً ۸ رقمی وارد کنید.');
      return;
    }

    // Always generates strictly 8-digit numerical code
    const { code, hexHash } = generateActivationCode(deviceCode, 'DPRO', '8digit', masterSecret);

    const now = new Date();

    const newRecord: DiagLicenseRecord = {
      id: `HOSHDAR-${Date.now()}`,
      customerName: customerName.trim() || 'مشتری آزاد / تعمیرگاه',
      customerPhone: customerPhone.trim(),
      deviceCode: deviceCode,
      tier: 'DPRO',
      format: '8digit',
      duration: 'lifetime',
      activationCode: code,
      hexHash: hexHash,
      issueDateShamsi: formatJalaliDate(now),
      issueDateGregorian: now.toISOString().split('T')[0],
      expiryDateShamsi: 'مادام‌العمر',
      expiryDateGregorian: 'Permanent',
      status: 'active',
      notes: 'صادر شده توسط سامانه لایسنس هشدار دیاگ',
    };

    setGeneratedCode(code);
    setLastGeneratedRecord(newRecord);
    onSaveLicense(newRecord);
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCustomerSmsText = () => {
    if (!lastGeneratedRecord) return '';
    return `مشتری گرامی ${lastGeneratedRecord.customerName}،
کد فعالسازی نرم‌افزار هشدار دیاگ برای دستگاه ${lastGeneratedRecord.deviceCode} با موفقیت صادر شد:

کد فعالسازی ۸ رقمی: ${lastGeneratedRecord.activationCode}

شرکت آرمین صنعت ثمین (شرق) - مهندس نریمانی
شماره تماس: 09159650802`;
  };

  const handleCopySmsMessage = () => {
    const msg = getCustomerSmsText();
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleSendSms = () => {
    if (!lastGeneratedRecord?.customerPhone) {
      alert('شماره تلفن مشتری وارد نشده است.');
      return;
    }
    const msg = encodeURIComponent(getCustomerSmsText());
    window.open(`sms:${lastGeneratedRecord.customerPhone}?body=${msg}`);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-xl mx-auto">
      {/* Top Banner Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              صدور لایسنس هشدار دیاگ
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              تولید کد فعالسازی ۸ رقمی اختصاصی سخت‌افزار خودرویی
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>کد ۸ رقمی</span>
        </span>
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#2563eb]" />
              <span>نام یا شناسه مشتری / تعمیرگاه (اختیاری):</span>
            </label>
            <input
              type="text"
              value={customerName}
              onBlur={() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); document.body.scrollTop = 0; }}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: کلینیک تخصصی خودرو شرق (مهندس رضایی)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#2563eb]" />
              <span>شماره تماس مشتری (جهت ارسال پیامک):</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={customerPhone}
              onBlur={() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); document.body.scrollTop = 0; }}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="0915xxxxxxx"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-mono placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 transition-all text-right font-bold"
            />
          </div>

          {/* Device Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#2563eb]" />
                <span>شناسه سخت‌افزاری دستگاه دیاگ (کد ۸ رقمی):</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                {deviceCode.length}/8 رقم
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                required
                maxLength={8}
                value={deviceCode}
                onBlur={() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); document.body.scrollTop = 0; }}
                onChange={handleDeviceChange}
                placeholder="84920173"
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-mono text-2xl font-black tracking-widest text-center focus:outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100 transition-all shadow-inner"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">
              کد ۸ رقمی نمایش داده شده روی صفحه تبلت یا نرم‌افزار دیاگ کاربر را وارد کنید.
            </p>
          </div>

          {/* Big Action Button with GUARANTEED Solid Blue Background and White Text */}
          <div className="pt-2">
            <button
              type="submit"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              className="w-full py-4 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-white stroke-[2.5]" />
              <span className="text-white font-black">تولید لایسنس هشدار</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Card - Appears only after code is generated */}
      {generatedCode && lastGeneratedRecord && (
        <div className="bg-white rounded-3xl border-2 border-[#2563eb] p-6 sm:p-7 shadow-xl shadow-blue-600/10 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-black text-[#2563eb] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2563eb] stroke-[2.5]" />
              <span>کد لایسنس با موفقیت صادر شد</span>
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
              {lastGeneratedRecord.issueDateShamsi}
            </span>
          </div>

          {/* Big Numerical Display Box */}
          <div className="bg-[#eff6ff] p-5 rounded-2xl border-2 border-[#bfdbfe] text-center shadow-inner space-y-1">
            <div className="text-xs text-slate-600 font-bold">کد فعالسازی ۸ رقمی هشدار دیاگ:</div>
            <div
              dir="ltr"
              className="font-mono text-3xl sm:text-4xl font-black text-[#1e40af] tracking-widest py-2 select-all"
            >
              {generatedCode}
            </div>
            <div className="text-xs text-slate-800 font-bold">
              دستگاه: <span className="font-mono font-black text-[#2563eb]">{lastGeneratedRecord.deviceCode}</span>
            </div>
          </div>

          {/* Action Buttons: Copy & Share */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopyCode}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              className="py-3 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  <span className="text-white font-black">کد کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white stroke-[2.2]" />
                  <span className="text-white font-black">کپی کد لایسنس</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopySmsMessage}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
            >
              {copiedMessage ? (
                <>
                  <Check className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                  <span>متن پیام کپی شد!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-700" />
                  <span>کپی متن پیام مشتری</span>
                </>
              )}
            </button>
          </div>

          {lastGeneratedRecord.customerPhone && (
            <button
              type="button"
              onClick={handleSendSms}
              className="w-full py-2.5 rounded-xl bg-[#eff6ff] hover:bg-blue-100 text-[#2563eb] border border-[#bfdbfe] text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ارسال مستقیم پیامک به {lastGeneratedRecord.customerPhone}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
