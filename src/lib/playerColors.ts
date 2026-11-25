export const playerColors = {
  Blue: "#60a5fa",
  Amber: "#fbbf24",
  Green: "#4ade80",
  Purple: "#c084fc",
  Pink: "#f472b6",
  Teal: "#2dd4bf",
  Orange: "#fb923c",
  Red: "#fb7185",
};

export type PlayerColor = keyof typeof playerColors;
export const playerColorOptions = Object.keys(playerColors) as PlayerColor[];

export function defaultPlayerColor(index: number): PlayerColor {
  return playerColorOptions[index % playerColorOptions.length];
}
