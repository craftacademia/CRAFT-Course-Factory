import ComponentRegistry from "../../src/runtime/componentRegistry.js";

const registry = new ComponentRegistry();

registry.register("NARRATION", {
    render() {
        console.log("Narration Renderer");
    }
});

registry.register("DIALOGUE", {
    render() {
        console.log("Dialogue Renderer");
    }
});

console.log(registry.has("NARRATION"));
console.log(registry.has("VIDEO"));

registry.get("NARRATION").render();
registry.get("DIALOGUE").render();