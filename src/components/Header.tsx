import { cn, isDarkTheme, toggleTheme } from "@/lib/utils";
import { useState } from "react";
import { FaArrowLeft, FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const lobbyButton =
  "inline-flex h-11 items-center justify-center gap-2 border border-input bg-card px-3 text-sm text-card-foreground hover:border-selected-border hover:bg-selected hover:text-selected-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function Header({ showBack = true }: { showBack?: boolean }) {
  const nav = useNavigate();
  const [darkTheme, setDarkTheme] = useState(isDarkTheme);
  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(
    window.location.hostname,
  );

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav("/dbd-streak-helper/", { replace: true });
    }
  };

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border bg-linear-to-b from-card to-card/75 px-4 py-4 text-card-foreground sm:px-8 sm:py-5">
      {showBack && (
        <button
          aria-label="Back"
          onClick={handleBack}
          className={cn(lobbyButton, "justify-self-start cursor-pointer")}
        >
          <FaArrowLeft aria-hidden="true" />
          <span className="hidden sm:inline">Back</span>
        </button>
      )}
      <h1 className="col-start-2 text-center text-sm font-bold tracking-[0.12em] uppercase sm:text-xl sm:tracking-[0.18em]">
        DBD Streak Helper
      </h1>
      {isLocal && (
        <button
          aria-label={
            darkTheme ? "Switch to light theme" : "Switch to dark theme"
          }
          onClick={() => setDarkTheme(toggleTheme())}
          className={cn(
            lobbyButton,
            "w-11 justify-self-end cursor-pointer text-base",
          )}
        >
          {darkTheme ? <IoSunnyOutline /> : <FaMoon />}
        </button>
      )}
    </header>
  );
}
