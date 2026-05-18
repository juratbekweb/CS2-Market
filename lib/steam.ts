import { RelyingParty } from "openid";

export function buildSteamClient(returnUrl: string, realm: string) {
  return new RelyingParty(returnUrl, realm, true, false, []);
}

export function extractSteamId(claimedIdentifier?: string | null) {
  if (!claimedIdentifier) return null;
  const match = claimedIdentifier.match(/\/id\/(\d+)$/) ?? claimedIdentifier.match(/\/openid\/id\/(\d+)$/);
  return match?.[1] ?? null;
}

export async function fetchSteamInventory(steamId: string) {
  try {
    const response = await fetch(
      `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=5000`
    );
    
    if (!response.ok) {
      throw new Error(`Steam inventory API returned status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.assets || !data.descriptions) {
      return [];
    }
    
    // Map assets to descriptions
    const inventory = data.assets.map((asset: any) => {
      const description = data.descriptions.find(
        (desc: any) => desc.classid === asset.classid && desc.instanceid === asset.instanceid
      );
      
      // Extract tags (rarity, type, exterior)
      const tags = description?.tags || [];
      const rarity = tags.find((tag: any) => tag.category === "Rarity")?.localized_tag_name;
      const exterior = tags.find((tag: any) => tag.category === "Exterior")?.localized_tag_name;
      const type = tags.find((tag: any) => tag.category === "Type")?.localized_tag_name;
      
      return {
        assetId: asset.assetid,
        classId: asset.classid,
        instanceId: asset.instanceid,
        name: description?.name,
        marketName: description?.market_hash_name,
        image: description?.icon_url ? `https://community.cloudflare.steamstatic.com/economy/image/${description.icon_url}` : null,
        rarity,
        exterior,
        type,
        tradable: description?.tradable === 1,
        marketable: description?.marketable === 1,
      };
    });
    
    return inventory;
  } catch (error) {
    console.error("Error fetching Steam inventory:", error);
    throw error;
  }
}
