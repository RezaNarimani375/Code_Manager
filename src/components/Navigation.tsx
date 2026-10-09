import React from 'react';
import { 
  KeyRound, 
  Cpu, 
  History, 
  Settings, 
  ShieldCheck, 
  Car, 
  Wrench, 
  Sparkles 
} from 'lucide-react';

export type TabType = 'generator' | 'simulator' | 'history' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  historyCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
}) => {
  return (
    <>
      {/* Top App Bar (Header) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800/80 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
              <Car className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  دیاگ هوشدار
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-950 text-amber-400 border border-amber-700/70">
                  مدیریت لایسنس
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                  HMAC-SHA256
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xs:block">
                سامانه تولید و مدیریت کدهای فعالسازی نرم‌افزار دیاگ خودرویی • مهندس نریمانی
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'generator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>تولید لایسنس</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>شبیه‌ساز دیاگ کاربر</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all relative ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>تاریخچه</span>
              {historyCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>تنظیمات و امنیت</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Material 3 Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
            activeTab === 'generator'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'generator' ? 'bg-amber-500/20' : ''}`}>
            <KeyRound className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">تولید لایسنس</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
            activeTab === 'simulator'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'simulator' ? 'bg-amber-500/20' : ''}`}>
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">شبیه‌ساز</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] relative ${
            activeTab === 'history'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'history' ? 'bg-amber-500/20' : ''}`}>
            <History className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">تاریخچه</span>
          {historyCount > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
            activeTab === 'settings'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'settings' ? 'bg-amber-500/20' : ''}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">تنظیمات</span>
        </button>
      </nav>
    </>
  );
};
