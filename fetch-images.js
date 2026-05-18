const fs = require('fs');
const path = require('path');
const https = require('https');

async function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching skins...');
  const res = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json');
  const skins = await res.json();
  
  console.log('Fetching stickers...');
  const resStickers = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/stickers.json');
  const stickers = await resStickers.json();
  
  console.log('Fetching agents...');
  const resAgents = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json');
  const agents = await resAgents.json();

  const pistol = skins.find(s => s.category?.name === 'Pistols' && s.image);
  const rifle = skins.find(s => s.category?.name === 'Rifles' && s.image);
  const sticker = stickers.find(s => s.image);
  const agent = agents.find(s => s.image);

  const toDownload = [
    { name: 'pistol.png', url: pistol.image },
    { name: 'rifle.png', url: rifle.image },
    { name: 'sticker.png', url: sticker.image },
    { name: 'agent.png', url: agent.image },
  ];

  for (const item of toDownload) {
    if (!item.url) continue;
    const filepath = path.join(__dirname, 'public', 'skins', item.name);
    console.log(`Downloading ${item.name} from ${item.url}`);
    await download(item.url, filepath);
  }
  console.log('Done!');
}

run().catch(console.error);
