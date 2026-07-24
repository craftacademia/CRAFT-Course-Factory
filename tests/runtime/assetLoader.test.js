import AssetLoader from "../../src/runtime/assetLoader.js";

const loader = new AssetLoader();

console.log(loader.has("BG_001"));

loader.clear();

console.log(loader.has("BG_001"));