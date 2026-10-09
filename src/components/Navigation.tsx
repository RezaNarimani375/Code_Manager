import React from 'react';
import { 
  KeyRound, 
  Cpu, 
  History, 
  Settings, 
  Car 
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
      <header className="sticky top-0 z-40 bg-[#e6e6e6] border-b border-[#cccccc] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#cccccc] flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-black tracking-tight">
                  دیاگ هوشدار
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white text-black border border-[#cccccc]">
                  مدیریت لایسنس
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-white text-black border border-[#cccccc]">
                  HMAC-SHA256
                </span>
              </div>
              <p className="text-[11px] text-black font-medium hidden xs:block">
                سامانه تولید و مدیریت کدهای فعالسازی نرم‌افزار دیاگ خودرویی • مهندس نریمانی
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-white p-1 rounded-xl border border-[#cccccc] text-xs font-semibold shadow-sm">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'generator'
                  ? 'bg-black text-white font-bold shadow'
                  : 'bg-white text-black hover:bg-[#e6e6e6]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>تولید لایسنس</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-black text-white font-bold shadow'
                  : 'bg-white text-black hover:bg-[#e6e6e6]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>شبیه‌ساز دیاگ کاربر</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all relative ${
                activeTab === 'history'
                  ? 'bg-black text-white font-bold shadow'
                  : 'bg-white text-black hover:bg-[#e6e6e6]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>تاریخچه</span>
              {historyCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-white text-black' : 'bg-[#e6e6e6] text-black'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-black text-white font-bold shadow'
                  : 'bg-white text-black hover:bg-[#e6e6e6]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>تنظیمات و امنیت</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#cccccc] px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
            activeTab === 'generator'
              ? 'text-black font-extrabold'
              : 'text-black/70 hover:text-black'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'generator' ? 'bg-[#e6e6e6]' : ''}`}>
            <KeyRound className="w-5 h-5 text-black" />
          </div>
          <span className="text-[10px] mt-0.5 text-black font-bold">تولید لایسنس</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
            activeTab === 'simulator'
              ? 'text-black font-extrabold'
              : 'text-black/70 hover:text-black'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'simulator' ? 'bg-[#e6e6e6]' : ''}`}>
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <span className="text-[10px] mt-0.5 text-black font-bold">شبیه‌ساز</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] relative ${
            activeTab === 'history'
              ? 'text-black font-extrabold'
              : 'text-black/70 hover:text-black'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'history' ? 'bg-[#e6e6e6]' : ''}`}>
            <History className="w-5 h-5 text-black" />
          </div>
          <span className="text-[10px] mt-0.5 text-black font-bold">تاریخچه</span>
          {historyCount > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 bg-black text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
            activeTab === 'settings'
              ? 'text-black font-extrabold'
              : 'text-black/70 hover:text-black'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'settings' ? 'bg-[#e6e6e6]' : ''}`}>
            <Settings className="w-5 h-5 text-black" />
          </div>
          <span className="text-[10px] mt-0.5 text-black font-bold">تنظیمات</span>
        </button>
      </nav>
    </>
  );
};
