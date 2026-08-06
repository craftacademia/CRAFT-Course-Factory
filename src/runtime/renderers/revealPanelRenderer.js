export default class RevealPanelRenderer {

    tabContentHtml(tab) {

        const imageHtml =
            tab.image
            ? `<img class="reveal-content-icon" src="./${tab.image.src}" alt="">`
            : "";


        return `
${imageHtml}
<h3 class="reveal-content-title">${tab.title ?? ""}</h3>
<p class="reveal-content-text">${tab.text ?? ""}</p>
`;

    }



    render(component, context) {

        const tabs =
            component.properties?.tabs ?? [];


        const sidebarButtons =
            tabs
            .map(
                (tab, index) => `

<button
class="reveal-tab-btn${index === 0 ? " active" : ""}"
data-reveal-tab="${component.id}"
data-tab-index="${index}"
${index === 0 ? "" : "disabled"}>
${tab.title ?? ""}
</button>

`
            )
            .join("");


        const firstTabContent =
            tabs[0]
            ? this.tabContentHtml(tabs[0])
            : "";


        const html = `
<div class="reveal-panel" data-component-id="${component.id}">

    <div class="reveal-sidebar">
        ${sidebarButtons}
    </div>

    <div class="reveal-content" data-reveal-content="${component.id}">
        ${firstTabContent}
    </div>

</div>

<div
class="reveal-checkbox-wrap"
data-reveal-checkbox-wrap="${component.id}"
style="display:${tabs.length <= 1 ? "block" : "none"};">

    <label class="tab-checkbox-label">
        <input type="checkbox" data-reveal-checkbox="${component.id}">
        I have read all
    </label>

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

        const tabs =
            component.properties?.tabs ?? [];


        const buttons =
            rootElement.querySelectorAll(
                `[data-reveal-tab="${component.id}"]`
            );


        const contentEl =
            rootElement.querySelector(
                `[data-reveal-content="${component.id}"]`
            );


        const checkboxWrap =
            rootElement.querySelector(
                `[data-reveal-checkbox-wrap="${component.id}"]`
            );


        const checkbox =
            rootElement.querySelector(
                `[data-reveal-checkbox="${component.id}"]`
            );


        // Tab 0's content is already shown from render() — it counts
        // as opened immediately, which unlocks tab 1 right away too.
        let highestOpenedIndex = 0;


        const unlockNext =
        (index) => {

            const nextButton =
                rootElement.querySelector(
                    `[data-reveal-tab="${component.id}"][data-tab-index="${index + 1}"]`
                );


            if (nextButton) {

                nextButton.disabled = false;

            }

        };


        const showCheckboxIfDone =
        () => {

            if (
                highestOpenedIndex >= tabs.length - 1 &&
                checkboxWrap
            ) {

                checkboxWrap.style.display = "block";

            }

        };


        unlockNext(0);

        showCheckboxIfDone();


        for (const button of buttons) {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.tabIndex
                        );


                    const tab =
                        tabs[index];


                    if (!tab) {
                        return;
                    }


                    for (const other of buttons) {

                        other.classList.remove("active");

                    }

                    button.classList.add("active");


                    if (contentEl) {

                        contentEl.innerHTML =
                            this.tabContentHtml(tab);

                    }


                    if (index > highestOpenedIndex) {

                        highestOpenedIndex = index;

                    }


                    unlockNext(index);

                    showCheckboxIfDone();

                }
            );

        }


        if (checkbox) {

            checkbox.addEventListener(
                "change",
                () => {

                    runtime.state.variables.set(
                        `revealPanel.${component.id}`,
                        checkbox.checked
                    );


                    if (typeof runtime.onStateChange === "function") {

                        runtime.onStateChange();

                    }

                }
            );

        }

    }

}
