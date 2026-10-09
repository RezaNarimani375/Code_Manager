import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DeviceMonitor } from './components/DeviceMonitor';
import { LicenseManager } from './components/LicenseManager';
import { CodeHub } from './components/CodeHub';
import { LicenseValidator } from './components/LicenseValidator';
import { 
  INITIAL_DEVICES, 
  INITIAL_LICENSES, 
  INITIAL_CODE_SNIPPETS 
} from './data/mockData';
import { WiFiPMotorDevice, MotorLicense, CodeSnippet } from './types';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'devices' | 'licenses' | 'code' | 'validator'>('devices');
  const [devices, setDevices] = useState<WiFiPMotorDevice[]>(() => {
    const saved = localStorage.getItem('pmotor_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });
  const [licenses, setLicenses] = useState<MotorLicense[]>(() => {
    const saved = localStorage.getItem('pmotor_licenses');
    return saved ? JSON.parse(saved) : INITIAL_LICENSES;
  });
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const saved = localStorage.getItem('pmotor_snippets');
    return saved ? JSON.parse(saved) : INITIAL_CODE_SNIPPETS;
  });

  const [prefilledMacForLicense, setPrefilledMacForLicense] = useState<string>('');
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem('pmotor_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('pmotor_licenses', JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem('pmotor_snippets', JSON.stringify(snippets));
  }, [snippets]);

  // Simulation engine: Smooth motor RPM transitions, realistic temperature & electrical load
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((dev) => {
          if (dev.status === 'offline') return dev;

          // Target ramp
          let newRpm = dev.currentRpm;
          if (dev.status === 'running') {
            const step = Math.max(50, Math.round(Math.abs(dev.targetRpm - dev.currentRpm) * 0.25));
            if (dev.currentRpm < dev.targetRpm) {
              newRpm = Math.min(dev.targetRpm, dev.currentRpm + step);
            } else if (dev.currentRpm > dev.targetRpm) {
              newRpm = Math.max(dev.targetRpm, dev.currentRpm - step);
            }
          } else {
            // Decelerate to 0
            if (newRpm > 0) {
              newRpm = Math.max(0, newRpm - 120);
            }
          }

          // Temperature dynamics
          let newTemp = dev.tempCelsius;
          if (newRpm > 0) {
            const heatRate = (newRpm / dev.maxRpmLimit) * 0.08;
            newTemp = Math.min(78.5, dev.tempCelsius + heatRate);
          } else {
            newTemp = Math.max(24.0, dev.tempCelsius - 0.05);
          }

          // Current amps dynamic
          const baseCurrent = newRpm > 0 ? 0.8 + (newRpm / dev.maxRpmLimit) * 3.4 : 0.05;
          const jitterCurrent = baseCurrent + (Math.random() * 0.06 - 0.03);

          // Voltage minor jitter
          const baseV = 24.0 + (Math.random() * 0.2 - 0.1);

          return {
            ...dev,
            currentRpm: newRpm,
            tempCelsius: Number(newTemp.toFixed(1)),
            currentAmps: Number(jitterCurrent.toFixed(2)),
            voltage: Number(baseV.toFixed(1)),
            lastPing: 'Active',
          };
        })
      );
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleUpdateDevice = (updated: WiFiPMotorDevice) => {
    setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleAddDevice = (newDev: WiFiPMotorDevice) => {
    setDevices((prev) => [newDev, ...prev]);
  };

  const handleAddLicense = (newLic: MotorLicense) => {
    setLicenses((prev) => [newLic, ...prev]);
  };

  const handleUpdateLicense = (updated: MotorLicense) => {
    setLicenses((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteLicense = (id: string) => {
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddSnippet = (newSnippet: CodeSnippet) => {
    setSnippets((prev) => [newSnippet, ...prev]);
  };

  const handleUpdateSnippet = (updated: CodeSnippet) => {
    setSnippets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleEmergencyStopAll = () => {
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        status: 'idle',
        targetRpm: 0,
        currentRpm: 0,
      }))
    );
    setEmergencyAlert('EMERGENCY STOP TRIGGERED: All WiFi PMotors powered down to 0 RPM.');
    setTimeout(() => setEmergencyAlert(null), 4000);
  };

  const handleOpenLicenseTab = (deviceMac: string) => {
    setPrefilledMacForLicense(deviceMac);
    setActiveTab('licenses');
  };

  const handleApplyLicenseToDevice = (mac: string, key: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.macAddress === mac || mac === 'CUSTOM') {
          return {
            ...d,
            licenseKey: key,
            licenseStatus: 'licensed',
            maxRpmLimit: key.includes('-IND-') ? 12000 : key.includes('-PRO-') ? 4500 : 1500,
          };
        }
        return d;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Emergency notification toast */}
      {emergencyAlert && (
        <div className="fixed top-20 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-red-400 animate-bounce">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-xs font-bold">{emergencyAlert}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        devices={devices}
        licenses={licenses}
        onEmergencyStopAll={handleEmergencyStopAll}
        onAddDevice={() => setActiveTab('devices')}
        onIssueLicense={() => setActiveTab('licenses')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'devices' && (
          <DeviceMonitor
            devices={devices}
            licenses={licenses}
            onUpdateDevice={handleUpdateDevice}
            onAddDevice={handleAddDevice}
            onOpenLicenseTab={handleOpenLicenseTab}
          />
        )}

        {activeTab === 'licenses' && (
          <LicenseManager
            licenses={licenses}
            onAddLicense={handleAddLicense}
            onUpdateLicense={handleUpdateLicense}
            onDeleteLicense={handleDeleteLicense}
            initialBindingMac={prefilledMacForLicense}
          />
        )}

        {activeTab === 'code' && (
          <CodeHub
            snippets={snippets}
            onAddSnippet={handleAddSnippet}
            onUpdateSnippet={handleUpdateSnippet}
            devices={devices}
            licenses={licenses}
          />
        )}

        {activeTab === 'validator' && (
          <LicenseValidator
            licenses={licenses}
            devices={devices}
            onApplyLicenseToDevice={handleApplyLicenseToDevice}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-slate-400">Code_Manager</span>
            <span>•</span>
            <span className="text-cyan-400">Lisense WiFi PMotor Hub</span>
          </div>
          <div>
            <span>Firmware Protocol: v2.4.1 (ESP32 / WiFi 802.11b/g/n / MQTT / REST)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
