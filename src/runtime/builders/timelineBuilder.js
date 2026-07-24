export default class TimelineBuilder {

    build(page) {

        const timeline = [];

        let currentTime = 0;
        let eventNumber = 1;

        for (const layer of page.layers ?? []) {

            for (const component of layer.components ?? []) {

                const start = component.start ?? currentTime;
                const duration = component.duration ?? 0;

                timeline.push({

                    id: `EVENT_${String(eventNumber++).padStart(3, "0")}`,

                    componentId: component.id,
                    componentType: component.type,

                    start,
                    duration,
                    end: start + duration

                });

                currentTime = Math.max(currentTime, start + duration);

            }

        }

        timeline.sort((a, b) => a.start - b.start);

        return timeline;

    }

}