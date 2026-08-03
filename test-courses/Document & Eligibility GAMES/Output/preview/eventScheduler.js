export default class EventScheduler {

    constructor(timeline = []) {

        this.setTimeline(timeline);

    }

    setTimeline(timeline = []) {

        if (!Array.isArray(timeline)) {
            throw new Error("Timeline must be an array.");
        }

        this.timeline = [...timeline].sort(
            (a, b) => (a.start ?? 0) - (b.start ?? 0)
        );

        this.reset();

    }

    reset() {

        this.index = 0;

    }

    hasNext() {

        return this.index < this.timeline.length;

    }

    next() {

        if (!this.hasNext()) {
            return null;
        }

        return this.timeline[this.index++];

    }

    peek() {

        if (!this.hasNext()) {
            return null;
        }

        return this.timeline[this.index];

    }

    skip() {

        if (!this.hasNext()) {
            return null;
        }

        this.index++;

        return this.peek();

    }

    currentIndex() {

        return this.index;

    }

    remaining() {

        return this.timeline.length - this.index;

    }

    size() {

        return this.timeline.length;

    }

    isEmpty() {

        return this.timeline.length === 0;

    }

}