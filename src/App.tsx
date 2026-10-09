import React, { useState, useEffect } from 'react';
import { Navigation, TabType } from './components/Navigation';
import { GeneratorScreen } from './components/GeneratorScreen';
import { SimulatorScreen } from './components/SimulatorScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ClientCodeModal } from './components/ClientCodeModal';
import { DiagLicenseRecord } from './types';
import { INITIAL_MOCK_LICENSES } from './data/mockData';
import { DEFAULT_MASTER_SECRET_KEY } from './utils/crypto';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [masterSecret, setMasterSecret] = useState<string>(() => {
    return localStorage.getItem('hoshdar_master_secret') || DEFAULT_MASTER_SECRET_KEY;
  });

  const [licenses, setLicenses] = useState<DiagLicenseRecord[]>(() => {
    const saved = localStorage.getItem('hoshdar_licenses');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_LICENSES;
  });

  // State passed to simulator if user clicks "Test in Simulator"
  const [simulatorDevice, setSimulatorDevice] = useState<string>('84920173');
  const [simulatorActivationCode, setSimulatorActivationCode] = useState<string>('');

  // Modal for viewing Kotlin/Java client verification code
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('hoshdar_licenses', JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem('hoshdar_master_secret', masterSecret);
  }, [masterSecret]);

  const handleSaveLicense = (newLic: DiagLicenseRecord) => {
    setLicenses((prev) => [newLic, ...prev]);
  };

  const handleDeleteLicense = (id: string) => {
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateStatus = (id: string, newStatus: 'active' | 'expired' | 'revoked') => {
    setLicenses((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  const handleClearAllHistory = () => {
    setLicenses([]);
  };

  const handleTestInSimulator = (deviceCode: string, activationCode: string) => {
    setSimulatorDevice(deviceCode);
    setSimulatorActivationCode(activationCode);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-[#e6e6e6] text-black flex flex-col font-sans selection:bg-amber-300 selection:text-black">
      {/* Top Header & Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={licenses.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'generator' && (
          <GeneratorScreen
            onSaveLicense={handleSaveLicense}
            onTestInSimulator={handleTestInSimulator}
            onOpenClientCodeModal={() => setIsClientModalOpen(true)}
            masterSecret={masterSecret}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorScreen
            initialDeviceCode={simulatorDevice}
            initialActivationCode={simulatorActivationCode}
            masterSecret={masterSecret}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            licenses={licenses}
            onDeleteLicense={handleDeleteLicense}
            onUpdateStatus={handleUpdateStatus}
            onClearAll={handleClearAllHistory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            masterSecret={masterSecret}
            onUpdateMasterSecret={setMasterSecret}
            onOpenClientCodeModal={() => setIsClientModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#cccccc] bg-[#e6e6e6] py-4 px-6 text-center text-xs text-black hidden md:block">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black">سامانه مدیریت لایسنس دیاگ هوشدار</span>
            <span>•</span>
            <span className="font-mono text-[11px] font-bold text-black">Hoshdar Diag License Manager</span>
          </div>
          <div>
            <span className="text-black font-medium">طراحی و توسعه: مهندس نریمانی • هسته رمزنگاری HMAC-SHA256</span>
          </div>
        </div>
      </footer>

      {/* Client Source Code Modal Dialog */}
      <ClientCodeModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        masterSecret={masterSecret}
      />
    </div>
  );
}

export default App;
