import fs from "fs/promises";
import path from "path";

export default class RuntimeBuilder {

    async build(outputFile) {

        const outputDirectory = path.dirname(outputFile);

        const runtimeFiles = [
            "browser/browserRuntime.js",
            "runtimePlayer.js",
            "assetLoader.js",
            "navigationEngine.js",
            "componentRegistry.js",
            "eventScheduler.js",
            "renderContext.js",
            "registerDefaultRenderers.js",
            "renderers/componentRenderer.js",
            "renderers/narrationRenderer.js",
            "renderers/dialogueRenderer.js",
            "renderers/backgroundRenderer.js",
            "renderers/characterRenderer.js",
            "renderers/locationRenderer.js",
            "renderers/propRenderer.js"
        ];


        for (const file of runtimeFiles) {

            const source =
                path.resolve(
                    process.cwd(),
                    "src/runtime",
                    file
                );

            const target =
                path.join(
                    outputDirectory,
                    file
                );

            await fs.mkdir(
                path.dirname(target),
                {
                    recursive: true
                }
            );

            await fs.copyFile(
                source,
                target
            );

        }


        const runtime = `
import BrowserRuntime from "./browser/browserRuntime.js";

document.addEventListener("DOMContentLoaded", async () => {

    const app = document.getElementById("app");

    const runtime = new BrowserRuntime(app);

    await runtime.mount(window.PIR);

});
`;

        await fs.writeFile(
            outputFile,
            runtime,
            "utf8"
        );

        return outputFile;

    }

}
