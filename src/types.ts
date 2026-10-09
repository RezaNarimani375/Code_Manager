export type MotorStatus = 'online' | 'idle' | 'running' | 'error' | 'offline';
export type LicenseStatus = 'licensed' | 'expired' | 'unlicensed' | 'trial';
export type LicenseTier = 'Standard' | 'Professional' | 'Industrial Enterprise' | 'Developer';

export interface WiFiPMotorDevice {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  firmwareVersion: string;
  motorType: 'Brushless DC' | 'Bipolar Stepper' | 'High-Torque Servo' | 'AC Induction Variable';
  status: MotorStatus;
  licenseStatus: LicenseStatus;
  licenseKey?: string;
  currentRpm: number;
  targetRpm: number;
  maxRpmLimit: number;
  torqueNm: number;
  tempCelsius: number;
  voltage: number;
  currentAmps: number;
  wifiSignalDbm: number;
  direction: 'CW' | 'CCW';
  lastPing: string;
}

export interface MotorLicense {
  id: string;
  licenseKey: string;
  clientName: string;
  tier: LicenseTier;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  boundMacAddress: string;
  issuedDate: string;
  expiresDate: string;
  maxRpm: number;
  maxTorqueNm: number;
  allowedFeatures: string[];
  signatureHash: string;
  notes?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: 'arduino' | 'micropython' | 'json' | 'gcode' | 'bash';
  category: 'License Verification' | 'Motor Control' | 'WiFi Networking' | 'Telemetry & MQTT' | 'Safety Routine';
  description: string;
  code: string;
  tags: string[];
  updatedAt: string;
}

export interface LicenseValidationResult {
  valid: boolean;
  message: string;
  payload?: {
    tier: string;
    boundMac: string;
    maxRpm: number;
    expires: string;
    features: string[];
    isExpired: boolean;
  };
}
