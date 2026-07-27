import CourseBuilder from "./builders/courseBuilder.js";
import TimelineBuilder from "../../runtime/builders/timelineBuilder.js";

export default class PresentationProvider {

    constructor() {

        this.courseBuilder =
            new CourseBuilder();

        this.timelineBuilder =
            new TimelineBuilder();

    }


    async build(ccir) {

        const presentation =
            await this.courseBuilder.build(ccir);


        for (const page of presentation.pages ?? []) {

            page.timeline =
                this.timelineBuilder.build(page);

        }


        if (ccir.assets) {

            presentation.assets =
                ccir.assets;

        }


        if (ccir.assets?.branding) {

            presentation.branding =
                ccir.assets.branding;

        }


        if (ccir.assets?.audio) {

            presentation.audio =
                ccir.assets.audio;

        }


        return presentation;

    }

}