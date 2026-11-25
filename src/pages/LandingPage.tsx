import { Link } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import { ChevronRight, Flame, FlaskConical, Skull } from "lucide-react";
import lobbyGif from "@/assets/dbd-lobby-campfire.gif";
import lobbyStill from "@/assets/dbd-lobby-campfire.jpg";

const pages = [
  { to: "./streaks", label: "Streaks", icon: Flame },
  { to: "./hardcore", label: "Hard Core", icon: Skull },
  { to: "./testing", label: "Testing Page", icon: FlaskConical },
];

export default function LandingPage() {
  return (
    <div className="relative isolate min-h-dvh text-white">
      <picture className="pointer-events-none fixed inset-0 -z-10 bg-black">
        <source media="(prefers-reduced-motion: reduce)" srcSet={lobbyStill} />
        <img
          src={lobbyGif}
          alt=""
          className="h-full w-full object-cover object-[32%_center] opacity-80 sm:object-center"
        />
      </picture>
      <PageWrapper>
        <nav
          aria-label="Main menu"
          className="mt-8 grid w-full max-w-xs gap-2 sm:mt-[clamp(3rem,12vh,9rem)] sm:ml-6 sm:self-start"
        >
          {pages.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              className="group flex min-h-14 items-center gap-4 border border-stone-600/80 border-l-2 border-l-stone-500 bg-linear-to-r from-stone-950 to-stone-900/85 px-4 py-3 text-stone-100 hover:border-orange-400/60 hover:border-l-orange-400 hover:from-[#351b14] hover:to-stone-950 focus-visible:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 motion-safe:transition-colors"
              to={to}
            >
              <Icon
                aria-hidden="true"
                className="size-5 shrink-0 text-stone-400 group-hover:text-orange-300 group-focus-visible:text-orange-300"
              />
              <span className="flex-1 text-sm font-bold tracking-[0.16em] uppercase">
                {label}
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-stone-400 group-hover:text-orange-300 group-focus-visible:text-orange-300"
              />
            </Link>
          ))}
        </nav>
      </PageWrapper>
    </div>
  );
}
