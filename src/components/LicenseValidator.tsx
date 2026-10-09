import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Gauge, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { MotorLicense, WiFiPMotorDevice, LicenseValidationResult } from '../types';
import { validateLicenseKey } from '../utils/licenseUtil';

interface LicenseValidatorProps {
  licenses: MotorLicense[];
  devices: WiFiPMotorDevice[];
  onApplyLicenseToDevice: (deviceMac: string, licenseKey: string) => void;
}

export const LicenseValidator: React.FC<LicenseValidatorProps> = ({
  licenses,
  devices,
  onApplyLicenseToDevice,
}) => {
  const [inputKey, setInputKey] = useState('PMOTOR-PRO-9F8A-7C2B-E410-WIFI');
  const [selectedMac, setSelectedMac] = useState(devices[0]?.macAddress || '24:6F:28:7A:B1:9C');
  const [result, setResult] = useState<LicenseValidationResult | null>(null);
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  const handleValidate = () => {
    const valResult = validateLicenseKey(inputKey, selectedMac, licenses);
    setResult(valResult);
    setAppliedFeedback(null);
  };

  const handlePreset = (key: string, mac: string) => {
    setInputKey(key);
    setSelectedMac(mac);
    const valResult = validateLicenseKey(key, mac, licenses);
    setResult(valResult);
    setAppliedFeedback(null);
  };

  const handleDeployToDevice = () => {
    if (!result || !result.valid) return;
    onApplyLicenseToDevice(selectedMac, inputKey.trim().toUpperCase());
    setAppliedFeedback(`Successfully deployed license ${inputKey} to WiFi PMotor (${selectedMac})!`);
    setTimeout(() => setAppliedFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Hardware License Decoder & Signature Validator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Emulates the on-chip boot verification sequence run by the WiFi PMotor ESP32 firmware before enabling high-speed PWM drive stages.
        </p>
      </div>

      {/* Preset Test Scenarios */}
      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Quick Verification Benchmarks:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() =>
              handlePreset('PMOTOR-PRO-9F8A-7C2B-E410-WIFI', '24:6F:28:7A:B1:9C')
            }
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
          >
            ✅ Valid Pro (4,500 RPM)
          </button>
          <button
            onClick={() =>
              handlePreset('PMOTOR-IND-88BC-33A1-77EE-WIFI', 'A4:CF:12:D8:E5:2F')
            }
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
          >
            🚀 Industrial Beast (12,000 RPM)
          </button>
          <button
            onClick={() =>
              handlePreset('PMOTOR-STD-1002-3344-9988-WIFI', '08:3A:F2:66:3D:C7')
            }
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
          >
            ⚠️ Expired License Key
          </button>
          <button
            onClick={() =>
              handlePreset('PMOTOR-PRO-9F8A-7C2B-E410-WIFI', 'FF:EE:DD:CC:BB:AA')
            }
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
          >
            ❌ MAC Address Mismatch
          </button>
          <button
            onClick={() => handlePreset('INVALID-KEY-1234', '24:6F:28:7A:B1:9C')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
          >
            ❌ Corrupt Key Format
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              WiFi PMotor License Key (Raw String):
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="PMOTOR-[TIER]-[HEX4]-[HEX4]-[HEX4]-WIFI"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target WiFi PMotor Device / Hardware MAC:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedMac}
                onChange={(e) => setSelectedMac(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.macAddress}>
                    {d.name} ({d.macAddress})
                  </option>
                ))}
                <option value="CUSTOM">Custom MAC Input...</option>
              </select>

              <input
                type="text"
                value={selectedMac}
                onChange={(e) => setSelectedMac(e.target.value)}
                placeholder="24:6F:28:XX:XX:XX"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleValidate}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2 transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Execute Cryptographic Inspection</span>
        </button>

        {appliedFeedback && (
          <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold text-center">
            {appliedFeedback}
          </div>
        )}
      </div>

      {/* Validation Result Output */}
      {result && (
        <div
          className={`rounded-xl border p-5 space-y-4 shadow-xl transition-all ${
            result.valid
              ? 'bg-slate-900/90 border-emerald-500/50 ring-1 ring-emerald-500/20'
              : 'bg-slate-900/90 border-red-500/50 ring-1 ring-red-500/20'
          }`}
        >
          {/* Status Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  result.valid
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {result.valid ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {result.valid ? 'VALID HARDWARE LICENSE' : 'VERIFICATION FAILED'}
                </h3>
                <p
                  className={`text-xs mt-0.5 ${
                    result.valid ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {result.message}
                </p>
              </div>
            </div>

            {result.valid && (
              <button
                onClick={handleDeployToDevice}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center space-x-1.5"
              >
                <span>Deploy to PMotor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Decoded Payload Details */}
          {result.payload && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3 text-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Decoded Firmware Permission Manifest
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Tier Level</span>
                  <strong className="text-white font-mono mt-0.5 block">{result.payload.tier}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Allowed Speed</span>
                  <strong className="text-cyan-400 font-mono mt-0.5 block">
                    {result.payload.maxRpm.toLocaleString()} RPM
                  </strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Expiry Date</span>
                  <strong
                    className={`font-mono mt-0.5 block ${
                      result.payload.isExpired ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    {result.payload.expires}
                  </strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hardware MAC</span>
                  <strong className="text-slate-200 font-mono mt-0.5 block truncate">
                    {result.payload.boundMac}
                  </strong>
                </div>
              </div>

              {/* Allowed Features Badges */}
              {result.payload.features && result.payload.features.length > 0 && (
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5">Unlocked Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.payload.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-2 py-0.5 text-[10px] rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
