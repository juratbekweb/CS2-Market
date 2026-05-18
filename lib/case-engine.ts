/**
 * Case Opening Engine
 * 
 * Rarity distribution:
 *   COMMON:    60%
 *   RARE:      25%
 *   EPIC:      10%
 *   LEGENDARY:  5%
 * 
 * Total drop expected value MUST be less than case price
 * to ensure platform profitability.
 */

export interface CaseItemDrop {
  id: string;
  skinId: string;
  name: string;
  image: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  dropRate: number; // 0.0 - 1.0
  value: number;
}

export interface CaseData {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  items: CaseItemDrop[];
}

export const RARITY_COLORS: Record<string, string> = {
  COMMON: "#b0bec5",
  RARE: "#4fc3f7",
  EPIC: "#ab47bc",
  LEGENDARY: "#ffd740",
};

export const DEFAULT_DROP_RATES: Record<string, number> = {
  COMMON: 0.60,
  RARE: 0.25,
  EPIC: 0.10,
  LEGENDARY: 0.05,
};

/**
 * Select a drop using weighted random selection
 * 
 * @param items - Array of items with dropRate
 * @param roll - Provably fair roll 0–100
 * @returns The selected item
 */
export function selectDrop(items: CaseItemDrop[], roll: number): CaseItemDrop {
  // Normalize roll to 0–1
  const normalizedRoll = roll / 100;
  
  // Sort by drop rate descending for consistent selection
  const sorted = [...items].sort((a, b) => b.dropRate - a.dropRate);
  
  let cumulative = 0;
  for (const item of sorted) {
    cumulative += item.dropRate;
    if (normalizedRoll <= cumulative) {
      return item;
    }
  }
  
  // Fallback: return the last (rarest) item
  return sorted[sorted.length - 1];
}

/**
 * Validate that a case is profitable for the platform
 * Expected value of drops must be less than case price
 */
export function validateCaseProfitability(casePrice: number, items: CaseItemDrop[]): {
  isValid: boolean;
  expectedValue: number;
  profitMargin: number;
} {
  const expectedValue = items.reduce((sum, item) => sum + item.value * item.dropRate, 0);
  const profitMargin = ((casePrice - expectedValue) / casePrice) * 100;

  return {
    isValid: expectedValue < casePrice,
    expectedValue: Math.round(expectedValue * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
  };
}

/**
 * Validate that total drop rates sum to 1.0 (100%)
 */
export function validateDropRates(items: CaseItemDrop[]): boolean {
  const total = items.reduce((sum, item) => sum + item.dropRate, 0);
  return Math.abs(total - 1.0) < 0.001; // Allow small floating point error
}

/**
 * Generate the "almost win" reel for animation
 * Creates a sequence of items where the winning item is placed near the end
 * with high-rarity items placed near the winning position for excitement
 */
export function generateSpinnerReel(
  items: CaseItemDrop[],
  winningItem: CaseItemDrop,
  reelLength: number = 40,
  winPosition: number = 32,
): CaseItemDrop[] {
  const reel: CaseItemDrop[] = [];

  for (let i = 0; i < reelLength; i++) {
    if (i === winPosition) {
      reel.push(winningItem);
    } else if (i === winPosition - 1 || i === winPosition + 1) {
      // Place epic/legendary items near the winning position for "almost win" effect
      const nearMisses = items.filter(
        (item) => (item.rarity === "EPIC" || item.rarity === "LEGENDARY") && item.id !== winningItem.id,
      );
      if (nearMisses.length > 0) {
        reel.push(nearMisses[Math.floor(Math.random() * nearMisses.length)]);
      } else {
        reel.push(items[Math.floor(Math.random() * items.length)]);
      }
    } else {
      // Fill with weighted random items
      const rand = Math.random();
      let cumulative = 0;
      let selected = items[0];
      for (const item of items) {
        cumulative += item.dropRate;
        if (rand <= cumulative) {
          selected = item;
          break;
        }
      }
      reel.push(selected);
    }
  }

  return reel;
}
