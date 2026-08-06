export default class TabPanelRenderer {

    render(component, context) {

        const bullets =
            component.properties?.bullets ?? [];


        const bulletHtml =
            bullets
            .map(
                bullet => `<li>${bullet}</li>`
            )
            .join("");


        const html = `
<div class="tab-panel" data-component-id="${component.id}">

    <button class="tab-open-btn" data-tab-open="${component.id}">
        Click to open
    </button>

    <div class="tab-panel-content" data-tab-content="${component.id}" style="display:none;">

        <ul class="tab-bullet-list">
            ${bulletHtml}
        </ul>

        <label class="tab-checkbox-label">
            <input type="checkbox" data-tab-checkbox="${component.id}">
            I have read this
        </label>

    </div>

</div>
`;


        if (context && typeof context.append === "function") {

            context.append(html);

        }


        return html;

    }



    bind(
        rootElement,
        component,
        runtime
    ) {

        const openButton =
            rootElement.querySelector(
                `[data-tab-open="${component.id}"]`
            );


        const contentBlock =
            rootElement.querySelector(
                `[data-tab-content="${component.id}"]`
            );


        const checkbox =
            rootElement.querySelector(
                `[data-tab-checkbox="${component.id}"]`
            );


        if (openButton && contentBlock) {

            openButton.addEventListener(
                "click",
                () => {

                    contentBlock.style.display =
                        "block";

                    openButton.style.display =
                        "none";

                },
                { once: true }
            );

        }


        if (checkbox) {

            checkbox.addEventListener(
                "change",
                () => {

                    if (checkbox.checked) {

                        runtime.state.variables.set(
                            `tabPanel.${component.id}`,
                            true
                        );

                    } else {

                        runtime.state.variables.set(
                            `tabPanel.${component.id}`,
                            false
                        );

                    }


                    // Tell the header/footer chrome to re-check whether
                    // Next should now be enabled — checking this box
                    // doesn't navigate anywhere on its own.
                    if (typeof runtime.onStateChange === "function") {

                        runtime.onStateChange();

                    }

                }
            );

        }

    }

}
