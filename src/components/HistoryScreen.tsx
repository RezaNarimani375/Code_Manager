import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Trash2, 
  Share2, 
  Download, 
  Calendar, 
  Smartphone, 
  User, 
  Phone, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet 
} from 'lucide-react';
import { DiagLicenseRecord } from '../types';
import { TIERS } from '../utils/crypto';

interface HistoryScreenProps {
  licenses: DiagLicenseRecord[];
  onDeleteLicense: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: 'active' | 'expired' | 'revoked') => void;
  onClearAll: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  licenses,
  onDeleteLicense,
  onUpdateStatus,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = licenses.filter((lic) => {
    const q = searchTerm.toLowerCase();
    const matchQuery =
      lic.customerName.toLowerCase().includes(q) ||
      lic.deviceCode.includes(q) ||
      lic.activationCode.toLowerCase().includes(q) ||
      lic.customerPhone.includes(q);

    const matchTier = tierFilter === 'all' || lic.tier === tierFilter;
    const matchStatus = statusFilter === 'all' || lic.status === statusFilter;

    return matchQuery && matchTier && matchStatus;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(licenses, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `hoshdar_diag_licenses_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Customer Name', 'Phone', 'Device Code', 'Tier', 'Activation Code', 'Issue Shamsi', 'Expiry Shamsi', 'Status'];
    const rows = licenses.map((l) => [
      l.id,
      `"${l.customerName}"`,
      `"${l.customerPhone}"`,
      l.deviceCode,
      l.tier,
      l.activationCode,
      l.issueDateShamsi,
      l.expiryDateShamsi,
      l.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodedUri);
    dlAnchor.setAttribute('download', `hoshdar_licenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              تاریخچه کدهای لایسنس صادر شده دیاگ هوشدار
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت کامل لایسنس‌های مشتریان، پیگیری وضعیت انقضا، ابطال و دریافت گزارش خروجی
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>خروجی اکسل / CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>خروجی JSON</span>
          </button>

          {licenses.length > 0 && (
            <button
              onClick={() => {
                if (confirm('آیا از پاکسازی کل تاریخچه لایسنس‌ها اطمینان دارید؟')) {
                  onClearAll();
                }
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>پاکسازی کل</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام مشتری، شماره تماس یا کد ۸ رقمی دستگاه..."
            className="w-full pr-9 pl-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>پکیج:</span>
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">همه پکیج‌ها</option>
            <option value="DPRO">دیاگ پرو (DPRO)</option>
            <option value="REMAP">ریمپ و تیونینگ (REMAP)</option>
            <option value="FLEET">مانیتورینگ ناوگان (FLEET)</option>
            <option value="LFT">نسخه نامحدود طلایی (LFT)</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <span>وضعیت:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">همه</option>
            <option value="active">فعال</option>
            <option value="expired">منقضی</option>
            <option value="revoked">لغو شده</option>
          </select>
        </div>
      </div>

      {/* License Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-8 text-center text-slate-500 text-xs">
            هیچ رکوردی منطبق با جستجوی شما یافت نشد.
          </div>
        ) : (
          filtered.map((lic) => {
            const tierObj = TIERS[lic.tier];
            const isRevoked = lic.status === 'revoked';

            return (
              <div
                key={lic.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isRevoked
                    ? 'bg-red-950/20 border-red-900/60 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{lic.customerName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierObj.badgeColor}`}
                        >
                          {tierObj.titleFa}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-amber-300">
                          <Smartphone className="w-3 h-3 text-slate-400" />
                          دستگاه: {lic.deviceCode}
                        </span>
                        {lic.customerPhone && (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                            <Phone className="w-3 h-3" />
                            {lic.customerPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {lic.status === 'active' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> فعال
                      </span>
                    )}
                    {lic.status === 'revoked' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-950 text-red-400 border border-red-800 flex items-center gap-1">
                        <Ban className="w-3 h-3" /> لغو شده
                      </span>
                    )}
                    {lic.status === 'expired' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> منقضی شده
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body: Code and dates */}
                <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">کد فعالسازی:</span>
                      <span dir="ltr" className="font-mono text-sm font-extrabold text-amber-400 tracking-wider">
                        {lic.activationCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(lic.id, lic.activationCode)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="کپی کد"
                      >
                        {copiedId === lic.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>صدور: {lic.issueDateShamsi}</span>
                      <span>•</span>
                      <span>انقضا: {lic.expiryDateShamsi}</span>
                    </div>
                  </div>

                  {/* Actions: Toggle revoke, delete */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() =>
                        onUpdateStatus(lic.id, lic.status === 'revoked' ? 'active' : 'revoked')
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                        lic.status === 'revoked'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                          : 'bg-red-950/60 text-red-300 border-red-800 hover:bg-red-900'
                      }`}
                    >
                      {lic.status === 'revoked' ? 'فعالسازی مجدد' : 'ابطال لایسنس'}
                    </button>

                    <button
                      onClick={() => onDeleteLicense(lic.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                      title="حذف رکورد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
