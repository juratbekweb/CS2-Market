// CS2 Skin Images - Using reliable image sources
// Using placeholder service that will show proper CS2 skin names until real images are added

const getImageUrl = (skinName) => {
  // For now, use a placeholder service that shows the skin name
  // In production, replace these with actual CS2 skin image URLs from:
  // - Steam Community Market API
  // - CS2 skin databases (cs2skinsdb.com, gigaskins.com)
  // - Or host images locally in public/images/skins/
  const encodedName = encodeURIComponent(skinName);
  return `https://via.placeholder.com/400x300/1a1a2e/00ff88?text=${encodedName}`;
};

export const products = [
  {
    id: 1,
    name: 'AK-47 | Redline',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.15,
    price: 125.50,
    image: getImageUrl('AK-47 | Redline'),
    category: 'rifles',
    description: 'The AK-47 | Redline is one of the most iconic and sought-after skins in Counter-Strike 2.',
    stats: {
      float: 0.15023456,
      pattern: 661,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 2,
    name: '★ Karambit | Fade',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 2450.00,
    image: getImageUrl('★ Karambit | Fade'),
    category: 'knives',
    description: 'A rare and highly sought-after knife skin with a beautiful fade pattern.',
    stats: {
      float: 0.01000000,
      pattern: 412,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 3,
    name: 'AWP | Dragon Lore',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.08,
    price: 3200.00,
    image: getImageUrl('AWP | Dragon Lore'),
    category: 'rifles',
    description: 'The legendary AWP Dragon Lore, one of the most expensive skins in CS2.',
    stats: {
      float: 0.08000000,
      pattern: 103,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 4,
    name: 'Sport Gloves | Pandora\'s Box',
    rarity: 'classified',
    condition: 'Field-Tested',
    float: 0.22,
    price: 890.00,
    image: getImageUrl('Sport Gloves | Pandora\'s Box'),
    category: 'gloves',
    description: 'Premium sport gloves with an intricate design pattern.',
    stats: {
      float: 0.22000000,
      pattern: 789,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 5,
    name: 'M4A4 | Howl',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.02,
    price: 450.00,
    image: getImageUrl('M4A4 | Howl'),
    category: 'rifles',
    description: 'A rare and discontinued skin, highly valued by collectors.',
    stats: {
      float: 0.02000000,
      pattern: 234,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 6,
    name: 'Glock-18 | Fade',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 380.00,
    image: getImageUrl('Glock-18 | Fade'),
    category: 'pistols',
    description: 'A beautiful fade pattern on the Glock-18.',
    stats: {
      float: 0.01000000,
      pattern: 567,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 7,
    name: 'AK-47 | Vulcan',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.10,
    price: 98.00,
    image: getImageUrl('AK-47 | Vulcan'),
    category: 'rifles',
    description: 'A popular AK-47 skin with a futuristic design.',
    stats: {
      float: 0.10000000,
      pattern: 445,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 8,
    name: 'Desert Eagle | Blaze',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 220.00,
    image: getImageUrl('Desert Eagle | Blaze'),
    category: 'pistols',
    description: 'A fiery design on the Desert Eagle.',
    stats: {
      float: 0.01000000,
      pattern: 123,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 9,
    name: 'AWP | Asiimov',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.18,
    price: 45.00,
    image: getImageUrl('AWP | Asiimov'),
    category: 'rifles',
    description: 'A popular futuristic AWP skin.',
    stats: {
      float: 0.18000000,
      pattern: 890,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 10,
    name: 'M4A1-S | Icarus Fell',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.02,
    price: 85.00,
    image: getImageUrl('M4A1-S | Icarus Fell'),
    category: 'rifles',
    description: 'A beautiful gradient design on the M4A1-S.',
    stats: {
      float: 0.02000000,
      pattern: 334,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 11,
    name: '★ Butterfly Knife | Fade',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 1850.00,
    image: getImageUrl('★ Butterfly Knife | Fade'),
    category: 'knives',
    description: 'A stunning butterfly knife with fade pattern.',
    stats: {
      float: 0.01000000,
      pattern: 678,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 12,
    name: 'USP-S | Kill Confirmed',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.09,
    price: 65.00,
    image: getImageUrl('USP-S | Kill Confirmed'),
    category: 'pistols',
    description: 'A tactical design on the USP-S.',
    stats: {
      float: 0.09000000,
      pattern: 112,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  }
]

export const categories = [
  { id: 'rifles', name: 'Rifles', icon: 'fa-gun', count: 12450 },
  { id: 'knives', name: 'Knives', icon: 'fa-sword', count: 3200 },
  { id: 'pistols', name: 'Pistols', icon: 'fa-handgun', count: 8900 },
  { id: 'gloves', name: 'Gloves', icon: 'fa-hand-paper', count: 2100 },
  { id: 'smgs', name: 'SMGs', icon: 'fa-gun', count: 5600 },
  { id: 'heavy', name: 'Heavy', icon: 'fa-shield-alt', count: 3800 },
]
