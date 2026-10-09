import React, { useState } from 'react';
import { 
  KeyRound, 
  Dices, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Car, 
  Clock, 
  Send, 
  Code2, 
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';
import { 
  TierCode, 
  LicenseFormat, 
  LicenseDuration, 
  TIERS, 
  generateActivationCode, 
  DEFAULT_MASTER_SECRET_KEY 
} from '../utils/crypto';
import { DiagLicenseRecord } from '../types';
import { formatJalaliDate, toPersianDigits } from '../utils/jalali';

interface GeneratorScreenProps {
  onSaveLicense: (license: DiagLicenseRecord) => void;
  onTestInSimulator: (deviceCode: string, activationCode: string) => void;
  onOpenClientCodeModal: () => void;
  masterSecret: string;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({
  onSaveLicense,
  onTestInSimulator,
  onOpenClientCodeModal,
  masterSecret,
}) => {
  // Input fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceCode, setDeviceCode] = useState('84920173');
  const [tier, setTier] = useState<TierCode>('DPRO');
  const [format, setFormat] = useState<LicenseFormat>('8digit');
  const [duration, setDuration] = useState<LicenseDuration>('1year');

  // Generated state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [lastGeneratedRecord, setLastGeneratedRecord] = useState<DiagLicenseRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Generate random 8-digit device ID
  const handleRandomDevice = () => {
    const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
    setDeviceCode(random8);
  };

  // Only digits filter for device code
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

    const { code, hexHash } = generateActivationCode(deviceCode, tier, format, masterSecret);

    const now = new Date();
    const expiry = new Date();
    if (duration === '1month') expiry.setMonth(expiry.getMonth() + 1);
    else if (duration === '6months') expiry.setMonth(expiry.getMonth() + 6);
    else if (duration === '1year') expiry.setFullYear(expiry.getFullYear() + 1);
    else if (duration === 'lifetime') expiry.setFullYear(expiry.getFullYear() + 25);

    const newRecord: DiagLicenseRecord = {
      id: `HOSHDAR-${Date.now()}`,
      customerName: customerName.trim() || 'مشتری آزاد / تعمیرگاه',
      customerPhone: customerPhone.trim(),
      deviceCode: deviceCode,
      tier: tier,
      format: format,
      duration: duration,
      activationCode: code,
      hexHash: hexHash,
      issueDateShamsi: formatJalaliDate(now),
      issueDateGregorian: now.toISOString().split('T')[0],
      expiryDateShamsi: duration === 'lifetime' ? 'مادام‌العمر' : formatJalaliDate(expiry),
      expiryDateGregorian: duration === 'lifetime' ? 'Permanent' : expiry.toISOString().split('T')[0],
      status: 'active',
      notes: `صادر شده برای ${TIERS[tier].titleFa}`,
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
    const tierTitle = TIERS[lastGeneratedRecord.tier].titleFa;
    return `مشتری گرامی ${lastGeneratedRecord.customerName}،
کد فعالسازی نرم‌افزار دیاگ هوشدار برای دستگاه ${lastGeneratedRecord.deviceCode} با موفقیت صادر شد:

🔑 کد فعالسازی: ${lastGeneratedRecord.activationCode}
📦 ماژول: ${tierTitle}
⏳ مدت اعتبار: ${lastGeneratedRecord.expiryDateShamsi}

پشتیبانی دیاگ هوشدار (مهندس نریمانی)`;
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
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-4 sm:p-5 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              سامانه تولید کدهای فعالسازی نرم‌افزار دیاگ خودرویی (Hoshdar Diag)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            رمزنگاری قطعی و غیرقابل جعل مبتنی بر الگوریتم سخت‌افزاری HMAC-SHA256 • کد فعالسازی یکتا
          </p>
        </div>

        <button
          onClick={onOpenClientCodeModal}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 flex items-center gap-2 shadow transition-all self-end sm:self-auto"
        >
          <Code2 className="w-4 h-4" />
          <span>کد برنامه کلاینت (Kotlin/Java)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Customer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>نام مشتری یا نام تعمیرگاه (اختیاری):</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: مهندس رضوانی - کلینیک خودرو شرق"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>شماره موبایل جهت پیامک فعالسازی:</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912xxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-right"
                />
              </div>
            </div>

            {/* Device Code with Random Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>شناسه سخت‌افزاری دستگاه دیاگ (کد ۸ رقمی):</span>
                </label>
                <button
                  type="button"
                  onClick={handleRandomDevice}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Dices className="w-3 h-3" />
                  <span>تولید کد تصادفی تستی</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  required
                  maxLength={8}
                  value={deviceCode}
                  onChange={handleDeviceChange}
                  placeholder="مثال: 84920173"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono text-base font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="absolute left-3 top-3 text-[11px] font-mono text-slate-500">
                  {deviceCode.length}/8 رقم
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                این کد ۸ رقمی در صفحه فعالسازی اپلیکیشن دیاگ روی گوشی یا تبلت کاربر نمایش داده می‌شود.
              </p>
            </div>

            {/* License Package Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                انتخاب پکیج نرم‌افزاری دیاگ:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(TIERS) as TierCode[]).map((tCode) => {
                  const t = TIERS[tCode];
                  const isSelected = tier === tCode;
                  return (
                    <button
                      key={tCode}
                      type="button"
                      onClick={() => setTier(tCode)}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                          {t.code}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="text-xs font-bold block">{t.titleFa}</span>
                    </button>
                  );
                })}
              </div>
              {/* Selected package feature description */}
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-1">قابلیت‌های {TIERS[tier].titleFa}:</span>
                <p className="text-[11px] text-slate-400 mb-2">{TIERS[tier].descriptionFa}</p>
                <div className="flex flex-wrap gap-1.5">
                  {TIERS[tier].permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Format & Validity Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  فرمت خروجی کد:
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as LicenseFormat)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="8digit">کد عددی استاندارد (۸ رقم)</option>
                  <option value="16block">کد بلوکی ۱۶ کاراکتری (XXXX-XXXX-XXXX-XXXX)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  مدت اعتبار لایسنس:
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as LicenseDuration)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="1month">۱ ماهه (آزمایشی / امانی)</option>
                  <option value="6months">۶ ماهه</option>
                  <option value="1year">۱ ساله (استاندارد)</option>
                  <option value="lifetime">نامحدود و مادام‌العمر (طلایی)</option>
                </select>
              </div>
            </div>

            {/* Big Action Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                <span>تولید و ثبت آنی کد فعالسازی</span>
              </button>
            </div>
          </form>
        </div>

        {/* Result Card Column */}
        <div className="lg:col-span-5 space-y-4">
          {generatedCode && lastGeneratedRecord ? (
            <div className="bg-slate-900/90 rounded-2xl border-2 border-amber-500/60 p-5 shadow-2xl shadow-amber-950/40 relative overflow-hidden space-y-4">
              {/* Top glow accent */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  کد فعالسازی با موفقیت صادر شد
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {lastGeneratedRecord.issueDateShamsi}
                </span>
              </div>

              {/* Big Golden Monospace Code Box */}
              <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/40 text-center shadow-inner relative group">
                <div className="text-[11px] text-slate-400 mb-1">کد فعالسازی اختصاصی دیاگ:</div>
                <div
                  dir="ltr"
                  className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wider py-1 select-all"
                >
                  {generatedCode}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  دستگاه: {lastGeneratedRecord.deviceCode} • پکیج: {lastGeneratedRecord.tier}
                </div>
              </div>

              {/* Action Buttons: Copy, Test in Simulator */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-400" />
                      <span>کپی کد فعالسازی</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onTestInSimulator(lastGeneratedRecord.deviceCode, generatedCode)}
                  className="py-2.5 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-amber-800/80 transition-all"
                >
                  <span>تست در شبیه‌ساز</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Share & Customer Notification Area */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    ارسال متن رسمی فعالسازی به مشتری:
                  </span>
                  {lastGeneratedRecord.customerPhone && (
                    <button
                      onClick={handleSendSms}
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>ارسال پیامک مستقیم</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-sans leading-relaxed">
                  مشتری: <strong className="text-white">{lastGeneratedRecord.customerName}</strong>
                  <br />
                  شناسه دستگاه: <span className="font-mono text-amber-400">{lastGeneratedRecord.deviceCode}</span>
                  <br />
                  پکیج فعال شده: <span className="text-emerald-400 font-semibold">{TIERS[lastGeneratedRecord.tier].titleFa}</span>
                  <br />
                  اعتبار لایسنس: <span className="text-slate-300">{lastGeneratedRecord.expiryDateShamsi}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopySmsMessage}
                  className="w-full py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-[11px] flex items-center justify-center gap-1.5 border border-slate-700/80 transition-colors"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">متن پیامک کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>کپی متن پیام رسمی برای واتساپ / SMS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                <KeyRound className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-white text-sm">آماده صدور لایسنس دیاگ</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                شناسه دستگاه دیاگ کاربر (۸ رقم) را در فرم مقابل وارد کنید و روی «تولید کد فعالسازی» کلیک نمایید.
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                🔒 فرمول رمزنگاری HMAC-SHA256 تضمین‌کننده یکتایی و عدم تقلب در کدهای تولیدی است.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
