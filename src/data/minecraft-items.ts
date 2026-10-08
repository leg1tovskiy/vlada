export interface MinecraftItem {
  id: string;
  name: string;
  file: string;
}

export const MINECRAFT_ITEMS: MinecraftItem[] = [
  // Руды и блоки
  { id: "diamond_ore", name: "Алмазная руда", file: "diamond_ore.png" },
  { id: "gold_ore", name: "Золотая руда", file: "gold_ore.png" },
  { id: "iron_ore", name: "Железная руда", file: "iron_ore.png" },
  { id: "coal_ore", name: "Угольная руда", file: "coal_ore.png" },
  { id: "emerald_ore", name: "Изумрудная руда", file: "emerald_ore.png" },
  { id: "ancient_debris", name: "Древние обломки", file: "ancient_debris.png" },
  { id: "diamond_block", name: "Алмазный блок", file: "diamond_block.png" },
  { id: "gold_block", name: "Золотой блок", file: "gold_block.png" },
  { id: "emerald_block", name: "Изумрудный блок", file: "emerald_block.png" },
  { id: "iron_block", name: "Железный блок", file: "iron_block.png" },
  { id: "netherite_block", name: "Незеритовый блок", file: "netherite_block.png" },
  { id: "tnt", name: "Динамит (ТНТ)", file: "tnt.png" },
  { id: "crafting_table", name: "Верстак", file: "crafting_table.png" },
  { id: "furnace", name: "Печь", file: "furnace.png" },
  { id: "bookshelf", name: "Книжная полка", file: "bookshelf.png" },
  { id: "obsidian", name: "Обсидиан", file: "obsidian.png" },
  { id: "crying_obsidian", name: "Плачущий обсидиан", file: "crying_obsidian.png" },
  { id: "beacon", name: "Маяк", file: "beacon.png" },
  { id: "carved_pumpkin", name: "Светильник Джека", file: "carved_pumpkin.png" },

  // Минералы и слитки
  { id: "diamond", name: "Алмаз", file: "diamond.png" },
  { id: "emerald", name: "Изумруд", file: "emerald.png" },
  { id: "gold_ingot", name: "Золотой слиток", file: "gold_ingot.png" },
  { id: "iron_ingot", name: "Железный слиток", file: "iron_ingot.png" },
  { id: "netherite_ingot", name: "Незеритовый слиток", file: "netherite_ingot.png" },
  { id: "copper_ingot", name: "Медный слиток", file: "copper_ingot.png" },
  { id: "redstone", name: "Красная пыль (Редстоун)", file: "redstone.png" },
  { id: "lapis_lazuli", name: "Лазурит", file: "lapis_lazuli.png" },
  { id: "amethyst_shard", name: "Осколок аметиста", file: "amethyst_shard.png" },
  { id: "nether_star", name: "Звезда Незера", file: "nether_star.png" },

  // Оружие и инструменты
  { id: "diamond_sword", name: "Алмазный меч", file: "diamond_sword.png" },
  { id: "netherite_sword", name: "Незеритовый меч", file: "netherite_sword.png" },
  { id: "golden_sword", name: "Золотой меч", file: "golden_sword.png" },
  { id: "iron_sword", name: "Железный меч", file: "iron_sword.png" },
  { id: "mace", name: "Булава", file: "mace.png" },
  { id: "trident", name: "Трезубец", file: "trident.png" },
  { id: "bow", name: "Лук", file: "bow.png" },
  { id: "diamond_pickaxe", name: "Алмазная кирка", file: "diamond_pickaxe.png" },
  { id: "netherite_pickaxe", name: "Незеритовая кирка", file: "netherite_pickaxe.png" },
  { id: "golden_pickaxe", name: "Золотая кирка", file: "golden_pickaxe.png" },
  { id: "iron_pickaxe", name: "Железная кирка", file: "iron_pickaxe.png" },
  { id: "diamond_axe", name: "Алмазный топор", file: "diamond_axe.png" },
  { id: "netherite_axe", name: "Незеритовый топор", file: "netherite_axe.png" },

  // Броня
  { id: "diamond_helmet", name: "Алмазный шлем", file: "diamond_helmet.png" },
  { id: "diamond_chestplate", name: "Алмазный нагрудник", file: "diamond_chestplate.png" },
  { id: "diamond_leggings", name: "Алмазные поножи", file: "diamond_leggings.png" },
  { id: "diamond_boots", name: "Алмазные ботинки", file: "diamond_boots.png" },
  { id: "netherite_helmet", name: "Незеритовый шлем", file: "netherite_helmet.png" },
  { id: "netherite_chestplate", name: "Незеритовый нагрудник", file: "netherite_chestplate.png" },
  { id: "netherite_leggings", name: "Незеритовые поножи", file: "netherite_leggings.png" },
  { id: "netherite_boots", name: "Незеритовые ботинки", file: "netherite_boots.png" },
  { id: "golden_helmet", name: "Золотой шлем", file: "golden_helmet.png" },
  { id: "golden_chestplate", name: "Золотой нагрудник", file: "golden_chestplate.png" },
  { id: "turtle_helmet", name: "Черепаший панцирь", file: "turtle_helmet.png" },
  { id: "elytra", name: "Элитры", file: "elytra.png" },

  // Магические предметы и сокровища
  { id: "totem_of_undying", name: "Тотем бессмертия", file: "totem_of_undying.png" },
  { id: "enchanted_book", name: "Зачарованная книга", file: "enchanted_book.png" },
  { id: "ender_pearl", name: "Жемчуг Энда", file: "ender_pearl.png" },
  { id: "heart_of_the_sea", name: "Сердце моря", file: "heart_of_the_sea.png" },
  { id: "nautilus_shell", name: "Раковина наутилуса", file: "nautilus_shell.png" },
  { id: "experience_bottle", name: "Пузырёк опыта", file: "experience_bottle.png" },
  { id: "potion", name: "Зелье", file: "potion.png" },
  { id: "splash_potion", name: "Взрывное зелье", file: "splash_potion.png" },

  // Еда и лакомства
  { id: "golden_apple", name: "Золотое яблоко", file: "golden_apple.png" },
  { id: "cake", name: "Торт", file: "cake.png" },
  { id: "golden_carrot", name: "Золотая морковь", file: "golden_carrot.png" },
  { id: "cookie", name: "Печенье", file: "cookie.png" },
  { id: "bread", name: "Хлеб", file: "bread.png" },
  { id: "apple", name: "Яблоко", file: "apple.png" },
  { id: "sweet_berries", name: "Сладкие ягоды", file: "sweet_berries.png" },
  { id: "melon_slice", name: "Ломтик арбуза", file: "melon_slice.png" },
  { id: "pumpkin_pie", name: "Тыквенный пирог", file: "pumpkin_pie.png" },

  // Лут и редкости
  { id: "firework_rocket", name: "Ракета фейерверка", file: "firework_rocket.png" },
  { id: "music_disc_pigstep", name: "Пластинка Pigstep", file: "music_disc_pigstep.png" },
  { id: "music_disc_cat", name: "Пластинка Cat", file: "music_disc_cat.png" },
  { id: "name_tag", name: "Бирка", file: "name_tag.png" },
  { id: "saddle", name: "Седло", file: "saddle.png" },
  { id: "lead", name: "Поводок", file: "lead.png" },
  { id: "blaze_rod", name: "Огненный стержень", file: "blaze_rod.png" },
  { id: "ghast_tear", name: "Слеза гаста", file: "ghast_tear.png" },
  { id: "slime_ball", name: "Сгусток слизи", file: "slime_ball.png" },
  { id: "magma_cream", name: "Лавовый крем", file: "magma_cream.png" },
  { id: "feather", name: "Перо", file: "feather.png" },
  { id: "gunpowder", name: "Порох", file: "gunpowder.png" },
  { id: "bone", name: "Кость", file: "bone.png" },
];

export function getRandomMinecraftItem(): MinecraftItem {
  const index = Math.floor(Math.random() * MINECRAFT_ITEMS.length);
  return MINECRAFT_ITEMS[index];
}
