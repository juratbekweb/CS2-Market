/**
 * Provably Fair System
 * 
 * Uses HMAC-SHA256 to generate verifiable random outcomes.
 * Users can verify any result using:  serverSeed + clientSeed + nonce
 * 
 * Flow:
 * 1. Server generates a serverSeed and gives user the HASH
 * 2. User sets their own clientSeed
 * 3. On each roll: HMAC(serverSeed, clientSeed:nonce) → deterministic roll
 * 4. After round, server reveals serverSeed for verification
 */

import crypto from "crypto";

/** Generate a cryptographically secure server seed */
export function generateServerSeed(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Hash a server seed (shown to user before the game) */
export function hashServerSeed(seed: string): string {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

/** Generate a default client seed */
export function generateClientSeed(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Generate a deterministic roll between 0 and 100 (inclusive, 2 decimal places)
 * 
 * @param serverSeed - Secret server seed
 * @param clientSeed - User's client seed
 * @param nonce - Incrementing counter per seed pair
 * @returns A number between 0.00 and 100.00
 */
export function generateRoll(serverSeed: string, clientSeed: string, nonce: number): number {
  const hmac = crypto.createHmac("sha256", serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);
  const hex = hmac.digest("hex");

  // Take first 8 hex chars → 32-bit integer → map to 0–10000 → divide by 100
  const int = parseInt(hex.substring(0, 8), 16);
  const roll = (int % 10001) / 100;
  return Math.round(roll * 100) / 100;
}

/**
 * Verify a previously recorded result
 * Anyone can call this with the revealed serverSeed
 */
export function verifyRoll(
  serverSeed: string,
  serverSeedHash: string,
  clientSeed: string,
  nonce: number,
  expectedRoll: number,
): boolean {
  // Verify the server seed matches its hash
  if (hashServerSeed(serverSeed) !== serverSeedHash) return false;

  // Verify the roll
  const actualRoll = generateRoll(serverSeed, clientSeed, nonce);
  return Math.abs(actualRoll - expectedRoll) < 0.01;
}
