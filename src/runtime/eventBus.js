export default class EventBus {

    constructor() {

        this.listeners = new Map();

    }

    on(event, handler) {

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(handler);

    }

    emit(event, payload = null) {

        const handlers = this.listeners.get(event) ?? [];

        for (const handler of handlers) {
            handler(payload);
        }

    }

    off(event, handler) {

        const handlers = this.listeners.get(event);

        if (!handlers) {
            return;
        }

        this.listeners.set(
            event,
            handlers.filter(h => h !== handler)
        );

    }

    clear() {

        this.listeners.clear();

    }

}