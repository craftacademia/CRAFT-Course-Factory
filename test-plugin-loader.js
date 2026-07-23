import { loadPlugins } from "./src/core/pluginLoader.js";
import registry from "./src/core/apiRegistry.js";

await loadPlugins("./src/apis/interactions");

console.log(registry.categories());
console.log(registry.getAll("interactions").map(p => p.name));
