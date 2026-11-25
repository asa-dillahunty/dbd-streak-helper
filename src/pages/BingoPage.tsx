import { useState } from "react";
import { Check, Shuffle, Sparkles } from "lucide-react";
import campfire from "@/assets/dbd-lobby-campfire.jpg";
import { OBSESSION_URL } from "@/assets/gameData";
import BingoListEditor from "@/components/BingoListEditor";
import PageWrapper from "@/components/PageWrapper";
import PlayerPicker, { type PlayerOption } from "@/components/PlayerPicker";
import { Button } from "@/components/ui/button";
import {
  CENTER_INDEX,
  drawLayout,
  getPrompts,
  initialBingoBoard,
  toggleCompletion,
  updatePromptPool,
} from "@/lib/bingo";
import usePersistedState from "@/lib/usePersistedState";
import { cn } from "@/lib/utils";

const genericPlayer = { id: "generic", name: "Generic" };
const defaultPlayers: PlayerOption[] = [
  { id: "stantley", name: "stantley" },
  { id: "terracottapot17", name: "terracottapot17" },
];

const controlClass =
  "min-h-11 rounded-sm border-stone-600 bg-stone-950 text-stone-100 hover:bg-stone-800 hover:text-white focus-visible:ring-red-300";
const tileClass =
  "flex h-full min-h-24 min-w-0 flex-col items-center justify-center gap-1.5 border px-0.5 py-2 text-center text-sm leading-tight [overflow-wrap:anywhere] sm:min-h-28 sm:px-2";

export default function BingoPage() {
  const [board, setBoard] = usePersistedState(
    "dbd-bingo-board-v1",
    initialBingoBoard,
  );
  const [roster, setRoster] = usePersistedState(
    "dbd-bingo-roster-v1",
    defaultPlayers,
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const activePlayer =
    roster.find(({ id }) => id === selectedPlayerId) ?? genericPlayer;
  const prompts = new Map(
    getPrompts(board.customPrompts).map(({ id, text }) => [id, text]),
  );

  return (
    <div className="relative isolate min-h-dvh bg-stone-950 text-stone-100">
      <img
        src={campfire}
        alt=""
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-30"
      />
      <PageWrapper>
        <section
          aria-labelledby="bingo-heading"
          className="w-full max-w-6xl pb-8 sm:pt-5"
        >
          <h2
            id="bingo-heading"
            className="mb-4 border-l-4 border-red-600 pl-3 text-3xl font-bold tracking-wide uppercase sm:mb-6 sm:text-4xl"
          >
            DBD Bingo
          </h2>
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-x-6">
            <div className="flex flex-wrap gap-2 lg:col-start-1 lg:row-start-1">
              <Button
                type="button"
                className="min-h-11 rounded-sm border border-red-700 bg-red-900 text-white hover:bg-red-800 focus-visible:ring-red-300"
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
                    board.freeSpace ? "text-red-200" : "text-stone-400"
                  }
                >
                  {board.freeSpace ? "On" : "Off"}
                </span>
              </Button>
              <BingoListEditor
                title="Edit prompts"
                description="Custom prompts fill the board first. Starter prompts fill any remaining squares."
                entryLabel="Prompt"
                entries={board.customPrompts}
                triggerClassName={controlClass}
                onSave={(entries) => {
                  setBoard(updatePromptPool(board, entries));
                  setAnnouncement("Prompt pool saved.");
                }}
              />
            </div>
            <aside
              aria-labelledby="bingo-players"
              className="min-w-0 border border-stone-700 bg-stone-950/90 p-3 sm:p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              <h3
                id="bingo-players"
                className="mb-2 text-sm font-bold tracking-wider text-stone-200 uppercase"
              >
                Players
              </h3>
              <PlayerPicker
                players={roster}
                selectedPlayerId={selectedPlayerId}
                onSelect={(id) =>
                  setSelectedPlayerId((current) => (current === id ? null : id))
                }
              />
              <div className="mt-3">
                <BingoListEditor
                  title="Edit players"
                  description="Existing marks keep the name recorded when the square was completed."
                  entryLabel="Player"
                  entries={roster.map(({ id, name }) => ({ id, text: name }))}
                  triggerClassName="min-h-11 rounded-sm border-transparent bg-transparent px-2 font-normal text-stone-400 shadow-none hover:bg-stone-900 hover:text-stone-100 focus-visible:ring-red-300"
                  onSave={(entries) => {
                    setRoster(
                      entries.map(({ id, text }) => ({ id, name: text })),
                    );
                    if (!entries.some(({ id }) => id === selectedPlayerId)) {
                      setSelectedPlayerId(null);
                    }
                    setAnnouncement("Player list saved.");
                  }}
                />
              </div>
            </aside>
            <ul
              aria-label="Bingo board"
              className="grid grid-cols-5 gap-1 border border-stone-700 bg-stone-950/90 p-1 sm:gap-2 sm:p-2 lg:col-start-1 lg:row-start-2"
            >
              {board.layout.map((id, index) => {
                if (board.freeSpace && index === CENTER_INDEX) {
                  return (
                    <li
                      key={id}
                      className={cn(
                        tileClass,
                        "border-amber-700 bg-amber-950 text-amber-100",
                      )}
                    >
                      <Sparkles
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      <span className="font-bold">Free Space</span>
                      <span className="sr-only">Automatically marked</span>
                    </li>
                  );
                }

                const completion = board.completions[id];
                return (
                  <li key={id} className="min-w-0">
                    <button
                      type="button"
                      aria-pressed={Boolean(completion)}
                      onClick={() =>
                        setBoard((current) =>
                          toggleCompletion(current, id, {
                            playerId: activePlayer.id,
                            playerName: activePlayer.name,
                          }),
                        )
                      }
                      className={cn(
                        tileClass,
                        "cursor-latched group relative isolate w-full overflow-hidden font-semibold focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-300",
                        completion
                          ? "border-red-500 bg-red-950 text-red-50 hover:bg-red-900"
                          : "border-stone-700 bg-stone-900 text-stone-100 hover:border-stone-400 hover:bg-stone-800",
                      )}
                    >
                      <img
                        src={OBSESSION_URL}
                        alt=""
                        className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-150 object-contain opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40 motion-safe:transition-opacity"
                      />
                      <span className="w-full">{prompts.get(id)}</span>
                      {completion && (
                        <span className="flex w-full flex-wrap items-center justify-center gap-x-1 text-xs font-medium text-red-200">
                          <Check
                            aria-hidden="true"
                            className="size-3 shrink-0"
                          />
                          {completion.playerId !== genericPlayer.id && (
                            <span className="min-w-0">
                              <span className="sr-only">Completed by </span>
                              {completion.playerName}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <p role="status" className="sr-only">
            {announcement}
          </p>
        </section>
      </PageWrapper>
    </div>
  );
}
