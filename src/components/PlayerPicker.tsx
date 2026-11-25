import { Button } from "@/components/ui/button";
import PlayerAvatar from "@/components/PlayerAvatar";
import type { PlayerColor } from "@/lib/playerColors";
import { cn } from "@/lib/utils";

export interface PlayerOption {
  id: string;
  name: string;
  iconURL?: string;
  color?: PlayerColor;
}

interface PlayerPickerProps {
  players: PlayerOption[];
  selectedPlayerId: string | null;
  onSelect: (playerId: string) => void;
}

export default function PlayerPicker({
  players,
  selectedPlayerId,
  onSelect,
}: PlayerPickerProps) {
  return (
    <div
      role="group"
      aria-label="Active player"
      className="flex flex-wrap gap-2"
    >
      {players.map(({ id, name, iconURL, color }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          aria-pressed={id === selectedPlayerId}
          onClick={() => onSelect(id)}
          className={cn(
            "h-auto min-h-11 max-w-full justify-start rounded-sm bg-card whitespace-normal text-card-foreground",
            id === selectedPlayerId &&
              "border-selected-border bg-selected text-selected-foreground hover:bg-selected/75 hover:text-selected-foreground",
          )}
        >
          {(iconURL || color) && (
            <PlayerAvatar name={name} iconURL={iconURL} color={color} />
          )}
          <span className="min-w-0 [overflow-wrap:anywhere]">{name}</span>
        </Button>
      ))}
    </div>
  );
}
