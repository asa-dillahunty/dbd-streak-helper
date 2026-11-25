import { EXIT_URL } from "@/assets/gameData";
import { useNavigate } from "react-router-dom";
import FogVideo from "@/assets/1511501-cannonbreed-rest-area.gif";

export default function Lost() {
  const nav = useNavigate();

  return (
    <>
      <main className="mx-auto p-4 flex-col flex justify-center items-center h-1/2">
        <img
          className="fixed top-0 left-0 w-full h-full object-cover"
          src={FogVideo}
        />
        <h2 className="text-4xl z-1 bg-primary/70 text-primary-foreground p-6">
          404: The Entity claims another victim
        </h2>
        <button
          className="flex flex-col mt-10 bg-accent/70 p-4 rounded-lg cursor-pointer hover:bg-accent z-1"
          onClick={() => nav("/dbd-streak-helper/")}
        >
          <div>Escape the Fog</div>
          <img src={EXIT_URL} alt="exit" />
        </button>
      </main>
    </>
  );
}
