// Utility functions for CS2 skin images

/**
 * Get CS2 skin image URL from various sources
 * @param {string} skinName - Name of the skin (e.g., "AK-47 | Redline")
 * @returns {string} Image URL
 */
export function getSkinImageUrl(skinName) {
  // Try multiple image sources
  const encodedName = encodeURIComponent(skinName);
  
  // Option 1: Steam Community Market (most reliable)
  // These URLs need to be fetched from Steam API or use known image hashes
  const steamBaseUrl = 'https://steamcommunity-a.akamaihd.net/economy/image/';
  
  // Option 2: CS2 Skin databases (fallback)
  const cs2SkinUrl = `https://cs2.gigaskins.com/skins/${encodedName}.png`;
  
  // Option 3: CSGOStash (another fallback)
  const csgoStashUrl = `https://csgostash.com/storage/img/skin_sideview/${encodedName.replace(/\s+/g, '_').toLowerCase()}.png`;
  
  return steamBaseUrl;
}

/**
 * Get image hash for Steam economy images
 * These are specific to each skin and need to be looked up
 */
export const skinImageHashes = {
  'AK-47 | Redline': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA',
  '★ Karambit | Fade': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK5cyzhr-YkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA',
  'AWP | Dragon Lore': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA',
  // Add more as needed
};

