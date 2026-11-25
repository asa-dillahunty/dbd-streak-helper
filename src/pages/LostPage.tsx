import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EXIT_URL } from "@/assets/gameData";
import LobbyBackground from "../components/LobbyBackground";

export default function Lost() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center bg-background p-6 text-foreground">
      <LobbyBackground />
      <div className="w-full max-w-lg border border-input border-l-2 border-l-selected-border bg-linear-to-r from-card to-muted/95 p-6 text-card-foreground sm:p-10">
        <h1 className="text-2xl font-bold uppercase tracking-wide sm:text-4xl">
          <span className="mb-3 block text-sm tracking-[0.25em] text-selected-foreground">
            404
          </span>
          The Entity Claimed This Page
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you’re looking for couldn’t be found.
        </p>
        <Link
          className="group mt-8 flex min-h-14 w-full max-w-xs items-center gap-4 border border-input border-l-2 bg-card px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] hover:border-selected-border hover:bg-selected hover:text-selected-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors"
          to="/dbd-streak-helper/"
        >
          <img
            src={EXIT_URL}
            alt=""
            className="size-7 shrink-0 scale-200 object-contain invert dark:invert-0"
          />
          <span className="flex-1">Return to the Campfire</span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground group-hover:text-selected-foreground group-focus-visible:text-selected-foreground"
          />
        </Link>
      </div>
    </main>
  );
}
