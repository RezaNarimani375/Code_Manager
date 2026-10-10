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
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Hero Header Card - Blue Background with White Text */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30">
            <Sparkles className="w-4 h-4 text-white" />
            <span>تولید ملی • تجهیزات پیشرفته الکترونیک خودرو</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            شرکت آرمین صنعت ثمین (شرق)
          </h2>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl font-medium">
            پیشگام و متخصص در حوزه برق و الکترونیک خودرو، طراح و تولیدکننده دستگاه‌های فوق‌پیشرفته تعمیرگاهی و عیب‌یابی تخصصی خودروهای داخلی و وارداتی.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Products & Capabilities Grid - White Cards with Black Text */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-black">
              محصولات و تجهیزات تولیدی شرکت
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              دستگاه‌های استاندارد کارگاهی و تعمیرگاهی با گارانتی و پشتیبانی تخصصی
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Product 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-blue-300 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">دستگاه عیب‌یاب و دیاگ تخصصی</h4>
              <p className="text-xs text-black/80 font-medium mt-1 leading-relaxed">
                خوانش و پاکسازی سریع کدهای خطا (DTC)، تست عملگرها، پارامترهای زنده سنسورها و ریمپ ECU.
              </p>
            </div>
          </div>

          {/* Product 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-blue-300 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">دستگاه شستشوی انژکتور (انژکتورشور)</h4>
              <p className="text-xs text-black/80 font-medium mt-1 leading-relaxed">
                تست زاویه پاشش، اولتراسونیک پرقدرت، تست نشتی، اهم‌سنجی و شبیه‌سازی دقیق دور موتور.
              </p>
            </div>
          </div>

          {/* Product 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-blue-300 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">مولتی‌پراب تخصصی سیم‌کشی</h4>
              <p className="text-xs text-black/80 font-medium mt-1 leading-relaxed">
                تست ولتاژ، پالس، اسیلوسکوپ، تحریک مثبت و منفی، اهم‌متر و بازر تست قطعی دسته سیم.
              </p>
            </div>
          </div>

          {/* Product 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-blue-300 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">ردیاب و تستر سیم‌کشی خودرو</h4>
              <p className="text-xs text-black/80 font-medium mt-1 leading-relaxed">
                پیدا کردن اتصال کوتاه و قطعی سیم‌ها درون خرطومی بدون نیاز به شکافتن دسته‌سیم‌های اصلی.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Engineer Narimani & Contact Card - Blue Gradient with White Text */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/20">
          <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black shadow-md">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/80">مدیریت و پشتیبانی فنی</div>
            <h3 className="text-xl sm:text-2xl font-black text-white">مهندس نریمانی</h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-start gap-3.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white/80 mb-0.5">آدرس دفتر و کارگاه:</div>
              <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                خراسان رضوی، مشهد، سی‌متری طلاب، خیابان شهید مفتح، شهید مفتح ۲۸، پلاک ۲۳۲، واحد ۱
              </div>
            </div>
          </div>

          {/* Phone Numbers with Click-to-Call */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <a
              href="tel:09159650802"
              className="flex items-center justify-between bg-white text-blue-600 p-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-md group"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-black font-bold">تماس ۱:</span>
              </div>
              <span dir="ltr" className="font-mono text-base tracking-wider text-blue-600">
                09159650802
              </span>
            </a>

            <a
              href="tel:09930096080"
              className="flex items-center justify-between bg-white text-blue-600 p-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-md group"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-black font-bold">تماس ۲:</span>
              </div>
              <span dir="ltr" className="font-mono text-base tracking-wider text-blue-600">
                09930096080
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
