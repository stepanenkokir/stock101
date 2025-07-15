import crypto from "crypto";

/**
 * Verify Telegram Web App initData according to official docs.
 * @param {string} initData - Raw initData string received from Telegram.
 * @param {string} botToken - Bot token from @BotFather.
 * @returns {boolean} True if signature is valid.
 */
export function verifyInitData(initData, botToken) {
  if (!initData || !botToken) return false;

  // Parse parameters
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  if (!hash) return false;
  urlParams.delete("hash");

  // Build data check string (key=value sorted by key)
  const dataCheckString = [...urlParams.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  // Secret key = HMAC-SHA256 of botToken using 'WebAppData' as key
  const secretKey = crypto.createHash("sha256").update(botToken).digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === hash;
}

/**
 * Extract user object from initData.
 * Returns null if not present or failed to parse.
 */
export function extractUser(initData) {
  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get("user");
    if (userParam) {
      return JSON.parse(decodeURIComponent(userParam));
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}
