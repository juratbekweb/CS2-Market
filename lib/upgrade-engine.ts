/**
 * Upgrade System Engine
 * 
 * Formula: chance = (itemA_value / itemB_value) * (1 - house_edge)
 * 
 * Example:
 *   A = $10, B = $20, house_edge = 0.10
 *   chance = (10/20) * (1 - 0.10) = 0.45 = 45%
 * 
 * The house always has a mathematical edge. 
 * Expected value for the user is always negative.
 */

export interface UpgradeCalculation {
  chance: number;        // Percentage 0-95
  multiplier: number;    // How many X the upgrade is
  maxMultiplier: number; // Maximum allowed multiplier
  isValid: boolean;      // Whether upgrade is allowed
  expectedValue: number; // EV for the user (always negative)
  houseEdge: number;     // House edge applied
}

export interface UpgradeInput {
  itemAValue: number;
  itemBValue: number;
  houseEdge: number;      // 0.05 to 0.20
  maxMultiplier?: number; // default 10
}

/**
 * Calculate upgrade chance and validate the upgrade
 */
export function calculateUpgrade(input: UpgradeInput): UpgradeCalculation {
  const { itemAValue, itemBValue, houseEdge, maxMultiplier = 10 } = input;

  const multiplier = itemBValue / itemAValue;
  const rawChance = (itemAValue / itemBValue) * (1 - houseEdge);
  
  // Clamp chance between 0.01% and 95%
  const chance = Math.min(Math.max(rawChance * 100, 0.01), 95);
  
  // Expected value: (chance of winning * target value) + (chance of losing * -input value)
  const expectedValue = (rawChance * itemBValue) + ((1 - rawChance) * -itemAValue);

  const isValid = 
    itemAValue > 0 &&
    itemBValue > 0 &&
    itemBValue > itemAValue &&
    multiplier <= maxMultiplier &&
    houseEdge >= 0.05 &&
    houseEdge <= 0.20;

  return {
    chance: Math.round(chance * 100) / 100,
    multiplier: Math.round(multiplier * 100) / 100,
    maxMultiplier,
    isValid,
    expectedValue: Math.round(expectedValue * 100) / 100,
    houseEdge,
  };
}

/**
 * Execute the upgrade: compare roll against chance
 * @param chance - The calculated chance percentage (0-100)
 * @param roll - The provably fair roll (0-100)
 * @returns true if WIN, false if LOSE
 */
export function executeUpgrade(chance: number, roll: number): boolean {
  return roll <= chance;
}

/**
 * Get the maximum multiplier based on house edge
 * With 10% edge, max multiplier = 10x (1/0.10)
 */
export function getMaxMultiplier(houseEdge: number): number {
  return Math.floor(1 / houseEdge);
}

/**
 * Calculate the minimum input value needed for a given target and desired chance
 */
export function getMinInputForChance(targetValue: number, desiredChance: number, houseEdge: number): number {
  // chance = (A/B) * (1 - edge) → A = (chance * B) / (1 - edge)
  const minInput = (desiredChance / 100 * targetValue) / (1 - houseEdge);
  return Math.ceil(minInput * 100) / 100;
}
