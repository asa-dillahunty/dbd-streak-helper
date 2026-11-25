import { useState, useSyncExternalStore } from "react";
import { Monitor, Shuffle, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import campfire from "@/assets/dbd-lobby-campfire.jpg";
import { OBSESSION_URL } from "@/assets/gameData";
import BingoListEditor from "@/components/BingoListEditor";
import PageWrapper from "@/components/PageWrapper";
import PlayerAvatar from "@/components/PlayerAvatar";
import PlayerPicker, { type PlayerOption } from "@/components/PlayerPicker";
import { Button } from "@/components/ui/button";
import {
  CENTER_INDEX,
  drawLayout,
  getPrompts,
  initialBingoBoard,
  toggleCompletion,
  updatePromptPool,
  type BingoBoardState,
} from "@/lib/bingo";
import usePersistedState from "@/lib/usePersistedState";
import { defaultPlayerColor, playerColors } from "@/lib/playerColors";
import { cn } from "@/lib/utils";

const genericPlayer: PlayerOption = { id: "generic", name: "Generic" };
const boardKey = "dbd-bingo-board-v1";
const rosterKey = "dbd-bingo-roster-v1";
const defaultPlayers: PlayerOption[] = [
  {
    id: "stantley",
    name: "stantley",
    iconURL:
      "https://avatars.akamai.steamstatic.com/3b8cb1147355991b99ded67f6d8631efece64d53_full.jpg",
    color: "Blue",
  },
  {
    id: "terracottapot17",
    name: "terracottapot17",
    iconURL:
      "https://avatars.akamai.steamstatic.com/ca744c812b0a990376ab314e8f38ea8c6481d3c8_full.jpg",
    color: "Amber",
  },
];

const controlClass = "min-h-11 rounded-sm bg-card text-card-foreground";
const tileClass =
  "flex h-full min-w-0 flex-col items-center justify-center gap-1.5 border px-0.5 py-2 text-center text-xs leading-tight [overflow-wrap:anywhere] sm:px-2 sm:text-sm";

export default function BingoPage() {
  const [searchParams] = useSearchParams();
  return searchParams.get("view") === "stream" ? (
    <BingoStream />
  ) : (
    <EditableBingo />
  );
}

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function useStreamValue<T>(key: string, fallback: T): T {
  const stored = useSyncExternalStore(subscribeToStorage, () => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  });
  try {
    return stored === null ? fallback : ((JSON.parse(stored) as T) ?? fallback);
  } catch {
    return fallback;
  }
}

function BingoStream() {
  const board = useStreamValue(boardKey, initialBingoBoard);
  const roster = useStreamValue(rosterKey, defaultPlayers);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-1 text-foreground">
      <h1 className="sr-only">DBD Bingo Stream View</h1>
      <Link
        to="?"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20 focus:bg-card focus:p-2 focus:text-card-foreground"
      >
        Open Bingo controls
      </Link>
      <div className="w-full max-w-[min(40rem,100dvh)]">
        <BingoBoard board={board} players={resolvePlayers(roster)} />
      </div>
    </main>
  );
}

function resolvePlayers(roster: PlayerOption[]) {
  return roster.map((player, index) => ({
    ...player,
    iconURL:
      player.iconURL ??
      defaultPlayers.find(({ id }) => id === player.id)?.iconURL,
    color: player.color ?? defaultPlayerColor(index),
  }));
}

function EditableBingo() {
  const [board, setBoard] = usePersistedState(boardKey, initialBingoBoard);
  const [roster, setRoster] = usePersistedState(rosterKey, defaultPlayers);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const players = resolvePlayers(roster);

  function claimTile(id: string) {
    const activePlayer =
      players.find(({ id }) => id === selectedPlayerId) ?? genericPlayer;
    setBoard((current) =>
      toggleCompletion(current, id, {
        playerId: activePlayer.id,
        playerName: activePlayer.name,
        iconURL: activePlayer.iconURL,
        color: activePlayer.color,
      }),
    );
  }

  return (
    <div className="relative isolate min-h-dvh bg-background text-foreground">
      <img
        src={campfire}
        alt=""
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-50 dark:opacity-80"
      />
      <PageWrapper>
        <section
          aria-labelledby="bingo-heading"
          className="w-full max-w-6xl pb-8 sm:pt-5"
        >
          <h2
            id="bingo-heading"
            className="mb-4 border-l-4 border-selected-border pl-3 text-3xl font-bold tracking-wide uppercase sm:mb-6 sm:text-4xl"
          >
            DBD Bingo
          </h2>
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-x-6">
            <div className="flex flex-wrap gap-2 lg:col-start-1 lg:row-start-1">
              <Button
                type="button"
                className="min-h-11 rounded-sm"
                onClick={() => {
                  setBoard({
                    ...board,
                    layout: drawLayout(board.customPrompts, board.freeSpace),
                  });
                  setAnnouncement("Board shuffled.");
                }}
              >
                <Shuffle aria-hidden="true" />
                Shuffle
              </Button>
              <Button
                type="button"
                variant="outline"
                className={controlClass}
                onClick={() => {
                  setBoard((current) => ({ ...current, completions: {} }));
                  setAnnouncement("Completion marks cleared.");
                }}
              >
                Clear Board
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-pressed={board.freeSpace}
                className={controlClass}
                onClick={() =>
                  setBoard((current) => ({
                    ...current,
                    freeSpace: !current.freeSpace,
                  }))
                }
              >
                Free Space{" "}
                <span
                  aria-hidden="true"
                  className={
                    board.freeSpace
                      ? "text-selected-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {board.freeSpace ? "On" : "Off"}
                </span>
              </Button>
              <BingoListEditor
                title="Edit prompts"
                addOnEnter
                description="Custom prompts fill the board first. Starter prompts fill any remaining squares."
                entryLabel="Prompt"
                entries={board.customPrompts}
                triggerClassName={controlClass}
                onSave={(entries) => {
                  setBoard(updatePromptPool(board, entries));
                  setAnnouncement("Prompt pool saved.");
                }}
              />
              <Button asChild variant="outline" className={controlClass}>
                <Link
                  to="?view=stream"
                  target="_blank"
                  rel="noopener"
                  aria-label="Stream View (opens in a new tab)"
                >
                  <Monitor aria-hidden="true" />
                  Stream View
                </Link>
              </Button>
            </div>
            <aside
              aria-labelledby="bingo-players"
              className="min-w-0 border border-border bg-card/90 p-3 text-card-foreground sm:p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2">
                <h3
                  id="bingo-players"
                  className="text-sm font-bold tracking-wider uppercase"
                >
                  Players
                </h3>
                <BingoListEditor
                  title="Edit players"
                  description="Existing marks keep the name recorded when the square was completed."
                  entryLabel="Player"
                  showPlayerAppearance
                  entries={players.map(({ id, name, iconURL, color }) => ({
                    id,
                    text: name,
                    iconURL,
                    color,
                  }))}
                  triggerClassName="min-h-11 rounded-sm border-transparent bg-transparent px-2 font-normal text-muted-foreground shadow-none"
                  onSave={(entries) => {
                    setRoster(
                      entries.map(({ id, text, iconURL, color }) => ({
                        id,
                        name: text,
                        iconURL,
                        color,
                      })),
                    );
                    if (!entries.some(({ id }) => id === selectedPlayerId)) {
                      setSelectedPlayerId(null);
                    }
                    setAnnouncement("Player list saved.");
                  }}
                />
              </div>
              <PlayerPicker
                players={players}
                selectedPlayerId={selectedPlayerId}
                onSelect={(id) =>
                  setSelectedPlayerId((current) => (current === id ? null : id))
                }
              />
            </aside>
            <BingoBoard board={board} players={players} onClaim={claimTile} />
          </div>
          <p role="status" className="sr-only">
            {announcement}
          </p>
        </section>
      </PageWrapper>
    </div>
  );
}

function BingoBoard({
  board,
  players,
  onClaim,
}: {
  board: BingoBoardState;
  players: PlayerOption[];
  onClaim?: (id: string) => void;
}) {
  const Tile = onClaim ? "button" : "div";
  const sizing = onClaim
    ? "min-h-24 sm:min-h-28"
    : "min-h-[clamp(3rem,15dvh,7rem)]";
  const playersById = new Map(players.map((player) => [player.id, player]));
  const prompts = new Map(
    getPrompts(board.customPrompts).map(({ id, text }) => [id, text]),
  );
  return (
    <ul
      aria-label="Bingo board"
      className={cn(
        "grid grid-cols-5 gap-1 border border-border bg-card/90 p-1 text-card-foreground",
        onClaim && "sm:gap-2 sm:p-2 lg:col-start-1 lg:row-start-2",
      )}
    >
      {board.layout.map((id, index) => {
        if (board.freeSpace && index === CENTER_INDEX) {
          return (
            <li
              key={id}
              className={cn(
                tileClass,
                sizing,
                "border-warning-border bg-warning text-warning-foreground",
              )}
            >
              <Sparkles aria-hidden="true" className="size-4 shrink-0" />
              <span className="font-bold">Free Space</span>
              <span className="sr-only">Automatically marked</span>
            </li>
          );
        }

        const completion = board.completions[id];
        const namedCompletion =
          completion?.playerId !== genericPlayer.id ? completion : undefined;
        const owner =
          namedCompletion && playersById.get(namedCompletion.playerId);
        const color = owner ? owner.color : namedCompletion?.color;
        return (
          <li key={id} className="min-w-0">
            <Tile
              {...(onClaim && {
                type: "button",
                "aria-pressed": Boolean(completion),
                onClick: () => onClaim(id),
              })}
              className={cn(
                tileClass,
                sizing,
                "relative isolate w-full overflow-hidden font-semibold",
                onClaim &&
                  "cursor-latched group focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                completion
                  ? "border-selected-border bg-selected text-selected-foreground"
                  : "border-border bg-muted",
                color && "text-card-foreground",
                onClaim &&
                  (completion
                    ? "hover:bg-selected/75"
                    : "hover:border-input hover:bg-accent"),
              )}
              style={
                color
                  ? {
                      borderColor: playerColors[color],
                      backgroundColor: `color-mix(in srgb, ${playerColors[color]} 30%, var(--card))`,
                    }
                  : undefined
              }
            >
              {onClaim && (
                <img
                  src={OBSESSION_URL}
                  alt=""
                  className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-150 object-contain opacity-0 invert group-hover:opacity-40 group-focus-visible:opacity-40 motion-safe:transition-opacity dark:invert-0"
                />
              )}
              <span className="w-full">{prompts.get(id)}</span>
              {!onClaim && completion && !namedCompletion && (
                <span className="sr-only">Completed</span>
              )}
              {namedCompletion && (
                <>
                  <span className="sr-only">
                    Completed by {namedCompletion.playerName}
                  </span>
                  <PlayerAvatar
                    name={namedCompletion.playerName}
                    iconURL={owner ? owner.iconURL : namedCompletion.iconURL}
                    color={color}
                    className="absolute right-1 bottom-1 size-7 sm:size-8"
                  />
                </>
              )}
            </Tile>
          </li>
        );
      })}
    </ul>
  );
}
