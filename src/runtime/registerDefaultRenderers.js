import NarrationRenderer from "./renderers/narrationRenderer.js";
import DialogueRenderer from "./renderers/dialogueRenderer.js";
import BackgroundRenderer from "./renderers/backgroundRenderer.js";
import CharacterRenderer from "./renderers/characterRenderer.js";
import LocationRenderer from "./renderers/locationRenderer.js";
import PropRenderer from "./renderers/propRenderer.js";

import TextRenderer from "./renderers/textRenderer.js";
import ImageRenderer from "./renderers/imageRenderer.js";
import AudioRenderer from "./renderers/audioRenderer.js";
import BranchingRenderer from "./renderers/branchingRenderer.js";
import TabPanelRenderer from "./renderers/tabPanelRenderer.js";
import RevealPanelRenderer from "./renderers/revealPanelRenderer.js";


export default function registerDefaultRenderers(registry) {

    if (!registry) {
        throw new Error(
            "ComponentRegistry is required."
        );
    }


    registry.register(
        "NARRATION",
        new NarrationRenderer()
    );


    registry.register(
        "DIALOGUE",
        new DialogueRenderer()
    );


    registry.register(
        "BACKGROUND",
        new BackgroundRenderer()
    );


    registry.register(
        "CHARACTER",
        new CharacterRenderer()
    );


    registry.register(
        "LOCATION",
        new LocationRenderer()
    );


    registry.register(
        "PROP",
        new PropRenderer()
    );


    registry.register(
        "TEXT",
        new TextRenderer()
    );


    registry.register(
        "IMAGE",
        new ImageRenderer()
    );


    registry.register(
        "AUDIO",
        new AudioRenderer()
    );


    registry.register(
        "BRANCHING",
        new BranchingRenderer()
    );


    registry.register(
        "TAB_PANEL",
        new TabPanelRenderer()
    );


    registry.register(
        "REVEAL_PANEL",
        new RevealPanelRenderer()
    );

}