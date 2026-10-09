import React, { useState } from 'react';
import { 
  Wifi, 
  RotateCw, 
  Play, 
  Square, 
  Key, 
  Plus, 
  Sliders, 
  Thermometer, 
  Zap, 
  Gauge, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Info,
  Clock,
  Shield,
  RefreshCw,
  Radio
} from 'lucide-react';
import { WiFiPMotorDevice, MotorLicense } from '../types';

interface DeviceMonitorProps {
  devices: WiFiPMotorDevice[];
  licenses: MotorLicense[];
  onUpdateDevice: (updated: WiFiPMotorDevice) => void;
  onAddDevice: (device: WiFiPMotorDevice) => void;
  onOpenLicenseTab: (deviceMac: string) => void;
}

export const DeviceMonitor: React.FC<DeviceMonitorProps> = ({
  devices,
  licenses,
  onUpdateDevice,
  onAddDevice,
  onOpenLicenseTab,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<WiFiPMotorDevice | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [licenseFeedback, setLicenseFeedback] = useState<{ success?: boolean; text?: string } | null>(null);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  // New device form state
  const [newDevName, setNewDevName] = useState('');
  const [newDevMac, setNewDevMac] = useState('B8:27:EB:' + Math.floor(Math.random() * 89 + 10) + ':4A:11');
  const [newDevIp, setNewDevIp] = useState('192.168.1.' + Math.floor(Math.random() * 100 + 100));
  const [newDevType, setNewDevType] = useState<WiFiPMotorDevice['motorType']>('Bipolar Stepper');

  const handleToggleMotor = (dev: WiFiPMotorDevice) => {
    if (dev.status === 'running') {
      onUpdateDevice({
        ...dev,
        status: 'idle',
        targetRpm: 0,
      });
    } else {
      // Default to 1200 or max allowed
      const speed = Math.min(1200, dev.maxRpmLimit);
      onUpdateDevice({
        ...dev,
        status: 'running',
        targetRpm: speed,
      });
    }
  };

  const handleSpeedChange = (dev: WiFiPMotorDevice, newSpeed: number) => {
    const capped = Math.min(newSpeed, dev.maxRpmLimit);
    onUpdateDevice({
      ...dev,
      targetRpm: capped,
      status: capped > 0 ? 'running' : 'idle',
    });
  };

  const handleDirectionToggle = (dev: WiFiPMotorDevice) => {
    onUpdateDevice({
      ...dev,
      direction: dev.direction === 'CW' ? 'CCW' : 'CW',
    });
  };

  const openApplyLicenseModal = (dev: WiFiPMotorDevice) => {
    setSelectedDevice(dev);
    setLicenseKeyInput(dev.licenseKey || '');
    setLicenseFeedback(null);
    setIsLicenseModalOpen(true);
  };

  const handleApplyLicense = () => {
    if (!selectedDevice) return;
    const key = licenseKeyInput.trim().toUpperCase();

    // Look for matching license in registry
    const match = licenses.find((l) => l.licenseKey.toUpperCase() === key);

    if (match) {
      if (match.status === 'revoked') {
        setLicenseFeedback({ success: false, text: 'This license has been REVOKED.' });
        return;
      }
      const isExpired = new Date(match.expiresDate).getTime() < Date.now();
      if (isExpired) {
        setLicenseFeedback({ success: false, text: 'This license is EXPIRED.' });
        return;
      }

      onUpdateDevice({
        ...selectedDevice,
        licenseKey: match.licenseKey,
        licenseStatus: 'licensed',
        maxRpmLimit: match.maxRpm,
      });
      setLicenseFeedback({
        success: true,
        text: `License activated! Tier: ${match.tier} (Unlocked up to ${match.maxRpm} RPM)`,
      });
      setTimeout(() => setIsLicenseModalOpen(false), 1200);
    } else if (key.startsWith('PMOTOR-') && key.endsWith('-WIFI')) {
      // Algorithmic fallback
      const isInd = key.includes('-IND-');
      const isPro = key.includes('-PRO-');
      const maxRpm = isInd ? 12000 : isPro ? 4500 : 1500;
      onUpdateDevice({
        ...selectedDevice,
        licenseKey: key,
        licenseStatus: 'licensed',
        maxRpmLimit: maxRpm,
      });
      setLicenseFeedback({
        success: true,
        text: `Valid standalone license key verified. Max RPM set to ${maxRpm}.`,
      });
      setTimeout(() => setIsLicenseModalOpen(false), 1200);
    } else {
      setLicenseFeedback({
        success: false,
        text: 'Invalid license format. Must be PMOTOR-[TIER]-[HEX4]-[HEX4]-[HEX4]-WIFI',
      });
    }
  };

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice: WiFiPMotorDevice = {
      id: `PMOT-ESP32-${Math.floor(Math.random() * 899 + 100)}`,
      name: newDevName || 'WiFi PMotor Unit',
      macAddress: newDevMac,
      ipAddress: newDevIp,
      firmwareVersion: 'v2.4.1-wifi',
      motorType: newDevType,
      status: 'idle',
      licenseStatus: 'unlicensed',
      currentRpm: 0,
      targetRpm: 0,
      maxRpmLimit: 1000, // Unlicensed cap
      torqueNm: 0.1,
      tempCelsius: 24.5,
      voltage: 24.0,
      currentAmps: 0.05,
      wifiSignalDbm: -55,
      direction: 'CW',
      lastPing: 'Just now',
    };

    onAddDevice(newDevice);
    setIsAddDeviceModalOpen(false);
    setNewDevName('');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Live WiFi PMotor Telemetry & Controller Mesh
          </h2>
          <p className="text-xs text-slate-400">
            Real-time wireless motor feedback, PWM modulation, hardware MAC binding, and speed licensing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddDeviceModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center space-x-1.5 shadow-md shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Pair WiFi PMotor</span>
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {devices.map((device) => {
          const isRunning = device.status === 'running';
          const isLicensed = device.licenseStatus === 'licensed';
          const isExpired = device.licenseStatus === 'expired';
          const isTrial = device.licenseStatus === 'trial';
          const isUnlicensed = device.licenseStatus === 'unlicensed';

          const rpmPercent = Math.min(100, Math.round((device.currentRpm / device.maxRpmLimit) * 100));

          return (
            <div
              key={device.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isRunning
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">{device.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {device.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center space-x-1 font-mono text-[11px]">
                      <Wifi className="w-3 h-3 text-cyan-400" />
                      <span>{device.ipAddress}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-400">MAC: {device.macAddress}</span>
                  </div>
                </div>

                {/* License Badge */}
                <div>
                  {isLicensed && (
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Licensed
                    </span>
                  )}
                  {isTrial && (
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Trial Mode
                    </span>
                  )}
                  {isExpired && (
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Expired
                    </span>
                  )}
                  {isUnlicensed && (
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Unlicensed (1000 RPM Cap)
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Live Telemetry */}
              <div className="p-4 space-y-4">
                {/* RPM & Speed Dial Section */}
                <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/70">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Gauge className="w-4 h-4 text-cyan-400" /> Current Velocity
                    </span>
                    <span className="font-mono text-slate-300">
                      Cap: <strong className="text-white">{device.maxRpmLimit}</strong> RPM
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                        {Math.round(device.currentRpm)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">RPM</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <span className="text-slate-400">Target:</span>
                      <span className="text-cyan-400 font-bold">{device.targetRpm} RPM</span>
                    </div>
                  </div>

                  {/* RPM Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        rpmPercent > 85 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${rpmPercent}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                      <Thermometer className="w-3 h-3 text-orange-400" /> Temp
                    </span>
                    <span className="font-mono font-semibold text-slate-200 mt-0.5 block">
                      {device.tempCelsius.toFixed(1)}°C
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" /> Voltage
                    </span>
                    <span className="font-mono font-semibold text-slate-200 mt-0.5 block">
                      {device.voltage.toFixed(1)}V
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400">Current</span>
                    <span className="font-mono font-semibold text-slate-200 mt-0.5 block">
                      {device.currentAmps.toFixed(2)}A
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400">WiFi RSSI</span>
                    <span className="font-mono font-semibold text-slate-200 mt-0.5 block">
                      {device.wifiSignalDbm} dBm
                    </span>
                  </div>
                </div>

                {/* Target Speed Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <label className="flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-slate-400" /> Set RPM Speed:
                    </label>
                    <span className="font-mono text-cyan-400 text-xs font-semibold">
                      {device.targetRpm} / {device.maxRpmLimit} RPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={device.maxRpmLimit}
                    step="50"
                    value={device.targetRpm}
                    onChange={(e) => handleSpeedChange(device, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  {device.targetRpm >= device.maxRpmLimit && (
                    <p className="text-[10px] text-amber-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Speed capped by current license profile ({device.maxRpmLimit} RPM).
                    </p>
                  )}
                </div>

                {/* Motor Controls Button Group */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleMotor(device)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all ${
                        isRunning
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Square className="w-3.5 h-3.5" />
                          <span>Stop Motor</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Run Motor</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDirectionToggle(device)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1"
                      title="Toggle Clockwise / Counter-Clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{device.direction}</span>
                    </button>
                  </div>

                  {/* License action button */}
                  <button
                    onClick={() => openApplyLicenseModal(device)}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/60 flex items-center space-x-1"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isLicensed ? 'Update Key' : 'Activate License'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Apply License Key */}
      {isLicenseModalOpen && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Apply License to WiFi PMotor</h3>
              </div>
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div>Device: <strong className="text-white">{selectedDevice.name}</strong></div>
              <div>MAC Binding: <strong className="text-cyan-400 font-mono">{selectedDevice.macAddress}</strong></div>
              <div>Current Cap: <span className="text-slate-300">{selectedDevice.maxRpmLimit} RPM</span></div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enter WiFi PMotor License Key:
              </label>
              <input
                type="text"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="PMOTOR-PRO-XXXX-XXXX-XXXX-WIFI"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Formats: PMOTOR-STD (1500 RPM), PMOTOR-PRO (4500 RPM), PMOTOR-IND (12000 RPM)
              </p>
            </div>

            {licenseFeedback && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  licenseFeedback.success
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : 'bg-red-950/80 text-red-300 border border-red-800'
                }`}
              >
                {licenseFeedback.text}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => onOpenLicenseTab(selectedDevice.macAddress)}
                className="text-xs text-purple-400 hover:underline"
              >
                Generate new license in Manager →
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyLicense}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow"
                >
                  Verify & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pair New WiFi PMotor */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDevice}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Pair New WiFi PMotor</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDeviceModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Motor / Workstation Identifier:
              </label>
              <input
                type="text"
                required
                value={newDevName}
                onChange={(e) => setNewDevName(e.target.value)}
                placeholder="e.g. Laser Axis Motor Y"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Device Hardware MAC:
                </label>
                <input
                  type="text"
                  required
                  value={newDevMac}
                  onChange={(e) => setNewDevMac(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assigned IP Address:
                </label>
                <input
                  type="text"
                  required
                  value={newDevIp}
                  onChange={(e) => setNewDevIp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Motor Hardware Type:
              </label>
              <select
                value={newDevType}
                onChange={(e) => setNewDevType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Bipolar Stepper">Bipolar Stepper (High Precision)</option>
                <option value="Brushless DC">Brushless DC (High RPM BLDC)</option>
                <option value="High-Torque Servo">High-Torque Servo Module</option>
                <option value="AC Induction Variable">AC Induction Variable Frequency</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddDeviceModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow"
              >
                Register Motor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
