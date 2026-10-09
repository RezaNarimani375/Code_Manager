import React from 'react';
import { 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Radio, 
  Code2, 
  KeyRound, 
  Activity 
} from 'lucide-react';
import { WiFiPMotorDevice, MotorLicense } from '../types';

interface HeaderProps {
  activeTab: 'devices' | 'licenses' | 'code' | 'validator';
  setActiveTab: (tab: 'devices' | 'licenses' | 'code' | 'validator') => void;
  devices: WiFiPMotorDevice[];
  licenses: MotorLicense[];
  onEmergencyStopAll: () => void;
  onAddDevice: () => void;
  onIssueLicense: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  devices,
  licenses,
  onEmergencyStopAll,
  onAddDevice,
  onIssueLicense,
}) => {
  const onlineCount = devices.filter((d) => d.status !== 'offline').length;
  const runningCount = devices.filter((d) => d.status === 'running').length;
  const activeLicensesCount = licenses.filter((l) => l.status === 'active').length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">Code_Manager</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> WiFi PMotor
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  License Core
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Smart WiFi Motor Firmware & Cryptographic License Control
              </p>
            </div>
          </div>

          {/* Quick Metrics & E-Stop */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-4 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400">Online:</span>
                <span className="font-semibold text-slate-200">{onlineCount}/{devices.length}</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Running:</span>
                <span className="font-semibold text-cyan-300">{runningCount}</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">Licenses:</span>
                <span className="font-semibold text-purple-300">{activeLicensesCount}</span>
              </div>
            </div>

            <button
              onClick={onEmergencyStopAll}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/50 flex items-center space-x-1.5 transition-all transform active:scale-95"
              title="Cut power to all connected WiFi PMotors immediately"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>E-STOP ALL</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-4 border-t border-slate-800/80 -mb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('devices')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'devices'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>WiFi PMotor Devices ({devices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('licenses')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'licenses'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>License Manager ({licenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code & Firmware Scripts</span>
          </button>

          <button
            onClick={() => setActiveTab('validator')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'validator'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>License Decoder & Validator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
