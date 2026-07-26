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

        this.handlers = new Map();
        this.middleware = [];

        this.beforeExecuteHooks = [];
        this.afterExecuteHooks = [];

        this.registerDefaults();

    }

    registerDefaults() {

        this.register("SET_VARIABLE", interaction => {

            this.runtimeState.variables.set(
                interaction.name,
                interaction.value
            );

        });

        this.register("ADD_SCORE", interaction => {

            this.runtimeState.addScore(
                Number(interaction.points ?? 0)
            );

        });

        this.register("SET_PAGE", interaction => {

            this.runtimeState.setPage(
                Number(interaction.page ?? 0)
            );

        });

        this.register("COMPLETE_COURSE", () => {

            this.runtimeState.complete();

        });

        this.register("EMIT_EVENT", interaction => {

            this.eventBus.emit(
                interaction.event,
                interaction.payload ?? {}
            );

        });

    }

    use(middleware) {

        if (typeof middleware !== "function") {
            throw new Error("Middleware must be a function.");
        }

        this.middleware.push(middleware);

    }

    beforeExecute(hook) {

        if (typeof hook !== "function") {
            throw new Error("Hook must be a function.");
        }

        this.beforeExecuteHooks.push(hook);

    }

    afterExecute(hook) {

        if (typeof hook !== "function") {
            throw new Error("Hook must be a function.");
        }

        this.afterExecuteHooks.push(hook);

    }

    register(type, handler) {

        if (typeof type !== "string" || !type) {
            throw new Error("Interaction type is required.");
        }

        if (typeof handler !== "function") {
            throw new Error("Interaction handler must be a function.");
        }

        this.handlers.set(type, handler);

    }

    unregister(type) {

        this.handlers.delete(type);

    }

    has(type) {

        return this.handlers.has(type);

    }

    execute(interaction) {

        if (!interaction || !interaction.type) {
            throw new Error("Interaction type is required.");
        }

        for (const hook of this.beforeExecuteHooks) {
            hook(interaction, this.runtimeState, this.eventBus);
        }

        for (const middleware of this.middleware) {
            middleware(interaction, this.runtimeState, this.eventBus);
        }

        const handler = this.handlers.get(interaction.type);

        if (!handler) {
            throw new Error(`Unknown interaction: ${interaction.type}`);
        }

        handler(interaction);

        for (const hook of this.afterExecuteHooks) {
            hook(interaction, this.runtimeState, this.eventBus);
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