import fs from "fs/promises";
import path from "path";


export default class RuntimeBuilder {


    async build(outputDirectory) {


        await fs.mkdir(
            outputDirectory,
            {
                recursive: true
            }
        );


        const runtimeSource =
            path.resolve(
                "src/providers/rendering/runtime"
            );


        const runtimeFiles = [
            "assessment.js",
            "branching.js",
            "navigation.js",
            "variables.js"
        ];


        for (const file of runtimeFiles) {

            await fs.copyFile(
                path.join(
                    runtimeSource,
                    file
                ),
                path.join(
                    outputDirectory,
                    file
                )
            );

        }



        const coreFiles = [

            "componentRegistry.js",
            "registerDefaultRenderers.js",
            "runtimeOrchestrator.js",
            "runtimeState.js",
            "variableStore.js",
            "assetLoader.js",
            "navigationEngine.js",
            "interactionRenderer.js",
            "eventScheduler.js",
            "renderContext.js",
            "runtimePlayer.js"

        ];


        for (const file of coreFiles) {

            await fs.copyFile(
                path.resolve(
                    "src/runtime",
                    file
                ),
                path.join(
                    outputDirectory,
                    file
                )
            );

        }



        const interactionDirectory =
            path.join(
                outputDirectory,
                "interactions"
            );


        await fs.mkdir(
            interactionDirectory,
            {
                recursive: true
            }
        );


        const interactionFiles = [

            "interactionRegistry.js",
            "interaction.js",
            "mcqInteraction.js",
            "msqInteraction.js",
            "hotspotInteraction.js",
            "clickToRevealInteraction.js",
            "dragDropInteraction.js",
            "reflectionInteraction.js",
            "branchingInteraction.js",
            "caseStudyInteraction.js",
            "dialogueChoiceInteraction.js",
            "sortingInteraction.js"

        ];


        for (const file of interactionFiles) {

            await fs.copyFile(
                path.resolve(
                    "src/runtime/interactions",
                    file
                ),
                path.join(
                    interactionDirectory,
                    file
                )
            );

        }



        await fs.mkdir(
            path.join(
                outputDirectory,
                "browser"
            ),
            {
                recursive: true
            }
        );


        await fs.copyFile(
            path.resolve(
                "src/runtime/browser/browserRuntime.js"
            ),
            path.join(
                outputDirectory,
                "browser",
                "browserRuntime.js"
            )
        );



        const rendererDirectory =
            path.join(
                outputDirectory,
                "renderers"
            );


        await fs.mkdir(
            rendererDirectory,
            {
                recursive: true
            }
        );


        const rendererFiles = [

            "componentRenderer.js",
            "dialogueRenderer.js",
            "narrationRenderer.js",
            "backgroundRenderer.js",
            "locationRenderer.js",
            "propRenderer.js",
            "characterRenderer.js",
            "textRenderer.js",
            "imageRenderer.js",
            "audioRenderer.js",
            "branchingRenderer.js"

        ];


        for (const file of rendererFiles) {

            await fs.copyFile(
                path.resolve(
                    "src/runtime/renderers",
                    file
                ),
                path.join(
                    rendererDirectory,
                    file
                )
            );

        }



        const runtimeEntry = `

import "./componentRegistry.js";
import "./registerDefaultRenderers.js";

import "./navigation.js";
import "./branching.js";
import "./assessment.js";
import "./variables.js";

import RuntimeOrchestrator from "./runtimeOrchestrator.js";


window.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "CRAFT Runtime Loaded"
        );


        const app =
            document.getElementById(
                "app"
            );


        const orchestrator =
            new RuntimeOrchestrator(
                app
            );


        await orchestrator.initialize(
            window.PIR
        );


        await orchestrator.start();

    }
);

`;



        await fs.writeFile(
            path.join(
                outputDirectory,
                "runtime.js"
            ),
            runtimeEntry,
            "utf8"
        );


        return outputDirectory;

    }


}