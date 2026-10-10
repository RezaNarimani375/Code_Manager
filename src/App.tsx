import React, { useState, useEffect } from 'react';
import { NavigationHeader, BottomNav, TabType } from './components/Navigation';
import { GeneratorScreen } from './components/GeneratorScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AboutScreen } from './components/AboutScreen';
import { LockScreen } from './components/LockScreen';
import { DiagLicenseRecord } from './types';
import { INITIAL_MOCK_LICENSES } from './data/mockData';
import { DEFAULT_MASTER_SECRET_KEY } from './utils/crypto';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const masterSecret = DEFAULT_MASTER_SECRET_KEY;

  // Authentication Lock state
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return sessionStorage.getItem('hoshdar_authenticated') !== 'true';
  });

  const [licenses, setLicenses] = useState<DiagLicenseRecord[]>(() => {
    const saved = localStorage.getItem('hoshdar_licenses');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_LICENSES;
  });

  useEffect(() => {
    localStorage.setItem('hoshdar_licenses', JSON.stringify(licenses));
  }, [licenses]);

  const handleUnlock = () => {
    sessionStorage.setItem('hoshdar_authenticated', 'true');
    setIsLocked(false);
  };

  const handleLockApp = () => {
    sessionStorage.removeItem('hoshdar_authenticated');
    setIsLocked(true);
  };

  const handleSaveLicense = (newLic: DiagLicenseRecord) => {
    setLicenses((prev) => [newLic, ...prev]);
  };

  const handleDeleteLicense = (id: string) => {
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearAllHistory = () => {
    setLicenses([]);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-slate-50 text-black flex flex-col font-sans selection:bg-blue-600 selection:text-white fixed inset-0">
      {/* Security Lock Screen */}
      {isLocked && <LockScreen onUnlock={handleUnlock} />}

      {/* Top Header (Anchored at top, shrink-0) */}
      <NavigationHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={licenses.length}
        onLockApp={handleLockApp}
      />

      {/* Independent Scrollable Middle Container (Only this scrolls, so viewport never collapses) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {activeTab === 'generator' && (
          <GeneratorScreen
            onSaveLicense={handleSaveLicense}
            masterSecret={masterSecret}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            licenses={licenses}
            onDeleteLicense={handleDeleteLicense}
            onClearAll={handleClearAllHistory}
          />
        )}

        {activeTab === 'about' && <AboutScreen />}

        {/* Desktop Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-black hidden md:block mt-8 rounded-2xl shadow-sm">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-black text-xs">لایسنس هشدار دیاگ</span>
              <span className="text-gray-400">•</span>
              <span className="font-bold text-gray-700">شرکت آرمین صنعت ثمین (شرق)</span>
            </div>
            <div className="text-gray-600 font-medium">
              <span>توسعه و پشتیبانی: مهندس نریمانی (09159650802 - 09930096080)</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation Bar (Anchored at the bottom of the flex layout, 100% stable, shrink-0) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={licenses.length}
      />
    </div>
  );
}

export default App;
