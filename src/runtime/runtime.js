import BrowserRuntime from "./browser/browserRuntime.js";


console.log(
    "CRAFT Runtime Loaded"
);


const app =
    document.getElementById(
        "app"
    );


app.innerHTML = `
<div class="craft-player-header">
    <div class="craft-header-left">
        <div class="craft-logo" id="craft-logo"></div>
        <div class="craft-header-text">
            <div class="craft-course-title" id="craft-course-title">Course</div>
            <div class="craft-scene-counter" id="craft-scene-counter">Scene 1 of 1</div>
        </div>
    </div>
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
`;


const stage =
    document.getElementById(
        "craft-stage"
    );


const runtime =
    new BrowserRuntime(
        stage
    );


function currentPageHasUnreadTabPanel() {

    const currentPage =
        runtime.navigation.current();


    for (const layer of currentPage?.layers ?? []) {

        for (const component of layer.components ?? []) {

            if (component.type !== "TAB_PANEL") {

                continue;

            }


            const isRead =
                runtime.state.variables.get(
                    `tabPanel.${component.id}`
                ) === true;


            if (!isRead) {

                return true;

            }

        }

    }


    return false;

}



function currentPageHasUnreadRevealPanel() {

    const currentPage =
        runtime.navigation.current();


    for (const layer of currentPage?.layers ?? []) {

        for (const component of layer.components ?? []) {

            if (component.type !== "REVEAL_PANEL") {

                continue;

            }


            const isRead =
                runtime.state.variables.get(
                    `revealPanel.${component.id}`
                ) === true;


            if (!isRead) {

                return true;

            }

        }

    }


    return false;

}



function currentPageHasUnresolvedDragDrop() {

    const currentPage =
        runtime.navigation.current();


    for (const layer of currentPage?.layers ?? []) {

        for (const component of layer.components ?? []) {

            if (component.type !== "DRAG_DROP") {

                continue;

            }


            const isResolved =
                runtime.state.variables.get(
                    `dragDrop.${component.id}`
                )?.resolved === true;


            if (!isResolved) {

                return true;

            }

        }

    }


    return false;

}



function currentPageHasUnresolvedBranching() {

    const currentPage =
        runtime.navigation.current();


    for (const layer of currentPage?.layers ?? []) {

        for (const component of layer.components ?? []) {

            if (component.type !== "BRANCHING") {

                continue;

            }


            // A choice recorded against this component's id means the
            // learner already picked an option — including a NEXT_SCREEN
            // option, which deliberately stays on this page rather than
            // navigating away. Only still-unanswered branching should
            // block Next.
            const alreadyChosen =
                runtime.state.variables.has(
                    `branching.${component.id}`
                );


            if (!alreadyChosen) {

                return true;

            }

        }

    }


    return false;

}



function updateChrome() {

    const total =
        runtime.navigation.totalPages();

    const index =
        runtime.navigation.currentIndex();

    const progress =
        runtime.navigation.progress();


    const counterEl =
        document.getElementById(
            "craft-scene-counter"
        );

    if (counterEl) {

        counterEl.textContent =
            `Scene ${index + 1} of ${total}`;

    }


    const fillEl =
        document.getElementById(
            "craft-progress-fill"
        );

    if (fillEl) {

        fillEl.style.width =
            `${progress}%`;

    }


    const backBtn =
        document.getElementById(
            "craft-back-btn"
        );

    if (backBtn) {

        backBtn.disabled =
            !runtime.navigation.hasPrevious();

    }


    const nextBtn =
        document.getElementById(
            "craft-next-btn"
        );

    if (nextBtn) {

        // A page with branching options is navigated only by choosing
        // an option — the Next button must not offer a way to skip
        // past the choice.
        nextBtn.disabled =
            currentPageHasUnresolvedBranching() ||
            currentPageHasUnreadTabPanel() ||
            currentPageHasUnreadRevealPanel() ||
            currentPageHasUnresolvedDragDrop() ||
            !runtime.navigation.hasNext();

    }

}


// Lets renderers (e.g. tabPanelRenderer.js) ask the header/footer chrome
// to re-check its state after something changes that doesn't itself
// trigger navigation, like checking a "I have read this" checkbox.
runtime.onStateChange = updateChrome;


document.getElementById(
    "craft-back-btn"
).addEventListener(
    "click",
    () => runtime.previous()
);


document.getElementById(
    "craft-next-btn"
).addEventListener(
    "click",
    () => runtime.next()
);


fetch(
    "./data/course.json"
)
.then(
    response =>
    response.json()
)
.then(
    course => {

        const titleEl =
            document.getElementById(
                "craft-course-title"
            );

        if (titleEl) {

            titleEl.textContent =
                course?.course?.title ?? "Course";

        }


        const logoEl =
            document.getElementById(
                "craft-logo"
            );

        const logoSrc =
            course?.branding?.logo?.src;

        if (logoEl) {

            if (logoSrc) {

                logoEl.innerHTML =
                    `<img src="./${logoSrc}" alt="">`;

            } else {

                logoEl.textContent =
                    "LOGO";

            }

        }


        // Start mounting, but don't wait for the full first-scene
        // playback to finish before wiring up the header. `navigation`
        // is created synchronously inside mount() before its first
        // await, so it already exists at this point.
        const mountPromise =
            runtime.mount(course);


        runtime.navigation.on(
            "afterNavigate",
            updateChrome
        );

        updateChrome();


        return mountPromise;

    }
)
.catch(
    error =>
    console.error(error)
);
