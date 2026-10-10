import React from 'react';
import { 
  KeyRound, 
  History, 
  Info, 
  ShieldCheck, 
  Sparkles 
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-11 h-11 rounded-2xl bg-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-blue-100 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  لایسنس هشدار دیاگ
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                شرکت آرمین صنعت ثمین (شرق) • مهندس نریمانی
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-2 space-x-reverse bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'generator'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
                  : 'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>تولید لایسنس</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all relative ${
                activeTab === 'history'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
                  : 'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>تاریخچه</span>
              {historyCount > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                    activeTab === 'history'
                      ? 'bg-white text-[#2563eb]'
                      : 'bg-[#2563eb] text-white'
                  }`}
                >
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'about'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
                  : 'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>درباره ما</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Docked & Elevated) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all min-w-[80px] ${
            activeTab === 'generator'
              ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-black">
            تولید لایسنس
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all min-w-[80px] relative ${
            activeTab === 'history'
              ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-black">
            تاریخچه
          </span>
          {historyCount > 0 && (
            <span
              className={`absolute top-0.5 right-3 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                activeTab === 'history' ? 'bg-white text-[#2563eb]' : 'bg-[#2563eb] text-white'
              }`}
            >
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all min-w-[80px] ${
            activeTab === 'about'
              ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-black">
            درباره ما
          </span>
        </button>
      </nav>
    </>
  );
};
