import React from 'react';
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Wrench, 
  Car, 
  Cpu, 
  Radio, 
  Sparkles,
  Zap
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
      {/* Hero Header Card - Guaranteed Solid Deep Blue Background with White Text */}
      <div 
        style={{ backgroundColor: '#1e40af', color: '#ffffff' }}
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30">
          <Sparkles className="w-4 h-4 text-white" />
          <span>تولید ملی • تجهیزات الکترونیک خودرو</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          شرکت آرمین صنعت ثمین (شرق)
        </h2>

        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-semibold">
          فعال در زمینه برق و الکترونیک خودرو، طراح و تولیدکننده تجهیزات پیشرفته کارگاهی و عیب‌یابی تخصصی خودروهای داخلی و خارجی.
        </p>
      </div>

      {/* Products & Equipment Section - White Card with Black Text */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              دستگاه‌ها و تجهیزات تولیدی شرکت
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              تجهیزات تخصصی تعمیرگاهی با بالاترین استاندارد فنی و پشتیبانی
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Product 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#2563eb] text-white shrink-0 mt-0.5">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">دستگاه عیب‌یاب دیاگ تخصصی</h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                خوانش و پاکسازی سریع کدهای خطا (DTC)، تست عملگرها، پارامترهای زنده سنسورها و جداول ECU.
              </p>
            </div>
          </div>

          {/* Product 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#2563eb] text-white shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">دستگاه شستشوی انژکتور (انژکتورشور)</h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                تست زاویه پاشش، حمام اولتراسونیک پرقدرت، تست نشتی، اهم‌سنجی و شبیه‌سازی دقیق دور موتور.
              </p>
            </div>
          </div>

          {/* Product 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#2563eb] text-white shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">مولتی‌پراب تخصصی سیم‌کشی</h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                تست ولتاژ، پالس، اسیلوسکوپ، تحریک مثبت و منفی، اهم‌متر و بازر تست سلامت دسته سیم.
              </p>
            </div>
          </div>

          {/* Product 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#2563eb] text-white shrink-0 mt-0.5">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">ردیاب و تستر سیم‌کشی خودرو</h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                ردیابی اتصال کوتاه و قطعی سیم‌ها درون خرطومی بدون نیاز به شکافتن دسته‌سیم‌های اصلی.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Engineer Narimani & Contact Card - Solid Blue Card with White Text */}
      <div 
        style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 space-y-5"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-white/20">
          <div className="w-11 h-11 rounded-2xl bg-white text-[#1e3a8a] flex items-center justify-center font-black shadow-md shrink-0">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/80">مدیریت و پشتیبانی فنی</div>
            <h3 className="text-xl sm:text-2xl font-black text-white">مهندس نریمانی</h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* Address Box */}
          <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
            <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white/80 mb-0.5">آدرس دفتر و کارگاه:</div>
              <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                خراسان رضوی، مشهد، سی‌متری طلاب، خیابان شهید مفتح، شهید مفتح ۲۸، پلاک ۲۳۲، واحد ۱
              </div>
            </div>
          </div>

          {/* Phone Numbers with Click-to-Call */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:09159650802"
              className="flex items-center justify-between bg-white text-slate-900 p-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-md group"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2563eb]" />
                <span className="text-slate-900 font-bold">تماس ۱:</span>
              </div>
              <span dir="ltr" className="font-mono text-base font-black text-[#2563eb]">
                09159650802
              </span>
            </a>

            <a
              href="tel:09930096080"
              className="flex items-center justify-between bg-white text-slate-900 p-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-md group"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2563eb]" />
                <span className="text-slate-900 font-bold">تماس ۲:</span>
              </div>
              <span dir="ltr" className="font-mono text-base font-black text-[#2563eb]">
                09930096080
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
