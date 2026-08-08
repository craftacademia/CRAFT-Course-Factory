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
import BrowserRuntime from "./browser/browserRuntime.js";

console.log("CRAFT Runtime Loaded");

const app = document.getElementById("app");

app.innerHTML = \`
<div class="craft-player-header">
    <div class="craft-header-left">
        <div class="craft-logo" id="craft-logo"></div>
        <div class="craft-header-text">
            <div class="craft-course-title" id="craft-course-title">Course</div>
            <div class="craft-scene-counter" id="craft-scene-counter">Scene 1 of 1</div>
        </div>
    </div>
    <div class="craft-score-display" id="craft-score-display">Score: 0</div>
    <div class="craft-actions">
        <span class="craft-icon-btn" title="Menu">&#9776;</span>
        <span class="craft-icon-btn" title="Help">?</span>
        <span class="craft-icon-btn" title="Exit">&times;</span>
    </div>
</div>

<div class="craft-progress-track">
    <div class="craft-progress-fill" id="craft-progress-fill"></div>
</div>

<div class="craft-player-stage" id="craft-stage"></div>

<div class="craft-player-footer">
    <button class="craft-nav-btn" id="craft-back-btn">&larr; Back</button>
    <button class="craft-nav-btn" id="craft-pause-btn">&#10073;&#10073; Pause</button>
    <button class="craft-nav-btn" id="craft-next-btn">Next &rarr;</button>
</div>
\`;

const stage = document.getElementById("craft-stage");

const runtime = new BrowserRuntime(stage);

function currentPageHasUnreadTabPanel() {
    const currentPage = runtime.navigation.current();
    for (const layer of currentPage?.layers ?? []) {
        for (const component of layer.components ?? []) {
            if (component.type !== "TAB_PANEL") continue;
            const isRead = runtime.state.variables.get(\`tabPanel.\${component.id}\`) === true;
            if (!isRead) return true;
        }
    }
    return false;
}

function currentPageHasUnreadRevealPanel() {
    const currentPage = runtime.navigation.current();
    for (const layer of currentPage?.layers ?? []) {
        for (const component of layer.components ?? []) {
            if (component.type !== "REVEAL_PANEL") continue;
            const isRead = runtime.state.variables.get(\`revealPanel.\${component.id}\`) === true;
            if (!isRead) return true;
        }
    }
    return false;
}

function currentPageHasUnresolvedDragDrop() {
    const currentPage = runtime.navigation.current();
    for (const layer of currentPage?.layers ?? []) {
        for (const component of layer.components ?? []) {
            if (component.type !== "DRAG_DROP") continue;
            const isResolved = runtime.state.variables.get(\`dragDrop.\${component.id}\`)?.resolved === true;
            if (!isResolved) return true;
        }
    }
    return false;
}

function computeTotalScore() {
    const allVars = runtime.state.variables.all();
    let total = 0;
    for (const [key, value] of Object.entries(allVars)) {
        if (key.startsWith("branching.")) {
            total += Number(value?.option?.score) || 0;
        } else if (key.startsWith("dragDrop.")) {
            total += Number(value?.score) || 0;
        }
    }
    return total;
}

function computeOverallMaxScore() {
    let total = 0;
    for (const page of runtime.course?.pages ?? []) {
        for (const layer of page.layers ?? []) {
            for (const component of layer.components ?? []) {
                if (component.type === "SCORE_CHECKPOINT") {
                    total += Number(component.properties?.max) || 0;
                }
            }
        }
    }
    return total;
}

function currentPageHasUnresolvedBranching() {
    const currentPage = runtime.navigation.current();
    for (const layer of currentPage?.layers ?? []) {
        for (const component of layer.components ?? []) {
            if (component.type !== "BRANCHING") continue;
            const alreadyChosen = runtime.state.variables.has(\`branching.\${component.id}\`);
            if (!alreadyChosen) return true;
        }
    }
    return false;
}

function updateChrome() {
    const total = runtime.navigation.totalPages();
    const index = runtime.navigation.currentIndex();
    const progress = runtime.navigation.progress();

    const counterEl = document.getElementById("craft-scene-counter");
    if (counterEl) counterEl.textContent = \`Scene \${index + 1} of \${total}\`;

    const fillEl = document.getElementById("craft-progress-fill");
    if (fillEl) fillEl.style.width = \`\${progress}%\`;

    const scoreEl = document.getElementById("craft-score-display");
    if (scoreEl) scoreEl.textContent = \`Score: \${computeTotalScore()}/\${computeOverallMaxScore()}\`;

    const backBtn = document.getElementById("craft-back-btn");
    if (backBtn) {
        backBtn.disabled = !runtime.dialogueComplete || !runtime.navigation.hasPrevious();
    }

    const nextBtn = document.getElementById("craft-next-btn");
    if (nextBtn) {
        nextBtn.disabled =
            !runtime.dialogueComplete ||
            currentPageHasUnresolvedBranching() ||
            currentPageHasUnreadTabPanel() ||
            currentPageHasUnreadRevealPanel() ||
            currentPageHasUnresolvedDragDrop() ||
            !runtime.navigation.hasNext();
    }
}

runtime.onStateChange = updateChrome;
runtime.computeTotalScore = computeTotalScore;

document.getElementById("craft-back-btn").addEventListener("click", () => runtime.previous());
document.getElementById("craft-next-btn").addEventListener("click", () => runtime.next());

const course = window.PIR;

const titleEl = document.getElementById("craft-course-title");
if (titleEl) titleEl.textContent = course?.course?.title ?? "Course";

const logoEl = document.getElementById("craft-logo");
const logoSrc = course?.branding?.logo?.src;
if (logoEl) {
    if (logoSrc) {
        logoEl.innerHTML = \`<img src="./\${logoSrc}" alt="">\`;
    } else {
        logoEl.textContent = "LOGO";
    }
}

const mountPromise = runtime.mount(course);

runtime.navigation.on("afterNavigate", updateChrome);

updateChrome();

mountPromise.catch(
    error => console.error(error)
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