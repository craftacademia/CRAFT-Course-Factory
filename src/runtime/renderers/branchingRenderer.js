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


    bind(rootElement, component, runtime) {

        const buttons =
            rootElement.querySelectorAll(
                `[data-branching-id="${component.id}"]`
            );


        for (const button of buttons) {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.optionIndex
                        );


                    const option =
                        component.properties.options[index];


                    if (runtime?.navigate &&
                        option?.next) {

                        runtime.navigate(
                            option.next
                        );

                    }

                }
            );

        }

    }

}