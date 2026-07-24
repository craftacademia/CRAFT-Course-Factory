import EventScheduler from "../../src/runtime/eventScheduler.js";

const scheduler = new EventScheduler([
    {
        id: "EVENT_001",
        componentId: "A",
        start: 0
    },
    {
        id: "EVENT_002",
        componentId: "B",
        start: 5
    }
]);

console.log(scheduler.next());
console.log(scheduler.next());
console.log(scheduler.next());