const fs = require('fs');
const path = require('path');

const txtPath = 'E:/SnapTap/Поздравления минилулу/Пожелания.txt';
const targetPath = path.join(__dirname, '..', 'src', 'data', 'vlada-wishes.ts');

const content = fs.readFileSync(txtPath, 'utf8');

const regex = /(?:^|\n)\s*(\d+)\s*\)\s*([\s\S]*?)(?=(?:\n\s*\d+\s*\))|$)/g;
let match;
const wishes = [];
while ((match = regex.exec(content)) !== null) {
  const num = parseInt(match[1]);
  let raw = match[2].trim();
  let author = '';
  let text = raw;

  const lines = raw.split(/\r?\n/);
  // Находим последнюю строку-подпись автора (-автор, —автор, –автор)
  const sigIndex = lines.findLastIndex(l => /^[-—–]\s*[^\s]/.test(l.trim()));
  if (sigIndex !== -1) {
    author = lines[sigIndex].trim().replace(/^[-—–]\s*/, '').trim();
    text = lines.slice(0, sigIndex).join('\n').trim();
  }

  text = text.replace(/\r\n/g, '\n');
  wishes.push({ id: num, author, text });
}

const fileHeader = `/**
 * Данные для книги поздравлений "для Влады"
 * 
 * Каждая запись в массиве WISHES отображается ровно на ОДНОЙ странице книги (1 в 1 как в Minecraft).
 */

export interface VladaWishItem {
  id: number;
  author: string;
  text: string;
  date?: string;
}

export interface VladaBookIntro {
  title: string;
  subtitle: string;
  paragraphs: string[];
  signature?: string;
}

/**
 * Вступительный лист (Страница 1)
 */
export const VLADA_INTRO: VladaBookIntro = {
  title: "Для Влады",
  subtitle: "Праздничная книга",
  paragraphs: [
    "Дорогая Влада! ✨",
    "В этот особенный день мы собрали для тебя самые искренние и тёплые поздравления от всей команды и друзей.",
    "Каждая страница этой книги хранит частичку тепла, добрых воспоминаний и самых искренних пожеланий.",
  ],
  signature: "Сделано с любовью твоими друзьями 💗",
};

/**
 * Список поздравлений: каждое поздравление на ОДНУ страницу.
 * Подписи — строго никнеймы авторов из Пожелания.txt
 */
export const VLADA_WISHES: VladaWishItem[] = `;

const fullFile = fileHeader + JSON.stringify(wishes, null, 2) + ';\n';
fs.writeFileSync(targetPath, fullFile, 'utf8');
console.log(`Successfully synced ${wishes.length} wishes to ${targetPath}`);
