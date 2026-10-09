import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Plus, 
  Copy, 
  Check, 
  Calendar, 
  Trash2, 
  Ban, 
  RefreshCcw, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { MotorLicense, LicenseTier } from '../types';
import { generateLicenseKey, computeSignatureHash } from '../utils/licenseUtil';

interface LicenseManagerProps {
  licenses: MotorLicense[];
  onAddLicense: (license: MotorLicense) => void;
  onUpdateLicense: (license: MotorLicense) => void;
  onDeleteLicense: (licenseId: string) => void;
  initialBindingMac?: string;
}

export const LicenseManager: React.FC<LicenseManagerProps> = ({
  licenses,
  onAddLicense,
  onUpdateLicense,
  onDeleteLicense,
  initialBindingMac,
}) => {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New License Form
  const [newClientName, setNewClientName] = useState('');
  const [newTier, setNewTier] = useState<LicenseTier>('Professional');
  const [newMacBinding, setNewMacBinding] = useState(initialBindingMac || '24:6F:28:7A:B1:9C');
  const [newExpiresInMonths, setNewExpiresInMonths] = useState<number>(12);
  const [newNotes, setNewNotes] = useState('');

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleIssueLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedKey = generateLicenseKey(newTier);

    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + newExpiresInMonths);

    const maxRpm = {
      Standard: 1500,
      Professional: 4500,
      'Industrial Enterprise': 12000,
      Developer: 3000,
    }[newTier];

    const maxTorque = {
      Standard: 3.0,
      Professional: 8.5,
      'Industrial Enterprise': 25.0,
      Developer: 5.0,
    }[newTier];

    const defaultFeatures = {
      Standard: ['WiFi Telemetry', 'Basic Stepping'],
      Professional: ['WiFi Telemetry', 'MQTT Streaming', 'PID Micro-Stepping', 'OTA Remote Flash'],
      'Industrial Enterprise': [
        'WiFi Telemetry',
        'MQTT Streaming',
        'PID Micro-Stepping',
        'OTA Remote Flash',
        'CAN-Bus Bridge',
        'Emergency Braking Assist',
        'Thermal Auto-Throttling',
      ],
      Developer: ['WiFi Telemetry', 'PID Micro-Stepping', 'Debug Console', 'API Webhooks'],
    }[newTier];

    const newLic: MotorLicense = {
      id: `LIC-${new Date().getFullYear()}-${Math.floor(Math.random() * 899 + 100)}`,
      licenseKey: generatedKey,
      clientName: newClientName || 'WiFi PMotor Station',
      tier: newTier,
      status: 'active',
      boundMacAddress: newMacBinding.trim() || '*',
      issuedDate: issueDate.toISOString().split('T')[0],
      expiresDate: expiryDate.toISOString().split('T')[0],
      maxRpm,
      maxTorqueNm: maxTorque,
      allowedFeatures: defaultFeatures,
      signatureHash: computeSignatureHash(generatedKey, newMacBinding),
      notes: newNotes,
    };

    onAddLicense(newLic);
    setIsIssueModalOpen(false);
    setNewClientName('');
    setNewNotes('');
  };

  const handleToggleRevoke = (lic: MotorLicense) => {
    const updatedStatus = lic.status === 'revoked' ? 'active' : 'revoked';
    onUpdateLicense({
      ...lic,
      status: updatedStatus,
    });
  };

  const handleRenew = (lic: MotorLicense) => {
    const currentExpiry = new Date(lic.expiresDate);
    currentExpiry.setFullYear(currentExpiry.getFullYear() + 1);
    onUpdateLicense({
      ...lic,
      status: 'active',
      expiresDate: currentExpiry.toISOString().split('T')[0],
    });
  };

  const exportLicensesJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(licenses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wifi_pmotor_licenses.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLicenses = licenses.filter((l) => {
    const matchesSearch =
      l.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.licenseKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.boundMacAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || l.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-400" />
            Lisense WiFi PMotor - Cryptographic Provisioning Registry
          </h2>
          <p className="text-xs text-slate-400">
            Issue, bind, enforce, and revoke cryptographic hardware licenses for WiFi PMotor actuators and drivers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportLicensesJson}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry</span>
          </button>
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Issue PMotor License</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search license key, client, or MAC binding..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Tier:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Tiers ({licenses.length})</option>
            <option value="Standard">Standard (1500 RPM)</option>
            <option value="Professional">Professional (4500 RPM)</option>
            <option value="Industrial Enterprise">Industrial (12000 RPM)</option>
            <option value="Developer">Developer (3000 RPM)</option>
          </select>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3">License Key / MAC Binding</th>
                <th className="px-4 py-3">Client / Workstation</th>
                <th className="px-4 py-3">Tier & Features</th>
                <th className="px-4 py-3">Max RPM Limit</th>
                <th className="px-4 py-3">Status & Expiry</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No matching WiFi PMotor licenses found.
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((lic) => {
                  const isExpired = new Date(lic.expiresDate).getTime() < Date.now();
                  const isRevoked = lic.status === 'revoked';

                  return (
                    <tr
                      key={lic.id}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        isRevoked ? 'opacity-60 bg-red-950/10' : ''
                      }`}
                    >
                      {/* Key & MAC */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-200 tracking-wide text-xs">
                            {lic.licenseKey}
                          </span>
                          <button
                            onClick={() => copyToClipboard(lic.licenseKey)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Copy License Key"
                          >
                            {copiedKey === lic.licenseKey ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] font-mono text-cyan-400/90 mt-0.5 flex items-center gap-1">
                          <span>Locked MAC:</span>
                          <span className="underline decoration-cyan-500/30">{lic.boundMacAddress}</span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{lic.clientName}</div>
                        {lic.notes && (
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{lic.notes}</div>
                        )}
                      </td>

                      {/* Tier & Features */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                            lic.tier === 'Industrial Enterprise'
                              ? 'bg-red-950 text-red-400 border border-red-800/60'
                              : lic.tier === 'Professional'
                              ? 'bg-purple-950 text-purple-400 border border-purple-800/60'
                              : lic.tier === 'Developer'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {lic.tier}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {lic.allowedFeatures.length} features allowed
                        </div>
                      </td>

                      {/* Max RPM */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-white text-sm">
                          {lic.maxRpm.toLocaleString()} <span className="text-[10px] text-slate-400">RPM</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Torque: {lic.maxTorqueNm} Nm
                        </div>
                      </td>

                      {/* Status & Expiry */}
                      <td className="px-4 py-3">
                        <div>
                          {isRevoked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/80 inline-flex items-center gap-1">
                              <Ban className="w-3 h-3" /> REVOKED
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/80 inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> EXPIRED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Exp: {lic.expiresDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleRenew(lic)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                            title="Extend 1 Year Renewal"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleRevoke(lic)}
                            className={`p-1.5 rounded transition-colors ${
                              isRevoked
                                ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400'
                                : 'bg-red-950/60 hover:bg-red-900 text-red-400'
                            }`}
                            title={isRevoked ? 'Reinstate License' : 'Revoke License'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteLicense(lic.id)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete License"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue New License */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleIssueLicense}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Issue WiFi PMotor License</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client Organization / Machine Name:
              </label>
              <input
                type="text"
                required
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="e.g. Apex Fluidics or Line 2 Robotic Arm"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  License Tier:
                </label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as LicenseTier)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Standard">Standard (1,500 RPM Cap)</option>
                  <option value="Professional">Professional (4,500 RPM Cap)</option>
                  <option value="Industrial Enterprise">Industrial (12,000 RPM Cap)</option>
                  <option value="Developer">Developer (3,000 RPM Cap)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hardware MAC Binding:
                </label>
                <input
                  type="text"
                  required
                  value={newMacBinding}
                  onChange={(e) => setNewMacBinding(e.target.value)}
                  placeholder="24:6F:28:XX:XX:XX or * for wildcard"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  License Validity:
                </label>
                <select
                  value={newExpiresInMonths}
                  onChange={(e) => setNewExpiresInMonths(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                >
                  <option value={1}>1 Month (Trial)</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year (Standard Subscription)</option>
                  <option value={24}>2 Years (Industrial Extended)</option>
                  <option value={60}>5 Years (Perpetual OEM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Security Salt:
                </label>
                <input
                  type="text"
                  disabled
                  value="WIFI_PMOTOR_SEC_SALT_2026"
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Engineering Notes / Work Order:
              </label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Authorized for automated dispensing unit pump controller"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow"
              >
                Generate & Sign License
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
