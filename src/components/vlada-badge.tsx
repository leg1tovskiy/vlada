import vladaAvatar from "@/assets/vlada-avatar.png";

export function VladaBadge() {
  return (
    <div className="vlada-badge relative z-20">
      <img src={vladaAvatar} alt="Аватар Влады" className="vlada-badge-avatar" />
      <span className="vlada-badge-name font-minecraft">Влада (именинница)</span>
    </div>
  );
}
