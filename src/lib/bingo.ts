import type { PlayerColor } from "./playerColors";

export interface BingoPrompt {
  id: string;
  text: string;
}

interface Completion {
  playerId: string;
  playerName: string;
  iconURL?: string;
  color?: PlayerColor;
}

export interface BingoBoardState {
  customPrompts: BingoPrompt[];
  layout: string[];
  completions: Partial<Record<string, Completion>>;
  freeSpace: boolean;
}

export const CENTER_INDEX = 12;
const BOARD_SIZE = 25;

const starterPrompts = [
  "Finish a generator",
  "Make a safe unhook",
  "Cleanse a totem",
  "Open a chest",
  "Vault a window in chase",
  "Heal a teammate",
  "Take a protection hit",
  "Complete a co-op repair",
  "Stun the Killer with a pallet",
  "Escape a chase",
  "Land a great skill check",
  "Pick up a dropped item",
  "Blind the Killer",
  "Finish healing yourself",
  "Sabotage a hook",
  "Bless a totem",
  "Drop a pallet in chase",
  "Hide in a locker",
  "Open an exit gate",
  "Escape through the hatch",
  "Recover while downed",
  "Be the Obsession",
  "Watch the Killer kick a generator",
  "Find the basement",
  "Escape through an exit gate",
].map((text, index) => ({ id: `starter-${index + 1}`, text }));

export const initialBingoBoard: BingoBoardState = {
  customPrompts: [],
  layout: starterPrompts.map(({ id }) => id),
  completions: {},
  freeSpace: true,
};

export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

export function getPrompts(customPrompts: BingoPrompt[]): BingoPrompt[] {
  return [...customPrompts, ...starterPrompts];
}

function availableStarters(customPrompts: BingoPrompt[]): BingoPrompt[] {
  const customText = new Set(
    customPrompts.map(({ text }) => normalizeText(text)),
  );
  return starterPrompts.filter(
    ({ text }) => !customText.has(normalizeText(text)),
  );
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function drawLayout(
  customPrompts: BingoPrompt[],
  freeSpace: boolean,
): string[] {
  const custom = shuffle(customPrompts).slice(0, BOARD_SIZE);
  const fillers = shuffle(availableStarters(customPrompts)).slice(
    0,
    BOARD_SIZE - custom.length,
  );
  const drawn = [...custom, ...fillers];
  if (!freeSpace) return shuffle(drawn).map(({ id }) => id);

  // Fillers stay behind the Free Space when possible so custom prompts are visible.
  const center = drawn.pop()!;
  const layout = shuffle(drawn).map(({ id }) => id);
  layout.splice(CENTER_INDEX, 0, center.id);
  return layout;
}

export function updatePromptPool(
  board: BingoBoardState,
  customPrompts: BingoPrompt[],
): BingoBoardState {
  const oldIds = new Set(board.customPrompts.map(({ id }) => id));
  const poolChanged =
    customPrompts.length !== oldIds.size ||
    customPrompts.some(({ id }) => !oldIds.has(id));
  const available = [...customPrompts, ...availableStarters(customPrompts)];
  const availableIds = new Set(available.map(({ id }) => id));
  const allIds = new Set(getPrompts(customPrompts).map(({ id }) => id));
  const completions = Object.fromEntries(
    Object.entries(board.completions).filter(([id]) => allIds.has(id)),
  );

  if (poolChanged) {
    return {
      ...board,
      customPrompts,
      completions,
      layout: drawLayout(customPrompts, board.freeSpace),
    };
  }

  // A rename can shadow a starter already on the board. Replace only that slot.
  const currentIds = new Set(board.layout);
  const replacements = shuffle(
    available.filter(({ id }) => !currentIds.has(id)),
  );
  const layout = board.layout.map((id) =>
    availableIds.has(id) ? id : replacements.pop()!.id,
  );
  return { ...board, customPrompts, completions, layout };
}

export function toggleCompletion(
  board: BingoBoardState,
  promptId: string,
  completion: Completion,
): BingoBoardState {
  if (board.freeSpace && board.layout[CENTER_INDEX] === promptId) return board;

  const completions = { ...board.completions };
  if (completions[promptId]?.playerId === completion.playerId) {
    delete completions[promptId];
  } else {
    completions[promptId] = completion;
  }
  return { ...board, completions };
}
