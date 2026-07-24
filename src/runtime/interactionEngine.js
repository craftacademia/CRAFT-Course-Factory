export default class InteractionEngine {

    constructor(eventBus, runtimeState) {

        this.eventBus = eventBus;
        this.runtimeState = runtimeState;

    }

    execute(interaction) {

        switch (interaction.type) {

            case "SET_VARIABLE":

                this.runtimeState.variables.set(
                    interaction.name,
                    interaction.value
                );

                break;

            case "ADD_SCORE":

                this.runtimeState.addScore(
                    interaction.points
                );

                break;

            case "EMIT_EVENT":

                this.eventBus.emit(
                    interaction.event,
                    interaction.payload ?? {}
                );

                break;

            default:

                throw new Error(
                    `Unknown interaction: ${interaction.type}`
                );

        }

    }

}