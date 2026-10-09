import React, { useState } from 'react';
import { Code2, Copy, Check, X, ShieldAlert, FileCode } from 'lucide-react';
import { DEFAULT_MASTER_SECRET_KEY } from '../utils/crypto';

interface ClientCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterSecret: string;
}

export const ClientCodeModal: React.FC<ClientCodeModalProps> = ({
  isOpen,
  onClose,
  masterSecret,
}) => {
  const [activeLang, setActiveLang] = useState<'kotlin' | 'java'>('kotlin');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const kotlinCode = `// =========================================================================
// Hoshdar Diag Client License Validator (Kotlin / Jetpack Compose)
// نویسنده: مهندس نریمانی | موتور امنیتی: HMAC-SHA256
// =========================================================================
package com.hoshdar.diag.security

import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

object HoshdarLicenseValidator {

    // کلید مادر لایسنس (Master Secret Key)
    private const val MASTER_SECRET = "${masterSecret || DEFAULT_MASTER_SECRET_KEY}"

    enum class Tier(val code: String, val title: String) {
        DPRO("DPRO", "دیاگ تخصصی پرو"),
        REMAP("REMAP", "ریمپ و تیونینگ ECU"),
        FLEET("FLEET", "مانیتورینگ ناوگان"),
        LFT("LFT", "نسخه نامحدود طلایی")
    }

    /**
     * بررسی و اعتبارسنجی کد فعالسازی ۸ رقمی یا ۱۶ کاراکتری
     */
    fun verifyActivationCode(rawDeviceCode: String, rawEnteredCode: String): Pair<Boolean, Tier?> {
        val cleanDevice = rawDeviceCode.filter { it.isDigit() }.padStart(8, '0').takeLast(8)
        val cleanCode = rawEnteredCode.trim().uppercase().replace("-", "")

        for (tier in Tier.values()) {
            // ساخت رشته پیلود بر اساس استاندارد دیاگ هوشدار
            val payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:$cleanDevice:\${tier.code}:HMAC_SHA256"
            val hexHash = hmacSha256(MASTER_SECRET, payload)

            // ۱. بررسی کد ۸ رقمی
            val first12Hex = hexHash.take(12)
            val parsedVal = first12Hex.toLong(16)
            val eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)
            if (eightDigit.toString() == cleanCode) {
                return Pair(true, tier)
            }

            // ۲. بررسی کد ۱۶ کاراکتری بلوکی
            val sixteenChar = hexHash.take(16).uppercase()
            if (sixteenChar == cleanCode) {
                return Pair(true, tier)
            }
        }

        return Pair(false, null)
    }

    private fun hmacSha256(key: String, data: String): String {
        val sha256Hmac = Mac.getInstance("HmacSHA256")
        val secretKey = SecretKeySpec(key.toByteArray(Charsets.UTF_8), "HmacSHA256")
        sha256Hmac.init(secretKey)
        val hashBytes = sha256Hmac.doFinal(data.toByteArray(Charsets.UTF_8))
        return hashBytes.joinToString("") { "%02x".format(it) }
    }
}`;

  const javaCode = `// =========================================================================
// Hoshdar Diag Client License Validator (Java / Android)
// مهندس نریمانی | الگوریتم اعتبارسنجی آفلاین خودرویی
// =========================================================================
package com.hoshdar.diag.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HoshdarLicenseValidator {

    private static final String MASTER_SECRET = "${masterSecret || DEFAULT_MASTER_SECRET_KEY}";
    private static final String[] TIERS = {"LFT", "REMAP", "DPRO", "FLEET"};

    public static class VerificationResult {
        public final boolean isValid;
        public final String tierCode;

        public VerificationResult(boolean isValid, String tierCode) {
            this.isValid = isValid;
            this.tierCode = tierCode;
        }
    }

    public static VerificationResult verify(String rawDeviceCode, String rawEnteredCode) {
        String cleanDevice = rawDeviceCode.replaceAll("[^0-9]", "");
        while (cleanDevice.length() < 8) cleanDevice = "0" + cleanDevice;
        if (cleanDevice.length() > 8) cleanDevice = cleanDevice.substring(cleanDevice.length() - 8);

        String cleanCode = rawEnteredCode.trim().toUpperCase().replace("-", "").replaceAll("\\\\s+", "");

        for (String tier : TIERS) {
            try {
                String payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:" + cleanDevice + ":" + tier + ":HMAC_SHA256";
                String hexHash = hmacSha256(MASTER_SECRET, payload);

                // ۱. کد عددی ۸ رقمی
                String first12 = hexHash.substring(0, 12);
                long parsed = Long.parseLong(first12, 16);
                long eightDigit = 10000000L + (Math.abs(parsed) % 90000000L);

                if (String.valueOf(eightDigit).equals(cleanCode)) {
                    return new VerificationResult(true, tier);
                }

                // ۲. کد ۱۶ کاراکتری
                String sixteen = hexHash.substring(0, 16).toUpperCase();
                if (sixteen.equals(cleanCode)) {
                    return new VerificationResult(true, tier);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new VerificationResult(false, null);
    }

    private static String hmacSha256(String key, String message) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] bytes = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}`;

  const currentCode = activeLang === 'kotlin' ? kotlinCode : javaCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <FileCode className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-sm">
                سورس‌کد اعتبارسنجی کلاینت (Client Verification Module)
              </h3>
              <p className="text-[11px] text-slate-400">
                این کلاس را در اپلیکیشن اندروید دیاگ کلاینت کپی کنید تا کد فعالسازی را آفلاین بررسی کند.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action bar */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2 space-x-reverse text-xs">
            <button
              onClick={() => setActiveLang('kotlin')}
              className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
                activeLang === 'kotlin'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Kotlin (Compose / Android)
            </button>
            <button
              onClick={() => setActiveLang('java')}
              className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
                activeLang === 'java'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Java (Legacy Android)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>کپی کامل سورس</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed" dir="ltr">
          <pre>
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-right text-[11px] text-slate-400 flex items-center justify-between">
          <span>الگوریتم بدون نیاز به اینترنت و به صورت کاملاً آفلاین کار می‌کند.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
