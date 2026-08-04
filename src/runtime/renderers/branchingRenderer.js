export default class BranchingRenderer {

    render(component, context) {

        const options =
            component.properties?.options ?? [];


        const html =
            options
            .map((option, index) => `

<button
class="branch-option"
data-branching-id="${component.id}"
data-option-index="${index}">
${option.text ?? ""}
</button>

`)
            .join("");


        if (context && typeof context.append === "function") {

            context.append(
                `<div class="branch-options" data-component-id="${component.id}">${html}</div>`
            );

        }


        return html;

    }


    bind(
        rootElement,
        component,
        runtime
    ) {

        const buttons =
            rootElement.querySelectorAll(
                `[data-branching-id="${component.id}"]`
            );


        for (const button of buttons) {

            button.addEventListener(
                "click",
                async () => {

                    const index =
                        Number(
                            button.dataset.optionIndex
                        );


                    const option =
                        component.properties.options[index];


                    if (!option) {
                        return;
                    }


                    // Stop any option voice-over still playing, and tell
                    // the playback loop in browserRuntime.js to stop
                    // moving to further options.
                    runtime.branchingChoicePending = false;

                    if (runtime.currentAudio) {

                        runtime.currentAudio.pause();

                        runtime.currentAudio = null;

                    }


                    runtime.state.variables.set(
                        `branching.${component.id}`,
                        {
                            selected:index,
                            option
                        }
                    );


                    if (
                        option.next &&
                        runtime.navigate
                    ) {

                        await runtime.navigate(
                            option.next
                        );

                    }

                }
            );

        }

    }

}
