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

        nextBtn.disabled =
            !runtime.navigation.hasNext();

    }

}


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
