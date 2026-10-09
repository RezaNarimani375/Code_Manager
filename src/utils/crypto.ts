/**
 * Hoshdar Diag Cryptographic Core Engine
 * Standard RFC 2104 HMAC-SHA256 Implementation for Automotive Diagnostic Licensing
 */

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

export function sha256(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let compositeClearHex = '';
  for (; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= (code & 0xff) << (24 - (i % 4) * 8);
  }

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  const w = new Array(64);

  for (i = 0; i < words.length; i += 16) {
    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[j + i] | 0;
      } else {
        const gamma0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const gamma1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0;
      }

      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + k[j] + w[j]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const byte = (hash[i] >> (j * 8)) & 255;
      result += ('0' + byte.toString(16)).slice(-2);
    }
  }

  return result;
}

export function hmacSha256(key: string, message: string): string {
  const blockSize = 64; // SHA-256 block size in bytes

  let keyBytes: number[] = [];
  for (let i = 0; i < key.length; i++) {
    keyBytes.push(key.charCodeAt(i) & 0xff);
  }

  if (keyBytes.length > blockSize) {
    const keyHash = sha256(key);
    keyBytes = [];
    for (let i = 0; i < keyHash.length; i += 2) {
      keyBytes.push(parseInt(keyHash.substr(i, 2), 16));
    }
  }

  while (keyBytes.length < blockSize) {
    keyBytes.push(0);
  }

  const oPad: number[] = [];
  const iPad: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    oPad.push(keyBytes[i] ^ 0x5c);
    iPad.push(keyBytes[i] ^ 0x36);
  }

  const iPadStr = String.fromCharCode(...iPad) + message;
  const innerHash = sha256(iPadStr);

  const innerHashBytes: number[] = [];
  for (let i = 0; i < innerHash.length; i += 2) {
    innerHashBytes.push(parseInt(innerHash.substr(i, 2), 16));
  }

  const oPadStr = String.fromCharCode(...oPad) + String.fromCharCode(...innerHashBytes);
  return sha256(oPadStr);
}

export const DEFAULT_MASTER_SECRET_KEY = "HOSHDAR_DIAG_MASTER_SECRET_KEY_2026_AUTOMOTIVE";

export type TierCode = 'DPRO' | 'REMAP' | 'FLEET' | 'LFT';
export type LicenseFormat = '8digit' | '16block';
export type LicenseDuration = '1month' | '6months' | '1year' | 'lifetime';

export interface TierInfo {
  code: TierCode;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  badgeColor: string;
  permissions: string[];
}

export const TIERS: Record<TierCode, TierInfo> = {
  DPRO: {
    code: 'DPRO',
    titleFa: 'دیاگ تخصصی پرو',
    titleEn: 'Diagnostic Pro',
    descriptionFa: 'عیب‌یابی پیشرفته، خواندن و پاک کردن تخصصی DTC، تست عملگرها و پارامترهای زنده کلیه ایسیوها',
    badgeColor: 'bg-blue-950 text-blue-400 border-blue-800',
    permissions: [
      'خواندن و پاک کردن کدهای خطای ECU',
      'تست عملگرهای انژکتور، رله دوبل و فن',
      'پایش زنده پارامترهای موتور و سنسورها',
      'پشتیبانی از پروتکل‌های K-Line و CAN',
    ],
  },
  REMAP: {
    code: 'REMAP',
    titleFa: 'ریمپ و تیونینگ ECU',
    titleEn: 'ECU Remap & Tuning',
    descriptionFa: 'تنظیم جداول سوخت و جرقه، حذف کات‌اف، حذف سنسور اکسیژن دوم، بهینه‌سازی دمای فن و شتاب',
    badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
    permissions: [
      'ویرایش جدول گشتاور و ریمپ نرم‌افزاری',
      'حذف خطاهای کاذب و سنسور میل‌سوپاپ',
      'تغییر دمای استارت فن دور کند و تند',
      'بک‌فایر و لانچ کنترل در حالت ایستاده',
      'کلیه قابلیت‌های پکیج دیاگ پرو',
    ],
  },
  FLEET: {
    code: 'FLEET',
    titleFa: 'مانیتورینگ ناوگان',
    titleEn: 'Fleet Diagnostics',
    descriptionFa: 'پایش بی‌سیم از راه دور، ارسال تله‌متری خودرو به سرور مرکزی، گزارش مصرف سوخت و خطاهای بحرانی',
    badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
    permissions: [
      'تله‌متری زنده از طریق وای‌فای و بلوتوث دیاگ',
      'ثبت داده‌های Blackbox هنگام بروز خطا',
      'لاگینگ مصرف سوخت و کارکرد موتور',
      'ارسال هشدار پیامکی دمای آب بحرانی',
    ],
  },
  LFT: {
    code: 'LFT',
    titleFa: 'نسخه نامحدود طلایی',
    titleEn: 'Lifetime Ultimate',
    descriptionFa: 'دسترسی کامل و مادام‌العمر به کلیه امکانات عیب‌یابی، ریمپ، دانلود، فلش و آپدیت‌های آینده هوشدار',
    badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-600/80 shadow-amber-500/20',
    permissions: [
      'دسترسی بی‌قید و شرط به تمام ماژول‌ها',
      'دانلود و فلش خودکار انواع ECU داخلی و خارجی',
      'پشتیبانی VIP و به‌روزرسانی مادام‌العمر',
      'فعالسازی قابلیت‌های ویژه دیاگ هوشدار',
    ],
  },
};

/**
 * Calculates the exact 8-digit or 16-block activation code based on device ID, tier, and master secret
 */
export function generateActivationCode(
  deviceCode: string,
  tier: TierCode,
  format: LicenseFormat = '8digit',
  masterSecret: string = DEFAULT_MASTER_SECRET_KEY
): { code: string; hexHash: string; payload: string } {
  // Normalize 8-digit device code
  const cleanDevice = deviceCode.replace(/\D/g, '').padStart(8, '0').slice(-8);

  // Exact payload specification:
  // "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:{cleanDevice8}:{tierCode}:HMAC_SHA256"
  const payload = `HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:${cleanDevice}:${tier}:HMAC_SHA256`;

  // Compute HMAC-SHA256
  const hexHash = hmacSha256(masterSecret.trim() || DEFAULT_MASTER_SECRET_KEY, payload);

  if (format === '8digit') {
    // 12 chars hex to BigInt / Long
    const first12Hex = hexHash.slice(0, 12);
    const parsedVal = BigInt('0x' + first12Hex);
    // Formula: eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)
    const modulo = parsedVal % 90000000n;
    const finalNumber = 10000000n + (modulo < 0n ? -modulo : modulo);
    return {
      code: finalNumber.toString(),
      hexHash,
      payload,
    };
  } else {
    // 16-character 4-part block format (e.g. ABCD-EFGH-IJKL-MNOP)
    const upperHex = hexHash.toUpperCase();
    const p1 = upperHex.slice(0, 4);
    const p2 = upperHex.slice(4, 8);
    const p3 = upperHex.slice(8, 12);
    const p4 = upperHex.slice(12, 16);
    return {
      code: `${p1}-${p2}-${p3}-${p4}`,
      hexHash,
      payload,
    };
  }
}

/**
 * Validates whether a provided activation code is authentic for a given device ID
 */
export function verifyActivationCode(
  deviceCode: string,
  enteredCode: string,
  masterSecret: string = DEFAULT_MASTER_SECRET_KEY
): {
  valid: boolean;
  matchedTier?: TierCode;
  matchedFormat?: LicenseFormat;
  message: string;
} {
  const cleanDevice = deviceCode.replace(/\D/g, '').padStart(8, '0').slice(-8);
  const cleanCode = enteredCode.trim().toUpperCase().replace(/\s+/g, '');

  const tierCodes: TierCode[] = ['LFT', 'REMAP', 'DPRO', 'FLEET'];

  for (const tier of tierCodes) {
    // Check 8-digit
    const gen8 = generateActivationCode(cleanDevice, tier, '8digit', masterSecret);
    if (gen8.code === cleanCode) {
      return {
        valid: true,
        matchedTier: tier,
        matchedFormat: '8digit',
        message: `کد فعالسازی ۸ رقمی معتبر است. پکیج فعال‌شده: ${TIERS[tier].titleFa}`,
      };
    }

    // Check 16-block
    const gen16 = generateActivationCode(cleanDevice, tier, '16block', masterSecret);
    if (gen16.code === cleanCode || gen16.code.replace(/-/g, '') === cleanCode.replace(/-/g, '')) {
      return {
        valid: true,
        matchedTier: tier,
        matchedFormat: '16block',
        message: `کد لایسنس بلوکی ۱۶ کاراکتری معتبر است. پکیج فعال‌شده: ${TIERS[tier].titleFa}`,
      };
    }
  }

  return {
    valid: false,
    message: 'کد فعالسازی با شناسه این دستگاه تطابق ندارد یا کلید امنیتی نامعتبر است.',
  };
}
