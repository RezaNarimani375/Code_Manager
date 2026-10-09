import { TierCode, LicenseFormat, LicenseDuration } from './utils/crypto';

export type LicenseStatus = 'active' | 'expired' | 'revoked';

export interface DiagLicenseRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceCode: string;
  tier: TierCode;
  format: LicenseFormat;
  duration: LicenseDuration;
  activationCode: string;
  hexHash: string;
  issueDateShamsi: string;
  issueDateGregorian: string;
  expiryDateShamsi: string;
  expiryDateGregorian: string;
  status: LicenseStatus;
  notes?: string;
}

export interface AppSettings {
  masterSecretKey: string;
  autoSaveToHistory: boolean;
  defaultFormat: LicenseFormat;
  defaultDuration: LicenseDuration;
}
