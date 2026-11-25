import { Link } from "react-router-dom";
import "./css/LandingPage.css";
import PageWrapper from "./PageWrapper";
import { FaArrowRightLong } from "react-icons/fa6";

export default function LandingPage() {
  // const navigation
  const pages = [
    { to: "./streaks", label: "Streaks" },
    { to: "./hardcore", label: "Hard Core" },
    { to: "./testing", label: "Testing Page" },
  ];

  return (
    <PageWrapper>
      <div className="flex-col flex">
        {pages.map(({ to, label }) => (
          <Link
            key={to}
            className="p-4 my-2 bg-accent w-full hover:underline flex flex-row gap-8 items-center justify-between"
            to={to}
          >
            {label} <FaArrowRightLong className="text-xl" />
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
