import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Trash2, 
  Smartphone, 
  User, 
  Phone, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Download 
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cccccc] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black">
              تاریخچه کدهای لایسنس صادر شده دیاگ هوشدار
            </h2>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            مدیریت کامل لایسنس‌های مشتریان، پیگیری وضعیت انقضا، ابطال و دریافت گزارش خروجی
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
            <span>خروجی اکسل / CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>خروجی JSON</span>
          </button>

          {licenses.length > 0 && (
            <button
              onClick={() => {
                if (confirm('آیا از پاکسازی کل تاریخچه لایسنس‌ها اطمینان دارید؟')) {
                  onClearAll();
                }
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] flex items-center gap-1 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-black" />
              <span>پاکسازی کل</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#cccccc] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-3 text-black/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام مشتری، شماره تماس یا کد ۸ رقمی دستگاه..."
            className="w-full pr-9 pl-4 py-2 bg-white border border-[#cccccc] rounded-xl text-xs text-black placeholder-gray-500 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <Filter className="w-3.5 h-3.5" />
            <span>پکیج:</span>
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-white border border-[#cccccc] rounded-xl px-2.5 py-1.5 text-xs text-black font-semibold focus:outline-none"
          >
            <option value="all">همه پکیج‌ها</option>
            <option value="DPRO">دیاگ پرو (DPRO)</option>
            <option value="REMAP">ریمپ و تیونینگ (REMAP)</option>
            <option value="FLEET">مانیتورینگ ناوگان (FLEET)</option>
            <option value="LFT">نسخه نامحدود طلایی (LFT)</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-bold text-black mr-2">
            <span>وضعیت:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#cccccc] rounded-xl px-2.5 py-1.5 text-xs text-black font-semibold focus:outline-none"
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
          <div className="bg-white rounded-2xl border border-[#cccccc] p-8 text-center text-black font-medium text-xs shadow-sm">
            هیچ رکوردی منطبق با جستجوی شما یافت نشد.
          </div>
        ) : (
          filtered.map((lic) => {
            const tierObj = TIERS[lic.tier];
            const isRevoked = lic.status === 'revoked';

            return (
              <div
                key={lic.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm ${
                  isRevoked
                    ? 'bg-[#e6e6e6] border-black/40 opacity-80'
                    : 'bg-white border-[#cccccc] hover:border-black'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#cccccc] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] border border-[#cccccc] flex items-center justify-center text-black">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black text-sm">{lic.customerName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-black bg-white text-black">
                          {tierObj.titleFa}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-black font-medium mt-0.5">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-black font-bold">
                          <Smartphone className="w-3 h-3 text-black" />
                          دستگاه: {lic.deviceCode}
                        </span>
                        {lic.customerPhone && (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-black">
                            <Phone className="w-3 h-3 text-black" />
                            {lic.customerPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {lic.status === 'active' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-black border border-black flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-black stroke-[2.5]" /> فعال
                      </span>
                    )}
                    {lic.status === 'revoked' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e6e6e6] text-black border border-black flex items-center gap-1">
                        <Ban className="w-3 h-3 text-black stroke-[2.5]" /> لغو شده
                      </span>
                    )}
                    {lic.status === 'expired' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e6e6e6] text-black border border-[#cccccc] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-black stroke-[2.5]" /> منقضی شده
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body: Code and dates */}
                <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="bg-[#e6e6e6] px-3.5 py-1.5 rounded-xl border border-[#cccccc] flex items-center gap-2">
                      <span className="text-[11px] text-black font-bold">کد فعالسازی:</span>
                      <span dir="ltr" className="font-mono text-sm font-black text-black tracking-wider">
                        {lic.activationCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(lic.id, lic.activationCode)}
                        className="p-1 rounded bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] transition-colors"
                        title="کپی کد"
                      >
                        {copiedId === lic.id ? (
                          <Check className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-black" />
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-black font-medium flex items-center gap-2">
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
                      className="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors border border-[#cccccc] bg-white text-black hover:bg-[#e6e6e6]"
                    >
                      {lic.status === 'revoked' ? 'فعالسازی مجدد' : 'ابطال لایسنس'}
                    </button>

                    <button
                      onClick={() => onDeleteLicense(lic.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] transition-colors"
                      title="حذف رکورد"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-black" />
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
