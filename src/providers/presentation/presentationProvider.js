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


            for (const layer of page.layers ?? []) {

                if (!layer.template) {

                    layer.template =
                        this.resolveTemplate(layer);

                }

            }

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


    resolveTemplate(layer) {

        const type =
            layer.type ?? "";


        if (type === "DIALOGUE") {

            return "dialogue";

        }


        if (type === "IMAGE") {

            return "image";

        }


        if (type === "ASSESSMENT") {

            return "assessment";

        }


        return "content";

    }

}