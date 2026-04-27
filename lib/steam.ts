import { RelyingParty } from "openid";

export function buildSteamClient(returnUrl: string, realm: string) {
  return new RelyingParty(returnUrl, realm, true, false, []);
}

export function extractSteamId(claimedIdentifier?: string | null) {
  if (!claimedIdentifier) return null;
  const match = claimedIdentifier.match(/\/id\/(\d+)$/) ?? claimedIdentifier.match(/\/openid\/id\/(\d+)$/);
  return match?.[1] ?? null;
}
