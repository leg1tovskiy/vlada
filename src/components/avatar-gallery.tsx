import type { CSSProperties } from "react";

const avatarFiles = import.meta.glob("../avatar/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const avatars = Object.entries(avatarFiles)
  .map(([path, src]) => ({
    nick: path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    src,
  }))
  .sort((a, b) => a.nick.localeCompare(b.nick, "ru", { sensitivity: "base" }));

// 40 компактных позиций вокруг таймера (по 18 по бокам + 4 сверху/снизу)
// Все координаты строго внутри экрана (Y: 12%..82%), ники сгруппированы ближе друг к другу
const compactPositions: [number, number][] = [
  // Левое крыло (3 компактные колонки, X: 5.5%..23.5%, Y: 14%..78%)
  [6, 15],  [15, 18], [24, 15],
  [6, 27],  [15, 30], [24, 27],
  [6, 39],  [15, 42], [24, 39],
  [6, 51],  [15, 54], [24, 51],
  [6, 63],  [15, 66], [24, 63],
  [6, 75],  [15, 78], [24, 75],

  // Правое крыло (3 компактные колонки, X: 76.5%..94.5%, Y: 14%..78%)
  [76, 15], [85, 18], [94, 15],
  [76, 27], [85, 30], [94, 27],
  [76, 39], [85, 42], [94, 39],
  [76, 51], [85, 54], [94, 51],
  [76, 63], [85, 66], [94, 63],
  [76, 75], [85, 78], [94, 75],

  // Центр сверху и снизу от карточки таймера
  [33, 12], [67, 12],
  [35, 84], [65, 84],
];

const nickColors = ["#fdba74", "#d8b4fe", "#f9a8d4", "#a7f3d0", "#fde68a"];

function nickStyle(index: number): CSSProperties {
  const [desktopX, desktopY] = compactPositions[index % compactPositions.length];
  // Для планшета 4 компактные колонки по бокам таймера (Y: 14%..84%)
  const tabletSide = index < 18 ? 0 : 1;
  const tabletColInSide = index % 2;
  const tabletRow = Math.floor((index % 18) / 2);
  const tabletX = tabletSide === 0
    ? (tabletColInSide === 0 ? 8 : 20)
    : (tabletColInSide === 0 ? 80 : 92);
  const tabletY = 14 + tabletRow * 7.8;

  return {
    "--nick-x": `${desktopX}%`,
    "--nick-y": `${desktopY}%`,
    "--nick-tablet-x": `${tabletX}%`,
    "--nick-tablet-y": `${tabletY}%`,
    "--nick-drift-x": `${[-6, 5, 7, -4, 3][index % 5]}px`,
    "--nick-drift-y": `${[-6, -4, 5, 7, -5][index % 5]}px`,
    "--nick-duration": `${4.5 + (index % 6) * 0.6}s`,
    "--nick-delay": `${-(index % 8) * 0.6}s`,
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
