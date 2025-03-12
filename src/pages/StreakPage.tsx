import GameSummary from "@/components/GameSummary";
import { Streak } from "@/lib/customTypes";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const StreakPage: React.FC = () => {
  const { id: streakId } = useParams<{ id: string }>();
  const path = useParams();
  const streaks: Streak[] = JSON.parse(localStorage.getItem("streaks") || "[]");
  const streak = streaks.find((s) => s.id === streakId);
  const scrollRef = useRef<HTMLDivElement>(null);

  //   console.log(streaks, streakId);
  console.log(path);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streak]);

  if (!streak) return <div className="text-center mt-4">Streak not found.</div>;

  return (
    <div className="flex flex-col h-screen p-4 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">{streak.title}</h1>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto border rounded-lg p-2 bg-gray-100"
      >
        {streak.games.map((game, index) => (
          <GameSummary key={index} game={game} />
        ))}
      </div>
    </div>
  );
};

export default StreakPage;
