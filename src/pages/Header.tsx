import { isDarkTheme, toggleTheme } from "@/lib/utils";
import { useState } from "react";
import { FaArrowLeft, FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();
  const [darkTheme, setDarkTheme] = useState(isDarkTheme());

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav("/dbd-streak-helper/", { replace: true });
    }
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setDarkTheme(isDarkTheme());
  };

  return (
    <>
      <header className="flex flex-row items-center justify-between px-4">
        <button
          onClick={handleBack}
          className="flex flex-row gap-2 items-center hover:underline cursor-pointer p-4"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-5xl text-center p-8 font-bold">
          DBD Streak Helper
        </h1>
        <button
          onClick={handleToggleTheme}
          className="inline-flex items-center justify-center text-5xl bg-accent p-4 rounded-full cursor-pointer"
        >
          {darkTheme ? <IoSunnyOutline /> : <FaMoon />}
        </button>
      </header>
    </>
  );
}
