export default class AssessmentEngine {

    constructor(runtimeState, interactionEngine, eventBus) {

        this.runtimeState = runtimeState;
        this.interactionEngine = interactionEngine;
        this.eventBus = eventBus;

    }

    submit(question) {

        if (question.selected === question.correct) {

            if (question.points) {

                this.interactionEngine.execute({
                    type: "ADD_SCORE",
                    points: question.points
                });

            }

            this.eventBus.emit("assessment.correct", question);

            return {
                correct: true,
                score: this.runtimeState.getScore()
            };

        }

        this.eventBus.emit("assessment.incorrect", question);

        return {
            correct: false,
            score: this.runtimeState.getScore()
        };

    }

}