export default class BranchingRenderer {

    render(component) {

        const options =
            component.properties?.options ?? [];


        return options
            .map((option, index) => `

<button
class="branch-option"
data-branching-id="${component.id}"
data-option-index="${index}">
${option.text ?? ""}
</button>

`)
            .join("");

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