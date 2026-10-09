import React, { useState } from 'react';
import { FileCode, Copy, Check, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#cccccc] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <FileCode className="w-5 h-5 text-black" />
            <div>
              <h3 className="font-bold text-black text-sm">
                سورس‌کد اعتبارسنجی کلاینت (Client Verification Module)
              </h3>
              <p className="text-[11px] text-black font-medium">
                این کلاس را در اپلیکیشن اندروید دیاگ کلاینت کپی کنید تا کد فعالسازی را آفلاین بررسی کند.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-black hover:bg-[#e6e6e6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action bar */}
        <div className="px-4 py-2.5 bg-white border-b border-[#cccccc] flex items-center justify-between">
          <div className="flex space-x-2 space-x-reverse text-xs">
            <button
              onClick={() => setActiveLang('kotlin')}
              className={`px-3 py-1 rounded-lg font-mono font-bold transition-colors ${
                activeLang === 'kotlin'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-[#cccccc] hover:bg-[#e6e6e6]'
              }`}
            >
              Kotlin (Compose / Android)
            </button>
            <button
              onClick={() => setActiveLang('java')}
              className={`px-3 py-1 rounded-lg font-mono font-bold transition-colors ${
                activeLang === 'java'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-[#cccccc] hover:bg-[#e6e6e6]'
              }`}
            >
              Java (Legacy Android)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-white hover:bg-[#e6e6e6] text-black border border-[#cccccc] flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span className="text-black">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-black" />
                <span>کپی کامل سورس</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="flex-1 overflow-auto p-4 bg-[#e6e6e6] font-mono text-xs text-black leading-relaxed font-semibold" dir="ltr">
          <pre>
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#cccccc] text-right text-[11px] text-black font-semibold flex items-center justify-between">
          <span>الگوریتم بدون نیاز به اینترنت و به صورت کاملاً آفلاین کار می‌کند.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-[#e6e6e6] text-black text-xs font-bold border border-[#cccccc]"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
