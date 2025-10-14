import rawKillers from "@/assets/killers.json";
import rawSurvivors from "@/assets/survivors.json";
import rawKillerPerks from "@/assets/killer_perks.json";
import rawSurvivorPerks from "@/assets/survivor_perks.json";

export function useGameData() {
  const killers = rawKillers;
  const survivors = rawSurvivors;
  const killerPerks = rawKillerPerks;
  const survivorPerks = rawSurvivorPerks;

  for (const killer of killers) {
    killer.iconURL = killer.iconUrl;
  }

  for (const s of survivors) {
    s.iconURL = s.iconUrl;
  }

  for (const perk of killerPerks) {
    perk.iconURL = perk.iconUrl;
  }

  for (const perk of survivorPerks) {
    perk.iconURL = perk.iconUrl;
  }

  return { killers, survivors, killerPerks, survivorPerks };
}

export const HOOK_URL =
  "https://deadbydaylight.wiki.gg/images/IconHelpLoading_hook.png";

export const DYING_URL =
  "https://deadbydaylight.wiki.gg/images/IconHelp_dying.png";

export const SACRIFICED_URL =
  "https://deadbydaylight.wiki.gg/images/IconHelp_Sacrificed.png";

export const EXIT_URL =
  "https://deadbydaylight.wiki.gg/images/IconHelp_exitGates.png";

export const OBSESSION_URL =
  "https://deadbydaylight.wiki.gg/images/IconHelp_obsession.png";
