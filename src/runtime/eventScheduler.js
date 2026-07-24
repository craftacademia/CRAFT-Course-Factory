export default class EventScheduler {

    constructor(timeline = []) {
        this.timeline = [...timeline].sort((a, b) => a.start - b.start);
        this.index = 0;
    }

    reset() {
        this.index = 0;
    }

    next() {

        if (this.index >= this.timeline.length) {
            return null;
        }

        return this.timeline[this.index++];

    }

    hasNext() {
        return this.index < this.timeline.length;
    }

}