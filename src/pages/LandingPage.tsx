import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { ChevronRight } from "lucide-react";
import {
  BASEMENT_URL,
  DYING_URL,
  HOOK_URL,
  HUNTER_URL,
  OBJECTIVES_URL,
  OBSESSION_URL,
  SACRIFICED_URL,
} from "@/assets/gameData";
import LobbyBackground from "../components/LobbyBackground";

const pages = [
  { to: "./streaks", label: "Streaks", icon: HOOK_URL },
  { to: "./hardcore", label: "Hard Core", icon: SACRIFICED_URL },
  { to: "./bingo/", label: "Bingo", icon: OBJECTIVES_URL },
  { to: "./testing", label: "Testing Page", icon: DYING_URL },
];

export default function LandingPage() {
  return (
    <div className="relative isolate min-h-dvh text-white">
      <LobbyBackground />
      <PageWrapper showBack={false}>
        <nav
          aria-label="Main menu"
          className="mt-8 grid w-full max-w-xs gap-2 sm:mt-[clamp(3rem,12vh,9rem)] sm:ml-6 sm:self-start"
        >
          {pages.map(({ to, label, icon }) => (
            <Link
              key={to}
              className="group flex min-h-14 items-center gap-4 border border-stone-600/80 border-l-2 border-l-stone-500 bg-linear-to-r from-stone-950 to-stone-900/85 px-4 py-3 text-stone-100 hover:border-red-600/70 hover:border-l-red-500 hover:from-red-950 hover:to-stone-950 focus-visible:border-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 motion-safe:transition-colors"
              to={to}
            >
              <img
                src={icon}
                alt=""
                className="size-5 shrink-0 scale-150 object-contain"
              />
              <span className="flex-1 text-sm font-bold tracking-[0.16em] uppercase">
                {label}
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-stone-400 group-hover:text-red-300 group-focus-visible:text-red-300"
              />
            </Link>
          ))}
        </nav>
      </PageWrapper>
    </div>
  );
}
