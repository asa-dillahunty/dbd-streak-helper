import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PrizeWheel, { PrizeItem } from "./components/PrizeWheel";

import killers from "./assets/killers.json";
import survivors from "./assets/survivors.json";
import killerPerks from "./assets/killer_perks.json";
import survivorPerks from "./assets/survivor_perks.json";

import { useState } from "react";
import { Button } from "./components/ui/button";
import PrizeGrid from "./components/SelectGrid";
import LootBoxSelector from "./components/LootBoxSelector";

for (const killer of killers) {
  killer.iconURL = killer.iconURL.split(".png")[0] + ".png";
  killer.name = killer.killerName;
  // killer.name = killer.name.replace("&amp;", "&");
}

for (const s of survivors) {
  s.iconURL = s.iconURL.split(".png")[0] + ".png";
  s.name = s.name.replace("&amp;", "&");
}

for (const perk of killerPerks) {
  perk.iconURL = perk.iconURL.split(".png")[0] + ".png";
}

for (const perk of survivorPerks) {
  perk.iconURL = perk.iconURL.split(".png")[0] + ".png";
}

// const killersCleaned = killers.filter((killer, index) => {
//   killer.iconURL = killer.iconURL.split(".png")[0] + ".png";
//   if (index < 12) return killer;
//   else return;
// });

function App() {
  const [killerList, setKillerList] = useState(killers);
  const [selectedKiller, setSelectedKiller] = useState<PrizeItem>(
    killerList[0]
  );

  return (
    <div className="flex flex-col items-center pb-20">
      <PrizeWheel
        items={killerList}
        setResult={setSelectedKiller}
        options={{ orientation: "right" }}
      />
      <Button
        onClick={() =>
          setKillerList(
            killerList.filter((killer) => killer.name !== selectedKiller.name)
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
            killerList.filter((killer) => killer.name !== randomKiller.name)
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
}

export default App;
