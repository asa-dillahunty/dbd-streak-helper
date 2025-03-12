// Define interfaces for streak data.
export interface Survivor {
  perks: string[];
  item: string | null;
  addons: string[];
  offering?: string | null;
  escapeStatus: boolean;
  score?: number;
}

export interface Killer {
  name: string;
  perks: string[];
  addons: string[];
  offering?: string | null;
  score?: number;
}

export interface Streak {
  id: string;
  title: string;
  type?: string;
  settings?: Record<string, any>;
  games: Game[];
}

export interface Game {
  survivors?: [Survivor, Survivor, Survivor, Survivor]; // 4 survivors
  killer?: Killer;
  gensCompleted?: number;
  hookStages?: number;
  kills?: number;
  escapes?: number;
  elapsedTime?: number;
  completedTime?: number;
  success: boolean;
  score?: number;
}
