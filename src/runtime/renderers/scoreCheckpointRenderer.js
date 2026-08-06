export default class ScoreCheckpointRenderer {

    render(component, context) {

        const html = `
<div class="score-checkpoint-panel" data-component-id="${component.id}">
    <div class="score-checkpoint-module-name" data-checkpoint-module="${component.id}"></div>
    <div class="score-checkpoint-module-score" data-checkpoint-module-score="${component.id}"></div>
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

        const moduleNameEl =
            rootElement.querySelector(
                `[data-checkpoint-module="${component.id}"]`
            );


        const moduleScoreEl =
            rootElement.querySelector(
                `[data-checkpoint-module-score="${component.id}"]`
            );


        const currentTotal =
            typeof runtime.computeTotalScore === "function"
            ? runtime.computeTotalScore()
            : 0;


        // Rolling baseline: the running score total at the moment the
        // PREVIOUS checkpoint was reached (0 if this is the first one).
        // This module's own score is simply how much the total has
        // grown since then.
        const baseline =
            runtime.state.variables.get(
                "scoreCheckpointBaseline"
            ) ?? 0;


        const moduleScore =
            currentTotal - baseline;


        const moduleName =
            component.properties?.moduleName ?? "";


        const max =
            component.properties?.max ?? 0;


        if (moduleNameEl) {

            moduleNameEl.textContent =
                moduleName;

        }


        if (moduleScoreEl) {

            moduleScoreEl.textContent =
                `Score: ${moduleScore}/${max}`;

        }


        // Set the baseline for the NEXT checkpoint to measure from.
        runtime.state.variables.set(
            "scoreCheckpointBaseline",
            currentTotal
        );

    }

}
