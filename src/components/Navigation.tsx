import React from 'react';
import { 
  KeyRound, 
  History, 
  Info, 
  ShieldCheck 
} from 'lucide-react';

export type TabType = 'generator' | 'history' | 'about';

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
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-blue-100">
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-black tracking-tight">
                لایسنس هشدار دیاگ
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 space-x-reverse bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'generator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white text-black hover:bg-slate-50 border border-slate-200/60'
              }`}
            >
              <KeyRound className={`w-4 h-4 ${activeTab === 'generator' ? 'text-white' : 'text-blue-600'}`} />
              <span>تولید لایسنس</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white text-black hover:bg-slate-50 border border-slate-200/60'
              }`}
            >
              <History className={`w-4 h-4 ${activeTab === 'history' ? 'text-white' : 'text-blue-600'}`} />
              <span>تاریخچه</span>
              {historyCount > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === 'history'
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'about'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white text-black hover:bg-slate-50 border border-slate-200/60'
              }`}
            >
              <Info className={`w-4 h-4 ${activeTab === 'about' ? 'text-white' : 'text-blue-600'}`} />
              <span>درباره ما</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'generator'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-black hover:text-blue-600'
          }`}
        >
          <KeyRound className="w-5 h-5" />
          <span className={`text-[11px] font-bold mt-0.5 ${activeTab === 'generator' ? 'text-white' : 'text-black'}`}>
            تولید لایسنس
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-black hover:text-blue-600'
          }`}
        >
          <History className="w-5 h-5" />
          <span className={`text-[11px] font-bold mt-0.5 ${activeTab === 'history' ? 'text-white' : 'text-black'}`}>
            تاریخچه
          </span>
          {historyCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                activeTab === 'history' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}
            >
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'about'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-black hover:text-blue-600'
          }`}
        >
          <Info className="w-5 h-5" />
          <span className={`text-[11px] font-bold mt-0.5 ${activeTab === 'about' ? 'text-white' : 'text-black'}`}>
            درباره ما
          </span>
        </button>
      </nav>
    </>
  );
};
