import GameSummary from "@/components/GameSummary";
import LootBoxSelector from "@/components/LootBoxSelector";

import killerPerks from "../assets/killer_perks.json";
import SelectGrid from "@/components/SelectGrid";
for (const perk of killerPerks) {
  perk.iconURL = perk.iconURL.split(".png")[0] + ".png";
}

const Testing: React.FC = () => {
  return (
    <div className="flex flex-col h-screen p-4 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Here</h1>
      <SelectGrid items={killerPerks} />
      {/* <LootBoxSelector items={killerPerks} /> */}
    </div>
  );
};

export default Testing;
