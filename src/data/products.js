// CS2 Skin Images - Prefer local images when available, fallback to placeholder service
import { getSkinFallbackImage } from '../utils/imageFallback';
import karambit from '../images/knives/Karambit.jfif';
import m9CrimsonWeb from '../images/knives/M9 Bayonet - Crimson Web.webp';
import talonDamascus from '../images/knives/Talon Knife - Damascus Steel.png';
import huntsmanSlaughter from '../images/knives/HUNTSMAN - Slaughter.webp';
import bowieGamma from '../images/knives/Bowie Knife - Gamma Doppler.png';
import m4a4Howl from '../images/weapons/M4A4  Howl.jfif';
import glockFade from '../images/weapons/Glock-18 Fade.jfif';
import akVulcan from '../images/weapons/AK-47 Vulcan.jfif';
import deBlaze from '../images/weapons/Desert Eagle Blaze.jfif';
import butterflyFade from '../images/knives/★ Butterfly Knife  Fade.jfif';
import uspKill from '../images/weapons/USP-S Kill Confirmed.jfif';
import akRedline from '../images/weapons/AK-47 Redline.webp';
import akCaseHardened from '../images/weapons/AK-47 Case Hardened.png';
import awpAsiimov from '../images/weapons/AWP Asiimov.png';
import awpDragonLore from '../images/weapons/AWP Dragon Lore.webp';
import awpPinkDDPAT from '../images/weapons/AWP-Pink DDPAT.png';
import m4a1DarkWater from '../images/weapons/M4A1-DARK WATER.png';
import m4a1Icarus from '../images/weapons/M4A1-S Icarus Fell.png';
import p2000FireElemental from '../images/weapons/P2000.webp';
import p250Muertos from '../images/weapons/P250-Meurtos.jfif';
import fiveSevenCaseHardened from '../images/weapons/Five-Seven.jfif';
import tec9FuelInjector from '../images/weapons/TEC-9.png';
import mp9Bulldrozer from '../images/weapons/MP9-Bulldrozer.jfif';
import ppBizon from '../images/weapons/PP-BIZON.webp';
import umpBlaze from '../images/weapons/UMP-Blaze.png';
import umpPrimalSaber from '../images/weapons/UMP-45 Primal Saber.png';
import augAkihabara from '../images/weapons/AUG-Akihabara.webp';
import famasCommemoration from '../images/weapons/Famas.webp';
import sawedOffKraken from '../images/weapons/Best Sawed-Off.webp';
import mag7Heat from '../images/weapons/MAC-7.png';
import sportGloves from '../images/gloves/Sport Gloves Pandora\'s Box.webp';
import motoGloves from '../images/gloves/Moto Gloves.png';
import driverGloves from '../images/gloves/Driver - Gloves.jfif';
import crimKimono from '../images/gloves/Crimson Kimono (Minimal-Wear).webp';
import handWrapsCaution from '../images/gloves/GLOW-Hand Wraps-CAUTION.png';
import novaAntique from '../images/gloves/StarTrek-Nova.webp';
import handWrapsOverprint from '../images/gloves/Hand Wraps - Overprint.png';
import motoSmokeOut from '../images/gloves/Moto Gloves - Smoke Out.png';
import sportGlovesVice from '../images/gloves/Sport Gloves  Vice.webp';
import brokenFangJade from '../images/gloves/Broken Fang Gloves  Jade.png';
import specialistGlovesFade from '../images/gloves/Specialist Gloves  Fade.jfif';
import akBloodsport from '../images/weapons/AK-47 Bloodsport.png';
import galilChatterbox from '../images/weapons/Galil Ar Chatterbox.png';
import m4a4Emperor from '../images/weapons/M4A4 The Emperor.jpg';
import uspNeoNoir from '../images/weapons/USP-S Neo-Noir.png';
import m4a1Printstream from '../images/weapons/M4A1-S Printstream.png';
import mac10NeonRider from '../images/weapons/MAC-10 Neon Rider.webp';
import p90DeathByKitty from '../images/weapons/P90 - Death by Kitty.png';
import xm1014Tranquility from '../images/weapons/XM1014 - Tranquility.png';
import negevPowerLoader from '../images/weapons/Negev - Power Loader.webp';
import glockWaterElemental from '../images/weapons/Glock-18 Water Elemental.png';
import xiangliu from '../images/weapons/CZ75 - Auto Xiangliu.png';
import cobraStrike from '../images/weapons/Dual Berettas - Cobra Strike.png';
import seeYaLater from '../images/weapons/P250 - See Ya Later.png';
import desertEagleCodeRed from '../images/weapons/Desert Eagle - Code Red.jfif';
import skeletonSlaughter from '../images/knives/★ Skeleton Knife  Slaughter.jfif';
import bayonetDoppler from '../images/knives/★ Bayonet  Doppler.png';
import flipKnifeLore from '../images/knives/★ Flip Knife  Lore.png';
import nomadCaseHardened from '../images/knives/★ Nomad Knife  Case Hardened.webp';

// Fallback placeholder generator - Using CS2 community images
const normalizeSkinName = (skinName = '') =>
  skinName
    .replace(/в…/g, '★')
    .replace(//g, '|')
    .replace(/пЃј/g, '|')
    .replace(/\s{2,}/g, ' ')
    .trim()

const normalizeResolvedSkinName = (skinName = '') =>
  normalizeSkinName(skinName).replace(/в…/g, '★')

const createImageRegistry = (entries) =>
  Object.entries(entries).reduce((registry, [skinName, image]) => {
    registry[normalizeResolvedSkinName(skinName)] = image
    return registry
  }, {})

const getImageUrl = (skinName) => {
  const normalizedSkinName = normalizeResolvedSkinName(skinName)
  // Try to use community CS2 skin images first
  const communityUrls = createImageRegistry({
    '★ M9 Bayonet | Crimson Web': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJR7c2klb-HnvD8J_WFzn9T5QJRduH3fDO2a1yxuJQoNvFt1L3HFq6n1cFOeU7m1g/360fx360f',
    '★ Talon Knife | Damascus Steel': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    '★ Huntsman Knife | Slaughter': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    '★ Bowie Knife | Gamma Doppler': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Moto Gloves | Bloodhound': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Driver Gloves | Imperial Plaid': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Specialist Gloves | Crimson Kimono': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Hand Wraps | CAUTION!': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'AK-47 | Case Hardened': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7Hviqodci2kb0nZkYO6nYeDg8_jDLfYkWNF18l4jeHVu9T2i6CcqF6tunJqL7rHd1G8n1aL_/360fx360f',
    'M4A1-S | Dark Water': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_6oDLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'AWP | Pink DDPAT': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJR7c2klb-HnvD8J_WFzn9T5QJRduH3fDO2a1yxuJQoNvFt1L3HFq6n1cFOeU7m1g/360fx360f',
    'P2000 | Fire Elemental': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujkfzhjxszceThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Five-SeveN | Case Hardened': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0vL3eYQJR7c2klb-HnvD8J_WFzn9T5QJRduH3fDO2a1yxuJQoNvFt1L3HFq6n1cFOeU7m1g/360fx360f',
    'Tec-9 | Fuel Injector': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuyMdFhjxszceThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'MP9 | Bulldozer': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6mclDh_jbjh-j-4uO1gb-Gw_6oDLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'PP-Bizon | Judgement of Anubis': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'MAG-7 | Heat': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhjxszceThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Sawed-Off | The Kraken': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cCxQ7cG1lYS0m_7zO6_ummpN68J8nHd3ujVxoDChU5SLMNq0eyhJYKd0wUYrF7T_lO9u8nJnXO_/360fx360f',
    'UMP-45 | Blaze': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflhf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'Nova | Antique': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhjxszceThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'P250 | Muertos': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FABz7PLfYQJR7c2klb-HnvD8J_WFzn9T5QJRduH3fDO2a1yxuJQoNvFt1L3HFq6n1cFOeU7m1g/360fx360f',
    'FAMAS | Djinn': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflhf0ebcZThQ6eO6nJaRnvb4DLbUqWNU6dN9t7A37DClT8H6sRqlL-HqUBqN1vZ_1S8w7vm0JfutM6bzHO1/360fx360f',
    'SSG 08 | Dragonfire': 'https://cdn.tradeit.gg/seo%2Fcsgo%2FSSG%2008%20-%20Dragonfire%20(Minimal%20Wear)_1200x628.webp',
    '★ Gut Knife | Marble Fade': 'https://cdn.tradeit.gg/seo%2Fcsgo%2F%E2%98%85%20Gut%20Knife%20-%20Marble%20Fade%20(Factory%20New)_1200x628.webp',
  })
  
  if (communityUrls[normalizedSkinName]) {
    return communityUrls[normalizedSkinName];
  }
  
  return getSkinFallbackImage(normalizedSkinName);
};

const localImages = createImageRegistry({
  '★ Karambit | Fade': karambit,
  'M4A4 | Howl': m4a4Howl,
  'Glock-18 | Fade': glockFade,
  'AK-47 | Vulcan': akVulcan,
  'Desert Eagle | Blaze': deBlaze,
  '★ Butterfly Knife | Fade': butterflyFade,
  'USP-S | Kill Confirmed': uspKill,
  'AK-47 | Redline': akRedline,
  'AK-47 | Case Hardened': akCaseHardened,
  'AWP | Asiimov': awpAsiimov,
  'AWP | Dragon Lore': awpDragonLore,
  'AWP | Pink DDPAT': awpPinkDDPAT,
  'M4A1-S | Dark Water': m4a1DarkWater,
  'M4A1-S | Icarus Fell': m4a1Icarus,
  'P2000 | Fire Elemental': p2000FireElemental,
  'P250 | Muertos': p250Muertos,
  'Five-SeveN | Case Hardened': fiveSevenCaseHardened,
  'Tec-9 | Fuel Injector': tec9FuelInjector,
  'MP9 | Bulldozer': mp9Bulldrozer,
  'PP-Bizon | Judgement of Anubis': ppBizon,
  'UMP-45 | Blaze': umpBlaze,
  'UMP-45 | Primal Saber': umpPrimalSaber,
  'AUG | Akihabara Accept': augAkihabara,
  'FAMAS | Commemoration': famasCommemoration,
  'Sawed-Off | The Kraken': sawedOffKraken,
  'Nova | Antique': novaAntique,
  'MAG-7 | Heat': mag7Heat,
  'Sport Gloves | Pandora\'s Box': sportGloves,
  'Moto Gloves | Bloodhound': motoGloves,
  'Driver Gloves | Imperial Plaid': driverGloves,
  'Specialist Gloves | Crimson Kimono': crimKimono,
  'Hand Wraps | CAUTION!': handWrapsCaution,
  'Hand Wraps | Overprint': handWrapsOverprint,
  'Moto Gloves | Smoke Out': motoSmokeOut,
  'Sport Gloves | Vice': sportGlovesVice,
  'Broken Fang Gloves | Jade': brokenFangJade,
  'Specialist Gloves | Fade': specialistGlovesFade,
  'AK-47 | Bloodsport': akBloodsport,
  'Galil AR | Chatterbox': galilChatterbox,
  'M4A4 | The Emperor': m4a4Emperor,
  'USP-S | Neo-Noir': uspNeoNoir,
  'M4A1-S | Printstream': m4a1Printstream,
  'MAC-10 | Neon Rider': mac10NeonRider,
  'P90 | Death by Kitty': p90DeathByKitty,
  'XM1014 | Tranquility': xm1014Tranquility,
  'Negev | Power Loader': negevPowerLoader,
  'Glock-18 | Water Elemental': glockWaterElemental,
  'CZ75-Auto | Xiangliu': xiangliu,
  'Dual Berettas | Cobra Strike': cobraStrike,
  'P250 | See Ya Later': seeYaLater,
  'Desert Eagle | Code Red': desertEagleCodeRed,
  '★ Skeleton Knife | Slaughter': skeletonSlaughter,
  '★ Bayonet | Doppler': bayonetDoppler,
  '★ Flip Knife | Lore': flipKnifeLore,
  '★ Nomad Knife | Case Hardened': nomadCaseHardened,
  '★ M9 Bayonet | Crimson Web': m9CrimsonWeb,
  '★ Talon Knife | Damascus Steel': talonDamascus,
  '★ Huntsman Knife | Slaughter': huntsmanSlaughter,
  '★ Bowie Knife | Gamma Doppler': bowieGamma,
  });

const getProductImage = (skinName) => {
  const normalizedSkinName = normalizeResolvedSkinName(skinName)
  return localImages[normalizedSkinName] || getImageUrl(normalizedSkinName)
}

export const products = [
  {
    id: 1,
    name: 'AK-47 | Redline',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.15,
    price: 125.50,
    image: getProductImage('AK-47 | Redline'),
    gallery: [
      getProductImage('AK-47 | Vulcan'),
      getProductImage('AK-47 | Case Hardened'),
      'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-Eo7ZGH1d4OVdwVrY1jS-AK2we3u15biuMicz3Vj7CAn-z-DyB4b1lI/600fx450f',
    ],
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
    image: getProductImage('★ Karambit | Fade'),
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
    image: getProductImage('AWP | Dragon Lore'),
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
    image: getProductImage('Sport Gloves | Pandora\'s Box'),
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
    image: getProductImage('M4A4 | Howl'),
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
    image: getProductImage('Glock-18 | Fade'),
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
    image: getProductImage('AK-47 | Vulcan'),
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
    image: getProductImage('Desert Eagle | Blaze'),
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
    image: getProductImage('AWP | Asiimov'),
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
    image: getProductImage('M4A1-S | Icarus Fell'),
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
    image: getProductImage('★ Butterfly Knife | Fade'),
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
    id: 13,
    name: 'UMP-45 | Blaze',
    rarity: 'classified',
    condition: 'Field-Tested',
    float: 0.25,
    price: 75.00,
    image: getProductImage('UMP-45 | Blaze'),
    category: 'smgs',
    description: 'A fiery design on the UMP-45.',
    stats: {
      float: 0.25000000,
      pattern: 567,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 14,
    name: 'Nova | Antique',
    rarity: 'restricted',
    condition: 'Minimal Wear',
    float: 0.12,
    price: 45.00,
    image: getProductImage('Nova | Antique'),
    category: 'heavy',
    description: 'A vintage shotgun skin.',
    stats: {
      float: 0.12000000,
      pattern: 890,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 15,
    name: 'P250 | Muertos',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.03,
    price: 120.00,
    image: getProductImage('P250 | Muertos'),
    category: 'pistols',
    description: 'A skull-themed pistol skin.',
    stats: {
      float: 0.03000000,
      pattern: 234,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 17,
    name: '★ M9 Bayonet | Crimson Web',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.08,
    price: 1200.00,
    image: getProductImage('★ M9 Bayonet | Crimson Web'),
    category: 'knives',
    description: 'A premium bayonet with a striking crimson web pattern.',
    stats: {
      float: 0.08000000,
      pattern: 234,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 18,
    name: '★ Talon Knife | Damascus Steel',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 2100.00,
    image: getProductImage('★ Talon Knife | Damascus Steel'),
    category: 'knives',
    description: 'An elegant talon knife with damascus steel finish.',
    stats: {
      float: 0.01000000,
      pattern: 456,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 19,
    name: '★ Huntsman Knife | Slaughter',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.20,
    price: 850.00,
    image: getProductImage('★ Huntsman Knife | Slaughter'),
    category: 'knives',
    description: 'A tactical huntsman knife with slaughter pattern.',
    stats: {
      float: 0.20000000,
      pattern: 789,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 20,
    name: '★ Bowie Knife | Gamma Doppler',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 2800.00,
    image: getProductImage('★ Bowie Knife | Gamma Doppler'),
    category: 'knives',
    description: 'A rare doppler knife with gamma phase.',
    stats: {
      float: 0.01000000,
      pattern: 123,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 21,
    name: 'Moto Gloves | Bloodhound',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.12,
    price: 650.00,
    image: getProductImage('Moto Gloves | Bloodhound'),
    category: 'gloves',
    description: 'Racing gloves with bloodhound pattern.',
    stats: {
      float: 0.12000000,
      pattern: 567,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 22,
    name: 'Driver Gloves | Imperial Plaid',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.02,
    price: 950.00,
    image: getProductImage('Driver Gloves | Imperial Plaid'),
    category: 'gloves',
    description: 'Premium driver gloves with imperial plaid design.',
    stats: {
      float: 0.02000000,
      pattern: 890,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 23,
    name: 'Specialist Gloves | Crimson Kimono',
    rarity: 'classified',
    condition: 'Field-Tested',
    float: 0.18,
    price: 720.00,
    image: getProductImage('Specialist Gloves | Crimson Kimono'),
    category: 'gloves',
    description: 'Specialist gloves with crimson kimono pattern.',
    stats: {
      float: 0.18000000,
      pattern: 345,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 24,
    name: 'Hand Wraps | CAUTION!',
    rarity: 'restricted',
    condition: 'Minimal Wear',
    float: 0.10,
    price: 180.00,
    image: getProductImage('Hand Wraps | CAUTION!'),
    category: 'gloves',
    description: 'Warning-themed hand wraps.',
    stats: {
      float: 0.10000000,
      pattern: 678,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 25,
    name: 'AK-47 | Case Hardened',
    rarity: 'classified',
    condition: 'Well-Worn',
    float: 0.45,
    price: 150.00,
    image: getProductImage('AK-47 | Case Hardened'),
    category: 'rifles',
    description: 'Classic case hardened AK-47 with blue tint.',
    stats: {
      float: 0.45000000,
      pattern: 234,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 26,
    name: 'M4A1-S | Dark Water',
    rarity: 'restricted',
    condition: 'Minimal Wear',
    float: 0.08,
    price: 95.00,
    image: getProductImage('M4A1-S | Dark Water'),
    category: 'rifles',
    description: 'M4A1-S with dark water finish.',
    stats: {
      float: 0.08000000,
      pattern: 567,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 27,
    name: 'AWP | Pink DDPAT',
    rarity: 'industrial',
    condition: 'Factory New',
    float: 0.01,
    price: 25.00,
    image: getProductImage('AWP | Pink DDPAT'),
    category: 'rifles',
    description: 'Fun pink camo pattern on AWP.',
    stats: {
      float: 0.01000000,
      pattern: 890,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 28,
    name: 'P2000 | Fire Elemental',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.25,
    price: 35.00,
    image: getProductImage('P2000 | Fire Elemental'),
    category: 'pistols',
    description: 'P2000 with fire elemental design.',
    stats: {
      float: 0.25000000,
      pattern: 123,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 29,
    name: 'Five-SeveN | Case Hardened',
    rarity: 'classified',
    condition: 'Battle-Scarred',
    float: 0.60,
    price: 45.00,
    image: getProductImage('Five-SeveN | Case Hardened'),
    category: 'pistols',
    description: 'Case hardened Five-SeveN.',
    stats: {
      float: 0.60000000,
      pattern: 456,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 30,
    name: 'Tec-9 | Fuel Injector',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.12,
    price: 85.00,
    image: getProductImage('Tec-9 | Fuel Injector'),
    category: 'pistols',
    description: 'Tec-9 with fuel injector pattern.',
    stats: {
      float: 0.12000000,
      pattern: 789,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 31,
    name: 'MP9 | Bulldozer',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.03,
    price: 65.00,
    image: getProductImage('MP9 | Bulldozer'),
    category: 'smgs',
    description: 'MP9 with bulldozer design.',
    stats: {
      float: 0.03000000,
      pattern: 234,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 32,
    name: 'PP-Bizon | Judgement of Anubis',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.20,
    price: 28.00,
    image: getProductImage('PP-Bizon | Judgement of Anubis'),
    category: 'smgs',
    description: 'PP-Bizon with Anubis theme.',
    stats: {
      float: 0.20000000,
      pattern: 567,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 33,
    name: 'MAG-7 | Heat',
    rarity: 'restricted',
    condition: 'Minimal Wear',
    float: 0.10,
    price: 15.00,
    image: getProductImage('MAG-7 | Heat'),
    category: 'heavy',
    description: 'MAG-7 with heat pattern.',
    stats: {
      float: 0.10000000,
      pattern: 890,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 34,
    name: 'Sawed-Off | The Kraken',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.02,
    price: 75.00,
    image: getProductImage('Sawed-Off | The Kraken'),
    category: 'heavy',
    description: 'Sawed-Off with Kraken design.',
    stats: {
      float: 0.02000000,
      pattern: 123,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 35,
    name: 'M4A1-S | Printstream',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.07,
    price: 365.00,
    image: getProductImage('M4A1-S | Printstream'),
    category: 'rifles',
    description: 'A crisp monochrome rifle skin with sleek futuristic lines.',
    stats: {
      float: 0.07000000,
      pattern: 182,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 36,
    name: 'AK-47 | Bloodsport',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.03,
    price: 215.00,
    image: getProductImage('AK-47 | Bloodsport'),
    category: 'rifles',
    description: 'Aggressive race-inspired AK finish with bold white and red graphics.',
    stats: {
      float: 0.03000000,
      pattern: 918,
      stickers: 'None',
      stattrak: true,
      souvenir: false
    }
  },
  {
    id: 37,
    name: 'Galil AR | Chatterbox',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.19,
    price: 54.00,
    image: getProductImage('Galil AR | Chatterbox'),
    category: 'rifles',
    description: 'A loud yellow rifle skin with unmistakable street-art energy.',
    stats: {
      float: 0.19000000,
      pattern: 347,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 38,
    name: 'FAMAS | Commemoration',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.04,
    price: 48.00,
    image: getProductImage('FAMAS | Commemoration'),
    category: 'rifles',
    description: 'Gold-accented FAMAS with a premium commemorative finish.',
    stats: {
      float: 0.04000000,
      pattern: 511,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 39,
    name: 'AUG | Akihabara Accept',
    rarity: 'covert',
    condition: 'Well-Worn',
    float: 0.41,
    price: 640.00,
    image: getProductImage('AUG | Akihabara Accept'),
    category: 'rifles',
    description: 'A collector-favorite AUG skin with vibrant anime artwork.',
    stats: {
      float: 0.41000000,
      pattern: 773,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 40,
    name: 'SSG 08 | Dragonfire',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.09,
    price: 135.00,
    image: getProductImage('SSG 08 | Dragonfire'),
    category: 'rifles',
    description: 'A fiery scout skin featuring a full dragon illustration.',
    stats: {
      float: 0.09000000,
      pattern: 690,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 41,
    name: 'M4A4 | The Emperor',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.17,
    price: 128.00,
    image: getProductImage('M4A4 | The Emperor'),
    category: 'rifles',
    description: 'Regal blue-and-gold rifle finish inspired by tarot symbolism.',
    stats: {
      float: 0.17000000,
      pattern: 286,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 42,
    name: '★ Skeleton Knife | Slaughter',
    rarity: 'covert',
    condition: 'Minimal Wear',
    float: 0.08,
    price: 1180.00,
    image: getProductImage('★ Skeleton Knife | Slaughter'),
    category: 'knives',
    description: 'A modern skeleton knife with a bright red slaughter finish.',
    stats: {
      float: 0.08000000,
      pattern: 401,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 43,
    name: '★ Bayonet | Doppler',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.02,
    price: 1320.00,
    image: getProductImage('★ Bayonet | Doppler'),
    category: 'knives',
    description: 'A sleek bayonet with a glossy Doppler phase finish.',
    stats: {
      float: 0.02000000,
      pattern: 229,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 44,
    name: '★ Flip Knife | Lore',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.21,
    price: 540.00,
    image: getProductImage('★ Flip Knife | Lore'),
    category: 'knives',
    description: 'A gold-etched flip knife with a classic Lore finish.',
    stats: {
      float: 0.21000000,
      pattern: 612,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 45,
    name: '★ Nomad Knife | Case Hardened',
    rarity: 'covert',
    condition: 'Well-Worn',
    float: 0.39,
    price: 675.00,
    image: getProductImage('★ Nomad Knife | Case Hardened'),
    category: 'knives',
    description: 'A rugged nomad blade carrying a heavy blue case hardened pattern.',
    stats: {
      float: 0.39000000,
      pattern: 954,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 46,
    name: '★ Gut Knife | Marble Fade',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.01,
    price: 310.00,
    image: getProductImage('★ Gut Knife | Marble Fade'),
    category: 'knives',
    description: 'A bright tri-color marble fade on the signature gut blade.',
    stats: {
      float: 0.01000000,
      pattern: 145,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 47,
    name: 'USP-S | Neo-Noir',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.08,
    price: 62.00,
    image: getProductImage('USP-S | Neo-Noir'),
    category: 'pistols',
    description: 'Stylized comic-book artwork makes this USP-S instantly recognizable.',
    stats: {
      float: 0.08000000,
      pattern: 355,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 48,
    name: 'Desert Eagle | Code Red',
    rarity: 'covert',
    condition: 'Factory New',
    float: 0.04,
    price: 97.00,
    image: getProductImage('Desert Eagle | Code Red'),
    category: 'pistols',
    description: 'A striking red Deagle finish with an industrial race-team vibe.',
    stats: {
      float: 0.04000000,
      pattern: 588,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 49,
    name: 'Glock-18 | Water Elemental',
    rarity: 'classified',
    condition: 'Field-Tested',
    float: 0.16,
    price: 23.00,
    image: getProductImage('Glock-18 | Water Elemental'),
    category: 'pistols',
    description: 'A blue aquatic Glock skin packed with dynamic illustrated detail.',
    stats: {
      float: 0.16000000,
      pattern: 809,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 50,
    name: 'CZ75-Auto | Xiangliu',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.05,
    price: 18.00,
    image: getProductImage('CZ75-Auto | Xiangliu'),
    category: 'pistols',
    description: 'A serpent-themed pistol finish with rich red and green tones.',
    stats: {
      float: 0.05000000,
      pattern: 278,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 51,
    name: 'Dual Berettas | Cobra Strike',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.11,
    price: 42.00,
    image: getProductImage('Dual Berettas | Cobra Strike'),
    category: 'pistols',
    description: 'Twin pistols with an aggressive snake motif and clean finish.',
    stats: {
      float: 0.11000000,
      pattern: 432,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 52,
    name: 'P250 | See Ya Later',
    rarity: 'covert',
    condition: 'Well-Worn',
    float: 0.40,
    price: 16.00,
    image: getProductImage('P250 | See Ya Later'),
    category: 'pistols',
    description: 'A playful reptile-themed P250 skin with graffiti character.',
    stats: {
      float: 0.40000000,
      pattern: 601,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 53,
    name: 'Sport Gloves | Vice',
    rarity: 'covert',
    condition: 'Battle-Scarred',
    float: 0.59,
    price: 780.00,
    image: getProductImage('Sport Gloves | Vice'),
    category: 'gloves',
    description: 'Bright neon gloves that stand out immediately in any inventory.',
    stats: {
      float: 0.59000000,
      pattern: 210,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 54,
    name: 'Broken Fang Gloves | Jade',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.10,
    price: 290.00,
    image: getProductImage('Broken Fang Gloves | Jade'),
    category: 'gloves',
    description: 'Dark tactical gloves highlighted by vivid green panels.',
    stats: {
      float: 0.10000000,
      pattern: 376,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 55,
    name: 'Hand Wraps | Overprint',
    rarity: 'classified',
    condition: 'Field-Tested',
    float: 0.23,
    price: 185.00,
    image: getProductImage('Hand Wraps | Overprint'),
    category: 'gloves',
    description: 'Urban hand wraps with a cool blue layered print pattern.',
    stats: {
      float: 0.23000000,
      pattern: 484,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 56,
    name: 'Moto Gloves | Smoke Out',
    rarity: 'classified',
    condition: 'Well-Worn',
    float: 0.38,
    price: 240.00,
    image: getProductImage('Moto Gloves | Smoke Out'),
    category: 'gloves',
    description: 'Clean monochrome moto gloves with a smoky gray palette.',
    stats: {
      float: 0.38000000,
      pattern: 529,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 57,
    name: 'Specialist Gloves | Fade',
    rarity: 'covert',
    condition: 'Field-Tested',
    float: 0.24,
    price: 615.00,
    image: getProductImage('Specialist Gloves | Fade'),
    category: 'gloves',
    description: 'Premium specialist gloves with a vivid multicolor fade gradient.',
    stats: {
      float: 0.24000000,
      pattern: 663,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 58,
    name: 'MAC-10 | Neon Rider',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.12,
    price: 21.00,
    image: getProductImage('MAC-10 | Neon Rider'),
    category: 'smgs',
    description: 'Vaporwave-inspired MAC-10 with vibrant neon character art.',
    stats: {
      float: 0.12000000,
      pattern: 871,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 59,
    name: 'UMP-45 | Primal Saber',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.05,
    price: 14.00,
    image: getProductImage('UMP-45 | Primal Saber'),
    category: 'smgs',
    description: 'A bold yellow-and-black SMG finish featuring saber-tooth artwork.',
    stats: {
      float: 0.05000000,
      pattern: 307,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 60,
    name: 'P90 | Death by Kitty',
    rarity: 'classified',
    condition: 'Field-Tested',
    float: 0.18,
    price: 52.00,
    image: getProductImage('P90 | Death by Kitty'),
    category: 'smgs',
    description: 'A colorful and chaotic classic P90 skin with cat-filled artwork.',
    stats: {
      float: 0.18000000,
      pattern: 742,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 61,
    name: 'XM1014 | Tranquility',
    rarity: 'classified',
    condition: 'Minimal Wear',
    float: 0.09,
    price: 17.00,
    image: getProductImage('XM1014 | Tranquility'),
    category: 'heavy',
    description: 'A serene blue shotgun skin with a highly detailed dreamlike scene.',
    stats: {
      float: 0.09000000,
      pattern: 294,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  },
  {
    id: 62,
    name: 'Negev | Power Loader',
    rarity: 'classified',
    condition: 'Factory New',
    float: 0.03,
    price: 9.00,
    image: getProductImage('Negev | Power Loader'),
    category: 'heavy',
    description: 'Industrial yellow loader theme gives this heavy weapon a bold identity.',
    stats: {
      float: 0.03000000,
      pattern: 157,
      stickers: 'None',
      stattrak: false,
      souvenir: false
    }
  }
]

const categoryMeta = [
  { id: 'rifles', name: 'Rifles', icon: 'fa-crosshairs', accent: 'Precision' },
  { id: 'knives', name: 'Knives', icon: 'fa-sword', accent: 'Collector' },
  { id: 'pistols', name: 'Pistols', icon: 'fa-handgun', accent: 'Sidearm' },
  { id: 'gloves', name: 'Gloves', icon: 'fa-hand-paper', accent: 'Flex Gear' },
  { id: 'smgs', name: 'SMGs', icon: 'fa-bolt', accent: 'Rush Picks' },
  { id: 'heavy', name: 'Heavy', icon: 'fa-shield-alt', accent: 'Powerhouse' },
]

export const categories = [
  ...categoryMeta.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.id).length,
  })),
]
