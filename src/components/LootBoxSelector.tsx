import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { PrizeItem } from "./PrizeWheel";

interface LootBoxSelectorProps {
  items: PrizeItem[];
}

export default function LootBoxSelector({ items }: LootBoxSelectorProps) {
  const cardWidth = 150; // width of each icon container in pixels
  const gap = 20; // gap between icons in pixels
  const totalCardWidth = cardWidth + gap;
  const scrollGoal = 100;
  const spinDuration = 5; // spin duration in seconds

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [containerCenter, setContainerCenter] = useState(0);
  const [visibleBufferCycles, setVisibleBufferCycles] = useState(0);
  const [initialIndex, setInitialIndex] = useState(0);

  const getOffsetOfIndex = (
    index: number,
    containerCenterOverride?: number
  ) => {
    const itemCenter = index * totalCardWidth + cardWidth / 2;
    if (containerCenterOverride) return containerCenterOverride - itemCenter;
    return containerCenter - itemCenter;
  };

  const scrollCycles = Math.ceil(scrollGoal / items.length);
  // buffers on both sides
  const totalItems = items.length * (visibleBufferCycles * 2 + scrollCycles);

  const controls = useAnimation();
  const [spinning, setSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [selectedNoise, setSelectedNoise] = useState(0);

  // Create a repeated list of items.
  const repeatedItems = Array.from({ length: totalItems }, (_, index) => {
    return items[index % items.length];
  });

  useEffect(() => {
    if (containerRef.current) {
      const cc = containerRef.current.offsetWidth / 2;
      const vbc = Math.ceil(
        containerRef.current.offsetWidth / totalCardWidth / items.length
      );
      const ii = vbc * items.length;

      setContainerCenter(cc);
      setVisibleBufferCycles(vbc);
      setInitialIndex(ii);

      controls.set({ x: getOffsetOfIndex(ii, cc) });
    }
  }, [containerRef, items]);

  const finishSpin = (index: number, noise: number) => {
    const resetIndex = initialIndex + index;
    // immediately reset without a visible jump to the first list
    controls.stop();
    controls.set({ x: getOffsetOfIndex(resetIndex) + noise });
    setSpinning(false);
  };

  const spin = () => {
    if (!containerRef.current) return;
    if (spinning) {
      finishSpin(selectedIndex, selectedNoise);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomNoise = (Math.random() - 0.5) * cardWidth;
    // const randomIndex = items.length - 1;

    // actual index
    const actualIndex =
      initialIndex + scrollCycles * items.length + randomIndex;

    controls.start({
      x: getOffsetOfIndex(actualIndex) + randomNoise,
      transition: {
        duration: spinDuration,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo -> https://easings.net/
      },
    });

    setSelectedIndex(randomIndex);
    setSelectedNoise(randomNoise);
    timeoutRef.current = setTimeout(
      () => finishSpin(randomIndex, randomNoise),
      spinDuration * 1000
    );
  };

  return (
    <div className="relative flex flex-col items-center gap-5">
      <div
        className="relative w-200 border border-gray-300 rounded-md bg-slate-900 overflow-hidden"
        ref={containerRef}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-500/20 pointer-events-none z-1" />
        <motion.div
          animate={controls}
          className="flex items-center pt-5 pb-5"
          style={{ gap: `${gap}px` }}
        >
          {repeatedItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-slate-700 rounded-lg"
              style={{ width: `${cardWidth}px`, height: `${cardWidth}px` }}
            >
              <img
                src={item.iconURL}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
      <button
        onClick={spin}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      <div className="mt-4">
        Selected Prize:{" "}
        {selectedIndex !== null && !spinning && items[selectedIndex]?.name}
      </div>
    </div>
  );
}
