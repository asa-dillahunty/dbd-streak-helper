import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface PrizeItem {
  name: string;
  iconURL: string;
}

interface PrizeWheelProps {
  items: PrizeItem[];
  setResult: Dispatch<SetStateAction<PrizeItem>>;
  options?: PrizeWheelOptions;
}

interface PrizeWheelOptions {
  size?: number;
  orientation?: "right" | "top";
  showText?: boolean;
}

const getDefaultOptions = () => ({
  size: 700,
  orientation: "right",
  showText: true,
});

export default function PrizeWheel({
  items,
  setResult,
  options: userOptions,
}: PrizeWheelProps) {
  const options = useMemo(
    () => Object.assign(getDefaultOptions(), userOptions),
    [userOptions]
  );

  const [spinning, setSpinning] = useState(false);
  const controls = useAnimationControls();
  const [angle, setAngle] = useState(0);
  const spinTimeout = useRef<NodeJS.Timeout | null>(null);
  const [chosenItem, setChosenItem] = useState(items[0]);

  const wheelSize = options.size; // wheel width/height in px, default 700
  const spinDuration = 8; // in seconds
  const sliceAngle = useMemo(() => 360 / items.length, [items]);
  const angleBuffer = useMemo(() => {
    const requestedSize = sliceAngle / 30;
    const maxSize = 1; // buffer shouldn't be more than 2deg (set to 1 for a little extra anxiety). This is most noticeable when picking 1 of two items
    return requestedSize < maxSize ? requestedSize : maxSize;
  }, [sliceAngle]);
  const iconSize = useMemo(() => {
    const maxSize = wheelSize / 4;
    // cannot be bigger than half the slice, also need to watch the spin button
    if (sliceAngle === 360) return maxSize; // one item left
    // we get cord length using c = 2r * sin(θ/2), and by setting r = R - c
    // c = R / ( ( 1 / 2*sin(θ/2) ) + 1)
    const requestedSize = Math.floor(
      wheelSize /
        2 /
        (1 / (2 * Math.sin((sliceAngle * (Math.PI / 180)) / 2)) + 1)
    );

    return requestedSize < maxSize ? requestedSize : maxSize;
  }, [items]);

  const spinWheel = () => {
    if (spinning) {
      // stop it early
      if (spinTimeout.current) {
        // take the opportunity to 'reset' the angle
        const newAngle = angle % 360;
        controls.stop();
        controls.set({
          rotate: newAngle,
        });
        clearTimeout(spinTimeout.current);
        spinTimeout.current = null;
        setSpinning(false);
        setAngle(newAngle);
      }
      return;
    }
    setSpinning(true);
    const randomTurns = Math.floor(Math.random() * 4) + 8; // between 8-11 spins
    const randomStop = Math.random() * 360;
    const extraRotation = 360 * randomTurns + randomStop;
    let newAngle = extraRotation + angle; // we add angle here to prevent 'snapping'

    // we don't want users to not believe the result, or worse, for it to visually display incorrectly due to slight pixel differences
    const midAngleDistance = newAngle % sliceAngle; // angular distance of arrow to line
    if (midAngleDistance < angleBuffer) {
      newAngle += angleBuffer;
    } else if (midAngleDistance > sliceAngle - angleBuffer) {
      newAngle -= angleBuffer;
    }

    controls.start({
      rotate: newAngle,
      transition: {
        duration: spinDuration,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo -> https://easings.net/
      },
    });

    spinTimeout.current = setTimeout(() => {
      setSpinning(false);
    }, spinDuration * 1010);

    setAngle(newAngle);
  };

  useEffect(() => {
    const effectiveAngle = angle % 360;

    let arrowAngle = 270; // orientation is top by default
    if (options.orientation === "right") arrowAngle = 0;

    const relativeAngle = (arrowAngle - effectiveAngle + 360) % 360;
    const prizeIndex = Math.floor(relativeAngle / sliceAngle) % items.length;
    setChosenItem(items[prizeIndex]);
    setResult(items[prizeIndex]); // can angle technically be zero with a spin cancel? No, zero is too close to a mid angle, right?
  }, [angle, items]);

  return (
    <div className="flex flex-col items-center gap-4 relative w-min">
      <motion.div
        animate={controls}
        className="relative rounded-full overflow-hidden border-4 border-slate-400"
        style={{
          width: wheelSize,
          height: wheelSize,
        }}
      >
        <SlicedBackground slices={items.length} />
        {items.map((item, index) => (
          <PrizeItem
            key={index + item.name}
            item={item}
            midAngle={(index + 0.5) * sliceAngle}
            showName={options.showText && items.length > 11}
            iconSize={iconSize}
          />
        ))}
      </motion.div>
      <ArrowIndicator orientation={options.orientation} />

      <Button
        onClick={spinWheel}
        className="rounded-full absolute top-1/2 left-1/2 -translate-1/2 w-[16ch] h-[16ch] hover:opacity-100 whitespace-break-spaces"
        variant={"outline"}
      >
        {spinning
          ? "Spinning..."
          : angle === 0
            ? "Spin the Wheel"
            : chosenItem.name}
      </Button>
    </div>
  );
}

function ArrowIndicator({ orientation }: { orientation?: "right" | "top" }) {
  if (orientation === "right") {
    return (
      <>
        {/* arrow indicator */}
        <div className="absolute -right-4 top-1/2 flex justify-center -translate-y-1/2">
          <div
            className="w-0 h-0 border-t-20 border-b-20 border-r-40 border-transparent border-r-red-300"
            // style={betterShadow}
          ></div>
        </div>
        {/* box behind arrow indicator */}
        <div className="absolute -right-4 top-1/2 flex justify-center -translate-y-1/2 -z-1">
          <div className="w-0 h-0 border-22 border-red-200 drop-shadow-lg"></div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* arrow indicator */}
        <div className="absolute top-[-10px] flex justify-center">
          <div className="w-0 h-0 border-l-20 border-r-20 border-t-40 border-transparent border-t-red-300 drop-shadow-lg"></div>
        </div>
        {/* box behind arrow indicator */}
        <div className="absolute top-[-10px] flex justify-center -z-1">
          <div className="w-0 h-0  border-22 border-red-200 drop-shadow-lg"></div>
        </div>
      </>
    );
  }
}

interface PrizeItemParams {
  item: PrizeItem;
  midAngle: number;
  showName: boolean;
  iconSize: number;
}

function PrizeItem({ item, midAngle, showName, iconSize }: PrizeItemParams) {
  // const sliceAngle = 360 / items.length;
  // const midAngle = (index + 0.5) * sliceAngle;
  const textSize =
    iconSize > 45 ? "text-sm" : iconSize > 40 ? "text-xs" : "text-[.5rem]";
  return (
    <div
      className={`absolute flex flex-row items-center justify-end text-white gap-4 w-full pr-4`}
      style={{
        top: "50%",
        transform: `translateY(-50%) rotate(${midAngle}deg)`,
        transformOrigin: "center",
      }}
    >
      {showName && (
        <span className={`${textSize} font-bold text-nowrap select-none`}>
          {item.name}
        </span>
      )}
      <img
        src={item.iconURL}
        height={iconSize}
        width={iconSize}
        className="select-none"
      />
    </div>
  );
}

{
  /* background with pie slices */
}
function SlicedBackground({ slices }: { slices: number }) {
  // A set of colors to use for each slice
  // const colors = [
  //   "#f87171",
  //   "#fbbf24",
  //   "#34d399",
  //   "#60a5fa",
  //   "#a78bfa",
  //   "#f472b6",
  //   "#6ee7b7",
  //   "#facc15",
  // ];

  // const colors = [
  //   "#2E2E2E",
  //   "#383838",
  //   "#424242",
  //   "#4C4C4C",
  //   "#565656",
  //   "#606060",
  //   "#6A6A6A",
  //   "#747474",
  // ];

  // const colorList = [
  //   "rgb(30, 41, 59)", // slate-900
  //   "rgb(51, 65, 85)", // slate-800
  //   "rgb(71, 85, 105)", // slate-700
  //   "rgb(100, 116, 139)", // slate-600
  //   "rgb(148, 163, 184)", // slate-500
  //   "rgb(203, 213, 225)", // slate-400
  //   "rgb(226, 232, 240)", // slate-300
  //   "rgb(241, 245, 249)", // slate-200
  // ];

  const colorList = [
    "rgb(30, 41, 59)", // slate-900
    "rgb(51, 65, 85)", // slate-800
    "rgb(71, 85, 105)", // slate-700
    "rgb(100, 116, 139)", // slate-600
    "rgb(71, 85, 105)", // slate-700
    //   "rgb(203, 213, 225)", // slate-400
    //   "rgb(226, 232, 240)", // slate-300
    //   "rgb(241, 245, 249)", // slate-200
  ];

  // Generate a conic-gradient string with each slice colored
  const generateConicGradient = (numSlices: number): string => {
    // const colors = numSlices % 2 === 0 ? colorList : colorList.slice(1);
    const colors =
      numSlices % 2 === 0
        ? colorList.slice(0, 2)
        : numSlices % 3 === 1
          ? colorList.slice(0, 5)
          : colorList.slice(0, 3);
    // const colors = colorList.slice(0, 2);

    const sliceAngle = 360 / numSlices;
    let gradientParts: string[] = [];
    for (let i = 0; i < numSlices; i++) {
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      const color = colors[i % colors.length];
      gradientParts.push(`${color} ${start}deg ${end}deg`);
    }
    return `conic-gradient(${gradientParts.join(", ")})`;
  };

  const gradient = generateConicGradient(slices);
  return (
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: gradient,
        boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.4)",
        transform: "rotate(90deg)", // our elements' rotation start horizontally, but the gradient starts vertically
      }}
    />
  );
}
