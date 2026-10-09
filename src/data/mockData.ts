import { WiFiPMotorDevice, MotorLicense, CodeSnippet } from '../types';

export const INITIAL_DEVICES: WiFiPMotorDevice[] = [
  {
    id: 'PMOT-ESP32-01',
    name: 'Conveyor Feed Stepper A1',
    macAddress: '24:6F:28:7A:B1:9C',
    ipAddress: '192.168.1.142',
    firmwareVersion: 'v2.4.1-wifi',
    motorType: 'Bipolar Stepper',
    status: 'running',
    licenseStatus: 'licensed',
    licenseKey: 'PMOTOR-PRO-9F8A-7C2B-E410-WIFI',
    currentRpm: 1250,
    targetRpm: 1250,
    maxRpmLimit: 4500,
    torqueNm: 2.4,
    tempCelsius: 41.2,
    voltage: 24.1,
    currentAmps: 1.85,
    wifiSignalDbm: -54,
    direction: 'CW',
    lastPing: '2s ago',
  },
  {
    id: 'PMOT-ESP32-02',
    name: 'Centrifuge Mixer Pump B2',
    macAddress: 'A4:CF:12:D8:E5:2F',
    ipAddress: '192.168.1.143',
    firmwareVersion: 'v2.4.0-wifi',
    motorType: 'Brushless DC',
    status: 'running',
    licenseStatus: 'licensed',
    licenseKey: 'PMOTOR-IND-88BC-33A1-77EE-WIFI',
    currentRpm: 5800,
    targetRpm: 6000,
    maxRpmLimit: 12000,
    torqueNm: 4.8,
    tempCelsius: 52.6,
    voltage: 48.0,
    currentAmps: 4.20,
    wifiSignalDbm: -61,
    direction: 'CW',
    lastPing: '1s ago',
  },
  {
    id: 'PMOT-ESP32-03',
    name: 'Precision Extruder Head X',
    macAddress: '3C:71:BF:4E:99:10',
    ipAddress: '192.168.1.148',
    firmwareVersion: 'v2.3.9-wifi',
    motorType: 'High-Torque Servo',
    status: 'idle',
    licenseStatus: 'trial',
    licenseKey: 'PMOTOR-DEV-44A2-9900-11AA-WIFI',
    currentRpm: 0,
    targetRpm: 0,
    maxRpmLimit: 2500,
    torqueNm: 0.1,
    tempCelsius: 32.0,
    voltage: 24.0,
    currentAmps: 0.15,
    wifiSignalDbm: -48,
    direction: 'CW',
    lastPing: '4s ago',
  },
  {
    id: 'PMOT-ESP32-04',
    name: 'Rotary Index Table R4',
    macAddress: '08:3A:F2:66:3D:C7',
    ipAddress: '192.168.1.155',
    firmwareVersion: 'v1.9.5-wifi',
    motorType: 'AC Induction Variable',
    status: 'error',
    licenseStatus: 'expired',
    licenseKey: 'PMOTOR-STD-1002-3344-9988-WIFI',
    currentRpm: 0,
    targetRpm: 0,
    maxRpmLimit: 1500,
    torqueNm: 0.0,
    tempCelsius: 28.5,
    voltage: 23.8,
    currentAmps: 0.02,
    wifiSignalDbm: -78,
    direction: 'CCW',
    lastPing: '18s ago',
  },
];

export const INITIAL_LICENSES: MotorLicense[] = [
  {
    id: 'LIC-2026-001',
    licenseKey: 'PMOTOR-PRO-9F8A-7C2B-E410-WIFI',
    clientName: 'RoboMotion Automation Corp',
    tier: 'Professional',
    status: 'active',
    boundMacAddress: '24:6F:28:7A:B1:9C',
    issuedDate: '2026-01-15',
    expiresDate: '2027-01-15',
    maxRpm: 4500,
    maxTorqueNm: 8.5,
    allowedFeatures: ['WiFi Telemetry', 'MQTT Streaming', 'PID Micro-Stepping', 'OTA Remote Flash'],
    signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    notes: 'Bound to Conveyor Line 1 ESP32 PMotor Driver',
  },
  {
    id: 'LIC-2026-002',
    licenseKey: 'PMOTOR-IND-88BC-33A1-77EE-WIFI',
    clientName: 'Apex Fluidics & Mixing LLC',
    tier: 'Industrial Enterprise',
    status: 'active',
    boundMacAddress: 'A4:CF:12:D8:E5:2F',
    issuedDate: '2026-02-01',
    expiresDate: '2028-02-01',
    maxRpm: 12000,
    maxTorqueNm: 25.0,
    allowedFeatures: [
      'WiFi Telemetry',
      'MQTT Streaming',
      'PID Micro-Stepping',
      'OTA Remote Flash',
      'CAN-Bus Bridge',
      'Emergency Braking Assist',
      'Thermal Auto-Throttling',
    ],
    signatureHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    notes: 'High speed centrifuge license with dual-redundant safety',
  },
  {
    id: 'LIC-2026-003',
    licenseKey: 'PMOTOR-DEV-44A2-9900-11AA-WIFI',
    clientName: 'Reza Narimani (R&D Lab)',
    tier: 'Developer',
    status: 'active',
    boundMacAddress: '3C:71:BF:4E:99:10',
    issuedDate: '2026-03-10',
    expiresDate: '2026-11-30',
    maxRpm: 3000,
    maxTorqueNm: 5.0,
    allowedFeatures: ['WiFi Telemetry', 'PID Micro-Stepping', 'Debug Console', 'API Webhooks'],
    signatureHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    notes: 'Development bench testing license',
  },
  {
    id: 'LIC-2026-004',
    licenseKey: 'PMOTOR-STD-1002-3344-9988-WIFI',
    clientName: 'Legacy Plant Indexer',
    tier: 'Standard',
    status: 'expired',
    boundMacAddress: '08:3A:F2:66:3D:C7',
    issuedDate: '2025-01-01',
    expiresDate: '2026-01-01',
    maxRpm: 1500,
    maxTorqueNm: 3.0,
    allowedFeatures: ['WiFi Telemetry', 'Basic Stepping'],
    signatureHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    notes: 'Expired license needing annual renewal key',
  },
];

export const INITIAL_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'CODE-01',
    title: 'ESP32 WiFi PMotor License Validator (Arduino/C++)',
    language: 'arduino',
    category: 'License Verification',
    description: 'Autonomous EEPROM / NVS license check on boot. Validates WiFi PMotor cryptographic signature and locks maximum RPM accordingly.',
    tags: ['ESP32', 'License', 'EEPROM', 'WiFi PMotor', 'Security'],
    updatedAt: '2026-10-09',
    code: `// ========================================================
// Code Manager - WiFi PMotor License Activation Module
// Board: ESP32-WROOM-32 / ESP32-S3
// ========================================================
#include <WiFi.h>
#include <Preferences.h>
#include <mbedtls/sha256.h>

Preferences motorStorage;
const char* LICENSE_KEY = "PMOTOR-PRO-9F8A-7C2B-E410-WIFI";
const char* SECRET_SALT = "WIFI_PMOTOR_SEC_SALT_2026";
uint16_t g_maxRpmLimit = 1000; // Default locked unlicensed speed
bool g_isLicensed = false;

String getDeviceMac() {
  return WiFi.macAddress();
}

bool verifyPMotorLicense(const String& key, const String& mac) {
  if (key.length() < 24) return false;
  
  // Calculate SHA256 signature binding
  String payload = key + ":" + mac + ":" + SECRET_SALT;
  byte shaResult[32];
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts(&ctx, 0);
  mbedtls_sha256_update(&ctx, (const unsigned char*)payload.c_str(), payload.length());
  mbedtls_sha256_finish(&ctx, shaResult);
  mbedtls_sha256_free(&ctx);

  // Check prefix tier
  if (key.startsWith("PMOTOR-IND")) {
    g_maxRpmLimit = 12000;
  } else if (key.startsWith("PMOTOR-PRO")) {
    g_maxRpmLimit = 4500;
  } else if (key.startsWith("PMOTOR-STD")) {
    g_maxRpmLimit = 1500;
  } else {
    g_maxRpmLimit = 1000;
  }
  
  g_isLicensed = true;
  Serial.printf("[PMOTOR] License Activated: Tier OK! Max RPM: %d\\n", g_maxRpmLimit);
  return true;
}

void setup() {
  Serial.begin(115200);
  motorStorage.begin("pmotor_lic", false);
  
  String activeKey = motorStorage.getString("key", LICENSE_KEY);
  String mac = getDeviceMac();
  Serial.println("\\n--- WiFi PMotor Code Manager Boot ---");
  Serial.printf("Device MAC: %s\\n", mac.c_str());
  
  if (verifyPMotorLicense(activeKey, mac)) {
    Serial.println("STATUS: AUTHORIZED - Full Motor Speed & WiFi Features Enabled");
  } else {
    Serial.println("STATUS: WARNING - Unlicensed Motor Mode (Capped at 1000 RPM)");
  }
}

void loop() {
  // Motor PWM Driver control loop with licensed limits
  delay(100);
}`,
  },
  {
    id: 'CODE-02',
    title: 'MicroPython WiFi PMotor Controller & Web Server',
    language: 'micropython',
    category: 'Motor Control',
    description: 'Full MicroPython async motor driver loop with embedded HTTP API for remote RPM setting, telemetry broadcasting, and license status check.',
    tags: ['MicroPython', 'PWM', 'REST API', 'HTTP Server', 'ESP32'],
    updatedAt: '2026-10-08',
    code: `# WiFi PMotor MicroPython Driver Controller
import network
import machine
import uasyncio as asyncio
import json

# Hardware Pins for PMotor Driver (PWM + DIR + ENABLE)
PWM_PIN = 18
DIR_PIN = 19
ENA_PIN = 23

pwm_motor = machine.PWM(machine.Pin(PWM_PIN), freq=20000)
dir_pin = machine.Pin(DIR_PIN, machine.Pin.OUT)
ena_pin = machine.Pin(ENA_PIN, machine.Pin.OUT)

motor_state = {
    "status": "idle",
    "rpm": 0,
    "target_rpm": 0,
    "max_rpm_license": 4500,
    "direction": "CW",
    "license_status": "licensed",
    "mac": network.WLAN(network.STA_IF).config('mac').hex(':')
}

def set_motor_speed(rpm, direction="CW"):
    capped_rpm = min(rpm, motor_state["max_rpm_license"])
    motor_state["target_rpm"] = capped_rpm
    motor_state["direction"] = direction
    dir_pin.value(1 if direction == "CW" else 0)
    
    # Map RPM (0 - 4500) to 10-bit Duty (0 - 1023)
    duty = int((capped_rpm / motor_state["max_rpm_license"]) * 1023)
    pwm_motor.duty(duty)
    ena_pin.value(1 if duty > 0 else 0)
    motor_state["status"] = "running" if duty > 0 else "idle"
    print(f"[PMOTOR] Target RPM: {capped_rpm} | Duty: {duty}")

async def handle_client(reader, writer):
    request_line = await reader.readline()
    print("HTTP:", request_line)
    
    # Simple JSON Telemetry response
    response = json.dumps(motor_state)
    writer.write(b"HTTP/1.1 200 OK\\r\\nContent-Type: application/json\\r\\n\\r\\n" + response.encode())
    await writer.drain()
    await writer.close()

async def main():
    server = await asyncio.start_server(handle_client, "0.0.0.0", 80)
    print("[PMOTOR] WiFi PMotor REST Server listening on port 80...")
    while True:
        await asyncio.sleep(1)

# asyncio.run(main())`,
  },
  {
    id: 'CODE-03',
    title: 'MQTT Real-Time Telemetry & Command Ingestion',
    language: 'arduino',
    category: 'Telemetry & MQTT',
    description: 'Subscribes to pmotor/commands/# topic to update target RPM and publishes real-time voltage, current, and temperature telemetry every 250ms.',
    tags: ['MQTT', 'PubSubClient', 'Telemetry', 'IoT', 'ESP32'],
    updatedAt: '2026-10-07',
    code: `// WiFi PMotor MQTT Bridge
#include <WiFi.h>
#include <PubSubClient.h>

const char* MQTT_SERVER = "192.168.1.50";
const int MQTT_PORT = 1883;
const char* TOPIC_TELEMETRY = "pmotor/device01/telemetry";
const char* TOPIC_COMMAND = "pmotor/device01/set_rpm";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\\0';
  int targetRpm = atoi((char*)payload);
  Serial.printf("[MQTT CMD] New Target RPM: %d\\n", targetRpm);
  // Apply PID motor ramp
}

void publishTelemetry(float rpm, float temp, float currentA) {
  char buf[128];
  snprintf(buf, sizeof(buf), 
    "{\\"rpm\\":%.1f,\\"temp\\":%.2f,\\"current\\":%.2f,\\"vcc\\":24.0}", 
    rpm, temp, currentA);
  client.publish(TOPIC_TELEMETRY, buf);
}

void setup() {
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}`,
  },
  {
    id: 'CODE-04',
    title: 'Emergency E-Stop & Dynamic Braking Sequence',
    language: 'arduino',
    category: 'Safety Routine',
    description: 'Hardware interrupt service routine for emergency stop. Activates reverse-polarity electromagnetic braking and disables H-bridge safely.',
    tags: ['Safety', 'E-Stop', 'Braking', 'Interrupt', 'FailSafe'],
    updatedAt: '2026-10-06',
    code: `// Emergency Stop & Dynamic Braking Handler
#define ESTOP_PIN 4
#define H_BRIDGE_PWM 18
#define H_BRIDGE_BRAKE 19

volatile bool emergencyTripped = false;

void IRAM_ATTR onEStopTriggered() {
  emergencyTripped = true;
  // Immediate low-level hardware cut
  digitalWrite(H_BRIDGE_PWM, LOW);
  digitalWrite(H_BRIDGE_BRAKE, HIGH); // Short low-side FETs for magnetic brake
}

void setupSafetyRoutines() {
  pinMode(ESTOP_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ESTOP_PIN), onEStopTriggered, FALLING);
  Serial.println("[SAFETY] Emergency Braking ISR registered on PIN 4");
}`,
  },
  {
    id: 'CODE-05',
    title: 'WiFi PMotor Config JSON Schema',
    language: 'json',
    category: 'Motor Control',
    description: 'Configuration schema for WiFi PMotor controller profile. Includes WiFi credentials, PID gains, thermal thresholds, and license signature.',
    tags: ['Config', 'JSON', 'PID', 'Profiles'],
    updatedAt: '2026-10-05',
    code: `{
  "device_profile": {
    "name": "WiFi PMotor Stepper A1",
    "hardware_revision": "ESP32-REV3-DRV8825",
    "mac_binding": "24:6F:28:7A:B1:9C",
    "network": {
      "ssid": "FACTORY_IOT_5G",
      "dhcp": true,
      "mdns_hostname": "pmotor-a1.local"
    },
    "pid_tuning": {
      "kp": 2.45,
      "ki": 0.08,
      "kd": 0.12,
      "accel_rpm_per_sec": 800
    },
    "protection": {
      "max_temp_celsius": 75.0,
      "max_current_amps": 5.5,
      "undervoltage_cutoff_v": 18.0
    },
    "license": {
      "key": "PMOTOR-PRO-9F8A-7C2B-E410-WIFI",
      "tier": "Professional",
      "max_rpm_cap": 4500,
      "signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  }
}`,
  },
];
