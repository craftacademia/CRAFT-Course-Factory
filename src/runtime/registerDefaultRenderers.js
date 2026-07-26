import NarrationRenderer from "./renderers/narrationRenderer.js";
import DialogueRenderer from "./renderers/dialogueRenderer.js";
import BackgroundRenderer from "./renderers/backgroundRenderer.js";
import CharacterRenderer from "./renderers/characterRenderer.js";
import LocationRenderer from "./renderers/locationRenderer.js";

export default function registerDefaultRenderers(registry) {

    if (!registry) {
        throw new Error("ComponentRegistry is required.");
    }

    registry.register("NARRATION", new NarrationRenderer());
    registry.register("DIALOGUE", new DialogueRenderer());
    registry.register("BACKGROUND", new BackgroundRenderer());
    registry.register("CHARACTER", new CharacterRenderer());
    registry.register("LOCATION", new LocationRenderer());

}