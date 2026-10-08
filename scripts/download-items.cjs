const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'mc-items');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const itemNames = [
  // Weapons & Tools
  'diamond_sword', 'netherite_sword', 'golden_sword', 'iron_sword',
  'diamond_pickaxe', 'netherite_pickaxe', 'golden_pickaxe', 'iron_pickaxe',
  'diamond_axe', 'netherite_axe', 'bow', 'crossbow', 'trident', 'shield', 'mace',
  // Armor
  'diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots',
  'netherite_helmet', 'netherite_chestplate', 'netherite_leggings', 'netherite_boots',
  'golden_helmet', 'golden_chestplate', 'turtle_helmet', 'elytra',
  // Minerals & Gems
  'diamond', 'emerald', 'gold_ingot', 'iron_ingot', 'netherite_ingot',
  'copper_ingot', 'redstone', 'lapis_lazuli', 'amethyst_shard',
  'nether_star', 'totem_of_undying', 'heart_of_the_sea', 'nautilus_shell',
  'enchanted_book', 'experience_bottle', 'ender_pearl', 'eye_of_ender',
  // Food
  'golden_apple', 'enchanted_golden_apple', 'cake', 'golden_carrot',
  'cookie', 'bread', 'apple', 'sweet_berries', 'melon_slice', 'pumpkin_pie',
  // Mob drops & brewing
  'potion', 'splash_potion', 'blaze_rod', 'ghast_tear',
  'slime_ball', 'magma_cream', 'feather', 'bone', 'gunpowder',
  // Miscellaneous
  'firework_rocket', 'compass', 'clock', 'lead', 'saddle',
  'music_disc_pigstep', 'music_disc_cat', 'name_tag'
];

function download(item) {
  return new Promise((resolve) => {
    const url = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.21.4/items/${item}.png`;
    const filePath = path.join(targetDir, `${item}.png`);
    
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ ${item}.png`);
          resolve(true);
        });
      } else {
        file.close();
        fs.unlinkSync(filePath);
        console.warn(`✗ ${item}.png (${res.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      console.warn(`✗ ${item}.png (${err.message})`);
      resolve(false);
    });
  });
}

async function run() {
  console.log(`Starting download of ${itemNames.length} items to ${targetDir}...`);
  let successCount = 0;
  for (const item of itemNames) {
    const ok = await download(item);
    if (ok) successCount++;
  }
  console.log(`\nFinished: ${successCount}/${itemNames.length} items successfully downloaded.`);
}

run();
