import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PlayerOption {
  id: string;
  name: string;
  iconURL?: string;
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
      {players.map(({ id, name, iconURL }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          aria-pressed={id === selectedPlayerId}
          onClick={() => onSelect(id)}
          className={cn(
            "h-auto min-h-11 max-w-full justify-start rounded-sm border-stone-600 bg-stone-950 whitespace-normal text-stone-100 hover:bg-stone-800 hover:text-white focus-visible:ring-red-300",
            id === selectedPlayerId &&
              "border-red-400 bg-red-950 text-red-100 hover:bg-red-900",
          )}
        >
          {iconURL && (
            <img
              src={iconURL}
              alt=""
              className="size-6 rounded-sm object-cover"
            />
          )}
          <span className="min-w-0 [overflow-wrap:anywhere]">{name}</span>
        </Button>
      ))}
    </div>
  );
}
