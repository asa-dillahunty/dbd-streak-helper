import lobbyGif from "@/assets/dbd-lobby-campfire.gif";
import lobbyStill from "@/assets/dbd-lobby-campfire.jpg";

export default function LobbyBackground() {
  return (
    <picture className="pointer-events-none fixed inset-0 -z-10 bg-black">
      <source media="(prefers-reduced-motion: reduce)" srcSet={lobbyStill} />
      <img
        src={lobbyGif}
        alt=""
        className="h-full w-full object-cover object-[32%_center] opacity-80 sm:object-center"
      />
    </picture>
  );
}
