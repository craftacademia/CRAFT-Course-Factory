export default class InteractionEngine {

    constructor(eventBus, runtimeState) {

        if (!eventBus) {
            throw new Error("EventBus is required.");
        }

        if (!runtimeState) {
            throw new Error("RuntimeState is required.");
        }

        this.eventBus = eventBus;
        this.runtimeState = runtimeState;

    }

    execute(interaction) {

        if (!interaction || !interaction.type) {
            throw new Error("Interaction type is required.");
        }

        switch (interaction.type) {

            case "SET_VARIABLE":

                this.runtimeState.variables.set(
                    interaction.name,
                    interaction.value
                );

                break;

            case "ADD_SCORE":

                this.runtimeState.addScore(
                    Number(interaction.points ?? 0)
                );

                break;

            case "SET_PAGE":

                this.runtimeState.setPage(
                    Number(interaction.page ?? 0)
                );

                break;

            case "COMPLETE_COURSE":

                this.runtimeState.complete();

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

        return true;

    }

    executeAll(interactions = []) {

        if (!Array.isArray(interactions)) {
            throw new Error("Interactions must be an array.");
        }

        for (const interaction of interactions) {
            this.execute(interaction);
        }

    }

}