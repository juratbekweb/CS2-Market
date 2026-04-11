// Utility functions for CS2 skin images

/**
 * Get CS2 skin image URL from known Steam economy image hashes.
 * @param {string} skinName
 * @returns {string}
 */
export function getSkinImageUrl(skinName) {
  const imageHash = skinImageHashes[skinName]
  if (imageHash) {
    return `https://steamcommunity-a.akamaihd.net/economy/image/${imageHash}`
  }

  return ''
}

export const skinImageHashes = {
  'AK-47 | Redline': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA',
  'Karambit | Fade': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK5cyzhr-YkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA',
  'AWP | Dragon Lore': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA',
}
