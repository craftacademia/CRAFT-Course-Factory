import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

export async function loadPlugins(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pluginPath = path.join(directory, entry.name, "index.js");

    try {
      await fs.access(pluginPath);
      await import(pathToFileURL(pluginPath).href);
      console.log(`✓ Loaded ${entry.name}`);
    } catch {
      // Ignore folders without index.js
    }
  }
}
