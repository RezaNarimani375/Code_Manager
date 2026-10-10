import React, { useState, useEffect } from 'react';
import { Navigation, TabType } from './components/Navigation';
import { GeneratorScreen } from './components/GeneratorScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AboutScreen } from './components/AboutScreen';
import { DiagLicenseRecord } from './types';
import { INITIAL_MOCK_LICENSES } from './data/mockData';
import { DEFAULT_MASTER_SECRET_KEY } from './utils/crypto';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const masterSecret = DEFAULT_MASTER_SECRET_KEY;

  const [licenses, setLicenses] = useState<DiagLicenseRecord[]>(() => {
    const saved = localStorage.getItem('hoshdar_licenses');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_LICENSES;
  });

  useEffect(() => {
    localStorage.setItem('hoshdar_licenses', JSON.stringify(licenses));
  }, [licenses]);

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
    <div className="min-h-screen bg-slate-50 text-black flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header & Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={licenses.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
      </main>

      {/* Modern Footer - White Background with Black Text */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 text-center text-xs text-black hidden md:block mt-auto shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-black text-sm">لایسنس هشدار دیاگ</span>
            <span className="text-gray-400">•</span>
            <span className="font-bold text-gray-700">شرکت آرمین صنعت ثمین (شرق)</span>
          </div>
          <div className="text-gray-600 font-medium">
            <span>توسعه و پشتیبانی: مهندس نریمانی (09159650802 - 09930096080)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
