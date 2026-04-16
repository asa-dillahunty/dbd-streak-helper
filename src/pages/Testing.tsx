import GameSummary from "@/components/GameSummary";
import LootBoxSelector from "@/components/LootBoxSelector";

import SelectGrid from "@/components/SelectGrid";
import { useState } from "react";
import PrizeWheel, { PrizeItem } from "@/components/PrizeWheel";
import { Button } from "@/components/ui/button";
import { useGameData } from "@/assets/gameData";
import HardCore from "./HardCore";
// import PipTracker from "@/components/PipTracker";

const Testing: React.FC = () => {
  const { killers, killerPerks } = useGameData();
  const [killerList, setKillerList] = useState(killers);
  const [selectedKiller, setSelectedKiller] = useState<PrizeItem>(
    killerList[0],
  );

  return (
    // <div className="flex flex-col h-screen p-4 overflow-hidden">
    <div className="flex flex-col items-center pb-20">
      {/* <HardCore /> */}
      <h1 className="text-2xl font-bold mb-4">Here</h1>
      <SelectGrid items={killerPerks} />
      {/* <PipTracker /> */}
      {/* <LootBoxSelector items={killerPerks} /> */}

      <PrizeWheel
        items={killerList}
        setResult={setSelectedKiller}
        options={{ orientation: "right" }}
      />
      <Button
        onClick={() =>
          setKillerList(
            killerList.filter((killer) => killer.name !== selectedKiller.name),
          )
        }
        className="mt-4"
      >
        Remove {selectedKiller.name}
      </Button>
      <Button
        onClick={() => {
          const randomKiller =
            killerList[Math.floor(killerList.length * Math.random())];
          setKillerList(
            killerList.filter((killer) => killer.name !== randomKiller.name),
          );
        }}
        className="mt-4"
      >
        Remove Random
      </Button>
      <LootBoxSelector items={killerList} />
      {/* <PrizeGrid items={killerPerks} />
            <PrizeGrid items={survivorPerks} />
            <PrizeWheel items={survivors} setResult={() => {}} orientation="right" />
            <PrizeWheel
              items={killerPerks}
              setResult={() => {}}
              orientation="right"
            />
            <PrizeWheel
              items={survivorPerks}
              setResult={() => {}}
              orientation="right"
            /> */}
    </div>
  );
};

export default Testing;
