import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Smartphone, 
  User, 
  Phone, 
  CheckCircle2, 
  FileSpreadsheet 
} from 'lucide-react';
import { DiagLicenseRecord } from '../types';

interface HistoryScreenProps {
  licenses: DiagLicenseRecord[];
  onDeleteLicense: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  licenses,
  onDeleteLicense,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = licenses.filter((lic) => {
    const q = searchTerm.toLowerCase();
    return (
      lic.customerName.toLowerCase().includes(q) ||
      lic.deviceCode.includes(q) ||
      lic.activationCode.includes(q) ||
      lic.customerPhone.includes(q)
    );
  });

  // Export native Excel file (.xls) with UTF-8 formatting and RTL support
  const handleExportExcel = () => {
    if (licenses.length === 0) {
      alert('تاریخچه‌ای برای خروجی اکسل وجود ندارد.');
      return;
    }

    const tableRows = licenses
      .map(
        (l, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${l.customerName}</td>
          <td>${l.customerPhone || '-'}</td>
          <td>${l.deviceCode}</td>
          <td style="font-weight: bold; color: #2563eb;">${l.activationCode}</td>
          <td>${l.issueDateShamsi}</td>
          <td>فعال</td>
        </tr>`
      )
      .join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>لایسنس‌های هشدار دیاگ</x:Name><x:WorksheetOptions><x:DisplayRightToLeft/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          body { font-family: Tahoma, Arial, sans-serif; direction: rtl; }
          table { border-collapse: collapse; width: 100%; direction: rtl; }
          th { background-color: #2563eb; color: #ffffff; padding: 10px; border: 1px solid #94a3b8; font-size: 13px; }
          td { padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <h3 style="text-align: center; color: #1e3a8a;">گزارش کدهای لایسنس صادر شده هشدار دیاگ - شرکت آرمین صنعت ثمین (شرق)</h3>
        <table>
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام مشتری / تعمیرگاه</th>
              <th>شماره تماس</th>
              <th>شناسه سخت‌افزاری دستگاه</th>
              <th>کد فعالسازی ۸ رقمی</th>
              <th>تاریخ صدور (شمسی)</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', excelTemplate], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const dlAnchor = document.createElement('a');
    dlAnchor.href = url;
    dlAnchor.download = `hoshdar_diag_licenses_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Top Banner - White Card with Black Text & Blue Action Button */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-black">
              تاریخچه لایسنس‌های صادر شده
            </h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">
              آرشیو کدهای فعالسازی صادر شده برای مشتریان به همراه خروجی اکسل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Only Excel Export Button as requested */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>خروجی اکسل</span>
          </button>

          {licenses.length > 0 && (
            <button
              onClick={() => {
                if (confirm('آیا از پاکسازی تمام تاریخچه لایسنس‌ها اطمینان دارید؟')) {
                  onClearAll();
                }
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-slate-200 transition-colors"
              title="پاکسازی تاریخچه"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input Card - White with Black Text */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام مشتری، شماره موبایل یا کد ۸ رقمی دستگاه..."
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-black font-medium placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-gray-600 font-medium text-xs shadow-sm">
            هیچ رکوردی منطبق با جستجوی شما یافت نشد.
          </div>
        ) : (
          filtered.map((lic) => (
            <div
              key={lic.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm">{lic.customerName}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-600 font-medium mt-0.5">
                      <span className="flex items-center gap-1 font-mono text-black font-bold">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        کد دستگاه: {lic.deviceCode}
                      </span>
                      {lic.customerPhone && (
                        <span className="flex items-center gap-1 font-mono text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {lic.customerPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>فعال</span>
                  </span>
                  <span className="text-[11px] font-mono text-gray-600 font-semibold">
                    {lic.issueDateShamsi}
                  </span>
                </div>
              </div>

              {/* Code Display & Action Row */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-bold">کد فعالسازی:</span>
                  <span dir="ltr" className="font-mono text-base font-black text-blue-600 tracking-wider">
                    {lic.activationCode}
                  </span>
                  <button
                    onClick={() => handleCopyCode(lic.id, lic.activationCode)}
                    className="p-1 rounded-lg bg-white hover:bg-slate-100 text-gray-600 hover:text-black border border-slate-200 transition-colors"
                    title="کپی کد فعالسازی"
                  >
                    {copiedId === lic.id ? (
                      <Check className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => onDeleteLicense(lic.id)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-slate-200 transition-colors"
                  title="حذف رکورد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
