import { copyFile, mkdir } from "node:fs/promises";
import staticRoutes from "../src/staticRoutes.json" with { type: "json" };

const dist = new URL("../dist/", import.meta.url);
const entry = new URL("index.html", dist);

for (const route of Object.values(staticRoutes)) {
  const directory = new URL(`${route}/`, dist);
  await mkdir(directory, { recursive: true });
  await copyFile(entry, new URL("index.html", directory));
}

// GitHub Pages serves this shell for dynamic streak URLs and unknown paths.
await copyFile(entry, new URL("404.html", dist));
