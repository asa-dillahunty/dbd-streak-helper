import { FaArrowRight } from "react-icons/fa";
// Predefined list of killers with icons

import killers from "../assets/killers.json";
import killerPerks from "../assets/killer_perks.json";
import { Game } from "@/lib/customTypes";

for (const killer of killers) {
  killer.iconURL = killer.iconURL.split(".png")[0] + ".png";
  killer.name = killer.killerName;
  // killer.name = killer.name.replace("&amp;", "&");
}
for (const perk of killerPerks) {
  perk.iconURL = perk.iconURL.split(".png")[0] + ".png";
}

interface GameSummaryProps {
  game: Game;
}

const GameSummary: React.FC<GameSummaryProps> = ({ game }) => {
  // Find the killer's icon from the predefined list
  const killerData = killers.find((k) => k.killerName === game.killer.name);
  const killerIcon = killerData ? killerData.iconURL : "/icons/default.png";

  // Ensure exactly 4 perks (fill empty slots if needed)
  const displayedPerks = [
    ...game.killer.perks.map((perk) => {
      const iconURL = killerPerks.find((p) => perk === p.name)?.iconURL;
      return {
        name: perk,
        iconURL: iconURL,
      };
    }),
    ...Array(4 - game.killer.perks.length).fill({
      name: "Empty Slot",
      iconURL: "/icons/empty_perk.png",
    }),
  ];
  console.log(displayedPerks);

  return (
    <div className="bg-white shadow-md p-4 rounded-lg border flex items-center">
      <div className="bg-gray-800 mr-4">
        <img
          src={killerIcon}
          alt={game.killer.name}
          className="w-16 h-16 rounded-md"
        />
      </div>

      {/* Perks */}
      <div className="flex gap-6 items-center">
        {displayedPerks.map((perk, idx) => (
          <div className="w-12 h-12 bg-slate-800 rotate-45 border-2 border-black box-border justify-center items-center flex">
            <img
              key={idx}
              src={perk.iconURL}
              alt={perk.name}
              className="w-full h-full -rotate-45 scale-150"
            />
          </div>
        ))}
      </div>

      {/* Game Stats */}
      {/* <p className="mt-2 text-sm">🔧 Gens Completed: {game.gensCompleted}</p>
      <p className="text-sm">🪦 Hook Stages: {game.hookStages}</p> */}
      {/* <FaArrowRight /> */}
    </div>
  );
};

export default GameSummary;
