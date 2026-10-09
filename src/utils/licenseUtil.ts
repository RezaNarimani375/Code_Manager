import { LicenseTier, LicenseValidationResult, MotorLicense } from '../types';

export function generateRandomHex(length: number): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateLicenseKey(tier: LicenseTier): string {
  const tierPrefix = {
    Standard: 'STD',
    Professional: 'PRO',
    'Industrial Enterprise': 'IND',
    Developer: 'DEV',
  }[tier];

  const part1 = generateRandomHex(4);
  const part2 = generateRandomHex(4);
  const part3 = generateRandomHex(4);

  return `PMOTOR-${tierPrefix}-${part1}-${part2}-${part3}-WIFI`;
}

export function computeSignatureHash(key: string, mac: string): string {
  // Deterministic pseudo-hash for validation display
  let hash = 0x811c9dc5;
  const str = `${key}:${mac}:WIFI_PMOTOR_SALT`;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `sha256_${hex}_${key.slice(-8)}`;
}

export function validateLicenseKey(
  key: string,
  targetMac?: string,
  licensesDatabase: MotorLicense[] = []
): LicenseValidationResult {
  const trimmed = key.trim().toUpperCase();

  if (!trimmed.startsWith('PMOTOR-') || !trimmed.endsWith('-WIFI')) {
    return {
      valid: false,
      message: 'Invalid license format. Must start with PMOTOR- and end with -WIFI.',
    };
  }

  const parts = trimmed.split('-');
  if (parts.length !== 6) {
    return {
      valid: false,
      message: 'License key structure invalid. Format: PMOTOR-[TIER]-[XXXX]-[XXXX]-[XXXX]-WIFI',
    };
  }

  const tierCode = parts[1];
  let tierName: LicenseTier = 'Standard';
  let maxRpm = 1500;
  let features = ['WiFi Telemetry', 'Basic Stepping'];

  if (tierCode === 'IND') {
    tierName = 'Industrial Enterprise';
    maxRpm = 12000;
    features = [
      'WiFi Telemetry',
      'MQTT Streaming',
      'PID Micro-Stepping',
      'OTA Remote Flash',
      'CAN-Bus Bridge',
      'Emergency Braking Assist',
      'Thermal Auto-Throttling',
    ];
  } else if (tierCode === 'PRO') {
    tierName = 'Professional';
    maxRpm = 4500;
    features = ['WiFi Telemetry', 'MQTT Streaming', 'PID Micro-Stepping', 'OTA Remote Flash'];
  } else if (tierCode === 'DEV') {
    tierName = 'Developer';
    maxRpm = 3000;
    features = ['WiFi Telemetry', 'PID Micro-Stepping', 'Debug Console', 'API Webhooks'];
  } else if (tierCode === 'STD') {
    tierName = 'Standard';
    maxRpm = 1500;
  } else {
    return {
      valid: false,
      message: `Unrecognized license tier code: ${tierCode}. Must be STD, PRO, IND, or DEV.`,
    };
  }

  // Check against database if registered
  const matched = licensesDatabase.find((lic) => lic.licenseKey.toUpperCase() === trimmed);
  if (matched) {
    if (matched.status === 'revoked') {
      return {
        valid: false,
        message: 'License has been explicitly REVOKED by the administrator.',
      };
    }
    const isExpired = new Date(matched.expiresDate).getTime() < Date.now();
    if (isExpired) {
      return {
        valid: false,
        message: `License EXPIRED on ${matched.expiresDate}. Please renew to uncap motor speed.`,
        payload: {
          tier: matched.tier,
          boundMac: matched.boundMacAddress,
          maxRpm: matched.maxRpm,
          expires: matched.expiresDate,
          features: matched.allowedFeatures,
          isExpired: true,
        },
      };
    }

    if (targetMac && matched.boundMacAddress !== '*' && matched.boundMacAddress !== targetMac) {
      return {
        valid: false,
        message: `Hardware MAC mismatch! This license is locked to ${matched.boundMacAddress}, but device is ${targetMac}.`,
      };
    }

    return {
      valid: true,
      message: `Verified authentic ${matched.tier} license registered to ${matched.clientName}.`,
      payload: {
        tier: matched.tier,
        boundMac: matched.boundMacAddress,
        maxRpm: matched.maxRpm,
        expires: matched.expiresDate,
        features: matched.allowedFeatures,
        isExpired: false,
      },
    };
  }

  // Unregistered but syntactically valid wildcard/standalone key
  return {
    valid: true,
    message: `Valid algorithmic ${tierName} key. Unregistered standalone token.`,
    payload: {
      tier: tierName,
      boundMac: targetMac || 'Unbound (Global)',
      maxRpm,
      expires: '2027-12-31',
      features,
      isExpired: false,
    },
  };
}
