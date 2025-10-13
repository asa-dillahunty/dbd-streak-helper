import {
  EXIT_URL,
  OBSESSION_URL,
  SACRIFICED_URL,
  useGameData,
} from "@/assets/gameData";
import TrapperVideo from "@/assets/the-trapper-dead-by-daylight.3840x2160.mp4";
import HardcorePNG from "@/assets/hardcore.png";
import SurvivorPNG from "@/assets/survivor.png";

import SelectGrid from "@/components/SelectGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import usePersistedState from "@/lib/usePersistedState";
import { cn } from "@/lib/utils";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PrizeItem } from "@/components/PrizeWheel";

interface HCSurvivor {
  name: string;
  iconURL: string;
  perks?: (PrizeItem | undefined)[];
  ownedBy?: PrizeItem | null;
  killed?: boolean;
  escapes?: number;
}

interface ContextValueType {
  removeSurvivor: (survivor: HCSurvivor) => void;
  updatePerk: (
    survivor: HCSurvivor,
    perkIndex: number,
    perk: PrizeItem
  ) => void;
  updateEscapes: (survivor: HCSurvivor, escapes: number) => void;
  setSurvivorOwner: (survivor: HCSurvivor, player: PrizeItem | null) => void;
  killSurvivor: (survivor: HCSurvivor, isKilled: boolean) => void;
  selectedPlayer: PrizeItem | null;
  setSelectedPlayer: Dispatch<SetStateAction<PrizeItem | null>>;
}

const HCContext = createContext<ContextValueType | null>(null);

export const useHCC = () => {
  const context = useContext(HCContext);
  if (!context) {
    throw new Error("useHC must be used within an HCProvider");
  }
  return context;
};

export default function HardCore() {
  const { survivors: rawSurvivors } = useGameData();

  const [survivors, setSurvivors] = usePersistedState<HCSurvivor[]>(
    "survivors",
    rawSurvivors
  );
  const [selectedPlayer, setSelectedPlayer] = useState<PrizeItem | null>(null);

  const reset = () => {
    setSurvivors(rawSurvivors);
  };

  const removeSurvivor = (survivor: HCSurvivor) => {
    setSurvivors((prev) => prev.filter((surv) => surv !== survivor));
  };

  const updatePerk = (
    survivor: HCSurvivor,
    perkIndex: number,
    perk: PrizeItem
  ) => {
    setSurvivors((prev) =>
      prev.map((surv) => {
        if (surv === survivor) {
          if (!surv.perks) {
            surv.perks = [, , ,];
          }
          surv.perks[perkIndex] = perk;
          return surv;
        }
        return surv;
      })
    );
  };

  const updateEscapes = (survivor: HCSurvivor, escapes: number) => {
    setSurvivors((prev) =>
      prev.map((surv) => {
        if (surv === survivor) {
          surv.escapes = escapes;
          return surv;
        }
        return surv;
      })
    );
  };

  const setSurvivorOwner = (survivor: HCSurvivor, player: PrizeItem | null) => {
    setSurvivors((prev) =>
      prev.map((surv) => {
        if (surv === survivor) {
          surv.ownedBy = player;
        }
        return surv;
      })
    );
  };

  const killSurvivor = (survivor: HCSurvivor, isKilled: boolean) => {
    setSurvivors((prev) =>
      prev.map((surv) => {
        if (surv === survivor) {
          surv.killed = isKilled;
        }
        return surv;
      })
    );
  };

  const contextValue = {
    removeSurvivor,
    updatePerk,
    updateEscapes,
    setSurvivorOwner,
    killSurvivor,
    selectedPlayer,
    setSelectedPlayer,
  };

  return (
    <HCContext value={contextValue}>
      <TooltipProvider delayDuration={750}>
        <div className="flex flex-col items-center pb-20 pt-10">
          <video
            className="fixed top-0 left-0 w-full h-full object-cover"
            src={TrapperVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          <img src={HardcorePNG} alt={"hardcore"} className="z-1 -mb-20 p-0" />
          <img src={SurvivorPNG} alt={"survivor"} className="z-1 mb-0 p-0" />
          <div className="flex flex-row items-center px-10">
            <HCSurvivors survivors={survivors} />
          </div>
          <Button onClick={reset} className="z-1">
            Reset
          </Button>
        </div>
      </TooltipProvider>
    </HCContext>
  );
}

function HCSurvivors({ survivors }: { survivors: HCSurvivor[] }) {
  return (
    <div className="flex flex-row pb-20 flex-wrap gap-2 justify-center">
      {survivors.map((survivor, index) => (
        <SurvivorSmall key={index} survivor={survivor} />
      ))}
      <Players />
    </div>
  );
}

function SurvivorSmall({ survivor }: { survivor: HCSurvivor }) {
  const {
    removeSurvivor,
    killSurvivor,
    setSurvivorOwner,
    selectedPlayer,
    updateEscapes,
  } = useHCC();

  const incEscapes = () => {
    updateEscapes(survivor, (survivor.escapes || 0) + 1);
  };

  const decEscapes = () => {
    updateEscapes(survivor, (survivor.escapes || 0) - 1);
  };

  return (
    <div className="flex flex-col items-center bg-slate-800/80 rounded text-white p-2 justify-center relative group">
      <Button
        variant={"ghost"}
        size={"sm"}
        className="absolute top-0.5 right-0.5 rounded-full p-0 size-6 group-hover:opacity-50 opacity-0 transition-opacity duration-1000 ease-in"
        onClick={(e) => {
          removeSurvivor(survivor);
          e.stopPropagation();
        }}
      >
        <IoClose />
      </Button>
      <div className="relative w-28 h-28 flex items-center justify-center overflow-hidden group">
        <img
          src={OBSESSION_URL}
          alt={"hovering"}
          className={cn(
            "scale-175 object-center bg-black/50 duration-500 absolute z-0 opacity-0 group-hover:opacity-100",
            survivor.killed ? "hidden" : ""
          )}
        />
        <img
          src={survivor.iconURL}
          alt={survivor.name}
          className={cn(
            "w-28 h-28 absolute top-0 bg-black/50 rounded-xs transition-colors duration-500 z-1",
            selectedPlayer ? "cursor-latched" : "cursor-carrying"
          )}
          onClick={(e) => {
            if (selectedPlayer) {
              if (selectedPlayer.name === survivor.ownedBy?.name) {
                setSurvivorOwner(survivor, null);
              } else {
                setSurvivorOwner(survivor, selectedPlayer);
              }
            } else {
              killSurvivor(survivor, !survivor.killed);
            }
            e.stopPropagation();
          }}
        />
      </div>

      <p className="break-words text-wrap">{survivor.name}</p>
      <div className="flex flex-row">
        {/* In here we have perks and escapes */}
        <div className="w-28 h-20 flex flex-wrap flex-row justify-center gap-0.5">
          {/* perks */}
          {[0, 1, 2, 3].map((num) => (
            <PerkDiamond
              key={num}
              perk={survivor?.perks?.[num]}
              perkIndex={num}
              survivor={survivor}
            />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div
            className="w-8 h-8 overflow-hidden hover:bg-slate-700 hover:cursor-pointer"
            onClick={incEscapes}
          >
            <img src={EXIT_URL} className="scale-175 object-center" />
          </div>
          <p>{survivor.escapes || 0}</p>
          {survivor.ownedBy && (
            <img
              src={survivor.ownedBy.iconURL}
              alt={survivor.ownedBy.name}
              onClick={decEscapes}
              className="w-7 h-7 bg-black/50 rounded-xs hover:cursor-pointer"
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          "w-full h-full absolute top-0 right-0 bg-red-900/50 transition-opacity duration-500 opacity-100 z-10 rounded",
          survivor.killed ? "" : "opacity-0 pointer-events-none"
        )}
      >
        <img
          src={SACRIFICED_URL}
          alt={"death"}
          onClick={() => killSurvivor(survivor, !survivor.killed)}
          className="w-21 h-30 hover:cursor-pointer m-auto"
        />
      </div>
    </div>
  );
}

interface PerkDiamondPropTypes {
  perk?: PrizeItem;
  perkIndex: number;
  survivor: HCSurvivor;
}

function PerkDiamond({ perk, perkIndex, survivor }: PerkDiamondPropTypes) {
  const [open, setOpen] = useState(false);
  const { survivorPerks } = useGameData();
  const { updatePerk } = useHCC();
  return (
    <Dialog open={open}>
      <DialogTrigger
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {perk?.name ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <img
                src={perk.iconURL}
                alt={perk.name}
                className="w-10 h-10 bg-black/50 rounded-xs hover:bg-black/20 hover:cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent side={perkIndex < 2 ? "top" : "bottom"}>
              {perk.name}
            </TooltipContent>
          </Tooltip>
        ) : (
          <img className="w-10 h-10 bg-black/50 rounded-xs hover:bg-black/20 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-250"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Select Perk</DialogTitle>
          <DialogDescription>Select Perk</DialogDescription>
          <Button
            variant={"ghost"}
            className="absolute top-0.5 right-0.5"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </Button>
        </DialogHeader>
        <SelectGrid
          items={survivorPerks}
          handleSelection={(selectedPerk) => {
            updatePerk(survivor, perkIndex, selectedPerk);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function Players() {
  const [open, setOpen] = useState(false);
  const { setSelectedPlayer } = useHCC();

  const players = [
    {
      name: "stantley",
      iconURL:
        "https://avatars.akamai.steamstatic.com/3b8cb1147355991b99ded67f6d8631efece64d53_full.jpg",
    },
    {
      name: "terracottapot17",
      iconURL:
        "https://avatars.akamai.steamstatic.com/ca744c812b0a990376ab314e8f38ea8c6481d3c8_full.jpg",
    },
  ];

  if (open) {
    return (
      <div className="fixed top-1/5 right-1 z-10 pointer-events-none">
        <div className="flex flex-col justify-center gap-1 items-end">
          <Button
            onClick={() => {
              setOpen(false);
              setSelectedPlayer(null);
            }}
            className="bg-slate-800/80 hover:bg-slate-800 pointer-events-auto"
          >
            <FaArrowRight />
          </Button>
          {players.map((player, index) => (
            <PlayerSmall key={index} player={player} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed top-1/5 right-1 z-10">
        <Button
          onClick={() => setOpen(true)}
          className="bg-slate-800/80 hover:bg-slate-800"
        >
          <FaArrowLeft />
        </Button>
      </div>
    );
  }
}

function PlayerSmall({ player }: { player: PrizeItem }) {
  const { selectedPlayer, setSelectedPlayer } = useHCC();
  return (
    <div
      onClick={(e) => {
        if (selectedPlayer?.name === player.name) {
          setSelectedPlayer(null);
        } else {
          setSelectedPlayer(player);
        }
        e.stopPropagation();
      }}
      className={cn(
        "flex flex-row justify-center items-center gap-2 bg-slate-800/80 hover:bg-slate-800 hover:cursor-pointer px-2 py-1 text-white rounded pointer-events-auto",
        selectedPlayer?.name === player.name
          ? "bg-blue-800/80 hover:bg-blue-800 "
          : ""
      )}
    >
      <div>{player.name}</div>
      <img
        src={player.iconURL}
        alt={player.name}
        className="w-7 h-7 bg-black/50 rounded-xs"
      />
    </div>
  );
}
