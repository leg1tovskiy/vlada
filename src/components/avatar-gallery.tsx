import type { CSSProperties } from "react";

const avatarFiles = import.meta.glob("../avatar/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const NICK_OVERRIDES: Record<string, string> = {
  Discord_IKxQzyE7Js: "люблю викусю",
};

const avatars = Object.entries(avatarFiles)
  .map(([path, src]) => {
    const rawNick = path.split("/").pop()!.replace(/\.[^.]+$/, "");
    const nick = NICK_OVERRIDES[rawNick] || rawNick;
    return { nick, src };
  })
  .sort((a, b) => a.nick.localeCompare(b.nick, "ru", { sensitivity: "base" }));

// 35 гармоничных позиций на десктопе вокруг таймера (по 15 по бокам + 5 сверху/снизу)
// Все координаты строго внутри экрана (Y: 12%..86%), без прокрутки
const desktopPositions: [number, number][] = [
  // Левое крыло (3 компактные колонки по 5 ников, X: 6%..24%, Y: 16%..76%)
  [6, 16],  [15, 18], [24, 16],
  [6, 30],  [15, 32], [24, 30],
  [6, 44],  [15, 46], [24, 44],
  [6, 58],  [15, 60], [24, 58],
  [6, 72],  [15, 74], [24, 72],

  // Правое крыло (3 компактные колонки по 5 ников, X: 76%..94%, Y: 16%..76%)
  [76, 16], [85, 18], [94, 16],
  [76, 30], [85, 32], [94, 30],
  [76, 44], [85, 46], [94, 44],
  [76, 58], [85, 60], [94, 58],
  [76, 72], [85, 74], [94, 72],

  // Центр сверху и снизу от карточки таймера (5 ников)
  [36, 12], [50, 10], [64, 12],
  [38, 86], [62, 86],
];

// 35 позиций на планшете (768px..1100px)
const tabletPositions: [number, number][] = [
  // Левое крыло (2 колонки по 7 ников)
  [8, 14],  [20, 16],
  [8, 25],  [20, 27],
  [8, 36],  [20, 38],
  [8, 47],  [20, 49],
  [8, 58],  [20, 60],
  [8, 69],  [20, 71],
  [8, 80],  [20, 82],

  // Правое крыло (2 колонки по 7 ников)
  [80, 14], [92, 16],
  [80, 25], [92, 27],
  [80, 36], [92, 38],
  [80, 47], [92, 49],
  [80, 58], [92, 60],
  [80, 69], [92, 71],
  [80, 80], [92, 82],

  // Верх и низ (7 ников)
  [34, 10], [50, 8],  [66, 10],
  [32, 88], [44, 91], [56, 91], [68, 88],
];

// 35 позиций на мобильных устройствах (<768px):
// Разбросаны по экрану над таймером, по краям и под таймером.
// Все строго внутри экрана (Y: 5%..93%, X: 7%..93%), без выхода за экран и без скролла!
const mobilePositions: [number, number][] = [
  // Сверху над таймером (12 ников в 3 ряда, Y: 5%..19%)
  [14, 5],  [38, 5],  [62, 5],  [86, 5],
  [10, 12], [34, 12], [66, 12], [90, 12],
  [16, 19], [40, 19], [60, 19], [84, 19],

  // По бокам от таймера (6 ников, Y: 32%..60%)
  [8, 32],  [92, 32],
  [7, 46],  [93, 46],
  [8, 60],  [92, 60],

  // Снизу под таймером (17 ников в 4 ряда, Y: 72%..93%)
  [14, 72], [38, 71], [62, 71], [86, 72],
  [9, 79],  [29, 78], [50, 78], [71, 78], [91, 79],
  [13, 86], [37, 85], [63, 85], [87, 86],
  [18, 93], [42, 92], [58, 92], [82, 93],
];

const nickColors = ["#fdba74", "#d8b4fe", "#f9a8d4", "#a7f3d0", "#fde68a"];

function nickStyle(index: number): CSSProperties {
  const [desktopX, desktopY] = desktopPositions[index % desktopPositions.length];
  const [tabletX, tabletY] = tabletPositions[index % tabletPositions.length];
  const [mobileX, mobileY] = mobilePositions[index % mobilePositions.length];

  return {
    "--nick-x": `${desktopX}%`,
    "--nick-y": `${desktopY}%`,
    "--nick-tablet-x": `${tabletX}%`,
    "--nick-tablet-y": `${tabletY}%`,
    "--nick-mobile-x": `${mobileX}%`,
    "--nick-mobile-y": `${mobileY}%`,
    "--nick-drift-x": `${[-4, 3, 5, -3, 2][index % 5]}px`,
    "--nick-drift-y": `${[-4, -3, 3, 4, -3][index % 5]}px`,
    "--nick-duration": `${4.2 + (index % 6) * 0.5}s`,
    "--nick-delay": `${-(index % 8) * 0.5}s`,
    "--nick-color": nickColors[index % nickColors.length],
  } as CSSProperties;
}

export function AvatarGallery() {
  return (
    <div className="nickname-sky" role="group" aria-label="Друзья и участники праздника">
      {avatars.map(({ nick, src }, index) => (
        <div className="floating-nick-spot" style={nickStyle(index)} key={nick}>
          <button type="button" className="floating-nick font-minecraft" aria-label={`Показать аватар ${nick}`}>
            <img src={src} alt="" loading="lazy" className="floating-nick-avatar" />
            <span>{nick}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
