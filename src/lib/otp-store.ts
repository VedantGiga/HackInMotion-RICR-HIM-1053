import fs from "fs";
import path from "path";

export interface OTPRecord {
  email: string;
  code: string;
  expiresAt: number; // timestamp in ms
  createdAt: number;
}

const OTP_FILE = "/tmp/koshin_otps.json";

const globalForOTP = globalThis as unknown as {
  _otpStore?: Record<string, OTPRecord>;
};

if (!globalForOTP._otpStore) {
  globalForOTP._otpStore = {};
}

function loadOTPsFromFile(): Record<string, OTPRecord> {
  try {
    if (fs.existsSync(OTP_FILE)) {
      const data = fs.readFileSync(OTP_FILE, "utf-8");
      return JSON.parse(data) || {};
    }
  } catch (err) {
    console.warn("[OTPStore] Failed to read OTP file:", err);
  }
  return {};
}

function saveOTPsToFile(store: Record<string, OTPRecord>) {
  try {
    const dir = path.dirname(OTP_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OTP_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("[OTPStore] Failed to write OTP file:", err);
  }
}

export function saveOTPCode(email: string, code: string, durationMinutes = 10): OTPRecord {
  const cleanEmail = email.trim().toLowerCase();
  const now = Date.now();
  const record: OTPRecord = {
    email: cleanEmail,
    code: String(code).trim(),
    expiresAt: now + durationMinutes * 60 * 1000,
    createdAt: now,
  };

  const store = globalForOTP._otpStore || {};
  store[cleanEmail] = record;
  globalForOTP._otpStore = store;

  const fileStore = loadOTPsFromFile();
  fileStore[cleanEmail] = record;
  saveOTPsToFile(fileStore);

  return record;
}

export function verifyOTPCode(email: string, code: string): { success: boolean; error?: string } {
  if (!email || !code) {
    return { success: false, error: "Email and code are required." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = String(code).trim();

  let record = globalForOTP._otpStore?.[cleanEmail];
  if (!record) {
    const fileStore = loadOTPsFromFile();
    record = fileStore[cleanEmail];
  }

  if (!record) {
    return { success: false, error: "No verification code found for this email address." };
  }

  if (Date.now() > record.expiresAt) {
    return { success: false, error: "Verification code has expired. Please request a new code." };
  }

  if (record.code !== cleanCode) {
    return { success: false, error: "Invalid verification code. Please check your inbox and try again." };
  }

  // Clear code after successful verification
  if (globalForOTP._otpStore) {
    delete globalForOTP._otpStore[cleanEmail];
  }
  const fileStore = loadOTPsFromFile();
  if (fileStore[cleanEmail]) {
    delete fileStore[cleanEmail];
    saveOTPsToFile(fileStore);
  }

  return { success: true };
}
