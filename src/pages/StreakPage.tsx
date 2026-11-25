import GameSummary from "@/components/GameSummary";
import Header from "@/components/Header";
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

  if (!streak) {
    return (
      <>
        <Header />
        <main className="mt-4 text-center">Streak not found.</main>
      </>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col p-4">
        <h2 className="mb-4 text-2xl font-bold">{streak.title}</h2>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-lg border bg-muted p-2"
        >
          {streak.games.map((game, index) => (
            <GameSummary key={index} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StreakPage;
