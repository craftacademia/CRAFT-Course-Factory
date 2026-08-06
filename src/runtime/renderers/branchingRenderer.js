export default class BranchingRenderer {

    render(component, context) {

        const style =
            component.properties?.style ?? "instant";


        const options =
            component.properties?.options ?? [];


        let html;


        if (style === "mcq") {

            html =
                this.renderMcq(
                    component,
                    options
                );

        } else if (style === "hotspot") {

            html =
                this.renderHotspot(
                    component,
                    options
                );

        } else {

            html =
                this.renderInstant(
                    component,
                    options
                );

        }


        if (context && typeof context.append === "function") {

            context.append(
                `<div class="branch-options branch-options--${style} branch-options--locked" data-component-id="${component.id}">${html}</div>`
            );

        }


        return html;

    }



    renderInstant(component, options) {

        return options
            .map((option, index) => `

<button
class="branch-option"
data-branching-id="${component.id}"
data-option-index="${index}">
<span class="branch-option-label">Option ${index + 1}</span>
${option.text ?? ""}
</button>

`)
            .join("");

    }



    renderMcq(component, options) {

        const radios =
            options
            .map((option, index) => `

<label class="mcq-option">
    <input
    type="radio"
    name="mcq-${component.id}"
    data-branching-id="${component.id}"
    data-option-index="${index}">
    <span>${option.text ?? ""}</span>
</label>

`)
            .join("");


        return `
${radios}
<button
class="mcq-submit-btn"
data-branching-submit="${component.id}"
disabled>
Submit
</button>
`;

    }



    renderHotspot(component, options) {

        return options
            .map((option, index) => `

<div
class="hotspot-option"
data-branching-id="${component.id}"
data-option-index="${index}">
    <img src="./${option.image?.src ?? ""}" alt="">
    <span class="hotspot-caption">${option.text ?? ""}</span>
</div>

`)
            .join("");

    }



    async selectOption(
        component,
        option,
        runtime,
        index
    ) {

        if (!option) {
            return;
        }


        // Stop any option voice-over still playing, and tell the
        // playback loop in browserRuntime.js to stop moving to
        // further options.
        runtime.branchingChoicePending = false;

        if (runtime.currentAudio) {

            runtime.currentAudio.pause();

            runtime.currentAudio = null;

        }


        // Directly, synchronously unblock the old audio-wait loop
        // (rather than relying on the async 'pause' event) so its
        // branchingChoicePending check runs and it exits cleanly
        // BEFORE the new page below starts playing its own audio —
        // otherwise the two can overlap.
        if (typeof runtime.currentAudioResolve === "function") {

            runtime.currentAudioResolve();

            runtime.currentAudioResolve = null;

        }


        // isTransitioning is also cleared directly here, for the same
        // reason — the flag's normal clearing (in a finally block, once
        // the old render chain actually finishes) isn't guaranteed to
        // happen before this click's own navigate() call checks it.
        runtime.isTransitioning = false;


        runtime.state.variables.set(
            `branching.${component.id}`,
            {
                selected:index,
                option
            }
        );


        // NEXT_SCREEN is a real keyword, not a page ID — it means "this
        // choice doesn't branch anywhere special, just record it and let
        // the learner continue via the normal Next button." Recording the
        // selection above already satisfies the "choice has been made"
        // check that re-enables Next, so there's nothing further to do.
        const isNextScreenKeyword =
            (option.next ?? "")
                .toUpperCase() === "NEXT_SCREEN";


        if (
            option.next &&
            !isNextScreenKeyword &&
            runtime.navigate
        ) {

            await runtime.navigate(
                option.next
            );

        }

    }



    bind(
        rootElement,
        component,
        runtime
    ) {

        const style =
            component.properties?.style ?? "instant";


        if (style === "mcq") {

            this.bindMcq(
                rootElement,
                component,
                runtime
            );

            return;

        }


        // Both "instant" and "hotspot" work the same way: clicking the
        // option (a text button, or a document image) selects it
        // immediately, with no separate submit step.
        const clickTargets =
            rootElement.querySelectorAll(
                `[data-branching-id="${component.id}"]`
            );


        for (const target of clickTargets) {

            target.addEventListener(
                "click",
                async () => {

                    const index =
                        Number(
                            target.dataset.optionIndex
                        );


                    const option =
                        component.properties.options[index];


                    await this.selectOption(
                        component,
                        option,
                        runtime,
                        index
                    );

                }
            );

        }

    }



    bindMcq(
        rootElement,
        component,
        runtime
    ) {

        const submitButton =
            rootElement.querySelector(
                `[data-branching-submit="${component.id}"]`
            );


        const radios =
            rootElement.querySelectorAll(
                `[data-branching-id="${component.id}"]`
            );


        for (const radio of radios) {

            radio.addEventListener(
                "change",
                () => {

                    if (submitButton) {

                        submitButton.disabled = false;

                    }

                }
            );

        }


        if (submitButton) {

            submitButton.addEventListener(
                "click",
                async () => {

                    const checked =
                        rootElement.querySelector(
                            `[data-branching-id="${component.id}"]:checked`
                        );


                    if (!checked) {

                        return;

                    }


                    const index =
                        Number(
                            checked.dataset.optionIndex
                        );


                    const option =
                        component.properties.options[index];


                    await this.selectOption(
                        component,
                        option,
                        runtime,
                        index
                    );

                }
            );

        }

    }

}
