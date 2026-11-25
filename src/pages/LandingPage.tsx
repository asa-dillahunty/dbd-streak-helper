import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { ChevronRight } from "lucide-react";
import {
  DYING_URL,
  HOOK_URL,
  OBJECTIVES_URL,
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
    <div className="relative isolate min-h-dvh bg-background text-foreground">
      <LobbyBackground />
      <PageWrapper showBack={false}>
        <nav
          aria-label="Main menu"
          className="mt-8 grid w-full max-w-xs gap-2 sm:mt-[clamp(3rem,12vh,9rem)] sm:ml-6 sm:self-start"
        >
          {pages.map(({ to, label, icon }) => (
            <Link
              key={to}
              className="group flex min-h-14 items-center gap-4 border border-input border-l-2 bg-linear-to-r from-card to-muted/90 px-4 py-3 text-card-foreground hover:border-selected-border hover:from-selected hover:to-card hover:text-selected-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors"
              to={to}
            >
              <img
                src={icon}
                alt=""
                className="size-5 shrink-0 scale-150 object-contain invert dark:invert-0"
              />
              <span className="flex-1 text-sm font-bold tracking-[0.16em] uppercase">
                {label}
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground group-hover:text-selected-foreground group-focus-visible:text-selected-foreground"
              />
            </Link>
          ))}
        </nav>
      </PageWrapper>
    </div>
  );
}
