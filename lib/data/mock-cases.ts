export const mockCases = [
  {
    id: "case-1",
    name: "Phantom Collection",
    slug: "phantom-collection",
    price: 4.99,
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQxnaebIzNHu4y0mNnblfP1mr7TlDkEucJw0-yRptjz2lHi-ko6YW2hIN_BcFRtN1-Brlm-x731/256fx256f",
    isActive: true,
    itemCount: 9,
    bestDrop: "AWP | Fade",
    bestDropValue: 89.99,
  },
  {
    id: "case-2",
    name: "Neon Rush",
    slug: "neon-rush",
    price: 2.49,
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZvq68KVAzjqbXITNA6Y_nwtaIj_H0NuvUkjMIvZQp2rmWpY2iiQbhqUY4a2HzLYPGJg5rNAnR_la5kL_u0ceh4J4_/256fx256f",
    isActive: true,
    itemCount: 9,
    bestDrop: "Knife | Fade",
    bestDropValue: 45.00,
  },
  {
    id: "case-3",
    name: "Dragon Lore Collection",
    slug: "dragon-lore",
    price: 9.99,
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUw1qefJDQWvN3ixNbbwb-gNumIlTME6sYi3u-Wpd-h3lDt-EE_a2HwLIfGcg9rYg7WrAC6k-y5xIjoMUA/256fx256f",
    isActive: true,
    itemCount: 9,
    bestDrop: "AWP | Dragon Lore",
    bestDropValue: 1299.99,
  },
  {
    id: "case-4",
    name: "Budget Blaster",
    slug: "budget-blaster",
    price: 0.99,
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUxnakbKjNA4_6wltTdx6OkMe-Hwz4BvZR23+uUpNqijQ3n8xJva2zxINGOJwdvNQ3SrwDqx+29h8DuvA/256fx256f",
    isActive: true,
    itemCount: 9,
    bestDrop: "AWP | Hyper Beast",
    bestDropValue: 12.50,
  },
];

const imgAwp = "/skins/awp-dragon-lore.png";
const imgAk = "/skins/rifle.png";
const imgKarambit = "/skins/karambit-fade.png";
const imgGloves1 = "/skins/sport-gloves-vice.webp";
const imgGloves2 = "/skins/sport-gloves-pandoras-box.webp";
const imgPistol = "/skins/pistol.png";
const imgSticker = "/skins/sticker.png";
const imgAgent = "/skins/agent.png";

// These correspond to DB Skin objects that we will seed.
export const mockCaseItemsData = {
  "phantom-collection": [
    { skinId: "skin-c1-1", name: "P250 | Sand Dune", image: imgPistol, price: 0.50, category: "Pistol", rarity: "COMMON", dropRate: 0.25 },
    { skinId: "skin-c1-2", name: "MP7 | Forest DDPAT", image: imgAk, price: 0.75, category: "SMG", rarity: "COMMON", dropRate: 0.25 },
    { skinId: "skin-c1-3", name: "USP-S | Blueprint", image: imgPistol, price: 3.50, category: "Pistol", rarity: "RARE", dropRate: 0.15 },
    { skinId: "skin-c1-4", name: "M4A1-S | Decimator", image: imgAk, price: 8.00, category: "Rifle", rarity: "RARE", dropRate: 0.10 },
    { skinId: "skin-c1-5", name: "AK-47 | Phantom Disruptor", image: imgAk, price: 22.00, category: "Rifle", rarity: "EPIC", dropRate: 0.08 },
    { skinId: "skin-c1-6", name: "Sticker | Titan", image: imgSticker, price: 45.00, category: "Sticker", rarity: "EPIC", dropRate: 0.02 },
    { skinId: "skin-c1-7", name: "AWP | Fade", image: imgAwp, price: 89.99, category: "Sniper Rifle", rarity: "LEGENDARY", dropRate: 0.05 },
    { skinId: "skin-c1-8", name: "Desert Eagle | Printstream", image: imgPistol, price: 90.00, category: "Pistol", rarity: "RARE", dropRate: 0.05 },
    { skinId: "skin-c1-9", name: "USP-S | Kill Confirmed", image: imgPistol, price: 150.00, category: "Pistol", rarity: "RARE", dropRate: 0.05 },
  ],
  "neon-rush": [
    { skinId: "skin-c2-1", name: "Glock-18 | Candy Apple", image: imgPistol, price: 0.30, category: "Pistol", rarity: "COMMON", dropRate: 0.30 },
    { skinId: "skin-c2-2", name: "MAC-10 | Neon Rider", image: imgAk, price: 0.60, category: "SMG", rarity: "COMMON", dropRate: 0.20 },
    { skinId: "skin-c2-3", name: "Five-SeveN | Neon Kimono", image: imgPistol, price: 4.00, category: "Pistol", rarity: "RARE", dropRate: 0.15 },
    { skinId: "skin-c2-4", name: "M4A4 | Neo-Noir", image: imgAk, price: 9.00, category: "Rifle", rarity: "RARE", dropRate: 0.10 },
    { skinId: "skin-c2-5", name: "Agent | Darryl", image: imgAgent, price: 25.00, category: "Agent", rarity: "EPIC", dropRate: 0.08 },
    { skinId: "skin-c2-6", name: "AWP | Neo-Noir", image: imgAwp, price: 35.00, category: "Sniper Rifle", rarity: "EPIC", dropRate: 0.02 },
    { skinId: "skin-c2-7", name: "Knife | Fade", image: imgKarambit, price: 45.00, category: "Knife", rarity: "LEGENDARY", dropRate: 0.05 },
    { skinId: "skin-c2-8", name: "M4A1-S | Printstream", image: imgAk, price: 180.00, category: "Rifle", rarity: "RARE", dropRate: 0.05 },
    { skinId: "skin-c2-9", name: "Galil AR | Eco", image: imgAk, price: 5.00, category: "Rifle", rarity: "RARE", dropRate: 0.05 },
  ],
  "dragon-lore": [
    { skinId: "skin-c3-1", name: "Tec-9 | Sandstorm", image: imgPistol, price: 0.75, category: "Pistol", rarity: "COMMON", dropRate: 0.25 },
    { skinId: "skin-c3-2", name: "Nova | Predator", image: imgAk, price: 1.00, category: "Shotgun", rarity: "COMMON", dropRate: 0.25 },
    { skinId: "skin-c3-3", name: "FAMAS | Mecha Industries", image: imgAk, price: 5.50, category: "Rifle", rarity: "RARE", dropRate: 0.15 },
    { skinId: "skin-c3-4", name: "M4A1-S | Golden Coil", image: imgAk, price: 15.00, category: "Rifle", rarity: "RARE", dropRate: 0.10 },
    { skinId: "skin-c3-5", name: "Sport Gloves | Vice", image: imgGloves1, price: 120.00, category: "Gloves", rarity: "EPIC", dropRate: 0.07 },
    { skinId: "skin-c3-6", name: "Karambit | Doppler", image: imgKarambit, price: 350.00, category: "Knife", rarity: "EPIC", dropRate: 0.03 },
    { skinId: "skin-c3-7", name: "AWP | Dragon Lore", image: imgAwp, price: 1299.99, category: "Sniper Rifle", rarity: "LEGENDARY", dropRate: 0.05 },
    { skinId: "skin-c3-8", name: "AK-47 | Redline", image: imgAk, price: 45.00, category: "Rifle", rarity: "RARE", dropRate: 0.05 },
    { skinId: "skin-c3-9", name: "Glock-18 | Water Elemental", image: imgPistol, price: 12.00, category: "Pistol", rarity: "RARE", dropRate: 0.05 },
  ],
  "budget-blaster": [
    { skinId: "skin-c4-1", name: "P90 | Sand Spray", image: imgAk, price: 0.10, category: "SMG", rarity: "COMMON", dropRate: 0.30 },
    { skinId: "skin-c4-2", name: "SG 553 | Waves", image: imgAk, price: 0.20, category: "Rifle", rarity: "COMMON", dropRate: 0.20 },
    { skinId: "skin-c4-3", name: "Sticker | Titan", image: imgSticker, price: 1.50, category: "Sticker", rarity: "RARE", dropRate: 0.15 },
    { skinId: "skin-c4-4", name: "Agent | Darryl", image: imgAgent, price: 3.00, category: "Agent", rarity: "RARE", dropRate: 0.10 },
    { skinId: "skin-c4-5", name: "SSG 08 | Dragonfire", image: imgAwp, price: 6.00, category: "Sniper Rifle", rarity: "EPIC", dropRate: 0.08 },
    { skinId: "skin-c4-6", name: "Sport Gloves | Box", image: imgGloves2, price: 10.00, category: "Gloves", rarity: "EPIC", dropRate: 0.02 },
    { skinId: "skin-c4-7", name: "AWP | Hyper Beast", image: imgAwp, price: 12.50, category: "Sniper Rifle", rarity: "LEGENDARY", dropRate: 0.05 },
    { skinId: "skin-c4-8", name: "P250 | Valence", image: imgPistol, price: 0.50, category: "Pistol", rarity: "RARE", dropRate: 0.05 },
    { skinId: "skin-c4-9", name: "UMP-45 | Plastique", image: imgAk, price: 1.00, category: "SMG", rarity: "RARE", dropRate: 0.05 },
  ],
};
