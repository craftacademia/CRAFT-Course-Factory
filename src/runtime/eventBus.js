export default class EventBus {

    constructor() {

        this.clear();

    }

    on(event, handler) {

        if (typeof event !== "string" || event.trim() === "") {
            throw new Error("Event name is required.");
        }

        if (typeof handler !== "function") {
            throw new Error("Handler must be a function.");
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event).add(handler);

        return () => this.off(event, handler);

    }

    once(event, handler) {

        const unsubscribe = this.on(event, payload => {

            unsubscribe();

            handler(payload);

        });

        return unsubscribe;

    }

    emit(event, payload = null) {

        const handlers = this.listeners.get(event);

        if (!handlers) {
            return 0;
        }

        let count = 0;

        for (const handler of handlers) {

            handler(payload);

            count++;

        }

        return count;

    }

    off(event, handler) {

        const handlers = this.listeners.get(event);

        if (!handlers) {
            return false;
        }

        const removed = handlers.delete(handler);

        if (handlers.size === 0) {
            this.listeners.delete(event);
        }

        return removed;

    }

    listenerCount(event) {

        return this.listeners.get(event)?.size ?? 0;

    }

    hasListeners(event) {

        return this.listenerCount(event) > 0;

    }

    clear(event = null) {

        if (event === null) {

            this.listeners = new Map();

            return;

        }

        this.listeners.delete(event);

    }

}