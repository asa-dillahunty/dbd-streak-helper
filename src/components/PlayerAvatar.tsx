import { cn } from "@/lib/utils";
import { playerColors, type PlayerColor } from "@/lib/playerColors";

interface PlayerAvatarProps {
  name: string;
  iconURL?: string;
  color?: PlayerColor;
  className?: string;
}

export default function PlayerAvatar({
  name,
  iconURL,
  color,
  className,
}: PlayerAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-sm border-2 border-stone-500 bg-stone-950 text-xs font-bold text-stone-100",
        className,
      )}
      style={color ? { borderColor: playerColors[color] } : undefined}
    >
      {Array.from(name)[0]?.toUpperCase()}
      {iconURL && (
        <img
          key={iconURL}
          src={iconURL}
          alt=""
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          className="absolute inset-0 size-full bg-stone-950 object-cover"
        />
      )}
    </span>
  );
}
