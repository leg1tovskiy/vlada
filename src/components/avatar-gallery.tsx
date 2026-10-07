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

// На широком экране ники окружают таймер, остальные свободно парят ниже.
const desktopPositions = [
  [8, 12], [22, 17], [78, 11], [92, 18],
  [9, 24], [22, 28], [78, 25], [91, 29],
  [7, 37], [22, 39], [78, 36], [92, 40],
  [9, 49], [23, 50], [77, 48], [91, 51],
  [9, 60], [28, 63], [47, 58], [68, 62], [88, 59],
  [15, 72], [35, 74], [54, 70], [75, 73], [93, 69],
  [7, 83], [26, 86], [46, 82], [66, 85], [85, 81],
  [20, 94], [41, 92], [61, 95], [81, 93],
];

const nickColors = ["#fdba74", "#d8b4fe", "#f9a8d4", "#a7f3d0", "#fde68a"];

function nickStyle(index: number): CSSProperties {
  const [desktopX, desktopY] = desktopPositions[index];
  const tabletColumn = index % 4;
  const mobileColumn = index % 2;
  const mobileRow = Math.floor(index / 2);
  return {
    "--nick-x": `${desktopX}%`,
    "--nick-y": `${desktopY}%`,
    "--nick-tablet-x": `${[12, 37, 63, 88][tabletColumn]}%`,
    "--nick-tablet-y": `${540 + Math.floor(index / 4) * 83 + tabletColumn * 10}px`,
    "--nick-mobile-x": `${mobileColumn === 0 ? 20 + (mobileRow % 4) * 3 : 80 - (mobileRow % 4) * 4}%`,
    "--nick-mobile-y": `${535 + mobileRow * 75 + mobileColumn * 20}px`,
    "--nick-drift-x": `${[-8, 6, 10, -5, 4][index % 5]}px`,
    "--nick-drift-y": `${[-9, -5, 7, 10, -7][index % 5]}px`,
    "--nick-duration": `${5 + (index % 6) * 0.7}s`,
    "--nick-delay": `${-(index % 8) * 0.8}s`,
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
