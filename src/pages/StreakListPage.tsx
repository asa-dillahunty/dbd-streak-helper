import { Button } from "@/components/ui/button";
import { Game, Streak } from "@/lib/customTypes";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StreakListPage: React.FC = () => {
  const [streaks, setStreaks] = useState<Streak[]>([exampleStreak]);

  // Load streaks from localStorage
  //   useEffect(() => {
  //     const streaksJson = localStorage.getItem("streaks");
  //     if (streaksJson) {
  //       try {
  //         const parsed = JSON.parse(streaksJson) as Streak[];
  //         setStreaks(parsed);
  //       } catch (err) {
  //         console.error("Failed to parse streaks from localStorage", err);
  //       }
  //     }
  //   }, []);

  // Count successful games in a streak
  const successfulGamesCount = (games: Game[]) =>
    games.filter((game) => game.success).length;

  const saveStreaks = () => {
    localStorage.setItem("streaks", JSON.stringify(streaks));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Streaks</h1>
      <div className="mb-4">
        <Link
          to="/new"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Start a New Streak
        </Link>
      </div>
      {streaks.length === 0 ? (
        <p>No streaks found. Start a new streak to begin!</p>
      ) : (
        <ul className="space-y-4">
          {streaks.map((streak) => (
            <li
              key={streak.id}
              className="border p-4 rounded hover:bg-gray-100 transition-colors"
            >
              <Link to={`/streak/${streak.id}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{streak.title}</h2>
                    <p>
                      Successful Games: {successfulGamesCount(streak.games)}
                    </p>
                  </div>
                  <div className="text-blue-600 font-medium">
                    View Details &rarr;
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button onClick={() => saveStreaks()}></Button>
    </div>
  );
};

export default StreakListPage;

const exampleStreak: Streak = {
  id: "streak-001",
  title: "Killer Win Streak",
  type: "Killer",
  settings: { difficulty: "Hard", mapPreference: "Random" },
  games: [
    {
      killer: {
        name: "The Trapper",
        perks: [
          "Hex: Ruin",
          "Pop Goes the Weasel",
          "Corrupt Intervention",
          "Hex: No One Escapes Death",
        ],
        addons: ["Trapper Bag", "Tar Bottle"],
        offering: "Petrified Oak",
        score: 28_500,
      },
      gensCompleted: 3,
      hookStages: 7,
      kills: 3,
      escapes: 1,
      elapsedTime: 600,
      completedTime: Date.now() - 600_000,
      success: true,
      score: 28_500,
    },
    {
      killer: {
        name: "The Wraith",
        perks: [
          "Shadowborn",
          "Sloppy Butcher",
          "Bamboozle",
          "Barbecue & Chilli",
        ],
        addons: ["Windstorm - Blood", "Swift Hunt - White"],
        offering: "Bloody Party Streamers",
        score: 31_200,
      },
      gensCompleted: 5,
      hookStages: 9,
      kills: 4,
      escapes: 0,
      elapsedTime: 720,
      completedTime: Date.now() - 1_200_000,
      success: true,
      score: 31_200,
    },
    {
      killer: {
        name: "The Hillbilly",
        perks: ["Enduring", "Spirit Fury", "Tinkerer", "Lightborn"],
        addons: ["Doom Engravings", "Begrimed Chains"],
        offering: "Sacrificial Ward",
        score: 19_800,
      },
      gensCompleted: 4,
      hookStages: 6,
      kills: 2,
      escapes: 2,
      elapsedTime: 540,
      completedTime: Date.now() - 1_800_000,
      success: false,
      score: 19_800,
    },
    {
      killer: {
        name: "The Nurse",
        perks: [
          "A Nurse's Calling",
          "Thanatophobia",
          "Make Your Choice",
          "Rancor",
        ],
        addons: ["Kavanagh's Last Breath", "Plaid Flannel"],
        offering: "MacMillan Estate Offering",
        score: 35_400,
      },
      gensCompleted: 2,
      hookStages: 10,
      kills: 4,
      escapes: 0,
      elapsedTime: 810,
      completedTime: Date.now() - 2_400_000,
      success: true,
      score: 35_400,
    },
  ],
};
