import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EXIT_URL } from "@/assets/gameData";
import LobbyBackground from "../components/LobbyBackground";

export default function Lost() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center bg-stone-950 p-6 text-stone-100">
      <LobbyBackground />
      <div className="w-full max-w-lg border border-stone-600/80 border-l-2 border-l-red-600 bg-linear-to-r from-stone-950 to-stone-900/90 p-6 sm:p-10">
        <h1 className="text-2xl font-bold uppercase tracking-wide sm:text-4xl">
          <span className="mb-3 block text-sm tracking-[0.25em] text-red-300">
            404
          </span>
          The Entity Claimed This Page
        </h1>
        <p className="mt-3 text-stone-300">
          The page you’re looking for couldn’t be found.
        </p>
        <Link
          className="group mt-8 flex min-h-14 w-full max-w-xs items-center gap-4 border border-stone-600/80 border-l-2 border-l-stone-500 bg-stone-950 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] hover:border-red-600/70 hover:border-l-red-500 hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 motion-safe:transition-colors"
          to="/dbd-streak-helper/"
        >
          <img
            src={EXIT_URL}
            alt=""
            className="size-7 shrink-0 scale-200 object-contain"
          />
          <span className="flex-1">Return to the Campfire</span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-stone-400 group-hover:text-red-300 group-focus-visible:text-red-300"
          />
        </Link>
      </div>
    </main>
  );
}
